const { instance } = require("../configs/razorpay");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const { customError, failed } = require("../utils/errorHandler");
const crypto = require('crypto');
const Product = require("../models/Product");
const Order = require("../models/Order");
const Address = require("../models/Address");
const { daysDiff } = require("../utils/helper");
const { createOrder, cancelOrder, printManifest, generateInvoice, generateLable, returnOrder } = require("../utils/deliveryHandler");
const ShipToken = require("../models/ShipToken");

//capture the payment and initiate the Razorpay order
exports.captureMultiPayment = async (req, res) => {
    try {
        //  Fetching
        const { id } = req.user;
        const { addressId, cart: cartObj } = req.body;

        const cart = JSON.parse(cartObj);
        if (cart.length === 0) {
            throw customError('No Item Found in Cart', 404);
        }
        console.log(cart);
        let totalAmount = 0;

        for (let item of cart) {
            const { productId, subDetailId, sizeId, quantity } = item;

            // Validate product and subDetail
            const product = await Product.findById(productId);
            if (!product) {
                throw customError(`Product with ID ${productId} not found`, 404);
            }

            const subDetail = product.subDetails.id(subDetailId);
            if (!subDetail) {
                throw customError(`SubDetail with ID ${subDetailId} not found in product ${productId}`, 404);
            }

            const sizeDetail = subDetail.sizes.id(sizeId);
            if (!sizeDetail) {
                throw customError(`Size with ID ${sizeId} not found in subDetail ${subDetailId}`, 404);
            }

            // Check stock availability
            if (sizeDetail.stock < quantity) {
                throw customError(`Insufficient stock for product ${product.name} in size ${sizeDetail.size}`, 400);
            }

            // Calculate total price
            totalAmount += sizeDetail.price * quantity;
        }

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `order_${Math.random(Date.now()).toString()}`,
            notes: {
                address: addressId,
            }
        }

        const paymentResponse = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            message: 'Payment Initiated',
            payment: paymentResponse,
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.verifyMultiSignature = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //  Fetching
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, addressId, cart: cartObj } = req.body;
        const { id: userId } = req.user;

        const cart = JSON.parse(cartObj);

        //  Validation
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !addressId) {
            throw customError('Invalid Payment', 500);
        }
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(body.toString()).digest('hex');
        if (generated_signature !== razorpay_signature) {
            throw customError('Payment Failed', 401);
        }

        // Validate address
        const address = await Address.findById(addressId).session(session);
        if (!address) throw customError('Unable to find address', 404);

        // Calculate total price and update product stock
        let totalPrice = 0;
        const orderItems = [];

        for (let item of cart) {
            const { productId, subDetailId, sizeId, quantity } = item;

            // Validate product and subDetail
            const product = await Product.findById(productId).session(session);
            if (!product) {
                throw customError(`Product with ID ${productId} not found`, 404);
            }

            const subDetail = product.subDetails.id(subDetailId);
            if (!subDetail) {
                throw customError(`SubDetail with ID ${subDetailId} not found in product ${productId}`, 404);
            }

            const sizeDetail = subDetail.sizes.id(sizeId);
            if (!sizeDetail) {
                throw customError(`Size with ID ${sizeId} not found in subDetail ${subDetailId}`, 404);
            }

            // Check stock availability
            if (sizeDetail.stock < quantity) {
                throw customError(`Insufficient stock for product ${product.name} in size ${sizeDetail.size}`, 400);
            }

            // Calculate total price
            totalPrice += sizeDetail.price * quantity;

            // Update stock
            sizeDetail.stock -= quantity;
            await product.save({ session });

            // Prepare order item
            orderItems.push({
                name: product.name,
                details: product.details,
                description: product.description,
                color: subDetail.colorName,
                size: sizeDetail.size,
                images: subDetail.images,
                price: sizeDetail.price,
                category: product.category ? product.category.toString() : '',
                quantity
            });
        }

        await Promise.all(cart.map(async (item) => {
            const product = await Product.findById(item.productId).session(session);
            await product.save({ session });
        }));

        // razorpay_order_id, razorpay_payment_id, razorpay_signature,
        // Create the order
        const order = new Order({
            user: userId,
            address: address.toObject(),
            paymentType: 'Prepaid',
            cart: orderItems,
            paymentId: {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                signature: razorpay_signature,
            },
            orderDetails: {
                public_order_id: `prepaid_${Date.now()}`,
                status: 'Pending',
                order_date: new Date(),
                expected_delivery: new Date(new Date().setDate(new Date().getDate() + 7))
            },
            totalPrice
        });

        // Retrieve the Shiprocket API token
        const token = (await ShipToken.findOne({})).token;
        const email = req.user.email;
        const shiprocketResponse = await createOrder(order, email, token);

        if (!shiprocketResponse || shiprocketResponse.status !== 200) {
            throw customError('Failed to create order in Shiprocket', 500);
        } else {
            order.shiprocketDetails = {
                order_id: shiprocketResponse.data.order_id
            }
        }

        await order.save({ session });


        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        if (shiprocketResponse?.data?.order_id) {
            await printManifest(shiprocketResponse.data.order_id, token);
            await generateInvoice(shiprocketResponse.data.order_id, token);
        }
        if (shiprocketResponse?.data?.shipment_id) {
            await generateLable(shiprocketResponse.data.shipment_id, token)
        }

        // Send response
        res.status(200).json({
            success: true,
            message: 'Ordered Successfully'
        });
    } catch (err) {
        failed(res, err);
    }
}

exports.cashOnDelivery = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { addressId, cart: cartObj } = req.body;
        const { id: userId } = req.user;

        const cart = JSON.parse(cartObj);

        // Validate address
        const address = await Address.findById(addressId).session(session);
        if (!address) throw customError('Unable to find address', 404);

        // Calculate total price and update product stock
        let totalPrice = 0;
        const orderItems = [];

        for (let item of cart) {
            const { productId, subDetailId, sizeId, quantity } = item;

            // Validate product and subDetail
            const product = await Product.findById(productId).session(session);
            if (!product) {
                throw customError(`Product with ID ${productId} not found`, 404);
            }

            const subDetail = product.subDetails.id(subDetailId);
            if (!subDetail) {
                throw customError(`SubDetail with ID ${subDetailId} not found in product ${productId}`, 404);
            }

            const sizeDetail = subDetail.sizes.id(sizeId);
            if (!sizeDetail) {
                throw customError(`Size with ID ${sizeId} not found in subDetail ${subDetailId}`, 404);
            }

            // Check stock availability
            if (sizeDetail.stock < quantity) {
                throw customError(`Insufficient stock for product ${product.name} in size ${sizeDetail.size}`, 400);
            }

            // Calculate total price
            totalPrice += sizeDetail.price * quantity;

            // Update stock
            sizeDetail.stock -= quantity;
            await product.save({ session });

            // Prepare order item
            orderItems.push({
                name: product.name,
                details: product.details,
                description: product.description,
                color: subDetail.colorName,
                size: sizeDetail.size,
                images: subDetail.images,
                price: sizeDetail.price,
                category: product.category ? product.category.toString() : '',
                quantity
            });
        }

        // Save updated products
        await Promise.all(cart.map(async (item) => {
            const product = await Product.findById(item.productId).session(session);
            await product.save({ session });
        }));

        // Create the order
        const order = new Order({
            user: userId,
            address: address.toObject(),
            paymentType: 'COD',
            cart: orderItems,
            orderDetails: {
                public_order_id: `cash_on_delivery_${Date.now()}`,
                status: 'Pending',
                order_date: new Date(),
                expected_delivery: new Date(new Date().setDate(new Date().getDate() + 7))
            },
            totalPrice
        });

        // Retrieve the Shiprocket API token
        const token = (await ShipToken.findOne({})).token;
        const email = req.user.email;
        const shiprocketResponse = await createOrder(order, email, token);

        if (!shiprocketResponse || shiprocketResponse.status !== 200) {
            throw customError('Failed to create order in Shiprocket', 500);
        } else {
            order.shiprocketDetails = {
                order_id: shiprocketResponse.data.order_id
            }
        }

        await User.findByIdAndUpdate(userId, { cart: [] });
        await order.save({ session });


        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        if (shiprocketResponse?.data?.order_id) {
            await printManifest(shiprocketResponse.data.order_id, token);
            await generateInvoice(shiprocketResponse.data.order_id, token);
        }
        if (shiprocketResponse?.data?.shipment_id) {
            await generateLable(shiprocketResponse.data.shipment_id, token)
        }

        res.status(200).json({ success: true, message: 'Order placed successfully', totalPrice });
    } catch (err) {
        // Abort transaction on error
        await session.abortTransaction();
        session.endSession();
        failed(res, err);
    }
};

exports.updateMyCart = async (req, res) => {
    try {
        // Fetching user and product data
        const { cart: cartObj } = req.body;
        const { id } = req.user;

        const cart = JSON.parse(cartObj);

        // Validation
        let items = []

        for (let item of cart) {
            const { productId, subDetailId, sizeId, quantity } = item;

            // Prepare order item
            items.push({
                productId,
                subDetailId,
                sizeId,
                quantity
            });
        }


        // Perform Task
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { cart: items },
            { new: true }
        );

        // Send response
        res.status(200).json({
            success: true,
            message: 'Added to Cart',
            cart: updatedUser.cart
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.updateMyWishlist = async (req, res) => {
    try {
        // Fetching user and product data
        const { wishlist: wishlistObj } = req.body;
        const { id } = req.user;

        const wishlist = JSON.parse(wishlistObj);

        // Validation
        let items = []

        for (let item of wishlist) {
            const { productId, subDetailId, sizeId, quantity } = item;

            // Prepare order item
            items.push({
                productId,
                subDetailId,
                sizeId,
                quantity
            });
        }


        // Perform Task
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { wishlist: items },
            { new: true }
        );

        // Send response
        res.status(200).json({
            success: true,
            message: 'Added to Cart',
            cart: updatedUser.cart
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.getMyCart = async (req, res) => {
    try {
        const { id } = req.user;

        // Fetch user cart with populated product, subDetail, and size details
        const user = await User.findById(id)
            .populate({
                path: 'cart.productId',
                select: 'name description',
                populate: {
                    path: 'subDetails',
                    select: 'colorName images',
                    populate: {
                        path: 'sizes',
                        select: 'size price stock',
                    },
                },
            });

        if (!user) {
            throw customError('User not found', 404);
        }

        const cartItems = user.cart.map((item) => {
            const subDetail = item.productId.subDetails.find(
                (subDetail) => subDetail._id.toString() === item.subDetailId
            );
            const size = subDetail.sizes.find(
                (size) => size._id.toString() === item.sizeId
            );

            return {
                productId: item.productId._id,
                name: `${item.productId.name} - ${subDetail.colorName} - ${size.size}`,
                description: item.productId.description,
                image: subDetail.images[0], // Assuming only one image is needed
                price: size.price,
                subDetailId: subDetail._id,
                sizeId: size._id,
                quantity: item.quantity,
                maxQuantity: size.stock,
            };
        });

        res.status(200).json({
            success: true,
            message: 'Successfully retrieved the cart',
            cart: cartItems,
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.getMyWishlist = async (req, res) => {
    try {
        const { id } = req.user;

        // Fetch user cart with populated product, subDetail, and size details
        const user = await User.findById(id)
            .populate({
                path: 'wishlist.productId',
                select: 'name description',
                populate: {
                    path: 'subDetails',
                    select: 'colorName images',
                    populate: {
                        path: 'sizes',
                        select: 'size price stock',
                    },
                },
            });

        if (!user) {
            throw customError('User not found', 404);
        }

        const wishlistItems = user.wishlist.map((item) => {
            const subDetail = item.productId.subDetails.find(
                (subDetail) => subDetail._id.toString() === item.subDetailId
            );
            const size = subDetail.sizes.find(
                (size) => size._id.toString() === item.sizeId
            );

            return {
                productId: item.productId._id,
                name: `${item.productId.name} - ${subDetail.colorName} - ${size.size}`,
                description: item.productId.description,
                image: subDetail.images[0], // Assuming only one image is needed
                price: size.price,
                subDetailId: subDetail._id,
                sizeId: size._id
            };
        });

        res.status(200).json({
            success: true,
            message: 'Successfully retrieved the wishlist',
            wishlist: wishlistItems,
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        //  Fetching
        const { id } = req.user;
        const { orderId } = req.body;

        //  Validation & Perform
        let orders;
        if (orderId) {
            orders = await Order.findById(orderId)
                .populate({
                    path: 'cart',
                })
                .populate({
                    path: 'address',
                })
        } else {
            orders = await Order.find({ user: id })
                .populate({
                    path: 'cart',
                    select: 'name description images price' // Specify the fields to retrieve from the Product model
                })
                .populate({
                    path: 'address',
                    select: 'name'
                }).sort({ 'orderDetails.order_date': -1 })
        }

        //  Send Response
        res.status(200).json({
            success: true,
            message: "Orders Fetched",
            orders: orders
        })
    } catch (err) {
        failed(res, err)
    }
}

exports.cancelMyOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const { id } = req.user;

        // Find order
        const order = await Order.findById(orderId);
        if (!order) throw customError('Order not found', 404);

        if (order.user.toString() !== id) throw customError("This order doesn't belongs to you", 403);
        if (order.status === 'DELIVERED') throw customError('Order cannot be cancelled now');

        // Cancel shipping order
        const { token } = await ShipToken.findOne({});
        const response = await cancelOrder(order.shiprocketDetails.order_id, token);

        if (!response) throw customError('Unable to cancel the order', 501);
        if (response?.data?.order_id) {
            await printManifest(response.data.order_id, token.token);
            await generateInvoice(response.data.order_id, token.token);
        }
        if (response?.data?.shipment_id) {
            await generateLable(response.data.shipment_id, token.token)
        }

        // Revert stock updates
        const stockUpdatePromises = order.cart.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        });
        await Promise.all(stockUpdatePromises);

        // Update order status
        order.orderDetails.status = 'CANCELED';
        await order.save();

        res.status(200).json({ success: true, message: 'Order canceled successfully', order });
    } catch (err) {
        failed(res, err);
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Find order
        const order = await Order.findById(orderId);
        if (!order) throw customError('Order not found', 404);
        if (order.status === 'DELIVERED') throw customError('Order cannot be cancelled now');

        // Cancel shipping order
        const { token } = await ShipToken.findOne({});
        const response = await cancelOrder(order.shiprocketDetails.order_id, token);
        if (!response) throw customError('Unable to cancel the order', 501);
        if (response?.data?.order_id) {
            await printManifest(response.data.order_id, token.token);
            await generateInvoice(response.data.order_id, token.token);
        }
        if (response?.data?.shipment_id) {
            await generateLable(response.data.shipment_id, token.token)
        }

        // Revert stock updates
        const stockUpdatePromises = order.cart.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        });
        await Promise.all(stockUpdatePromises);

        // Update order status
        order.orderDetails.status = 'CANCELED';
        await order.save();

        res.status(200).json({ success: true, message: 'Order canceled successfully', order });
    } catch (err) {
        failed(res, err);
    }
};

exports.returnOrder = async (req, res) => {
    try {
        // Fetching data from the request
        const { orderId, cart, reason = 'Not provided' } = req.body;
        const { id: userId } = req.user;
        const user = await User.findById(id);
        const token = await ShipToken.find({});

        // Validation
        if (!orderId) {
            throw customError('Order ID is required', 400);
        }

        // Find the order
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) {
            throw customError('Order not found', 404);
        }

        // Check if the order is eligible for return
        if (order.status !== 'DELIVERED') {
            throw customError('Order is not delivered yet', 400);
        }
        if (order.type !== 'Order') {
            throw customError('Only Orders can be returned', 400);
        }
        if (daysDiff(order.deliveryDate) > 3) {
            throw customError('Order cannot be returned after 3 days of delivery', 400);
        }

        // Perform return process
        order.status = 'Pending';
        order.type = 'Return';
        order.reason = reason;
        order.updateDate = Date.now();

        let newOrder;

        // If cart is provided (partial return)
        if (cart && cart.length > 0) {
            const newCart = order.cart.map(item => {
                const cartItem = cart.find(c => c.product._id.toString() === item.product.toString());
                if (cartItem && cartItem.currQty <= item.quantity) {
                    item.quantity = item.quantity - cartItem.currQty;
                } else {
                    item.quantity = 0;
                }
                return item;
            });

            // Remove items with zero quantity
            const filteredCart = newCart.filter(item => item.quantity > 0);

            // Check if at least one item is being returned
            if (filteredCart.length === 0) {
                throw customError('At least one item should be returned', 400);
            }

            // Update order details for partial return
            order.cart = filteredCart;
            let totalPrice = 0;
            for (const item of filteredCart) {
                const currItem = await Product.findById(item.product);
                if (!currItem) {
                    throw customError('Item not listed anymore', 404);
                }
                totalPrice += currItem.price * item.quantity;
            }
            order.totalPrice = totalPrice;
            order.orderId = `${order.orderId}_return`;

            // Create a new order document for partial return
            const response = await returnOrder(order, order.address, order.cart, user.email, token.token);
            if (!response) throw customError('Unable to fulfil that request', 500);
            const orderObject = order._doc;
            const { _id, ...rest } = orderObject;
            newOrder = new Order(rest);
        } else {
            // Full order return
            const response = await returnOrder(order, order.address, order.cart, user.email, token.token);
            if (!response) throw customError('Unable to fulfil that request', 500);
            const orderObject = order._doc;
            const { _id, ...rest } = orderObject;
            newOrder = new Order(rest);
            if (response?.data?.order_id) {
                await printManifest(response.data.order_id, token.token);
                await generateInvoice(response.data.order_id, token.token);
            }
            if (response?.data?.shipment_id) {
                await generateLable(response.data.shipment_id, token.token)
            }
        }

        newOrder.save();

        // Send Response
        res.status(200).json({
            success: true,
            message: 'Order return process initiated',
            order: newOrder,
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.getOrders = async (req, res) => {
    try {
        //  Fetching
        let { orderId, type } = req.body;

        //  Validation
        if (orderId && !mongoose.Types.ObjectId.isValid(orderId)) {
            throw customError('Invalid Order', 404);
        }

        //  Perform task
        let orders;

        if (orderId) {
            orders = await Order.findById(orderId)
                .populate({
                    path: 'cart',
                })
                .populate({
                    path: 'address',
                })
                .populate({
                    path: 'user',
                })
        } else {
            if (!type) {
                throw customError('Unable to get order type', 404);
            }

            orders = await Order.find({ 'orderType': type }).sort({ 'orderDetails.order_date': -1 })
                .populate({
                    path: 'address',
                    select: 'name'
                })
        }

        //  Send response
        res.status(200).json({
            success: true,
            message: 'Successfully fetched the orders',
            data: orders
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.updateOrder = async (req, res) => {
    try {
        // Fetching
        const { orderId, status, type } = req.body;

        // Validations
        if (!orderId) {
            throw customError('Order ID is required', 400);
        }

        const order = await Order.findById(orderId);

        if (!order) {
            throw customError('Order not found', 404);
        }

        // Check if the new status is valid for the order type
        const validStatusTransitions = {
            Order: {
                Pending: ['Processing', 'Cancelled'],
                Processing: ['Shipped', 'Cancelled', 'On_the_way'],
                Shipped: ['On_the_way', 'Delivered', 'Returned', 'Cancelled'],
                Delivered: ['Processing'],
                Replaced: ['Shipped', 'Cancelled'],
                Returned: ['Cancelled'],
                Cancelled: [],
                On_the_way: ['Delivered', 'Cancelled'],
            },
            Replacement: {
                Pending: ['Processing', 'Cancelled'],
                Processing: ['Shipped', 'Cancelled', 'On_the_way'],
                Shipped: ['On_the_way', 'Delivered', 'Cancelled'],
                Delivered: ['Cancelled'],
                Cancelled: [],
                On_the_way: ['Delivered', 'Cancelled'],
            },
            Return: {
                Pending: ['Processing', 'Cancelled'],
                Processing: ['On_the_way', 'Pickup', 'Returned', 'Cancelled'],
                On_the_way: ['Pickup', 'Returned', 'Cancelled'],
                Pickup: ['Returned'],
                Returned: ['Cancelled'],
                Cancelled: [],
            },
        };

        const currentStatus = order.status;
        let currentType = order.type;

        const validNextStatuses = validStatusTransitions[currentType][currentStatus];

        if (status && !validNextStatuses.includes(status)) {
            throw customError(`Invalid status transition from ${currentStatus} to ${status} for order type ${currentType}`, 400);
        }

        // Change order type if transitioning from "Delivered" to "Replacement" or "Return"
        if (currentStatus === 'Delivered' && (status === 'Replaced' || status === 'Returned')) {
            currentType = status === 'Replaced' ? 'Replacement' : 'Return';
        }

        // Update the order
        order.status = status || order.status;
        order.type = type || currentType;
        order.updateDate = Date.now();

        if (status === 'Delivered' || status === 'Replaced' || status === 'Returned') {
            order.deliveryDate = Date.now();
        }

        if (order.type === 'Return' && order.status === 'Returned' && order.paymentType === 'Prepaid' && order.paymentId.payment_id) {
            instance.payments.refund(order.paymentId.payment_id, {
                "amount": order.totalPrice * 100,
                "speed": "normal",
                "receipt": order.orderId
            })
        }

        await order.save();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Order updated successfully',
        });
    } catch (err) {
        failed(res, err);
    }
};
const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const orderStatusMail = require('../mails/orderStatus');

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    addressLine1: {
        type: String,
        required: [true, 'Address Line 1 is required'],
        trim: true
    },
    addressLine2: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
    },
    pinCode: {
        type: String,
        required: [true, 'Pin Code is required'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone Number is required'],
        trim: true
    }
}, { _id: false });

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    details: [{
        type: String,
        trim: true
    }],
    description: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        trim: true
    },
    size: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    price: {
        type: Number,
        required: [true, 'Item price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity cannot be less than 1']
    }
}, { _id: false });

const detailSchema = new mongoose.Schema({
    public_order_id: {
        type: String,
        required: [true, 'Public order ID is required'],
        trim: true
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        trim: true
    },
    order_date: {
        type: Date,
        required: [true, 'Order date is required']
    },
    expected_delivery: {
        type: Date,
        required: [true, 'Expected delivery date is required']
    }
}, { _id: false });

const shiprocketSchema = new mongoose.Schema({
    order_id: {
        type: String,
        trim: true
    },
    shipment_id: {
        type: String,
        trim: true
    },
    awb_code: {
        type: String,
        trim: true
    },
    manifest: {
        type: String,
        trim: true
    },
    label: {
        type: String,
        trim: true
    },
    invoice: {
        type: String,
        trim: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    address: {
        type: addressSchema,
        required: [true, 'Address is required']
    },
    paymentType: {
        type: String,
        required: [true, 'Payment type is required'],
        enum: ['COD', 'Prepaid'],
        default: 'COD'
    },
    paymentId: {
        order_id: {
            type: String,
            trim: true
        },
        payment_id: {
            type: String,
            trim: true
        },
        signature: {
            type: String,
            trim: true
        }
    },
    cart: {
        type: [itemSchema],
        required: [true, 'Cart items are required']
    },
    orderDetails: {
        type: detailSchema,
        required: [true, 'Order details are required']
    },
    orderType: {
        type: String,
        required: [true, 'Order type is required'],
        enum: ['Order', 'Return'],
        default: 'Order'
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Total price cannot be negative']
    },
    reason: {
        type: String,
        trim: true,
        default: ''
    },
    shiprocketDetails: {
        type: shiprocketSchema
    }
}, { timestamps: true });

orderSchema.post('save', async function (doc, next) {
    try {
        await this.constructor.populate(this, { path: 'user' });
        mailSender(this.user.email, 'URI&Mackenzie - Order Status', orderStatusMail(this._id, this.orderType, this.orderDetails.status, this.user.fullname, 'View more information about your order in the below link.\nThank you for choosing us.'));
        mailSender(process.env.SMTP_EMAIL, 'URI&Mackenzie - Order Status', orderStatusMail(this._id, this.orderType, this.orderDetails.status, this.user.fullname, 'View more information about your order in the below link.\nThank you for choosing us.'));
        next();
    } catch (err) {
        console.log(err);
        next();
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

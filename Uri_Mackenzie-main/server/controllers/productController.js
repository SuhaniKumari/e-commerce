const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const { failed, customError } = require("../utils/errorHandler");
const uploadMedia = require("../utils/fileUploader");
const { convertToArray } = require("../utils/helper");
const Category = require("../models/Category");
const Order = require("../models/Order");
const User = require("../models/User");


exports.createProduct = async (req, res) => {
    try {
        //  Fetching
        let { name, description, category, cashOnDelivery = 'Off' } = req.body;
        let details = req.body['details[]'] || [];
        details = convertToArray(details);

        //  Validation
        if (!name || !description) {
            throw customError("All fields are required", 404);
        }
        if (details.length === 0) {
            throw customError("Atleast one Detail is required", 404);
        }
        if (category) {
            const categoryObj = await Category.findById(category);
            if (!categoryObj) {
                throw customError("Invalid category", 404);
            }
        }

        //  Perform Task
        const productObj = new Product({
            name, description, details, category, isCOD: cashOnDelivery === 'Off' ? false : true
        })
        await productObj.save();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Product Created Successfully'
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.addVarient = async (req, res) => {
    try {
        const { productId, colorName, colorCode, sizes: sizesString } = req.body;
        let images = req.files['images[]'] || [];
        images = convertToArray(images)
        let sizes = JSON.parse(sizesString);
        sizes = convertToArray(sizes);

        // Validation
        if (!productId) {
            throw customError("Product ID is required", 404);
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw customError("Invalid Product ID", 400);
        }
        if (!colorName || !colorCode || !images.length || !sizes.length) {
            throw customError("All fields are required", 400);
        }
        sizes.forEach(size => {
            if (!size.price || size.price < 0) {
                throw customError("Each size must have a valid, non-negative price", 400);
            }
            if (!size.stock || size.stock < 0) {
                throw customError("Each size must have a valid, non-negative stock", 400);
            }
            if (!size.size || size.size < 0) {
                throw customError("Each size must have a valid, non-negative size value", 400);
            }
        });


        const product = await Product.findById(productId);
        if (!product) {
            throw customError("Product not found", 404);
        }

        const imagesPromises = images.map(async (image) => {
            const getUrl = await uploadMedia(image, `Products/${product.name}`);
            return getUrl.secure_url;
        });

        const imagesUrl = await Promise.all(imagesPromises);

        const newVarient = {
            colorName,
            colorCode,
            images: imagesUrl,
            sizes
        };

        product.subDetails.push(newVarient);
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Varient added successfully',
            product
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.updateProduct = async (req, res) => {
    try {

        // Fetching
        let { id, name, description, category, cashOnDelivery = 'Off' } = req.body;
        let details = req.body['details[]'] || [];
        details = convertToArray(details);

        //  Validation
        if (!id) {
            throw customError("Unknown Product selected");
        }
        const product = await Product.findById(id);
        if (!product) {
            throw customError("Unable to find the product");
        }
        if (!name || !description) {
            throw customError("All fields are required", 404);
        }
        if (details.length === 0) {
            throw customError("Atleast one Detail is required", 404);
        }
        if (category) {
            const categoryObj = await Category.findById(category);
            if (!categoryObj) {
                throw customError("Invalid category", 404);
            }
        }

        // Perform Task
        await Product.findByIdAndUpdate(id, {
            name, description, details, category, isCOD: cashOnDelivery === 'Off' ? false : true
        })

        // Send response
        res.status(200).json({ success: true, message: 'Product Updated Successfully' });
    } catch (err) {
        failed(res, err);
    }
};

exports.updateVarient = async (req, res) => {
    try {
        const { productId, variantId, colorName, colorCode, sizes: sizesString } = req.body;
        let images = req.body['images[]'] || [];
        let newImages = req.files ? req.files['images[]'] : [];
        newImages = convertToArray(newImages);
        images = convertToArray(images);
        let sizes = JSON.parse(sizesString);
        sizes = convertToArray(sizes); // Assuming convertToArray is a utility function that ensures sizes is an array

        // Validation
        if (!productId) {
            throw customError("Product ID is required", 404);
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw customError("Invalid Product ID", 400);
        }
        if (!variantId) {
            throw customError("Variant ID is required", 404);
        }
        if (!mongoose.Types.ObjectId.isValid(variantId)) {
            throw customError("Invalid Variant ID", 400);
        }
        if (!colorName || !colorCode || !images.length || !sizes.length) {
            throw customError("All fields are required", 400);
        }
        sizes.forEach(size => {
            if (size.price < 0) {
                throw customError("Each size must have a valid, non-negative price", 400);
            }
            if (size.stock < 0) {
                throw customError("Each size must have a valid, non-negative stock", 400);
            }
            if (size.size < 0) {
                throw customError("Each size must have a valid, non-negative size value", 400);
            }
        });

        const product = await Product.findById(productId);
        if (!product) {
            throw customError("Product not found", 404);
        }

        const variant = product.subDetails.id(variantId);
        if (!variant) {
            throw customError("Variant not found", 404);
        }

        const newImagesUrls = await Promise.all(
            newImages.map(async (image) => {
                const temp = await uploadMedia(image, product.name);
                return temp.secure_url;
            })
        );
        const updatedImages = [...images, ...newImagesUrls];

        if (!updatedImages || updatedImages.length === 0) {
            throw customError("Atleast one image is required", 404)
        }

        variant.colorName = colorName;
        variant.colorCode = colorCode;
        variant.images = updatedImages;
        variant.sizes = sizes;

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Variant updated successfully',
            product
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        // Fetching
        const { id } = req.body;

        // Validation
        if (!id) {
            throw customError('Unknown product selected', 404);
        }
        const product = await Product.findOneById(id);
        if (!product) {
            throw customError('Unable to find the product', 404);
        }

        // Perform Task
        await Product.findByIdAndUpdate(id, { deleted: true });

        // Send response
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        failed(res, err);
    }
};

exports.deleteVarient = async (req, res) => {
    try {
        // Fetching
        const { productId, variantId } = req.body;

        // Validation
        if (!productId) {
            throw customError("Product ID is required", 404);
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw customError("Invalid Product ID", 400);
        }
        if (!variantId) {
            throw customError("Variant ID is required", 404);
        }
        if (!mongoose.Types.ObjectId.isValid(variantId)) {
            throw customError("Invalid Variant ID", 400);
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw customError("Product not found", 404);
        }

        const variant = product.subDetails.id(variantId);
        if (!variant) {
            throw customError("Variant not found", 404);
        }

        // Removing the variant
        product.subDetails.pull(variantId);
        await product.save();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Variant deleted successfully',
            product
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.getAllProduct = async (req, res) => {
    try {
        // Fetching the query parameters
        const {
            page = 1,
            limit = 12,
            category = null,
            search = null,
            priceMin = null,
            priceMax = null,
            availability = null,
            payment = 'Off',
            sortBy = 'purchased',
            sortOrder = 'desc',
            color = null,
            all = null,
        } = req.query;

        // Validation
        const skip = (page - 1) * limit;
        const sortOptions = {};

        // Determine the sort order
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Perform Task
        let query = {};

        // Filter by category
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            query.category = new mongoose.Types.ObjectId(category);
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive search
            query.$or = [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { details: { $elemMatch: { $regex: searchRegex } } }
            ];
        }

        // Filter by price range
        if (priceMin && priceMax) {
            query['subDetails.sizes.price'] = {
                $gte: Number(priceMin),
                $lte: Number(priceMax)
            };
        }
        if (color) {
            query['subDetails.colorCode'] = color;
        }

        // Filter by availability
        if (availability || availability === 'true' || availability === true) {
            query['subDetails.sizes.stock'] = { $gt: 0 };
        }

        // Filter by payment method
        if (payment !== 'Off') {
            query.isCOD = true;
        }

        let products;

        if (all) {
            products = await Product.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$_id',
                        name: { $first: '$name' },
                        description: { $first: '$description' },
                        category: { $first: '$category' },
                        isCOD: { $first: '$isCOD' },
                        viewed: { $first: '$viewed' },
                        purchased: { $first: '$purchased' },
                        minStock: {
                            $min: {
                                $ifNull: [
                                    { $min: '$subDetails.sizes.stock' }, // Use minimum stock from subDetails.sizes if available
                                    0
                                ]
                            }
                        },
                        maxStock: {
                            $max: {
                                $ifNull: [
                                    { $max: '$subDetails.sizes.stock' }, // Use maximum stock from subDetails.sizes if available
                                    0
                                ]
                            }
                        },
                        minPrice: {
                            $min: {
                                $ifNull: [{ $arrayElemAt: ['$subDetails.sizes.price', 0] }, 0] // Use 0 as default if subDetails is empty
                            }
                        },
                        maxPrice: {
                            $max: {
                                $ifNull: [{ $arrayElemAt: ['$subDetails.sizes.price', 0] }, 0] // Use 0 as default if subDetails is empty
                            }
                        },
                        totalVariants: { $sum: { $size: '$subDetails' } },
                        image: { $first: '$subDetails.images' },
                        createdAt: { $first: '$createdAt' }
                    }
                },
                { $sort: sortOptions },
                { $skip: parseInt(skip) }, // Parse skip as a number
                { $limit: parseInt(limit) }, // Parse limit as a number
            ]);
        } else {
            products = await Product.aggregate([
                { $unwind: '$subDetails' },
                { $unwind: '$subDetails.sizes' },
                { $match: query },
                {
                    $group: {
                        _id: '$_id',
                        name: { $first: '$name' },
                        description: { $first: '$description' },
                        category: { $first: '$category' },
                        isCOD: { $first: '$isCOD' },
                        viewed: { $first: '$viewed' },
                        purchased: { $first: '$purchased' },
                        minPrice: { $min: '$subDetails.sizes.price' }, // Modify if filtering by price
                        maxPrice: { $max: '$subDetails.sizes.price' },
                        image: { $first: '$subDetails.images' },
                        createdAt: { $first: '$createdAt' },
                        colorCodes: { $addToSet: '$subDetails.colorCode' },
                        availableSizes: { $addToSet: '$subDetails.sizes.size' },
                        details: { $push: '$details' }
                    }
                },
                { $sort: sortOptions },
                { $skip: parseInt(skip) }, // Parse skip as a number
                { $limit: parseInt(limit) }, // Parse limit as a number
            ]);

        }


        const totalCount = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        // Send Response
        res.status(200).json({
            success: true,
            message: "Successfully fetched the Products",
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCount
            }
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.getProduct = async (req, res) => {
    try {
        // Fetching
        const { id } = req.body;

        // Validation
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw customError("Unknown Product selected", 404);
        }

        const product = await Product.findById(id);
        if (!product) {
            throw customError('Unable to find the product', 404);
        }
        await Product.findByIdAndUpdate(id, { viewed: product.viewed + 1 });

        const query = { _id: { $ne: id } };
        query.category = product.category;
        query.stock = { $gt: 0 };

        const suggestions = await Product.find(query)
            .limit(10)
            .sort('price')
            .lean()
            .exec();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            product: {
                ...product.toObject(),
                suggestions
            }
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.createCategory = async (req, res) => {
    try {
        //  Fetching
        const { name } = req.body;
        const image = req.files ? req.files['image'] : null;

        //  Validation
        if (!name) {
            throw customError("Enter category correctly");
        }
        if (name.length === 0) {
            throw customError("Category can't be empty");
        }
        const alreadyExist = await Category.findOne({ name: name });
        if (alreadyExist) {
            throw customError("This category already exist");
        }
        if (!image) {
            throw customError("Image is required");
        }
        let getUrl;
        if (image) {
            getUrl = await uploadMedia(image, `Category/${name}`)
        }

        //  Perform Task
        await Category.create({ name: name, image: getUrl.secure_url });
        const category = await Category.find().sort({ name: 1 });

        //  Send response
        res.status(200).json({
            success: true,
            message: "Successfully created the category",
            categories: category
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.getCategory = async (req, res) => {
    try {
        //  Perform task
        const allCategories = await Category.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            message: "Successfully fetched the category",
            categories: allCategories,
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.updateCategory = async (req, res) => {
    try {
        //  Fetching
        let { id, name } = req.body;
        const image = req.files ? req.files['image'] : null;


        //  Validation
        if (!name) {
            throw customError("Enter category correctly");
        }
        let check = await Category.findById(id);
        if (!check) {
            throw customError("This category does not exist");
        }
        check = await Category.findOne({ name: name });
        if (!image && check) {
            throw customError("This name category already exist");
        }

        if (image) {
            const getUrl = await uploadMedia(image, `Category/${name}`)
            await Category.findByIdAndUpdate(id, { image: getUrl.secure_url })
        }

        //  Perform task
        await Category.findByIdAndUpdate(id, { name: name });
        const allCategories = await Category.find().sort({ name: 1 });


        //  Send response
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            categories: allCategories
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        //  Fetching
        const { id } = req.body;

        //  Validation
        let check = await Category.findById(id);
        if (!check) {
            throw customError("This category does not exist");
        }
        if (check.category === "any") {
            throw customError("You can't delete 'Any' category");
        }

        //  Perform task
        await Category.findByIdAndDelete(id);
        const category = await Category.find().sort({ name: 1 });
        await Product.updateMany({ category: id }, { $set: { category: null } })

        //  Send response
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            categories: category,
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.getGraphData = async (req, res) => {
    try {
        // Fetch products
        const products = await Product.find({}, { name: 1, 'subDetails.sizes.stock': 1, category: 1 });

        // Fetch orders
        const orders = await Order.find({}, { totalPrice: 1, orderDetails: 1, createdAt: 1 }).lean();

        // Fetch users
        const users = await User.find({}, { email: 1 }).lean();

        res.status(200).json({
            success: true,
            products,
            orders,
            users,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

exports.getColors = async (req, res) => {
    try {
        // Leverage aggregation framework for efficient color retrieval and deduplication
        const colors = await Product.aggregate([
            {
                // Unwind the "subDetails" array to access individual color objects
                $unwind: "$subDetails"
            },
            {
                // Group by both colorCode and colorName, ensuring unique combinations
                $group: {
                    _id: "$subDetails.colorCode",
                    // No need for $addToSet here, as grouping by both fields achieves uniqueness
                    colorCode: { $first: "$subDetails.colorCode" },
                    colorName: { $first: "$subDetails.colorName" }
                }
            },
            {
                // Project the desired color object structure
                $project: {
                    _id: 0, // Exclude unnecessary _id field
                    colorCode: 1,
                    colorName: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Successfully fetched the colors',
            colors: colors,
        })
    } catch (err) {
        failed(res, err);
    }
}
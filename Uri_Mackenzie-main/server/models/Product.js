const mongoose = require('mongoose');

const subDetailsSchema = new mongoose.Schema({
    colorName: {
        type: String,
        trim: true
    },
    colorCode: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    sizes:[{
        price: {
            type: Number,
            min: [0, 'Price cannot be negative']
        },
        size: {
            type: Number,
            trim: true,
        },
        stock: {
            type: Number,
            min: [0, 'Stock cannot be negative'],
            default: 0
        },
    }],
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    subDetails: [subDetailsSchema],
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    details: [{
        type: String,
        required: [true, 'Product detail is required'],
        trim: true
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    isCOD: {
        type: Boolean,
        required: [true, 'COD status is required'],
        default: false
    },
    viewed: {
        type: Number,
        default: 0,
        min: [0, 'Viewed count cannot be negative']
    },
    purchased: {
        type: Number,
        default: 0,
        min: [0, 'Purchased count cannot be negative']
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

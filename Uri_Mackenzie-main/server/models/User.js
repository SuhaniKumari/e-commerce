const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const welcomeMail = require('../mails/welcome');

const itemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    subDetailId: {
        type: String,
    },
    sizeId: {
        type: String,
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity cannot be less than 1']
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    phone: {
        type: String,
        minlength: 10,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    userType: {
        type: String,
        enum: ['Admin', 'Viewer'],
        default: 'Viewer',
        required: true,
    },
    cart: [{
        type: itemSchema
    }],
    wishlist: [{
        type: itemSchema
    }],
    image: {
        type: String,
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }]
})

userSchema.post('save', async function () {
    await mailSender(this.email, 'Welcome to Uri & Mackenzie', welcomeMail());
})

module.exports = mongoose.model('User', userSchema);;
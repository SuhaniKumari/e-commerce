const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['reset', 'verification'],
        default: 'verification'
    },
    expirationDate: {
        type: Date,
        required: true,
        index: true,
        expireAfterSeconds: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900
    }
})

tokenSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Token', tokenSchema);
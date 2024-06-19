const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        set: function (value) {
            return value.toLowerCase();
        }
    },
    image: {
        type: String,
        required: [true, 'Category image is required'],
        trim: true
    }
})

module.exports = mongoose.model('Category', categorySchema);
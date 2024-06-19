const { default: mongoose } = require("mongoose");

const ShipTokenSchema = new mongoose.Schema({
    token: {
        type: String,
    }
})

module.exports = mongoose.model('ShipToken', ShipTokenSchema);
const Order = require("../models/Order");
const ShipToken = require("../models/ShipToken");
const { generateInvoice, generateLable, printManifest } = require("../utils/deliveryHandler");
const { failed, customError } = require("../utils/errorHandler")
const axios = require('axios');


exports.generateToken = async (req, res) => {
    try {
        //  Fetching
        const data = {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD
        };

        //  Perform task
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://apiv2.shiprocket.in/v1/external/auth/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios(config)
        if (response) {
            const already = await ShipToken.findOne();
            if (already) {
                await ShipToken.findByIdAndUpdate(already._id, { token: response.data.token });
            } else {
                await ShipToken.create({ token: response.data.token });
            }
        } else {
            throw customError('Unable to get new Credentials', 501);
        }

        //  Send Response
        res.status(200).json({
            success: true,
            message: 'Successfully created new token'
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.handleOrder = async (req, res) => {
    try {
        //  Fetching
        const { awb, current_status, order_id, etd } = req.body;

        const order = await Order.findOneAndUpdate({ orderId: order_id }, {
            orderDetails: {
                status: current_status,
                expected_delivery: etd
            },
            shiprocketDetails: {
                awb_code: awb,
            }
        })

        const token = (await ShipToken.findOne({})).token;

        await generateInvoice(order_id, token);
        await generateLable(order.shiprocket.shipment_id, token);
        await printManifest(order.shiprocket.shipment_id, token);
        res.status(200).json({
            success: true,
            message: 'Updated Order'
        })
    } catch (err) {
        res.status(200).json({
            success: true,
            message: 'Updated Order'
        })
    }
}
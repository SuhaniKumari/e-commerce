const axios = require('axios');
const Order = require('../models/Order');
const axiosInstance = axios.create({});
const apiConnector = (method, url, bodyData, token,) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    return axiosInstance({
        method,
        url,
        data: bodyData ? bodyData : null,
        headers: headers,
        maxBodyLength: Infinity,
    })
}

function getFormattedDateTime(currentDate) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function convertToShiprocketFormat(cart) {
    return cart.map((item, index) => ({
        name: item.name,
        sku: `${item.category.toLowerCase()}${item._id}${Date.now()}${index}`,
        units: item.quantity,
        selling_price: item.price,
    }));
}

exports.createOrder = async (order, email, token) => {
    try {
        const nameArr = order.address.name.split(' ');
        const firstName = nameArr[0];
        const lastName = nameArr.length > 1 ? nameArr[1] : '';

        const data = JSON.stringify({
            order_id: order.orderDetails.public_order_id,
            order_date: getFormattedDateTime(order.orderDetails.order_date),
            pickup_location: "Primary",
            billing_customer_name: firstName,
            billing_last_name: lastName,
            billing_address: order.address.addressLine1,
            billing_address_2: order.address.addressLine2,
            billing_city: order.address.city,
            billing_pincode: order.address.pinCode,
            billing_state: order.address.state,
            billing_country: "India",
            billing_email: email,
            billing_phone: order.address.phoneNumber,
            order_items: convertToShiprocketFormat(order.cart),
            payment_method: order.paymentType,
            sub_total: order.totalPrice,
            shipping_is_billing: true,
            length: '10',
            breadth: '10',
            height: '10',
            weight: '1'
        });

        const method = 'post';
        const url = 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc';

        const response = await apiConnector(method, url, data, token);
        return response;
    } catch (err) {
        console.log('Delivery Handler: ', err);
        return null;
    }
};

exports.cancelOrder = async (orderId, token) => {
    try {
        const data = JSON.stringify({
            "ids": [orderId]
        });

        const method = 'post';
        const url = 'https://apiv2.shiprocket.in/v1/external/orders/cancel';

        await apiConnector(method, url, data, token);

        return true;
    } catch (err) {
        return false;
    }
}

exports.returnOrder = async (order, email, token) => {
    try {
        const nameArr = order.address.name.split(' ');
        const firstName = nameArr[0];
        const lastName = nameArr.length > 1 ? nameArr[1] : '';

        const data = JSON.stringify({
            "order_id": order.orderId,
            "order_date": getFormattedDateTime(Date.now()),
            "channel_id": '',
            "pickup_customer_name": firstName,
            "pickup_last_name": lastName ? lastName : '',
            "pickup_address": order.address.addressLine1,
            "pickup_address_2": order.address.addressLine2,
            "pickup_city": order.address.city,
            "pickup_pincode": order.address.pinCode,
            "pickup_state": order.address.state,
            "pickup_country": "India",
            "pickup_email": email,
            "pickup_phone": order.address.phoneNumber,
            "shipping_customer_name": 'Mohammad',
            "shipping_last_name": 'Afnan',
            "shipping_address": 'KW-204, JK Nagar',
            "shipping_address_2": 'Kareli Allahabad',
            "shipping_city": 'Prayagraj',
            "shipping_pincode": '211016',
            "shipping_state": 'Uttar Pradesh',
            "shipping_country": "India",
            "shipping_email": 'm.afnan2018@gmail.com',
            "shipping_phone": '7235893701',
            "order_items": convertToShiprocketFormat(order.cart),
            "payment_method": order.paymentType,
            "sub_total": order.totalPrice,
            "length": '10',
            "breadth": '15',
            "height": '20',
            "weight": '1'
        });

        const method = 'post';
        const url = 'https://apiv2.shiprocket.in/v1/external/orders/create/return';

        let response = await apiConnector(method, url, data, token);

        return response;
    } catch (err) {
        console.log('Delivery Handler: ', err);
        return null;
    }
}

exports.printManifest = async (orderId, token) => {
    try {
        var data = JSON.stringify({
            "order_id": [orderId]
        });

        const method = 'post';
        const url = 'https://apiv2.shiprocket.in/v1/external/manifests/print';

        let response = await apiConnector(method, url, data, token);

        if (response?.data?.manifest_url) {
            await Order.findOneAndUpdate({ 'shiprocketDetails.order_id': orderId }, { 'shiprocketDetails.manifest': response.data.manifest_url })
        }

        return true;
    } catch (err) {
        console.log(err.response.data);
        return false;
    }
}

exports.generateLable = async (shipmentId, token) => {
    try {
        var data = JSON.stringify({
            "shipment_id": [shipmentId]
        });

        const method = 'post';
        const url = 'https://apiv2.shiprocket.in/v1/external/courier/generate/label';

        let response = await apiConnector(method, url, data, token);

        if (response.data.label_created) {
            await Order.findOneAndUpdate({ 'shiprocketDetails.shipment_id': shipmentId }, { 'shiprocketDetails.label_url': response.data.label_url })
        }

        return true;
    } catch (err) {
        console.log(err.response.data);
        return false;
    }
}

exports.generateInvoice = async (orderId, token) => {
    try {
        var data = JSON.stringify({
            "ids": [orderId]
        });

        const method = 'post';
        const url = 'https://apiv2.shiprocket.in/v1/external/orders/print/invoice';

        let response = await apiConnector(method, url, data, token);

        if (response.data.is_invoice_created) {
            await Order.findOneAndUpdate({ 'shiprocketDetails.order_id': orderId }, { 'shiprocketDetails.invoice': response.data.invoice_url })
        }

        return true;
    } catch (err) {
        console.log(err.response.data);
        return false;
    }
}
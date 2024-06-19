const express = require('express');
const router = express.Router();

//  Import controllers
const { captureMultiPayment, verifyMultiSignature, getMyCart, getMyWishlist, cashOnDelivery, getMyOrders, cancelOrder, returnOrder, getOrders, updateOrder, cancelMyOrder, updateMyCart, updateMyWishlist } = require('../controllers/orderController');

//  Import middlewares
const { authN } = require('../middlewares/authN');
const { adminCheck, verifyCheck } = require('../middlewares/authZ');

router.post('/updateMyCart', authN, updateMyCart);
router.post('/updateMyWishlist', authN, updateMyWishlist);
router.post('/getMyCart', authN, getMyCart);
router.post('/getMyWishlist', authN, getMyWishlist);
router.post('/getMyOrders', authN, getMyOrders);
router.post('/cashOnDelivery', authN, verifyCheck, cashOnDelivery);
router.post('/capturePayment', authN, verifyCheck, captureMultiPayment);
router.post('/verifyPayment', authN, verifyCheck, verifyMultiSignature);
router.post('/cancelMyOrder', authN, verifyCheck, cancelMyOrder);
router.post('/cancelOrder', authN, adminCheck, cancelOrder);
router.post('/returnOrder', authN, verifyCheck, returnOrder);
router.post('/getOrders', authN, adminCheck, getOrders);
router.post('/updateOrder', authN, adminCheck, updateOrder);

module.exports = router;
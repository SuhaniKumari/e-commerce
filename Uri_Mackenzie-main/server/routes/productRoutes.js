const express = require('express');
const router = express.Router();

//  Import controllers
const { createProduct, getAllProduct, updateProduct, getProduct, getCategory, createCategory, updateCategory, deleteCategory, addVarient, deleteVarient, updateVarient, getGraphData, getColors } = require('../controllers/productController');

//  Import middlewares
const { authN } = require('../middlewares/authN');
const { adminCheck } = require('../middlewares/authZ');

router.post('/createProduct', authN, adminCheck, createProduct);
router.get('/getAllProduct', getAllProduct);
router.post('/updateProduct', authN, adminCheck, updateProduct);
router.post('/getProduct', getProduct);

router.get('/category', getCategory);
router.post('/category', authN, adminCheck, createCategory);
router.put('/category', authN, adminCheck, updateCategory);
router.delete('/category', authN, adminCheck, deleteCategory);

router.post('/varient', authN, adminCheck, addVarient);
router.delete('/varient', authN, adminCheck, deleteVarient);
router.put('/varient', authN, adminCheck, updateVarient);

router.post('/getGraphData', authN, adminCheck, getGraphData);
router.get('/getColors', getColors);
module.exports = router;
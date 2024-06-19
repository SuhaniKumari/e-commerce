const express = require('express');
const router = express.Router();

//  Import controllers
const { generateToken, handleOrder } = require('../controllers/shiprockController');

router.post('/handleOrder', handleOrder)
router.post('/generateNewToken', generateToken)

module.exports = router;
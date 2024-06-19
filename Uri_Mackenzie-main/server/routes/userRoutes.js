const express = require('express');
const router = express.Router();

//  Import controllers
const { signup, signin, updateUser, getUser, getToken, getAddress, addAddress, removeAddress, updateAddress } = require('../controllers/userController');

//  Import middlewares
const { authN } = require('../middlewares/authN');
const { adminCheck, viewerCheck } = require('../middlewares/authZ');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/getToken', authN, getToken);
router.get('/getUser', authN, getUser);
router.post('/updateUser', authN, updateUser);
router.get('/getAddress', authN, getAddress);
router.post('/addAddress', authN, addAddress);
router.post('/removeAddress', authN, removeAddress);
router.post('/updateAddress', authN, updateAddress);

module.exports = router;
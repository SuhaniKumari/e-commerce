const express = require('express');
const router = express.Router();

//  Import controllers
const { getVerifyLink, verify, getResetPasswordLink, resetPassword } = require('../controllers/authController');

//  Import middlewares
const { authN } = require('../middlewares/authN');

router.post('/getVerificationLink', authN, getVerifyLink);
router.post('/verification', authN, verify);
router.post('/getResetPasswordLink', getResetPasswordLink);
router.post('/resetPassword', resetPassword)

module.exports = router;
const express = require('express');
const router = express.Router();

//  Import controllers


//  Import middlewares
const { authN } = require('../middlewares/authN');
const { verifyCheck } = require('../middlewares/authZ');
const { getReview, createReview, updateReview, deleteReview } = require('../controllers/reviewController');

//  Define Routes
router.get('/getReview', getReview);
router.post('/createReview', authN, verifyCheck, createReview);
router.post('/updateReview', authN, verifyCheck, updateReview)
router.post('/deleteReview', authN, verifyCheck, deleteReview)

module.exports = router;
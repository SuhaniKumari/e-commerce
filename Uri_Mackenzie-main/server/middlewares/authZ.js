const { customError, failed } = require('../utils/errorHandler');
const User = require('../models/User')

//  Is Admin
exports.adminCheck = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user.id }, { userType: 1 });
        if (user.userType === 'Admin') {
            next();
        } else {
            throw customError('Please verify your account', 400);
        }
    } catch (err) {
        failed(res, err);
    }
}

//  Is Verified
exports.verifyCheck = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.isVerified) {
            next();
        } else {
            throw customError('Please verify your account', 400);
        }
    } catch (err) {
        failed(res, err);
    }
}

//  Is Viewer
exports.viewerCheck = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user.id }, { userType: 1 });
        if (user) {
            next();
        } else {
            throw customError('Invalid Access', 400);
        }
    } catch (err) {
        failed(res, err);
    }
}
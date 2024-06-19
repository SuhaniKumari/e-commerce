const Token = require("../models/Token");
const User = require("../models/User");
const bcrypt = require('bcrypt')
const { failed, customError } = require("../utils/errorHandler");
const mailSender = require("../utils/mailSender");
const verifyMail = require("../mails/verify");
const resetMail = require("../mails/reset");

const getVerifyLink = async (req, res) => {
    try {
        //  Fetching
        const { id } = req.user;

        //  Validation
        const user = await User.findById(id);
        if (user.isVerified) {
            throw customError("You are already verified", 400);
        }
        const already = await Token.findOne({ user: user._id, type: "verification" });
        if (already) {
            await mailSender(user.email, 'Uri&Mackenzie - Verify your account', verifyMail(user.fullname, already.token));
            return res.status(200).json({
                success: true,
                message: 'New link sent'
            })
        }

        //  Perform task
        const token = await require('crypto').randomBytes(20).toString("hex");
        const tokenObj = new Token({
            token,
            user: id,
            type: "verification",
            expirationDate: new Date(Date.now() + (15 * 60 * 1000)),
        })
        await tokenObj.save()

        await mailSender(user.email, 'Uri&Mackenzie - Verify your account', verifyMail(user.fullname, token));

        //  Send response 
        res.status(200).json({
            success: true,
            message: "Verification link sent successfully",
        })
    } catch (err) {
        failed(res, err);
    }
}

const verify = async (req, res) => {
    try {
        //  Fetching
        const { token } = req.body;

        //  Validation
        const find = await Token.findOne({ token, type: 'verification' });
        if (!find) {
            throw customError("Unauthorized access", 404);
        }

        //  Perform Task
        const userId = find.user;
        await User.findByIdAndUpdate(userId, { isVerified: true });

        //  Send response
        res.status(200).json({
            success: true,
            message: "User successfully verified",
        })
    } catch (err) {
        failed(res, err);
    }
}

const getResetPasswordLink = async (req, res) => {
    try {
        //  Fetching
        const { email } = req.body;

        //  Validation
        if (!email) {
            throw customError("Unable to get the email", 401);
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            throw customError("Unable to find the user", 401);
        }
        const already = await Token.findOne({ user: user._id, type: "reset" });
        if (already) {
            mailSender(user.email, 'Uri&Mackenzie - Reset your password', resetMail(user.fullname, already.token));
            return res.status(200).json({
                success: true,
                message: 'New link sent'
            })
        }

        //  Perform task
        const token = await require('crypto').randomBytes(20).toString("hex");
        const tokenObj = new Token({
            token,
            user: user._id,
            type: "reset",
            expirationDate: new Date(Date.now() + (15 * 60 * 1000)),
        })
        await tokenObj.save()
        mailSender(user.email, 'Uri&Mackenzie - Reset your password', resetMail(user.fullname, token));

        //  Send response 
        res.status(200).json({
            success: true,
            message: "Reset Password link sent successfully",
        })
    } catch (err) {
        failed(res, err);
    }
}

const resetPassword = async (req, res) => {
    try {
        //  Fetching
        const { token, password } = req.body;

        //  Validation
        if (!password) {
            throw customError("Password field is required", 401);
        }
        if (password.length < 8) {
            throw customError("Password is too short", 401);
        }
        const find = await Token.findOne({ token, type: 'reset' });
        if (!find) {
            throw customError("Unauthorized access", 404);
        }

        //  Perform Task
        const hashPassword = await bcrypt.hash(password, 10);
        const userId = find.user;
        await User.findByIdAndUpdate(userId, { password: hashPassword });
        await Token.findByIdAndDelete(find._id)

        //  Send response
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.getVerifyLink = getVerifyLink;
exports.verify = verify;
exports.getResetPasswordLink = getResetPasswordLink;
exports.resetPassword = resetPassword;
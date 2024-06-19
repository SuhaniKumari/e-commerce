const { failed, customError } = require("../utils/errorHandler")
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Address = require("../models/Address")
const uploadMedia = require("../utils/fileUploader")

exports.signup = async (req, res) => {
    try {
        //  Fetching
        const { fullname, email, password } = req.body;
        //  Validation
        if (!fullname || !email || !password || fullname.length === 0 || email.length === 0 || password.length < 8) {
            throw customError('Please enter the details correctly', 401);
        }
        const find = await User.findOne({ email })
        if (find) {
            throw customError('This email is already registered', 402);
        }

        //  Perform task
        const hashPassword = await bcrypt.hash(password, 10);
        const userObj = new User({
            fullname, email, password: hashPassword,
        })
        await userObj.save();

        //  Send Response
        res.status(200).json({
            success: true,
            message: 'Signup successfully'
        })
    } catch (err) {
        failed(res, err)
    }
}

exports.signin = async (req, res) => {
    try {
        //  Fetching
        const { email, password } = req.body;

        //  Validation
        if (!email || !password || email.length === 0 || password.length === 0) {
            throw customError('Please enter the details correctly', 404);
        }
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            throw customError('User does not exist', 404);
        }
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            throw customError("Password doesn't match", 404);
        }

        //  Perform task
        const payload = {
            id: user._id,
            name: user.fullname,
            email: user.email,
            userType: user.userType,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '30d'
        })


        //  Send Response
        res.cookie('token', token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        }).status(200).json({
            success: true,
            message: 'Signin successfully',
            token
        })
    } catch (err) {
        failed(res, err)
    }
}

exports.getToken = async (req, res) => {
    try {
        const token = req.cookies.token
            || req.body.token
            || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) throw customError('No token found', 404);

        res.status(200).json({
            success: true,
            message: "Successfully get the token",
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.getUser = async (req, res) => {
    try {
        //  Fetching
        const { id } = req.user;

        //  Validation
        const user = await User.findById(id).populate({
            path: 'address'
        });
        if (!user) {
            throw customError("Unable to find the user");
        }

        const payload = user

        //  Performing the task
        res.status(200).json({
            success: true,
            message: "Fetched user successfully",
            user: payload,
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.updateUser = async (req, res) => {
    try {
        //  Fetching
        const { fullname, phone, removeDP } = req.body;
        const { id } = req.user;
        const image = req.files? req.files['image'] : null;

        //  Validation
        if (!fullname && !image && !phone && !removeDP) {
            throw customError("No field is updated", 402);
        }
        if (fullname && fullname.length === 0) {
            throw customError("Fullname can't be empty", 401);
        }
        let user = await User.findById(id).populate({
            path: 'address'
        });

        //  Performing task
        if (fullname) {
            user = await User.findByIdAndUpdate(id, { fullname }, { new: true }).populate({
                path: 'address'
            });
        }
        if (phone) {
            user = await User.findByIdAndUpdate(id, { phone }, { new: true }).populate({
                path: 'address'
            });
        }
        if (image) {
            const getUrl = await uploadMedia(image, `User/${user.fullname}`)
            user = await User.findByIdAndUpdate(id, { image: getUrl.secure_url }, { new: true }).populate({
                path: 'address'
            });
        }
        else if(removeDP){
            user = await User.findByIdAndUpdate(id, { image: null }, { new: true }).populate({
                path: 'address'
            });
        }

        //  Send Response
        res.status(200).json({
            success: true,
            message: "Successfully updated the user",
            updatedUser: user
        })
    } catch (err) {
        failed(res, err);
    }
}

exports.addAddress = async (req, res) => {
    try {
        // Fetching
        const { name, addressLine1, addressLine2 = '', city, state, pinCode, phoneNumber } = req.body;
        const { id } = req.user;

        // Validation
        if (!name || !addressLine1 || !city || !state || !pinCode || !phoneNumber) {
            throw customError("Mandatory fields are required", 404);
        }

        // Perform Task
        const newAddress = new Address({
            name, addressLine1, addressLine2, city, state, pinCode, phoneNumber
        });
        const savedAddress = await newAddress.save();

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $push: { address: savedAddress._id } },
            { new: true }
        ).populate('address');

        // Send response
        res.status(200).json({
            success: true,
            message: 'Address added successfully',
            address: updatedUser.toObject().address
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.updateAddress = async (req, res) => {
    try {
        // Fetching
        const { id, name, addressLine1, addressLine2 = '', city, state, pinCode, phoneNumber } = req.body;
        const userId = req.user.id;

        // Validation
        if (!id) {
            throw customError('Unknown Address updating', 404)
        }
        const address = await Address.findById(id);
        if (!address) {
            throw customError('Unable to find the address', 404);
        }
        if (!name || !addressLine1 || !city || !state || !pinCode || !phoneNumber) {
            throw customError("Mandatory fields are required", 404);
        }

        // Perform Task
        await Address.findByIdAndUpdate(id, {
            name, addressLine1, addressLine2, city, state, pinCode, phoneNumber
        });
        const user = await User.findById(userId).populate('address');

        // Send response
        res.status(200).json({
            success: true,
            message: 'Address Updated Successfully',
            address: user.address
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.removeAddress = async (req, res) => {
    try {
        // Fetching
        const userId = req.user.id;
        const { id } = req.body;

        // Validation
        if (!id) {
            throw customError("Unknown Address is deleting", 404);
        }
        const address = await Address.findById(id);
        if (!address) {
            throw customError("Unable to find the address", 404);
        }

        // Perform Task
        await Address.findByIdAndDelete(id);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { address: id } },
            { new: true }
        ).populate('address')

        // Send response
        res.status(200).json({
            success: true,
            message: 'Address Removed Successfully',
            address: updatedUser.address
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.getAddress = async (req, res) => {
    try {
        // Fetching
        const userId = req.user.id;

        // Validation
        const user = await User.findById(userId).populate('address');

        // Perform Task

        // Send response
        res.status(200).json({
            success: true,
            message: 'Successfully got the address',
            address: user.address
        });
    } catch (err) {
        failed(res, err);
    }
}
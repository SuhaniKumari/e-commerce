const Review = require("../models/Review");
const Product = require("../models/Product");
const { failed, customError } = require("../utils/errorHandler")


exports.createReview = async (req, res) => {
    try {
        // Fetching
        const { productId, stars, review } = req.body;
        const userId = req.user.id;

        // Validations
        if (!productId) {
            throw customError('Product ID is required', 400);
        }

        if (!stars) {
            throw customError('Rating stars are required', 400);
        }

        if (!review) {
            throw customError('Review text is required', 400);
        }

        if (stars < 1 || stars > 5) {
            throw customError('Rating stars must be between 1 and 5', 400);
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            throw customError('Product not found', 404);
        }

        // Check if the user has already reviewed this product
        const existingReview = await Review.findOne({ product: productId, user: userId });
        if (existingReview) {
            throw customError('You have already reviewed this product', 400);
        }

        // Create the review
        const newReview = new Review({
            product: productId,
            user: userId,
            stars,
            review,
        });

        const savedReview = await newReview.save();

        // Return the saved review
        res.status(201).json({
            success: true,
            message: 'Review Posted successfully',
            savedReview
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.updateReview = async (req, res) => {
    try {
        // Fetch the review ID and update data
        const { stars, review, reviewId } = req.body;
        const userId = req.user.id;

        // Validations
        if (!reviewId) {
            throw customError('Unknown review selected', 400);
        }

        if (!stars && !review) {
            throw customError('At least one field (stars or review) must be provided', 400);
        }

        if (stars && (stars < 1 || stars > 5)) {
            throw customError('Rating stars must be between 1 and 5', 400);
        }

        // Find the review
        const existingReview = await Review.findById(reviewId);
        if (!existingReview) {
            throw customError('Review not found', 404);
        }

        // Check if the user owns the review
        if (existingReview.user.toString() !== userId) {
            throw customError('You are not authorized to update this review', 403);
        }

        // Update the review
        existingReview.stars = stars || existingReview.stars;
        existingReview.review = review || existingReview.review;

        const updatedReview = await existingReview.save();

        // Return the updated review
        res.json({
            success: true,
            message: 'Review updated successfully',
            updatedReview
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.deleteReview = async (req, res) => {
    try {
        // Fetch the review ID
        const { reviewId } = req.body;
        const userId = req.user.id;

        // Validations
        if (!reviewId) {
            throw customError('Unknow review selected', 400);
        }

        // Find the review
        const review = await Review.findById(reviewId);
        if (!review) {
            throw customError('Review not found', 404);
        }

        // Check if the user owns the review
        if (review.user.toString() !== userId) {
            throw customError('You are not authorized to delete this review', 403);
        }

        // Delete the review
        await Review.findByIdAndDelete(reviewId);

        // Return a success message
        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (err) {
        failed(res, err);
    }
};

exports.getReview = async (req, res) => {
    try {
        // Fetching
        const { page = 1, limit = 7, userId = null, productId = null } = req.query;

        // Validations
        if (page < 1) {
            throw customError('Page number must be at least 1', 400);
        }

        if (limit < 1) {
            throw customError('Limit must be at least 1', 400);
        }

        const skip = (page - 1) * limit;

        let query = {};

        let myReview;

        if (userId) {
            myReview = await Review.findOne({ product: productId, user: userId })
                .populate('user', 'name image')
                .populate('product', 'name')
        }

        if (productId) {
            query.product = productId;
        }

        // Fetch reviews based on the query
        const reviews = await Review.find(query)
            .skip(skip)
            .limit(limit)
            .populate('user', 'fullname image')
            .populate('product', 'name')
            .sort({
                'user.image': 1,
                stars: -1,
                'review.length': -1,
            });

        const totalCount = await Review.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        // Return the reviews and pagination metadata
        res.json({
            success: true,
            message: 'Successfully fetched the review',
            reviews,
            myReview,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,

            }
        });
    } catch (err) {
        failed(res, err);
    }
};
import React, { useEffect, useState } from 'react';
import style from './Review.module.css';
import { createReview, deleteReview, updateReview } from 'services/operations/reviewAPI';
import { Rating } from 'react-simple-star-rating';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ReviewForm = ({ setMyReview, myReview, productId }) => {
    const [isEditing, setIsEditing] = useState(!myReview);
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);

    const { user } = useSelector(state=>state.user);

    const navigate = useNavigate();

    const handleSubmit = () => {
        if (myReview) {
            updateReview({ review, stars, reviewId: myReview._id }, setMyReview);
        } else {
            createReview({ review, stars, productId }, setMyReview);
        }
        setIsEditing(false);
    };

    useEffect(() => {
        if (myReview) {
            setReview(myReview.review);
            setStars(myReview.stars);
            setIsEditing(false);
        } else {
            setReview('');
            setStars('');
            setIsEditing(true);
        }
    }, [myReview]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDeleteReview = () => {
        deleteReview({ reviewId: myReview._id }, setMyReview);
    };

    const handleIsNotLogin = ()=>{
        if(!user){
            navigate('/login')
            return;
        }

        if(!user.isVerified){
            toast.error('Verify your account to post review');
            navigate('/myaccount/#manageAccount');
            return;
        }
    }

    return (
        <div className={style.ReviewForm}>
           {user && user.isVerified ? <div>
                <div>
                    <label htmlFor="stars">Rating:</label>
                    <Rating
                        initialValue={stars}
                        allowHalfIcon={true}
                        fillColor="#ffd700"
                        emptyColor="#d3d3d3"
                        readonly={!isEditing}
                        onClick={(value) => setStars(value)}
                    />
                </div>
                <div>
                    <label htmlFor="review">Review:</label>
                    <textarea
                        name="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        rows={4}
                        placeholder="Write your review here..."
                        disabled={!isEditing}
                    />
                </div>
                {myReview && !isEditing ? (
                    <>
                        <button className="border-round-btn" onClick={handleEdit}>
                            Edit Review
                        </button>
                        <button className="border-round-btn" onClick={() => handleDeleteReview()}>
                            Delete Review
                        </button>
                    </>
                ) : (
                    <>
                        <button className="border-round-btn" onClick={handleSubmit}>
                            {myReview ? 'Update Review' : 'Post Review'}
                        </button>
                        {myReview && (
                            <button className="border-round-btn" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        )}
                    </>
                )}
            </div> : <div style={{textAlign: 'center'}}>
                    <button className='border-round-btn' onClick={handleIsNotLogin}>{user ? 'Verify your account to post review' : 'Login to post review'}</button>
                </div>}
        </div>
    );
};

export default ReviewForm;
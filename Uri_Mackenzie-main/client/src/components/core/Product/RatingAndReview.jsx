import React, { useEffect, useState } from 'react'
import style from './Product.module.css'
import ReviewForm from 'components/common/Review/ReviewForm'
import { useNavigate, useParams } from 'react-router-dom'
import { getReview } from 'services/operations/reviewAPI'
import { useSelector } from 'react-redux'
import { Rating } from 'react-simple-star-rating'

const RatingAndReview = () => {
    const { id } = useParams();
    const [myReview, setMyReview] = useState(null);
    const [reviews, setReviews] = useState([]);

    const { user } = useSelector(state => state.user);

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            getReview({ productId: id, userId: user._id }, setReviews, setMyReview)
        } else {
            getReview({ productId: id }, setReviews)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div className={style.RatingAndReview}>
            <h3>RatingAndReview</h3>
            <div>
                <ReviewForm productId={id} myReview={myReview} setMyReview={setMyReview} />
                <div className={style.allReviews}>
                    {reviews.map((review, index) => (
                        <div key={index}>
                            <img src={review.user.image ? review.user.image : `https://ui-avatars.com/api/?name=${review.user.fullname}`} alt='user' />
                            <div>
                                <h4>{review.user.fullname}</h4>
                                <Rating
                                    initialValue={review.stars}
                                    allowHalfIcon={true}
                                    fillColor="#ffd700"
                                    emptyColor="#d3d3d3"
                                    readonly={true}
                                    size={24}
                                />
                                <h5>{review.review}</h5>
                            </div>
                        </div>
                    ))}
                    {reviews.length > 0 && <button className='border-round-btn' onClick={() => navigate(`/reviews/${id}`)}>View More</button>}
                </div>
            </div>
        </div>
    )
}

export default RatingAndReview
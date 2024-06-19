import React, { useEffect, useState } from 'react'
import style from './Review.module.css'
import ReviewForm from 'components/common/Review/ReviewForm'
import { useNavigate, useParams } from 'react-router-dom'
import { getReview } from 'services/operations/reviewAPI'
import { useSelector } from 'react-redux'
import { Rating } from 'react-simple-star-rating'

const Review = () => {
    const { id } = useParams();
    const [myReview, setMyReview] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [loader, setLoader] = useState(true);

    const { user } = useSelector(state => state.user);

    const navigate = useNavigate();

    if (!id) {
        navigate('/');
    }

    useEffect(() => {
        if (user) {
            getReview({ productId: id, userId: user._id, limit: 99999 }, setReviews, setMyReview)
        } else {
            getReview({ productId: id, limit: 99999 }, setReviews)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(()=>{
        if(reviews && loader){
            setLoader(false);
        }else if(!reviews && !loader){
            setLoader(true);
        }
    }, [reviews, loader])

    return (
        <div className={style.Review}>
            <h3>Rating and Reviews</h3>
            <div>
                <ReviewForm productId={id} myReview={myReview} setMyReview={setMyReview} />
                {
                    loader ? <div className='loaderBg'><div className='loader'></div></div> :
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
                        </div>
                }
            </div>

        </div>
    )
}

export default Review
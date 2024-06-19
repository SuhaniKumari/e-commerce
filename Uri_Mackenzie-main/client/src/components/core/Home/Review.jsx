import React, { useEffect, useState } from 'react'
import style from './Home.module.css'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import ReactStars from "react-rating-stars-component";
import { MdOutlineArrowBack, MdOutlineArrowForward, MdOutlineStar, MdOutlineStarHalf, MdOutlineStarOutline } from 'react-icons/md';
import { getReview } from 'services/operations/reviewAPI';

const Review = () => {

    const [reviews, setReviews] = useState(null);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        getReview({}, setReviews);
    }, [])

    useEffect(() => {
        if (reviews) {
            setLoader(false);
        }
    }, [reviews]);

    return (
        <div className={style.Review}>
            <p>Happy Customers</p>
            <div>{loader ? <div className='loaderBg' style={{height: '100%'}}><div className='loader'></div></div> :
                <Slide prevArrow={<MdOutlineArrowBack />} nextArrow={<MdOutlineArrowForward />}>
                    {
                        reviews.map((review, index) => (<div className={style.singleReview} key={index}>
                            <img src={review?.user?.image ? review.user.image : `https://ui-avatars.com/api/?name=${review.user.fullname}`} alt='user' />
                            <ReactStars
                                count={5}
                                size={24}
                                value={review.stars}
                                isHalf={true}
                                emptyIcon={<MdOutlineStarOutline />}
                                halfIcon={<MdOutlineStarHalf />}
                                fullIcon={<MdOutlineStar />}
                                activeColor="#ffd700"
                                edit={false}
                                default={0}
                            />
                            <p>{review.review}</p>
                        </div>
                        ))
                    }
                </Slide>}
            </div>
        </div>
    )
}

export default Review
import React from 'react'
import style from './Home.module.css'
import Marquee from 'react-fast-marquee';
import { useNavigate } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useSelector } from 'react-redux';

function doesProductExist(wishlist, productId) {
    if (wishlist) {
        return wishlist.some(item => item.productId === productId);
    }
    return false;
}

const Showcase = ({ products }) => {

    const { wishlist } = useSelector(state => state.products);

    const navigate = useNavigate()

    return (
        <div className={style.Showcase}>
            <Marquee pauseOnHover={true} autoFill={true}>
                {products.map((product, index) => <div key={index} className={style.single} onClick={() => navigate(`product/${product._id}`)} style={{ backgroundImage: `url(${product.image[0]}` }} alt='product' >{doesProductExist(wishlist, product._id) ? <MdFavorite /> : <MdFavoriteBorder />}</div>)}
            </Marquee>
        </div>
    )
}

export default Showcase
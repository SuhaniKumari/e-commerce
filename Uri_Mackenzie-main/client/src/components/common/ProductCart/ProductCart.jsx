import React from 'react'
import style from './ProductCart.module.css'
import SingleProduct from './SingleProduct'
import { useNavigate } from 'react-router-dom'

const ProductCart = ({ products, type }) => {
    const navigate = useNavigate();
    return (
        <div className={style.ProductCart}>
            {
                products.length !== 0 ?
                    products.map((product, index) => (
                        <SingleProduct key={index} product={product} type={type} />
                    ))
                    : (
                        <div className={style.empty}>
                            <h2>
                                {type === 'cart' && "Your Cart is Empty, Shop Now"}
                                {type === 'order' && "You haven't ordered anything yet, Order Now"}
                                {type === 'wishlist' && "You haven't wish for anything yet"}
                            </h2>
                            <button className='border-round-btn' onClick={() => navigate('/')}>
                                Shop Now
                            </button>
                        </div>
                    )
            }
        </div>
    )
}

export default ProductCart
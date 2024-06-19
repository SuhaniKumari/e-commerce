import React from 'react'
import style from './ProductCard.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { setQuickView } from 'slices/productSlice';
import { useDispatch } from 'react-redux';

const ProductCard = ({ data }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    return (
        <div className={`${style.ProductCard} ${location.pathname === '/search' && style.search}`} style={{ width: location.pathname === '/search' ? 'auto' : '180px' }}>
            <img src={data?.image} alt='product' onClick={() => navigate(`/product/${data._id}`)} />
            <h3 onClick={() => navigate(`/product/${data._id}`)}>{data?.name}</h3>
            <h4 onClick={() => navigate(`/product/${data._id}`)}>Starting from  ₹{data.minPrice}</h4>
            <button className='border-round-btn' onClick={() => dispatch(setQuickView(data))}>Quick view</button>
        </div>
    )
}

export default ProductCard
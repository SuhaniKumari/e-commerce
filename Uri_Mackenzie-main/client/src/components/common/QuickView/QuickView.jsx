import React, { useRef } from 'react'
import style from './QuickView.module.css'
import { setQuickView } from 'slices/productSlice';
import { MdClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useNavigate } from 'react-router-dom';

const QuickView = ({ data }) => {

    console.log(data);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const quickViewRef = useRef();

    useOnClickOutside(quickViewRef, () => dispatch(setQuickView(null)));


    return (
        <div className={style.QuickView} ref={quickViewRef}>
            <button className='border-round-btn' onClick={() => dispatch(setQuickView(null))}><MdClose /></button>
            <div>
                <img src={data.image[0]} alt='product' />
            </div>
            <div style={{ padding: '1rem' }}>
                <h1>{data.name}</h1>
                <h3>{data.description}</h3>
                <h2>Details:</h2>
                <ul>
                    {data.details[0].map((detail, index) => (
                        <li key={index} >{detail}</li>
                    ))}
                </ul>
                <h2>Available colors:</h2>
                <div>
                    {data.colorCodes.map((color, index) => (
                        <div key={index} style={{ backgroundColor: color }} className={style.color}></div>
                    ))}
                </div>
                <h2>Available Sizes:</h2>
                <div>
                    {data.availableSizes.map((size, index) => (
                        <div key={index} className={style.size}>{size}</div>
                    ))}
                </div>
                <button className='border-round-btn' onClick={() => navigate(`/product/${data._id}`)}>View More</button>
            </div>
        </div >
    )
}

export default QuickView
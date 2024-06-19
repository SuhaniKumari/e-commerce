import React from 'react'
import style from './ProductSlider.module.css';
import ProductCard from 'components/common/ProductCard/ProductCard';
import { useNavigate } from 'react-router-dom';

const ProductSlider = ({products, heading, click}) => {
    const navigate = useNavigate();
    return (
        <div className={style.ProductSlider}>
            <p>{heading}</p>
            <div>
                <div>
                    {
                        products.map((data, index) => (
                            <ProductCard key={index} data={data} />
                        ))
                    }
                </div>
            </div>
            <button className='border-round-btn' onClick={()=>navigate(click)}>View All</button>
        </div>
    )
}

export default ProductSlider
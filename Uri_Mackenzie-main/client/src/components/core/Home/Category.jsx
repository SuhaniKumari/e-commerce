import React from 'react'
import style from './Home.module.css'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const Category = () => {
    const navigate = useNavigate();

    const { categories } = useSelector(state => state.products);
    // const categories = ['temp', 'all'];

    return (
        <div className={style.category}>
            {
                categories?.length > 0 && categories.map((cat, index) => (<div key={index} onClick={() => navigate(`/search?category=${cat._id}`)}>
                    <img src={cat.image} alt={cat.name} />
                    <p>{cat.name}</p>
                </div>
                ))
            }
        </div>
    )
}

export default Category
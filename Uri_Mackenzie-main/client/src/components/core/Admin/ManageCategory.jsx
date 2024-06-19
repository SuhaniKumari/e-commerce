import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import style from './Admin.module.css'
import { useNavigate } from 'react-router-dom';
import { deleteCategory } from 'services/operations/productAPI';

const ManageCategory = () => {

    const { categories } = useSelector(state => state.products);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div className={style.ManageCategory}>
            <div>
                <h1>Manage Category:</h1>
                <div>
                    {categories?.length === 0 ? <div className={style.loaderBg}>No Product Found</div> :
                        categories.map((category, index) => <div key={index}>
                            <p>{category.name}</p>
                            <div>
                                <button className='border-round-btn' onClick={() => navigate(`/admin/add-category/${category._id}`)}>Edit</button>
                                <button className='border-round-btn' onClick={() => deleteCategory(dispatch, { id: category._id })}>Delete</button>
                            </div>
                        </div>)}
                </div>

            </div>
        </div>
    )
}

export default ManageCategory
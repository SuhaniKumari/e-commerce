import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import style from './Admin.module.css';
import { addCategory, updateCategory } from 'services/operations/productAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdDelete } from 'react-icons/md';

const AddCategory = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const { categories } = useSelector(state => state.products);

    const imageRef = useRef();

    const [previewImage, setPreviewImage] = useState(id ? categories.filter(cat => cat._id === id)[0]?.image : null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        clearErrors
    } = useForm();

    useEffect(() => {
        if (id) {
            setValue('id', id)
        }
    }, [id, setValue])

    const submitHandler = async (formData) => {
        // Handle form submission
        console.log(formData);

        if (!formData.image) {
            setError('image')
        }

        if (id) {
            await updateCategory(dispatch, formData);
            navigate('/admin/manage-category')
        } else {
            await addCategory(dispatch, formData);
            navigate('/admin/manage-category')
        }
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            clearErrors('image');
            setValue('image', file);
            setPreviewImage(reader.result);
        };
    };

    const handleImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            event.target.value = null;
            previewFile(file);
        }
    };

    return (
        <div className={style.Product}>
            <form onSubmit={handleSubmit(submitHandler)}>
                <div>
                    {/* Image */}
                    <div>
                        <input
                            type='file'
                            id='image'
                            onChange={handleImage}
                            ref={imageRef}
                            accept='image/*'
                            style={{ display: 'none' }}
                        />
                        {
                            previewImage ?
                                <div className={style.categoryImage}>
                                    <img src={previewImage} alt="Category" />
                                    <button type='button' className='border-round-btn' onClick={() => imageRef.current.click()}>Change</button>
                                </div>
                                :
                                <button type='button' className='border-round-btn' onClick={() => imageRef.current.click()}>Add Image</button>
                        }
                        {errors.image && <span>Image is required</span>}
                    </div>

                    {/* Name */}
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            defaultValue={id ? categories.filter(cat => cat._id === id)[0].name : ''}
                            {...register('name', { required: true, trim: true })}
                        />
                        {errors.name && <span>This field is required</span>}
                    </div>
                    <button type="submit" className='border-round-btn'>{id ? 'Update Category' : 'Add Category'}</button>
                    {id && <button type="button" onClick={() => navigate('/admin/manage-category')} className='border-round-btn'>Go Back</button>}
                </div>
            </form>

        </div>
    )
}

export default AddCategory
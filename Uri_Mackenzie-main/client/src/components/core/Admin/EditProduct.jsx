import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import style from './Admin.module.css';
import { MdClose, MdDeleteForever, MdOutlineCheckCircle, MdOutlineModeEditOutline } from 'react-icons/md';
import { createVarient, createProduct, getProduct, updateProduct, updateVarient, deleteVarient } from 'services/operations/productAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditProduct = () => {
    const [data, setData] = useState(null);
    const [addVarient, setAddVarient] = useState(false);
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    return (
        <div className={style.Product}>
            {addVarient ? (
                <AddVariantForm
                    addVarient={addVarient}
                    setAddVarient={setAddVarient}
                    images={images}
                    setImages={setImages}
                    previewImages={previewImages}
                    setPreviewImages={setPreviewImages}
                />
            ) : (
                <EditProductForm
                    setAddVarient={setAddVarient}
                    setData={setData}
                    data={data}
                />
            )}
        </div>
    );
};

const AddVariantForm = ({ addVarient, setAddVarient, images, setImages, previewImages, setPreviewImages }) => {
    const imageRef = useRef();

    const { id } = useParams();

    const [sizes, setSizes] = useState([]);
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        clearErrors
    } = useForm();

    useEffect(() => {
        // Set initial values for the variant form
        if (addVarient === true) {
            setValue('colorCode', '');
            setValue('colorName', '');
            setImages([]);
            setPreviewImages([]);
            setSizes([]);
        } else {
            setValue('colorCode', addVarient.colorCode);
            setValue('colorName', addVarient.colorName);
            setImages(addVarient.images);
            setPreviewImages(addVarient.images);
            setSizes(addVarient.sizes);
        }
    }, [addVarient, setImages, setPreviewImages, setValue]);

    const addVariantHandler = async (formData) => {
        // console.log(images);
        // return;
        if (!images || images.length === 0) {
            setError('images')
            return;
        }
        if (sizes.length === 0) {
            setError('sizes', {
                type: 'manual',
                message: 'Atleast one size is required'
            });
            return;
        }
        formData.images = images;
        formData.sizes = JSON.stringify(sizes);
        formData.productId = id;
        if (addVarient === true) {
            await createVarient(formData);
            setAddVarient(false);
        } else {
            formData.variantId = addVarient._id;
            await updateVarient(formData);
            setAddVarient(false);
        }
    };

    const addImage = (file) => {
        if (file) {
            setImages((prev) => [...prev, file]);
            clearErrors('images');
        }
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            addImage(file);
            setPreviewImages((prev) => [...prev, reader.result]);
        };
    };

    const handleImage = (event) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                previewFile(file);
            });
        }
    };

    const removeImage = (index) => {
        if (index >= 0) {
            let temp = previewImages.filter((_, i) => i !== index);
            setPreviewImages(temp);

            temp = images.filter((_, i) => i !== index);
            setImages(temp);
        }
    };


    const addSizes = () => {
        if (!isNaN(size) && !isNaN(price) && !isNaN(stock) && size !== '' && price !== '' && stock !== '') {
            setSizes([...sizes, { 'size': size, 'price': price, 'stock': stock }]);
            setSize('');
            setPrice('');
            setStock('');
        } else {
            setError('sizes', {
                type: 'manual',
                message: 'Size, Price, and Stock must be valid numbers'
            });
        }
    };

    const handleSizes = (e) => {
        clearErrors('sizes')
        if (e.target.name === 'size') {
            setSize(e.target.value);
        }
        if (e.target.name === 'price') {
            setPrice(e.target.value);
        }
        if (e.target.name === 'stock') {
            setStock(e.target.value);
        }
    }

    const removeSizes = (index) => {
        setSizes(sizes.filter((_, i) => i !== index));
    };

    return (
        <form key='variant-form' onSubmit={handleSubmit(addVariantHandler)}>
            <div>
                <button type='button' onClick={() => setAddVarient(false)} className='secondary-round-btn'>Back to Product</button>

                {/* Images */}
                <div className={style.imageSection}>
                    <input ref={imageRef} onChange={handleImage} type='file' accept='image/*' multiple />
                    {images.length === 0 && <div onClick={() => imageRef.current.click()} className={style.tempImage}>
                        <h2>Add at least one image</h2>
                    </div>}
                    <div>
                        {previewImages.map((image, index) => (
                            <div key={index} className={style.imageContainer}>
                                <MdClose onClick={() => removeImage(index)} />
                                <img src={image} alt='productImage' />
                            </div>
                        ))}
                    </div>
                    {errors.images && (
                        <span>Atleast one image is required</span>
                    )}
                    {images.length !== 0 && <button onClick={() => imageRef.current.click()} type='button' className='border-round-btn'>Add Image</button>}
                </div>


                {/* Sizes */}
                <div className={style.sizesSection}>
                    <label htmlFor="stock">Stock, Size & Price</label>
                    <div>
                        {sizes.length > 0 && sizes.map((detail, index) => (
                            <div key={index}>
                                <p>{detail.size}</p>
                                <p>{detail.price}</p>
                                <p>{detail.stock}</p>
                                <button className='border-round-btn' type='button' onClick={() => removeSizes(index)}><MdClose /></button>
                            </div>
                        ))
                        }
                    </div>
                    <div>
                        <div>
                            {/* Size */}
                            <input
                                type="text"
                                id="size"
                                placeholder='Size'
                                name='size'
                                value={size}
                                onChange={handleSizes}
                            />

                            {/* Price */}
                            <input
                                type="text"
                                id="price"
                                placeholder='Price'
                                name='price'
                                value={price}
                                onChange={handleSizes}
                            />

                            {/* Stock */}
                            <input
                                type="text"
                                id="stock"
                                placeholder='Stock'
                                name='stock'
                                value={stock}
                                onChange={handleSizes}
                            />

                            <button className='border-round-btn' type='button' onClick={addSizes}><MdOutlineCheckCircle /></button>
                        </div>
                    </div>
                    {errors.sizes && (
                        <span>{errors.sizes.message}</span>
                    )}
                </div>


                {/* Color Code */}
                <div>
                    <label htmlFor="colorCode">Color Code (Hex Format: #XXXXXX)</label>
                    <input
                        type="text"
                        id="colorCode"
                        {...register('colorCode', {
                            required: true,
                            pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                        })}
                    />
                    {errors.colorCode && (
                        <span>This field is required and must be a valid hex color code</span>
                    )}
                </div>

                {/* Color Name */}
                <div>
                    <label htmlFor="colorName">Color Name</label>
                    <input
                        type="text"
                        id="colorName"
                        {...register('colorName', { required: true })}
                    />
                    {errors.colorName && (
                        <span>This field is required</span>
                    )}
                </div>

                <button type="submit" className='border-round-btn'>{addVarient === true ? 'Add Varient' : 'Update Varient'}</button>
            </div>
        </form>
    );
};

const EditProductForm = ({ setAddVarient, setData, data }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { categories } = useSelector(state => state.products);

    const [details, setDetails] = useState(data?.details || []);
    const [detail, setDetail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    useEffect(() => {
        if (data) {
            setValue('name', data.name);
            setValue('description', data.description);
            setDetails(data.details);
            setValue('category', data.category);
            setValue('cashOnDelivery', data.isCOD ? 'On' : 'Off');
        } else {
            setValue('name', '');
            setValue('description', '');
            setDetails([]);
            setValue('category', '');
            setValue('cashOnDelivery', 'Off');
        }
    }, [data, setValue]);

    useEffect(() => {
        if (id) {
            getProduct({ 'id': id }, setData);
        } else {
            setData(null);
        }
    }, [id, setData]);

    const addProductHandler = async (formData) => {
        formData.details = details;

        if (data) {
            formData.id = data._id;
            await updateProduct(formData);
            navigate('/admin/manage-products');
        } else {
            await createProduct(formData);
            navigate('/admin/manage-products');
        }
    };

    const addDetails = () => {
        if (detail.length !== 0) {
            setDetails([...details, detail]);
            setDetail('');
        }
    };

    const removeDetails = (index) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    const removeVarient = async (data) => {
        await deleteVarient(data);
        setData(prev => ({
            ...prev,
            subDetails: prev.subDetails.filter(subDetail => subDetail._id !== data.variantId)
        }));
    }

    return (
        <form key='product-form' onSubmit={handleSubmit(addProductHandler)}>
            <div>
                {/* Name */}
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        {...register('name', { required: true })}
                    />
                    {errors.name && <span>This field is required</span>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        {...register('description', { required: true })}
                    ></textarea>
                    {errors.description && <span>This field is required</span>}
                </div>

                {/* Details */}
                <div className={style.details}>
                    <label htmlFor="details">Details</label>
                    {details.length > 0 && <div>
                        {details.map((detail, index) => (
                            <div key={index}>
                                <p>{detail}</p>
                                <button className='border-round-btn' type='button' onClick={() => removeDetails(index)}><MdClose /></button>
                            </div>
                        ))}
                    </div>}
                    <input
                        type="text"
                        id="details"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                    />
                    <button className='border-round-btn' onClick={addDetails} type='button'>Add Detail</button>
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category">Category</label>
                    <select id="category" {...register('category', { required: true })}>
                        <option disabled value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                    {errors.category && <span>This field is required</span>}
                </div>

                {/* Cash on Delivery */}
                <div>
                    <label htmlFor="cashOnDelivery">Cash on Delivery</label>
                    <select id="cashOnDelivery" {...register('cashOnDelivery', { required: true })}>
                        <option value="Off">Off</option>
                        <option value="On">On</option>
                    </select>
                    {errors.cashOnDelivery && <span>This field is required</span>}
                </div>

                {/* Varients */}
                {data && <div className={style.details}>
                    <label htmlFor="details">Varients:</label>
                    {data.subDetails.length > 0 && <div>
                        {data.subDetails.map((detail, index) => (
                            <div key={index}>
                                <p>{detail.colorName}</p>
                                <button style={{ borderRadius: '0', borderRight: '0' }} className='border-round-btn' type='button' onClick={() => setAddVarient(detail)}><MdOutlineModeEditOutline /></button>
                                <button type='button' className='border-round-btn' onClick={() => { removeVarient({ productId: data._id, variantId: detail._id }) }}><MdDeleteForever /></button>
                            </div>
                        ))}
                    </div>}
                    <button type='button' className='border-round-btn' onClick={() => setAddVarient(true)}>Add Variant</button>
                </div>}

                <button type="submit" className='border-round-btn'>{data ? 'Update Product' : 'Add Product'}</button>
            </div>
        </form>
    );
};

export default EditProduct;
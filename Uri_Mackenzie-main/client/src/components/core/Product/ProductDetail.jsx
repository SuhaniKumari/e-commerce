import React, { useEffect, useState } from 'react'
import style from './Product.module.css'
import ReactImageGallery from 'react-image-gallery'
import '../../../../node_modules/react-image-gallery/styles/css/image-gallery.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { setCart, setWishlist } from 'slices/productSlice'
import background from 'assets/images/background.png'

const convertToGalleryImages = (images) => {
    if(images){
        return images.map((image) => ({
            original: image,
            thumbnail: image,
            thumbnailHeight: '50px',
            thumbnailWidth: '100px',
            originalHeight: '500px',
            originalWidth: '400px',
            thumbnailClass: style.thumbnailClass,
            originalClass: style.originalClass
        }));
    }
    return [];
};

const countItems = (cart, productId, colorId, sizeId) => {
    if (!colorId || !sizeId) {
        return 0;
    }
    const item = cart.filter((item => item.productId === productId && item.subDetailId === colorId && item.sizeId === sizeId))
    if (item.length !== 0) {
        return item[0].quantity;
    }
    return 0;
}

const ProductDetail = ({ product }) => {
    const { user } = useSelector(state => state.user);
    const { cart, wishlist } = useSelector(state => state.products);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [color, setColor] = useState(product.subDetails.length > 0 ? product.subDetails[0]._id : '');
    const [selectedColor, setSelectedColor] = useState(product.subDetails.length > 0 ? product.subDetails[0] : null);
    const [size, setSize] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    const [checkCart, setCheckCart] = useState(0)
    const [checkWishlist, setCheckWishlist] = useState(0)

    const handleCart = async (val) => {
        if (!user) {
            navigate('/login')
            return;
        }
        if (val) {
            if (checkCart !== 0) {
                navigate('/cart');
            } else {
                if (!selectedColor) {
                    toast.error('Select the color first');
                    return;
                }
                if (!selectedSize) {
                    toast.error('Select the size');
                    return;
                }
                if (selectedSize.stock === 0) {
                    toast.error('Item is out of stock');
                    return;
                }
                const obj = {
                    productId: product._id,
                    name: `${product.name}-${selectedColor.colorName}-${selectedSize.size}`,
                    description: product.description,
                    image: selectedColor.images[0],
                    price: selectedSize.price,
                    subDetailId: selectedColor._id,
                    sizeId: selectedSize._id,
                    quantity: 1,
                    maxQuantity: selectedSize.stock

                }
                dispatch(setCart([
                    ...cart, obj
                ]));
                navigate('/cart');
            }
        }
        else {
            if (checkCart !== 0) {
                // await removeFromCart({ productId: product._id }, dispatch, user);
                const filteredCart = cart.filter(item => item.productId !== product._id);
                dispatch(setCart(filteredCart))
            } else {
                if (!selectedColor) {
                    toast.error('Select the color first');
                    return;
                }
                if (!selectedSize) {
                    toast.error('Select the size');
                    return;
                }
                if (selectedSize.stock === 0) {
                    toast.error('Item is out of stock');
                    return;
                }
                const obj = {
                    productId: product._id,
                    name: `${product.name}-${selectedColor.colorName}-${selectedSize.size}`,
                    description: product.description,
                    image: selectedColor.images[0],
                    price: selectedSize.price,
                    subDetailId: selectedColor._id,
                    sizeId: selectedSize._id,
                    quantity: 1,
                    maxQuantity: selectedSize.stock

                }
                dispatch(setCart([
                    ...cart, obj
                ]));
            }
        }
    }

    const addToWishlist = async () => {
        const obj = {
            productId: product._id,
            name: `${product.name} - ${selectedColor.colorName} - ${selectedSize.size}`,
            description: product.description,
            image: selectedColor.images[0],
            price: selectedSize.price,
            subDetailId: selectedColor._id,
            sizeId: selectedSize._id,

        }

        dispatch(setWishlist([...wishlist, obj]));
    }
    const removeFromWishlist = async () => {
        const updatedWishlist = wishlist.filter(
            (item) => item.productId !== product._id && item.subDetailId !== selectedColor._id && item.sizeId !== selectedSize._id
        );
        dispatch(setWishlist(updatedWishlist));
    }

    useEffect(() => {
        if (color) {
            const detail = product.subDetails.filter(detail => detail._id === color);
            setSelectedColor(detail[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color]);

    useEffect(() => {
        if (selectedColor) {
            setSelectedSize(null);
            setSize('');
        }
    }, [selectedColor])

    useEffect(() => {
        if (size) {
            const detail = selectedColor.sizes.filter(item => item._id === size);
            setSelectedSize(detail[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size]);

    useEffect(() => {
        if (cart) {
            setCheckCart(countItems(cart, product._id, selectedColor?._id, selectedSize?._id))
        }
        if (wishlist) {
            const temp = wishlist.filter((item => item.productId === product._id && item.subDetailId === selectedColor?._id && item.sizeId === selectedSize?._id))
            if (temp.length > 0) {
                setCheckWishlist(true)
            } else {
                setCheckWishlist(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart, wishlist, selectedColor, selectedSize])

    return (
        <div className={style.ProductDetail} style={{ backgroundImage: `url(${background})` }}>
            <div>
                <ReactImageGallery key={`gallery-${selectedColor?._id}`} showNav={false} items={convertToGalleryImages(selectedColor?.images)} thumbnailPosition='bottom' showIndex={true} showPlayButton={false} />
                <div>
                    <button className='primary-round-btn' onClick={() => handleCart('buy')}>{checkCart !== 0 ? `View Cart` : 'Buy Now'}</button>
                    <button className='border-round-btn' onClick={() => handleCart()}>{checkCart !== 0 ? `Remove From Cart (${checkCart})` : 'Add to Cart'}</button>
                </div>
            </div>
            <div>
                <h2>{product.name}</h2>
                <h4>{product.description}</h4>
                {selectedSize && <div className={style.priceTag}>
                    <h3>₹ {selectedSize.price}</h3>
                </div>}
                <div>
                    <div>
                        <label htmlFor="color">Select Color</label>
                        <select id="color" defaultValue={color} onChange={(e) => setColor(e.target.value)}>
                            <option disabled value="">Select a color</option>
                            {product.subDetails.map(detail => (
                                <option key={detail._id} value={detail._id}>{detail.colorName}</option>
                            ))}
                        </select>
                    </div>
                    {color && <div>
                        <label htmlFor="size">Select Size</label>
                        <select id="size" value={size} defaultValue={''} onChange={(e) => setSize(e.target.value)}>
                            <option disabled value="">Select a size</option>
                            {selectedColor.sizes.map(size => (
                                <option key={size._id} value={size._id}>{size.size}</option>
                            ))}
                        </select>
                    </div>}
                </div>
                {selectedSize && selectedSize.stock === 0 && <h4 style={{ color: 'red', fontWeight: '700' }}>This Item is out of Stock</h4>}
                {selectedSize && selectedSize.stock > 0 && selectedSize.stock <= 10 && <h4 style={{ color: 'red', fontWeight: '700' }}>Hurry Up, Only {selectedSize.stock} left !!!</h4>}
                {selectedSize && <div className={style.priceTag}>
                    {checkWishlist ? <button className='border-round-btn' onClick={removeFromWishlist}>Remove from wishlist</button> : <button className='border-round-btn' onClick={addToWishlist}>Add to wishlist</button>}
                </div>}
                <h3>Detailed View</h3>
                <ul>
                    {product.details.map((detail, index) => (<li key={index}>{detail}</li>))}
                </ul>
                <h3>Offers</h3>
                <ul>
                    <li>3 Days Replacement Guarantee</li>
                    {product.cashOnDelivery === "On" && <li>Cash On Delivery Availble</li>}
                </ul>
            </div>
        </div>
    )
}

export default ProductDetail
import React from 'react'
import style from './ProductCart.module.css'
import { MdAdd, MdRemove } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { setCart, setReturn, setWishlist } from 'slices/productSlice'

const SingleProduct = ({ product, type }) => {
    const { returnCart, cart, wishlist } = useSelector(state => state.products);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addMore = async () => {
        if (type === 'cart') {
            if (product.quantity < product.maxQuantity) {
                const updatedCart = cart.map(item =>
                    item.productId === product.productId && item.subDetailId === product.subDetailId && item.sizeId === product.sizeId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                dispatch(setCart(updatedCart));
            } else {
                toast.error('Out of Stock');
            }
        }
        if (type === 'return') {
            if (product.quantity < product.maxQuantity) {
                const updatedCart = returnCart.map(item =>
                    item._id === product._id
                        ? { ...item, currQty: item.currQty + 1 }
                        : item
                );

                dispatch(setReturn(updatedCart));
            } else {
                toast.error('Maximum selected');
            }
        }
    }

    const remove = async () => {
        if (type === 'cart') {
            console.log(product);
            if (product.quantity > 1) {
                const updatedCart = cart.map(item =>
                    item.productId === product.productId && item.subDetailId === product.subDetailId && item.sizeId === product.sizeId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
                dispatch(setCart(updatedCart));
            } else if (product.quantity === 1) {
                const updatedCart = cart.filter(
                    (item) => item.productId !== product.productId || item.subDetailId !== product.subDetailId || item.sizeId !== product.sizeId
                );
                dispatch(setCart(updatedCart));
            } else {
                toast.error('Product is not in cart');
            }
        }
        if (type === 'return') {
            if (product.currQty > 0) {
                const updatedCart = returnCart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );

                dispatch(setReturn(updatedCart));
            } else {
                toast.error('Minimum selected');
            }
        }
        if (type === 'wishlist') {
            const updatedWishlist = wishlist.filter(
                (item) => item.productId !== product.productId || item.subDetailId !== product.subDetailId || item.sizeId !== product.sizeId
            );
            dispatch(setWishlist(updatedWishlist));
        }
    }

    const handleClick = () => {
        if (type === 'order') {
            navigate(`/orders/${product.id}`)
        }
    }

    return (
        <div className={style.SingleProduct} style={{ cursor: type === 'order' ? 'pointer' : 'default' }} onClick={handleClick}>
            <img src={product.image} alt='product' />
            <div>
                <h2>{product.name}</h2>
                <h3>{product.description}</h3>
            </div>
            {type === 'cart' && <div>
                <h2>Price: ₹{product.price * product.quantity} </h2>
                <div className={style.buttons}>
                    <button className='border-round-btn' onClick={remove}><MdRemove /></button>
                    <div className='primary-round-btn'>{product.quantity}</div>
                    <button className='border-round-btn' onClick={addMore}><MdAdd /></button>
                </div>
            </div>}
            {type === 'wishlist' &&
                <div>
                    <button className='border-round-btn' onClick={remove}>Remove from Wishlist</button>
                </div>
            }
            {type === 'order' && <div>
                <h2>Price: ₹{product.price}</h2>
                <h2>Status: {product.status}</h2>
            </div>}
            {type === 'return' && <div>
                <h2>Refund: ₹{product.product.discountPrice * product.currQty} </h2>
                <div className={style.buttons}>
                    <button className='border-round-btn' onClick={remove}><MdRemove /></button>
                    <div className='primary-round-btn'>{product.currQty}</div>
                    <button className='border-round-btn' onClick={addMore}><MdAdd /></button>
                </div>
            </div>}
        </div>
    )
}

export default SingleProduct
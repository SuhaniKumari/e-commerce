import React, { useEffect, useState } from 'react';
import style from './OrderDetail.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { cancelMyOrder, cancelOrder, getMyOrder } from 'services/operations/orderAPI';
import ReactImageGallery from 'react-image-gallery';
import '../../../../node_modules/react-image-gallery/styles/css/image-gallery.css';
import { useDispatch } from 'react-redux';
import { MdArrowBackIos } from 'react-icons/md';
import { setReturn } from 'slices/productSlice';
import toast from 'react-hot-toast';
import background from 'assets/images/background.png'

const convertToGalleryImages = (images) => {
    return images.map((image) => ({
        original: image,
        thumbnail: image,
    }));
};

function getAllImages(order) {
    const images = [];
    if (order.cart && order.cart.length > 0) {
        order.cart.forEach((item) => {
            if (item && item.images && item.images.length > 0) {
                images.push(...item.images);
            }
        });
    }
    return images;
}

function getTime(date) {
    const currentDate = new Date();
    const deliveryDate = new Date(date);
    const timeDiff = deliveryDate.getTime() - currentDate.getTime();
    const diff = Math.floor(timeDiff / (1000 * 3600 * 24));
    return diff;
}

const OrderDetail = ({ product, setProduct }) => {

    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loader, setLoader] = useState(true);
    const [images, setImages] = useState([]);
    const [daysDiff, setDaysDiff] = useState(4);
    const [hold, setHold] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (product) {
            setOrder(product);
        }
        else if (id) {
            getMyOrder({ orderId: id }, setOrder);
        }
    }, [id, product]);

    useEffect(() => {
        if (order) {
            console.log(order);
            setLoader(false);
            setImages(getAllImages(order));
            setDaysDiff(getTime(order.updateDate));
        }
    }, [order]);

    const cancelHandler = async () => {
        if (hold) {
            toast.error('Wait')
            return;
        }
        setHold(true);
        if (product) {
            await cancelOrder({ orderId: order._id }, setOrder);
        } else {
            await cancelMyOrder({ orderId: order._id }, setOrder)
        }
        setHold(false);
    }
    const returnHandler = async () => {
        dispatch(setReturn(order));
        navigate(`/return/${order._id}`);
    }

    return (
        <div className={style.OrderDetail} style={{ backgroundImage: `url(${background})` }}>
            <h3><span style={{ cursor: 'pointer', fontSize: '1.25rem' }}><MdArrowBackIos onClick={() => product ? setProduct(null) : navigate('/orders')} /></span>Order Detail:</h3>
            <div>
                {loader ? (
                    <div
                        className="loader"
                        style={{ border: '5px solid var(--delft-blue)', borderBottomColor: 'transparent' }}
                    ></div>
                ) : (
                    <div>
                        <div className={style.detailPart}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem' }}>Order ID: {order.orderDetails.public_order_id}</h2>
                                <h2>Delivery Details:</h2>
                                <ul>
                                    <li>
                                        <h3>Name: </h3>
                                        <h4>{order.address.name}</h4>
                                    </li>
                                    <li>
                                        <h3>Address: </h3>
                                        <h4>
                                            {order.address.addressLine1},<br /> {order.address.addressLine2}
                                        </h4>
                                    </li>
                                    <li>
                                        <h3>City: </h3>
                                        <h4>{order.address.city}</h4>
                                    </li>
                                    <li>
                                        <h3>State: </h3>
                                        <h4>{order.address.state}</h4>
                                    </li>
                                    <li>
                                        <h3>Pin Code: </h3>
                                        <h4>{order.address.pinCode}</h4>
                                    </li>
                                    <li>
                                        <h3>Phone Number: </h3>
                                        <h4>{order.address.phoneNumber}</h4>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2>Items:</h2>
                                <ul>
                                    {order.cart.map((item) => (
                                        <li key={item._id} style={{ alignItems: 'flex-end' }}>
                                            <h3>{item.name}</h3>
                                            <p>Quantity: {item.quantity}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h2>Total: ₹{order.totalPrice}</h2>
                                <h2 style={{ fontSize: '1.2rem' }}>Payment Type: {(order.paymentType === 'Prepaid' || order.orderDetails.status === 'Delivered') ? 'Paid' : (order.orderDetails.status === 'Cancelled') ? 'Not Done' : 'Pending'} ({order.paymentType === 'COD' ? 'Cash' : 'Prepaid'})</h2>
                                {order.paymentType === 'Prepaid' && <h2 style={{ fontSize: '1.2rem' }}>Payment ID: {order.paymentId.payment_id}</h2>}
                            </div>
                            <div>
                                <h2>Status: {order.orderDetails.status} ({order.orderType})</h2>
                            </div>
                            <div>
                                {order?.shiprocketDetails?.invoice && order.shiprocketDetails.invoice.length > 0 && <button className='border-round-btn'><a rel='noreferrer' href={order.shiprocketDetails.invoice}>Invoice</a></button>}
                            </div>
                        </div>
                        <div className={style.imagePart}>
                            <ReactImageGallery
                                items={convertToGalleryImages(images)}
                                thumbnailPosition="bottom"
                                showIndex={true}
                                showPlayButton={false}
                                showNav={false}
                            />
                            <div>
                                {order.orderDetails.status === 'Pending' && order.orderType === 'Order' && <button className='primary-btn' onClick={cancelHandler}>Cancel</button>}
                                {order?.shiprocketDetails?.awb_code?.length > 0 && <button className='primary-btn'><a target='_blank' rel='noreferrer' href={`https://shiprocket.co/tracking/${order.shiprocketDetails.awb_code}`}>Track Package</a></button>}
                                {order.orderDetails.status === 'DELIVERED' && order.orderType === 'Order' && daysDiff < 3 && <button className='primary-btn' onClick={returnHandler} >Return</button>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetail;
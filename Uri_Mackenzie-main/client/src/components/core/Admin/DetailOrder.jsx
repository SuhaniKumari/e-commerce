import React, { useEffect, useState } from 'react'
import style from './Admin.module.css'
import ReactImageGallery from 'react-image-gallery';
import '../../../../node_modules/react-image-gallery/styles/css/image-gallery.css';
import { cancelOrder, getOrders } from 'services/operations/orderAPI';
import { MdArrowBackIos } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setReturn } from 'slices/productSlice';
import toast from 'react-hot-toast';


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
            if (item.product && item.product.images && item.product.images.length > 0) {
                images.push(...item.product.images);
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

const DetailOrder = ({ detail, setDetail }) => {
    const [images, setImages] = useState([]);
    const [order, setOrder] = useState(null);
    const [loader, setLoader] = useState(true);
    const [trigger, setTrigger] = useState(false);
    const [daysDiff, setDaysDiff] = useState(4);
    const [hold, setHold] = useState(false);

    useEffect(() => {
        if (trigger) {
            setTrigger(false)
            getOrders({ orderId: detail }, setOrder);
        }
        if (loader && detail) {
            getOrders({ orderId: detail }, setOrder);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detail, trigger]);

    useEffect(() => {
        if (order) {
            setLoader(false);
            setImages(getAllImages(order));
            setDaysDiff(getTime(order.updateDate));
        }
    }, [order]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleCancel = async () => {
        if (hold) {
            toast.error('Wait')
            return;
        }
        setHold(true);
        await cancelOrder({ orderId: detail._id }, setOrder)
        setHold(false);
    }
    const returnHandler = () => {
        dispatch(setReturn(order));
        navigate(`/return/${order._id}`);
    }

    return (
        <div className={style.DetailOrder}>
            <h3><span style={{ cursor: 'pointer', fontSize: '1.25rem' }}><MdArrowBackIos onClick={() => setDetail(null)} /></span>Order Detail:</h3>
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
                                <h2>User Details:</h2>
                                <ul>
                                    <li>
                                        <h3>Fullname: </h3>
                                        <h4>{order.user.fullname}</h4>
                                    </li>
                                    <li>
                                        <h3>Email: </h3>
                                        <h4 style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}> {order.user.email}  </h4>
                                    </li>
                                    <li>
                                        <h3>Order ID: </h3>
                                        <h4 style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{order.orderId}</h4>
                                    </li>
                                </ul>
                            </div>
                            <div>
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
                                            <h3>{item.product.name}</h3>
                                            <p>Quantity: {item.quantity}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {order.type !== 'Order' &&
                                <div>
                                    <h2>Reason:</h2>
                                    <ul>
                                        <li>{order.reason}</li>
                                    </ul>
                                </div>}
                            <div>
                                <h2>Total: ₹{order.totalPrice}</h2>
                                <h2 style={{ fontSize: '1.2rem' }}>Payment Type: {(order.paymentType === 'Prepaid' || order.status === 'Delivered') ? 'Paid' : (order.status === 'Cancelled') ? 'Not Done' : 'Pending'} ({order.paymentType === 'COD' ? 'Cash' : 'Prepaid'})</h2>
                                {order.paymentType === 'Prepaid' && <h2 style={{ fontSize: '1.2rem' }}>Payment ID: {order.paymentId.payment_id}</h2>}
                            </div>
                            <div>
                                <h2>Status: {order.status} ({order.type})</h2>
                            </div>
                            <div>
                                {order?.shiprocket?.invoice?.length > 0 && <button className='border-round-btn'><a target='_blank' rel='noreferrer' href={order.shiprocket.invoice}>Invoice</a></button>}
                                {order?.shiprocket?.label?.length > 0 && <button className='border-round-btn'><a target='_blank' rel='noreferrer' href={order.shiprocket.label}>Label</a></button>}
                                {order?.shiprocket?.manifest?.length > 0 && <button className='border-round-btn'><a target='_blank' rel='noreferrer' href={order.shiprocket.manifest}>Manifest</a></button>}
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
                            {
                                (order.status !== 'DELIVERED' && order.status !== 'RETURNED' && order.status !== 'CANCELED') &&
                                <div>
                                    {order.status === 'Pending' && order.type === 'Order' && <button className='primary-btn' onClick={handleCancel}>Cancel</button>}
                                    {order?.shiprocket?.awb_code?.length > 0 && <button className='primary-btn'><a target='_blank' rel='noreferrer' href={`https://shiprocket.co/tracking/${order.shiprocket.awb_code}`}>Track Package</a></button>}
                                    {order.status === 'DELIVERED' && order.type === 'Order' && daysDiff < 3 && <button className='primary-btn' onClick={returnHandler} >Return</button>}
                                </div>
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DetailOrder
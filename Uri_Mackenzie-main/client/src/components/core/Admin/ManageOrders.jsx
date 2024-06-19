import React, { useEffect, useState } from 'react'
import style from './Admin.module.css'
import { getOrders } from 'services/operations/orderAPI';
import OrderDetail from 'components/common/OrderDetail/OrderDetail';

const ManageOrders = ({ orderType }) => {
    const [orders, setOrders] = useState(null);
    const [loader, setLoader] = useState(true);
    const [order, setOrder] = useState(null);
    useEffect(() => {
        setLoader(true);
        getOrders({ type: orderType }, setOrders);
    }, [orderType])

    useEffect(() => {
        if (orders) {
            setLoader(false);
        }
    }, [orders])

    if (order) {
        return <OrderDetail product={order} setProduct={setOrder} />
    }

    return (
        <div className={style.ManageProduct}>
            <div>
                {orderType === 'Order' && <h1>Manage Orders</h1>}
                {orderType === 'Returns' && <h1>Manage Returns</h1>}

                {
                    loader ? <div className='loaderBg'><div className='loader'></div></div> :
                        <div className={style.allProduct}>
                            {orders.length === 0 ? <div className={style.loaderBg}>{orderType === 'Order' ? 'No Orders Found' : 'No Return Found'}</div> :
                                orders.map((o, index) => <SingeOrder key={index} viewOrder={setOrder} order={o} />)}
                        </div>
                }

            </div>
        </div>
    )
}

const SingeOrder = ({ order, viewOrder }) => {

    return (
        <div className={style.singleOrder}>
            <div>
                <h2>{order?.address?.name}</h2>
                <h3>Status: {order.orderDetails.status}</h3>
            </div>
            <div>
                <button className='border-btn' onClick={() => viewOrder(order)}>View Order</button>
            </div>
        </div>
    )
}

export default ManageOrders
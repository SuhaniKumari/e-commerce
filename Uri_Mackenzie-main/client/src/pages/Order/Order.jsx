import React, { useEffect, useState } from 'react'
import style from './Order.module.css'
import { getMyOrders } from 'services/operations/orderAPI';
import ProductCart from 'components/common/ProductCart/ProductCart';
import background from 'assets/images/background.png'

function restructure(cart) {
    return cart.map(order => {
        const productNames = order.cart.map(item => item.name);
        const productImages = order.cart[0].images[0];
        const description = `${productNames.join(', ')}`;

        let product = {};
        product.name = order.address.name;
        product.description = description;
        product.image = productImages;
        product.status = order.orderDetails.status;
        product.price = order.totalPrice;
        product.id = order._id;
        return product;
    });
}
const Order = () => {

    const [orders, setOrders] = useState(null);

    useEffect(() => {
        getMyOrders(setOrders);
    }, [])

    if (!orders) {
        return <div className='loaderBg'><div className='loader'></div></div>
    }

    return (
        <div className={style.Order} style={{ backgroundImage: `url(${background})` }}>
            <h3>My Order</h3>
            <div>
                {orders && <ProductCart products={restructure(orders)} type={'order'} />}
            </div>
        </div>
    )
}

export default Order
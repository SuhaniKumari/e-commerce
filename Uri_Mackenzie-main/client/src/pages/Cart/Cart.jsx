import React, { useEffect, useState } from 'react'
import style from './Cart.module.css'
import { useSelector } from 'react-redux';
import ProductCart from 'components/common/ProductCart/ProductCart';
import { useNavigate } from 'react-router-dom';
import background from 'assets/images/background.png'

const Cart = () => {

    const [totalCost, setTotalCost] = useState(0);

    const navigate = useNavigate();

    const { cart } = useSelector(state => state.products);

    useEffect(() => {
        let total = 0;
        if (cart) {
            cart.forEach((item) => {
                total += (item.price * item.quantity);
            })
            setTotalCost(total);
        }
    }, [cart]);

    if (!cart) {
        return <div className='loaderBg'><div className='loader'></div></div>
    }

    return (
        <div className={style.Cart} style={{ backgroundImage: `url(${background})` }}>
            <h3>My Cart</h3>
            <div>
                <ProductCart products={cart} type={'cart'} />
                {cart?.length !== 0 && <div className={style.detail}>
                    <div>
                        <h3>Total Cost:</h3>
                        <h4>₹{totalCost}</h4>
                    </div>
                    <div>
                        <h3>Delivery Charges:</h3>
                        <h4>₹40</h4>
                    </div>
                    <div>
                        <h3>Delivery discount:</h3>
                        <h4 style={{ color: 'red' }}>- ₹40</h4>
                    </div>
                    <div>
                        <h3>Final Cost:</h3>
                        <h4>{totalCost}</h4>
                    </div>
                    <button className='border-btn' onClick={() => navigate('/booking')}>Pay ₹{totalCost}</button>
                </div>}
            </div>
        </div>
    )
}

export default Cart
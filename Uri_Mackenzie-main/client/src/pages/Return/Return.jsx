import React, { useEffect, useState } from 'react';
import style from './Return.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCart from 'components/common/ProductCart/ProductCart';
import { useDispatch, useSelector } from 'react-redux';
import { setReturn } from 'slices/productSlice';
import { returnOrder } from 'services/operations/orderAPI';

const Return = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { returnProducts } = useSelector(state => state.user);

    if (!id) {
        navigate('/');
    }

    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [totalAllCost, setAllTotalCost] = useState(0);
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (returnProducts) {
            const updatedReturnProducts = {
                ...returnProducts,
                cart: returnProducts.cart.map(item => ({
                    ...item,
                    currQty: item.quantity,
                })),
            };

            setOrder(updatedReturnProducts);
        } else {
            navigate(`/orders/${id}`);
        }

        return () => {
            dispatch(setReturn(null));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (order) {
            dispatch(setReturn(order));
            setProducts(order.cart);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);

    useEffect(() => {
        if (returnProducts) {
            setProducts(returnProducts.cart);
        }
    }, [returnProducts])

    useEffect(() => {
        if (products) {
            let total = 0;
            let totalAll = 0;
            products.forEach((item) => {
                total += (item.product.discountPrice * item.currQty);
                totalAll += (item.product.discountPrice * item.quantity);
            })

            setTotalCost(total);
            setAllTotalCost(totalAll)
        }
    }, [products])

    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const handleSubmit = (withCart) => {
            if (withCart) {
                returnOrder({ reason: reason, orderId: order._id, cart: returnProducts.cart }, navigate);
            } else {
                returnOrder({ reason: reason, orderId: order._id }, navigate);
            }
    }

    return (
        <div className={style.Return}>
            <h3>Return</h3>
            <div>
                <ProductCart products={products} type={'return'} />
                {products && products.length !== 0 && <div className={style.detail}>
                    <div>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={handleReasonChange}
                            placeholder="Enter your reason for return"
                        />
                    </div>
                    <button className='border-round-btn' onClick={() => handleSubmit(true)}>Return: ₹{totalCost}</button>
                    <button className='border-round-btn' onClick={() => handleSubmit(false)}>Return All: ₹{totalAllCost}</button>
                </div>}
            </div>
        </div>
    );
};

export default Return;
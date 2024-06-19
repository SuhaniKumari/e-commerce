import React, { useEffect, useRef, useState } from 'react'
import style from './Booking.module.css'
import { getAddress } from 'services/operations/userAPI';
import AddressForm from 'components/common/Address/AddressForm';
import AddressTile from 'components/common/Address/AddressTile';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { cashOnDelivery, payOnline } from 'services/operations/orderAPI';
import { useDispatch, useSelector } from 'react-redux';
import background from 'assets/images/background.png'

const Booking = () => {
    const [address, setAddress] = useState([]);
    const [edit, setEdit] = useState(null);
    const [adding, setAdding] = useState(false);
    const [select, setSelect] = useState(null);
    const [back, setBack] = useState(false);
    const [hold, setHold] = useState(false);

    const tileRef = useRef(null);

    const { user } = useSelector(state => state.user);
    const { cart } = useSelector(state => state.products);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getAddress(setAddress);
    }, []);

    useEffect(() => {
        setEdit(null);
        setAdding(false);
        if (back) {
            setBack(false);
        }
    }, [address, back])

    useEffect(() => {
        if (edit && tileRef.current) {
            tileRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [edit]);

    const handleCOD = async () => {
        if (select === null) {
            toast.error('Select Any Address');
            return;
        }

        if (!user.isVerified) {
            toast.error('Please verify your account from manage account');
            navigate('/myaccount/#manageAccount')
            return;
        }
        if (hold) {
            toast.error('Booking is in progress');
            return;
        }
        setHold(true);
        await cashOnDelivery({ addressId: select, cart: JSON.stringify(cart) }, navigate, dispatch, user);
        setHold(false);
    }

    const handleOnline = async () => {
        if (select === null) {
            toast.error('Select Any Address');
            return;
        }
        if (!user.isVerified) {
            toast.error('Please verify your account from manage account');
            navigate('/myaccount/#manageAccount')
            return;
        }
        if (hold) {
            toast.error('Booking is in progress');
            return;
        }

        // toast.error('Pay online is in development, Book on Cash on delivery');

        // return;
        payOnline({ addressId: select, cart: JSON.stringify(cart) }, navigate, dispatch, user);
    }

    return (
        <div ref={tileRef} className={style.Booking} style={{background: `url(${background})`}}>
            <button className='border-round-btn' onClick={() => setAdding(true)}>Add New Address</button>
            {(edit || adding) && <AddressForm setter={setAddress} data={edit} setBack={setBack} />}
            {
                address.length !== 0 && <div>
                    {address.map((addr, index) => (
                        (edit ? addr._id !== edit._id : true) && < AddressTile key={index} select={select} setSelect={setSelect} address={addr} setEdit={setEdit} setAddress={setAddress} />
                    ))}
                </div>
            }

            <button className='border-round-btn' onClick={handleCOD}>Cash on Delivery</button>
            <button className='primary-round-btn' onClick={handleOnline}>Pay Now</button>
        </div>
    )
}

export default Booking
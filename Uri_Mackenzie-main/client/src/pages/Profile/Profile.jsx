import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import style from './Profile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import AddressForm from 'components/common/Address/AddressForm';
import AddressTile from 'components/common/Address/AddressTile';
import { useNavigate } from 'react-router-dom';
import { updateUser } from 'services/operations/userAPI';
import { setIsLogin, setToken, setUser } from 'slices/userSlice';
import { getResetPasswordLink, getVerifyLink } from 'services/operations/authAPI';
import { MdArrowBackIos } from 'react-icons/md';

const Profile = () => {
    const [userData, setUserData] = useState({
        fullname: '',
        email: '',
        phone: '',
        image: '',
    });
    const [edit, setEdit] = useState(null);
    const [adding, setAdding] = useState(false);
    const [address, setAddress] = useState([]);
    const [back, setBack] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const imageRef = useRef();

    const { user } = useSelector(state => state.user);

    useEffect(() => {
        if (user) {
            setUserData(user);
            setValue('fullname', user.fullname);
            setValue('email', user.email);
            setValue('phone', user.phone);
            setAddress(user.address);
            setIsEditing(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const onSubmit = (data) => {
        updateUser(data, dispatch)
    };

    useEffect(() => {
        setEdit(null);
        setAdding(false);
        if (back) {
            setBack(false);
        }
    }, [address, back])

    useEffect(() => {
        if (edit || adding) {
            document.querySelector('#manageAddress').scrollIntoView({ behavior: 'smooth' })
        }
    }, [edit, adding])

    const handleImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            event.target.value = null;
            updateUser({ image: file }, dispatch);
        }
    };

    const handleLogout = () => {
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(setIsLogin(false));
        localStorage.removeItem("loggedIn");
    }

    return (
        <div className={style.Profile}>
            <div className={style.sidebar}>
                {/* Sidebar content */}
                <button className='border-round-btn' onClick={() => { document.querySelector('#profile').scrollIntoView({ behavior: 'smooth' }) }}>Profile</button>
                <button className='border-round-btn' onClick={() => { document.querySelector('#manageAddress').scrollIntoView({ behavior: 'smooth' }) }}>Manage Address</button>
                <button className='border-round-btn' onClick={() => { document.querySelector('#manageAccount').scrollIntoView({ behavior: 'smooth' }) }}>Manage Account</button>
                <button className='border-round-btn' onClick={() => navigate('/cart')}>My Cart</button>
                <button className='border-round-btn' onClick={() => navigate('/wishlist')}>My Wishlist</button>
                <button className='border-round-btn' onClick={() => navigate('/orders')}>My Orders</button>
            </div>
            <div className={style.main}>
                <div id='profile'>
                    <h2><MdArrowBackIos onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '1rem' }} />  Profile</h2>
                    <input ref={imageRef} onChange={handleImage} type='file' accept='image/*' style={{ display: 'none' }} />
                    <img src={userData?.image ? userData.image : `https://ui-avatars.com/api/?name=${userData.fullname}`} onClick={() => imageRef.current.click()} alt="Profile" />
                    {userData?.image && <button className='border-round-btn' onClick={() => updateUser({ removeDP: 'yes' }, dispatch)}>Remove Picture</button>}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="fullname">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                {...register('fullname', { required: 'Full name is required' })}
                                disabled={!isEditing}
                            />
                            {errors.fullname && <span className={style.error}>{errors.fullname.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                disabled
                            />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                {...register('phone', {
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: 'Invalid phone number',
                                    },
                                })}
                                disabled={!isEditing}
                            />
                            {errors.phone && <span className={style.error}>{errors.phone.message}</span>}
                        </div>
                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className='border-round-btn' type="submit">Save</button>
                                <button className='border-round-btn' type="button" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button className='border-round-btn' type="button" onClick={() => setIsEditing(true)}>
                                Edit
                            </button>
                        )}
                    </form>
                </div>
                <div id='manageAddress'>
                    <h2>Manage Address</h2>
                    {(edit || adding) && <AddressForm setter={setAddress} data={edit} setBack={setBack} />}
                    {
                        address.length !== 0 && <div className={style.address}>
                            {address.map((addr) => (
                                (edit ? addr._id !== edit._id : true) && < AddressTile address={addr} setEdit={setEdit} setAddress={setAddress} />
                            ))}
                        </div>
                    }
                    <button className='border-round-btn' onClick={() => setAdding(true)}>Add New Address</button>
                </div>
                <div id='manageAccount'>
                    <h2>Manage Account</h2>
                    {!userData.isVerified && <button className='border-round-btn' onClick={getVerifyLink}>Verify My Account</button>}
                    <button className='border-round-btn' onClick={() => getResetPasswordLink({ email: userData.email })}>Reset My Password</button>
                    <button className='border-round-btn' onClick={handleLogout}>Log out</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
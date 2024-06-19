import React, { useEffect, useState } from 'react'
import style from './Verification.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { verifyAccount } from 'services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from 'services/operations/userAPI';

const Verification = () => {

    const [loader, setLoader] = useState(false)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { token } = useParams();

    const { user, isLogin } = useSelector(state => state.user)

    const verify = async () => {
        if (isLogin) {
            if (user) {
                if (user.isVerified === true) {
                    setLoader(false);
                } else {
                    await verifyAccount({ token: token }, setLoader, navigate);
                    await getUser(dispatch);
                }

            } else {
                getUser(dispatch);
            }
        } else {
            navigate('/login');
            sessionStorage.setItem('verifyToken', token);
        }
    }

    useEffect(() => {
        verify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])


    return (
        loader ? <div className={style.Verification}>
            <h1>Verifying your account</h1>
            <div className='loader' />
        </div> : <div className={style.Verification}>
            <h1>Your account is activated</h1>
            <button className='border-round-btn' onClick={() => navigate('/login')}>Go to Dashboard</button>
        </div>
    )
}

export default Verification

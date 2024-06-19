import React from 'react'
import style from 'components/common/Login/Login.module.css'
import Marquee from "react-fast-marquee";
import image from 'assets/images/Kurta1.jpg';
import background from 'assets/images/background.png'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { getResetPasswordLink } from 'services/operations/authAPI';

const ResetPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        // Handle form submission logic here
        getResetPasswordLink({ email: data.email });
    };
    return (
        <div className={style.Login} style={{ backgroundImage: `url(${background})` }}>
            <div>
                <div>
                    <Marquee>
                        <img src={image} alt='tmepIMage' />
                        <img src={image} alt='tmepIMage' />
                        <img src={image} alt='tmepIMage' />
                        <img src={image} alt='tmepIMage' />
                        <img src={image} alt='tmepIMage' />
                        <img src={image} alt='tmepIMage' />
                    </Marquee>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Reset Password:</h2>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                        {errors.email && <span>{errors.email.message}</span>}
                    </div>
                    <button type="submit" className='border-round-btn'>Reset Password</button>
                    <div>
                        <Link className='border-round-btn' to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
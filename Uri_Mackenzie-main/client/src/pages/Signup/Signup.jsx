import React from 'react';
import style from 'components/common/Login/Login.module.css'
import Marquee from "react-fast-marquee";
import image from 'assets/images/Kurta1.jpg';
import background from 'assets/images/background.png'
import { useForm } from 'react-hook-form';
import { signupUser } from 'services/operations/userAPI';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const password = watch('password');
    const navigate = useNavigate();

    const onSubmit = (data) => {
        // Handle form submission logic here
        signupUser(data, navigate);
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
                    <h2>Sign Up</h2>
                    <div>
                        <div>
                            <label htmlFor="fullname">Full Name</label>
                            <input
                                type="text"
                                id="fullname"
                                {...register('fullname', { required: 'Full Name is required' })}
                            />
                            {errors.fullname && <span>{errors.fullname.message}</span>}
                        </div>
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
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                            />
                            {errors.password && <span>{errors.password.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                {...register('confirmPassword', {
                                    required: 'Confirm Password is required',
                                    validate: (value) =>
                                        value === password || 'Passwords do not match',
                                })}
                            />
                            {errors.confirmPassword && (
                                <span>{errors.confirmPassword.message}</span>
                            )}
                        </div>
                    </div>
                    <button type="submit" className='border-round-btn'>Sign Up</button>
                    <div>
                        <Link className='border-round-btn' to='/login'>Login</Link>
                        <Link className='border-round-btn' to='/reset-password'>Forget Password ?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
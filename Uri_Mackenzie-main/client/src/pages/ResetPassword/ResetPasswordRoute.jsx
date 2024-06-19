import React from 'react'
import style from 'components/common/Login/Login.module.css'
import Marquee from "react-fast-marquee";
import image from 'assets/images/Kurta1.jpg';
import background from 'assets/images/background.png'
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from 'services/operations/authAPI';
import { useDispatch } from 'react-redux';

const ResetPasswordRoute = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const { id } = useParams();

    const password = watch('password');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = (data) => {
        resetPassword({ token: id, password: data.password }, dispatch, navigate);
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
                    <button style={{ marginTop: '2rem' }} type="submit" className='border-round-btn'>Reset Password</button>
                    <div>
                        <Link className='border-round-btn' to='/login'>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordRoute
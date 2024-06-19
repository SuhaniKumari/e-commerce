import React from 'react';
import style from 'components/common/Login/Login.module.css'
import Marquee from "react-fast-marquee";
import image from 'assets/images/Kurta1.jpg';
import background from 'assets/images/background.png'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { signinUser } from 'services/operations/userAPI';
import { Link } from 'react-router-dom';

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();

	const onSubmit = (data) => {
		signinUser(data, dispatch);
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
					<h2>Login:</h2>
					<div>
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
					</div>
					<button style={{ marginTop: '2rem', marginBottom: '2rem' }} type="submit" className='border-round-btn'>Login</button>
					<div>
						<Link className='border-round-btn' to={'/signup'}>Create Account</Link>
						<Link className='border-round-btn' to={'/reset-password'}>Forget Password</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
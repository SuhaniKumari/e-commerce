import React from 'react'
import style from './Utils.module.css';
import lost from 'assets/images/lost.svg'
import { useNavigate } from 'react-router-dom';

const Error = () => {
    const navigate = useNavigate();

    return (
        <div className={style.Utils}>
            <img src={lost} width={'min(100%, 300px)'} alt='Have you lost ?' />
            <h1>Page not found</h1>
            <button onClick={() => navigate('/')}>Go to home</button>
        </div>
    )
}

export default Error
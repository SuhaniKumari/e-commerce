import React from 'react'
import style from './Footer.module.css'
import { useNavigate } from 'react-router-dom'
import { MdOutlineCall, MdOutlineLocationOn, MdOutlineMailOutline } from 'react-icons/md'
import { FaFacebookF, FaInstagram, FaPinterest, FaTwitter, FaYoutube } from "react-icons/fa";
import logo from 'assets/images/logo.png'

const Footer = () => {
    const navigate = useNavigate();
    return (
        <div className={style.Footer}>
            <div>
                <div className={style.top}>
                    <div>
                        <div>
                            <MdOutlineLocationOn />
                            <a href='/'>Visit Us</a>
                        </div>
                        <div>
                            <MdOutlineMailOutline />
                            <a href='mailto:m.afnan2918@gmail.com'>@Uri&Mackenzie</a>
                        </div>
                        <div>
                            <MdOutlineCall />
                            <a style={{widht: '100%'}} href='tel:9554522980'>+91 8977528118
                                Mon - Sat - 11:00 am to 6:00 pm (IST)</a>
                        </div>
                    </div>
                    <div>
                        <h2>About Us</h2>
                        <div>
                            <a href='/'>Our Story</a>
                            <a href='/'>Contact Us</a>
                            <div>
                                <a href='https://facebook.com/Uri&Mackenzie'><FaFacebookF /></a>
                                <a href='https://facebook.com/Uri&Mackenzie'><FaTwitter /></a>
                                <a href='https://facebook.com/Uri&Mackenzie'><FaInstagram /></a>
                                <a href='https://facebook.com/Uri&Mackenzie'><FaPinterest /></a>
                                <a href='https://facebook.com/Uri&Mackenzie'><FaYoutube /></a>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Quick Links</h2>
                        <div>
                            <p onClick={() => navigate('/refund')}>Shipping & Return</p>
                            <p onClick={() => navigate('/privacy')}>Privacy Policy</p>
                            <p onClick={() => navigate('/privacy')}>Term and Conditions</p>
                        </div>
                    </div>
                    <div>
                        <img src={logo} alt='logo' />
                    </div>
                </div>
            </div>
            <div className={style.down}>
                <p>© 2024, URI & Mackenzie. All rights reserved.</p>
                <p>Best in work from last 10+ years.</p>
            </div>
        </div>
    )
}

export default Footer
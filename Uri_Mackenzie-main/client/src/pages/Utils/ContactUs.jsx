import React from 'react'
import style from './Utils.module.css'

const ContactUs = () => {
    return (
        <div className={style.Utils}>
            <div>
                <h1>Contact Us</h1>
                <ul>
                    <li>Email: <a href="mailto:m.afnan2018@gmail.com" target='_blank' rel='noreferrer'>m.afnan2018@gmail.com</a></li>
                    <li>Phone: <a href="tel://+919554522980" target='_blank' rel='noreferrer'> +919554522980</a> (Hours: Monday-Friday, 9:00 AM to 5:00 PM PST)</li>
                    <li>Instagram: <a href="https://www.instagram.com/m.afnan2018" target='_blank' rel='noreferrer'>https://www.instagram.com/m.afnan2018</a></li>
                    <li>Instagram: <a href="https://www.facebook.com/m.afnan2018" target='_blank' rel='noreferrer'>https://www.facebook.com/m.afnan2018</a></li>
                    <li>Instagram: <a href="https://www.twitter.com/m.afnan2018" target='_blank' rel='noreferrer'>https://www.twitter.com/m.afnan2018</a></li>
                </ul>
            </div>

        </div>
    )
}

export default ContactUs
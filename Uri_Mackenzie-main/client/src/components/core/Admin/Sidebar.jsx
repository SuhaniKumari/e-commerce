import React from 'react'
import style from './Admin.module.css'
import { Link, useLocation } from 'react-router-dom'
import dashboardLink from 'assets/data/dashboardLinks'

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className={style.Sidebar}>
            {
                dashboardLink.map((data, index) => (
                    <Link style={{ backgroundColor: location.pathname === data.link && 'var(--sunset)' }} to={data.link}>{data.title}</Link>
                ))
            }
        </div>
    )
}

export default Sidebar
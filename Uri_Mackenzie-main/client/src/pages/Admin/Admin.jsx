import React from 'react'
import style from './Admin.module.css'
import background from 'assets/images/background.png'
import { Outlet } from 'react-router-dom'
import Sidebar from 'components/core/Admin/Sidebar';

const Admin = () => {
    return (
        <div className={style.Admin} style={{ backgroundImage: `url(${background}` }}>
            <Sidebar />
            <div className={style.Outlet}>
                <Outlet />
            </div>
        </div>
    )
}

export default Admin
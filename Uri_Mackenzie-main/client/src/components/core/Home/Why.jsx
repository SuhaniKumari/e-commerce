import React from 'react'
import style from './Home.module.css'
import { TbTruckDelivery } from "react-icons/tb";
import { IoCardOutline } from 'react-icons/io5'
import { MdOutlineWorkspacePremium } from 'react-icons/md';
import { RiScissorsCutFill } from "react-icons/ri";

const Why = () => {
    return (
        <div className={style.Why}>
            <div>
                <TbTruckDelivery />
                <p>Free Shipping</p>
            </div>
            <div>
                <IoCardOutline />
                <p>Cash on Delivery</p>
            </div>
            <div>
                <MdOutlineWorkspacePremium />
                <p>Premium Quality</p>
            </div>
            <div>
                <RiScissorsCutFill />
                <p>Free Alterations</p>
            </div>

        </div>
    )
}

export default Why
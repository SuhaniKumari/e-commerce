import React from 'react'
import style from './Booking.module.css'
import { removeAddress } from 'services/operations/userAPI'

const AddressTile = ({ address, setEdit, setAddress, select, setSelect }) => {


    return (
        <div className={style.AddressTile} style={{ backgroundColor: (select && select === address._id) && 'var(--delft-blue)', color: (select && select === address._id) && 'var(--sunset)' }}>
            <div>
                <div>
                    <h3>Name: </h3>
                    <h4>{address.name}</h4>
                </div>
                <div>
                    <h3>Address Line 1: </h3>
                    <h4>{address.addressLine1}</h4>
                </div>
                <div>
                    <h3>Address Line 2: </h3>
                    <h4>{address.addressLine2}</h4>
                </div>
                <div>
                    <h3>City: </h3>
                    <h4>{address.city}</h4>
                </div>
                <div>
                    <h3>State: </h3>
                    <h4>{address.state}</h4>
                </div>
                <div>
                    <h3>Pin code: </h3>
                    <h4>{address.pinCode}</h4>
                </div>
                <div>
                    <h3>Phone Number: </h3>
                    <h4>{address.phoneNumber}</h4>
                </div>
            </div>
            <div>
                <button className='border-round-btn' onClick={() => setEdit(address)}>Edit</button>
                {setSelect && (select ? select !== address._id : true) && <button className='border-round-btn' onClick={() => setSelect(address._id)}>Select</button>}
                <button className='border-round-btn' onClick={() => removeAddress({ id: address._id }, setAddress)}>Delete</button>
            </div>
        </div>
    )
}

export default AddressTile
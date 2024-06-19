import React, { useState, useEffect } from 'react';
import style from './Booking.module.css';
import { addAddress, updateAddress } from 'services/operations/userAPI';
import statesAndCities from 'assets/data/stateCities';

const AddressForm = ({ setter, data, setBack }) => {
    const [formData, setFormData] = useState({
        id: data ? data._id : '',
        name: data ? data.name : '',
        addressLine1: data ? data.addressLine1 : '',
        addressLine2: data ? data.addressLine2 : '',
        city: data ? data.city : '',
        state: data ? data.state : '',
        pinCode: data ? data.pinCode : '',
        phoneNumber: data ? data.phoneNumber : '',
    });

    const [errors, setErrors] = useState({});
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        setStates(Object.keys(statesAndCities).sort());
    }, []);

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setFormData({ ...formData, state: selectedState, city: '' });
        setCities((statesAndCities[selectedState] || []).sort());
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            if (data) {
                updateAddress(formData, setter);
            } else {
                addAddress(formData, setter);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name) {
            errors.name = 'Name is required';
        }
        if (!formData.addressLine1) {
            errors.addressLine1 = 'Address Line 1 is required';
        }
        if (!formData.city) {
            errors.city = 'City is required';
        }
        if (!formData.state) {
            errors.state = 'State is required';
        }
        if (!formData.pinCode) {
            errors.pinCode = 'Zip Code is required';
        }
        if (!formData.phoneNumber) {
            errors.phoneNumber = 'Phone Number is required';
        }

        return errors;
    };

    return (
        <div className={style.AddressForm}>
            <h2>Add Address</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <span>{errors.name}</span>}
                </div>

                <div>
                    <label htmlFor="addressLine1">Address Line 1</label>
                    <input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                    />
                    {errors.addressLine1 && <span>{errors.addressLine1}</span>}
                </div>

                <div>
                    <label htmlFor="addressLine2">Address Line 2</label>
                    <input
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="state">State</label>
                    <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleStateChange}
                    >
                        <option value="">Select State</option>
                        {states.map((state, index) => (
                            <option key={index} value={state}>{state}</option>
                        ))}
                    </select>
                    {errors.state && <span>{errors.state}</span>}
                </div>

                <div>
                    <label htmlFor="city">City</label>
                    <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!formData.state}
                    >
                        <option value="">Select City</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    {errors.city && <span>{errors.city}</span>}
                </div>

                <div>
                    <label htmlFor="pinCode">Pin Code</label>
                    <input
                        type="text"
                        id="pinCode"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                    />
                    {errors.pinCode && <span>{errors.pinCode}</span>}
                </div>

                <div>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                    {errors.phoneNumber && <span>{errors.phoneNumber}</span>}
                </div>

                <button type="submit" className='border-round-btn'>{data ? 'Update this Address' : 'Add this Address'}</button>
                <button type="button" className='border-round-btn' onClick={() => setBack(true)}>Cancel</button>
            </form>
        </div>
    );
};

export default AddressForm;

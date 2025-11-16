import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {countries} from 'countries-list'
import { saveShippingInfo } from '../../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './CheckOutStep';
import { toast } from 'react-toastify';

export const validateShipping = (shippingInfo, navigate) => { 
  if(!shippingInfo.address||!shippingInfo.city||!shippingInfo.country||!shippingInfo.phoneNo||!shippingInfo.postalcode) {
    toast.error('Please fill the shipping information',{position:'top-right'})
    navigate('/shipping')
  }
} 

const ShippingInfo = () => {
  const {shippingInfo={}} = useSelector(state=>state.cartState)
  const [address,setAddress]=useState(shippingInfo.address);
  const [city,setCity]=useState(shippingInfo.city);
  const [phoneNo,setPhoneNo]=useState(shippingInfo.phoneNo);
  const [postalcode,setPostalcode]=useState(shippingInfo.postalcode);
  const [country,setCountry]=useState(shippingInfo.country);
  const countryList = Object.values(countries);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingInfo({address,city,phoneNo,postalcode,country}))
    navigate('/order/confirm')
  };

  

  return (
    <Fragment>
      <CheckoutSteps shipping={true}/>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Shipping Info
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Address */}
            <div>
              <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e)=>setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={city}
                onChange={(e)=>setCity(e.target.value)}
                
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
                Phone No
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phoneNo}
                onChange={(e)=>setPhoneNo(e.target.value)}
                
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block mb-1 text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="number"
                id="postalCode"
                name="postalCode"
                value={postalcode}
                onChange={(e)=>setPostalcode(e.target.value)}
                
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block mb-1 text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={country}
                onChange={(e)=>setCountry(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {countryList.map((country,i)=>(
                  <option key={i} value={country.name}>{country.name}</option>
                ))}
                
                
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-medium py-3 rounded-md hover:bg-orange-600 transition"
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ShippingInfo;

import React, { useContext,  useEffect,  useState } from 'react'
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
const PlaceOrder = () => {
  const {getTotalCartAmount,token,food_list,cartItems,url}=useContext(StoreContext);
  const [data,setData]=useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:""
  })
  const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const placeOrder=async(event)=>{
    event.preventDefault();
    let orderItems=[];
    food_list.map((item)=>{
      if(cartItems[item._id]>0){
        let itemInfo=item;
        itemInfo["quantity"]=cartItems[item._id];
        orderItems.push(itemInfo)
      }
    })
    let orderData={
      address:data,
      items:orderItems,
      amount:getTotalCartAmount()+2
    }
    
    try {
      // First create order on the server
      const response = await axios.post(url+"/api/order/place", orderData, {headers:{token}})
      
      if(response.data.success) {
        // Initialize Razorpay payment
        const options = {
          key: response.data.key_id,
          amount: response.data.amount,
          currency: "INR",
          name: "Food Delivery",
          description: "Food Order Payment",
          order_id: response.data.order_id,
          handler: function(razorpayResponse) {
            // After successful payment, redirect to verification page
            navigate('/verify', {
              state: {
                paymentData: {
                  orderId: response.data.order_info._id,
                  razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                  razorpay_order_id: razorpayResponse.razorpay_order_id,
                  razorpay_signature: razorpayResponse.razorpay_signature
                }
              }
            });
          },
          prefill: {
            name: data.firstName + " " + data.lastName,
            email: data.email,
            contact: "9876543210" // डमी फोन नंबर
          },
          theme: {
            color: "#ff4242"
          }
        };
        
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        alert("Error creating order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Error placing order");
    }
  }

  const navigate= useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0){
      navigate('/cart')
    }
  },[token])
  return (
   <form  onSubmit={placeOrder} className='place-order'>
  <div className="place-order-left">
    <p className="title">Delivery Information</p>
    <div className="multi-fields">
      <input  required  name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name'/>
      <input  required  name='lastName'onChange={onChangeHandler}  value={data.lastName} type="text" placeholder='Last Name'/>
    </div>
    <input  required  name='email'onChange={onChangeHandler}  value={data.email} type="email" placeholder='Email address' />
    <input  required  name='street'onChange={onChangeHandler}  value={data.street} type="text"  placeholder='Street'/>

    <div className="multi-fields">
      <input   required name='city'onChange={onChangeHandler}  value={data.city} type="text" placeholder='City'/>
      <input  required  name='state'onChange={onChangeHandler}  value={data.state} type="text" placeholder='State'/>
    </div>
    <div className="multi-fields">
      <input  required  name='zipcode'onChange={onChangeHandler}  value={data.zipcode} type="text" placeholder='Zip code'/>
      <input  required  name='country'onChange={onChangeHandler}  value={data.country} type="text" placeholder='Country'/>
    </div>

  </div>

  <div className="place-order-right">
    <div className="cart-total">
      <h2>Cart Totals</h2>
      <div>
        <div className="cart-total-details">
          <p>Subtotal</p>
          <p>₹{getTotalCartAmount()}</p>
        </div>
        <hr/>
        <div className="cart-total-details">
          <p>Delivery Fee</p>
          <p>₹2</p>
        </div>
        <hr/>
        <div className="cart-total-details">
          <b>Total</b>
          <b>₹{getTotalCartAmount()+2}</b>
        </div>
      </div>
      <button type='submit'>PROCEED TO PAYMENT</button>
    </div>
  </div>
</form>

  )
}

export default PlaceOrder

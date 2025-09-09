// import React from 'react'
// import './Orders.css'
// import { useState } from 'react'
// import { toast } from 'react-toastify'
// import { useEffect } from 'react'
// import axios from 'axios'
// import { assets } from '../../assets/assets'
// const Orders = ({url}) => {
//   const[orders,setOrders]=useState([]);
//   const fetchAllOrders=async()=>{
//     const response=await axios.get(url+"/api/order/list");
//     if(response.data.success){
//       setOrders(response.data.data);
//       console.log(response.data.data);

//     }else{
//       toast.error("Error")
//     }
//   }

//   const statusHandler=async(event,orderId)=>{
//     const response= await axios.post(url+"/api/order/status",{
//       orderId,
//       status:event.target.value
//     })
//     if(response.data.success){
//       await fetchAllOrders();
//     }
//   }
//   useEffect(()=>{
//     fetchAllOrders();
//   },[])
//   return (
//     <div className='order add'>
//       <h3>Order Page</h3>
//       <div className="order-list">
//         {orders.map((order, index)=>(
//           <div key={index} className="order-item">
//             <img src={assets.parcel_icon} alt="" />
//             <div>
//               <p className='order-item-food'>
//               {order.item.map((item,index)=>{
//                 if(index===order.item.length-1){
//                   return item.name+" x "+item.quantity
//                 }else{
//                   return item.name+" x "+item.quantity+", "
//                 }

//               })}
//               </p>
//               <p className='order-item-name'>{order.address.firstName+" "+order.address.lastName}</p>
//               <div className="order-item-address">
//                 <p>{order.address.street+","}</p>
//                 <p>{order.address.city+","+order.address.state+", "+order.address.country+", "+order.address.zipcode}</p>

//               </div>

//             </div>
//             <p>Items:{order.item.length}</p>
//             <p>₹{order.amount}</p>
//             <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
//               <option value="Food Processing">Food Processing</option>
//               <option value="Out for delivery">Out for delivery</option>
//               <option value="Delivered">Delivered</option>
//             </select>
//           </div>
//         ))}
//       </div>
      
//     </div>
//   )
// }

// export default Orders



import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
        console.log("Orders from API:", response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      toast.error("Server Error");
    }
  };

  // Handle order status update
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      });
      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders();
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Server Error");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="parcel" />

              {/* Items */}
              <div>
                <p className='order-item-food'>
                  {order.items && order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} x {item.quantity}
                      {idx === order.items.length - 1 ? "" : ", "}
                    </span>
                  ))}
                </p>

                {/* Customer Name */}
                <p className='order-item-name'>
                  {order.address?.firstName} {order.address?.lastName}
                </p>

                {/* Address */}
                <div className="order-item-address">
                  <p>{order.address?.street},</p>
                  <p>
                    {order.address?.city}, {order.address?.state},{" "}
                    {order.address?.country} - {order.address?.zipcode}
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <p>Items: {order.items ? order.items.length : 0}</p>
              <p>₹{order.amount}</p>

              {/* Status Dropdown */}
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        ) : (
          <p>No Orders Found</p>
        )}
      </div>
    </div>
  );
};

export default Orders;


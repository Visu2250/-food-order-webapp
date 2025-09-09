// import React, { useContext, useEffect, useState } from 'react'
// import './Myorders.css';
// import { StoreContext } from '../../Context/StoreContext';
// import axios from 'axios';
// import { assets } from '../../assets/assets.js';

// const Myorders = () => {
//     const {url,token}=useContext(StoreContext);
//     const[data,setData]=useState([]);

//     const fetchOrders=async ()=>{
//         const response=await axios.post(url+"/api/order/userorders",{},{headers:{token}});
//         setData(response.data.data);
      
//     }
//     useEffect(()=>{
//         if(token){
//             fetchOrders();
//         }
//     },[token])

 

//   return (
//     <div className='my-orders'>
//         <h2>My Orders</h2>
//         <div className="container">
//            {data.map((order,index)=>{
//             return(

//             <div className="my-orders-order">
//               <img src={assets.parcel_icon} alt="parcel" />
//                 <p>{order.items.map((item,index)=>{
//                     if(index===order.item.length-1){
//                         return item.name+" X "+item.quantity
//                     }else{
//                         return item.name+" X "+item.quantity+", "
                        
//                     }
//                 })}</p>
//                 <p>₹{order.amount}</p>
//                 <p>Items:{order.items.length}</p>
//                 <p><span>&#x25cf;</span><b>{order.status}</b></p>
//                 <button onClick={fetchOrders}>Track Order</button>
//             </div>
//             )

//            })}
//         </div>
      
//     </div>
//   )
// }

// export default Myorders



import React, { useContext, useEffect, useState } from 'react';
import './Myorders.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets.js';

const Myorders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.length > 0 ? (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="parcel" />

              {/* Items */}
              <p>
                {order.items && order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}
                    {idx === order.items.length - 1 ? "" : ", "}
                  </span>
                ))}
              </p>

              {/* Amount */}
              <p>₹{order.amount}</p>

              {/* Total Items */}
              <p>Items: {order.items ? order.items.length : 0}</p>

              {/* Status */}
              <p>
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>

              <button onClick={fetchOrders}>Track Order</button>
            </div>
          ))
        ) : (
          <p>No Orders Found</p>
        )}
      </div>
    </div>
  );
};

export default Myorders;


import React, { useContext, useEffect, useState } from 'react'
import './Verify.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
const Verify = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState('');
    const location = useLocation();
    const { paymentData } = location.state || {};
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();
    
    const verifyPayment = async () => {
        if (!paymentData) {
            setPaymentStatus('Payment data not found');
            setIsLoading(false);
            setTimeout(() => navigate('/'), 2000);
            return;
        }
        
        try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = paymentData;
            
            const response = await axios.post(url + "/api/order/verify", {
                orderId,
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature
            });
            
            if (response.data.success) {
                setPaymentStatus('Payment successful!');
                setTimeout(() => navigate("/myorders"), 2000);
            } else {
                setPaymentStatus('Payment verification failed');
                setTimeout(() => navigate("/"), 2000);
            }
        } catch (error) {
            console.error('Verification error:', error);
            setPaymentStatus('Error verifying payment');
            setTimeout(() => navigate("/"), 2000);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div className='verify'>
            {isLoading ? (
                <div className="spinner"></div>
            ) : (
                <div className="payment-status">
                    <h2>{paymentStatus}</h2>
                </div>
            )}
        </div>
    )
}

export default Verify

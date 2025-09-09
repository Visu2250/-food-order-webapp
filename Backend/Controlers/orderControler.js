import { CurrencyCodes } from "validator/lib/isISO4217.js";
import orderModel from "../Models/orderModel.js";
import userModel from "../Models/UserModel.js"
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

//placing user order for frontend
const placeOrder=async(req,res)=>{
    const frontend_url="http://localhost:5173"

    try{
        const newOrder=new orderModel({
            userId:req.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, {cartData:{}});

        // Calculate total amount in paise (Razorpay uses smallest currency unit)
        const totalAmount = req.body.amount * 100;
        
        // Create Razorpay order
        const options = {
            amount: totalAmount,
            currency: "INR",
            receipt: `order_${newOrder._id}`,
            notes: {
                orderId: newOrder._id.toString()
            }
        };
        
        const order = await razorpay.orders.create(options);
        
        // Send order details to frontend
        res.json({
            success: true,
            order_id: order.id,
            amount: totalAmount,
            key_id: process.env.RAZORPAY_KEY_ID,
            order_info: newOrder,
            frontend_url: frontend_url
        });
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const verifyOrder=async(req,res)=>{
const {orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature}=req.body;
try {
    // Verify the payment signature
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');
    
    if (generated_signature === razorpay_signature) {
        // Payment is successful
        await orderModel.findByIdAndUpdate(orderId, {payment: true});
        res.json({success: true, message: "Payment verified successfully"});
    } else {
        // Payment verification failed
        await orderModel.findByIdAndDelete(orderId);
        res.json({success: false, message: "Payment verification failed"});
    }
} catch (error) {
    console.log(error);
    res.json({success: false, message: "Error during payment verification"});
}
}

//user order for frontend

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId }); // token se aa raha hoga
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel
const listOrders=async(req,res)=>{
    try{
        const orders=await orderModel.find({});
        res.json({success:true,data:orders})

    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
// api for updating order status
const updateStatus=async(req,res)=>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:" Status Updated"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}
import mongoose from "mongoose";
export const connectDB= async()=>{
    await mongoose.connect('mongodb+srv://Visu2250:1572532@cluster0.g5cv7y5.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}

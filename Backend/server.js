import express from "express";
import cors from "cors";
import { connectDB } from "./Config/db.js";
import foodRouter from "./Routes/FoodRoutes.js";
import userRouter from "./Routes/UserRoute.js";
import 'dotenv/config.js'
import cartRouter from "./Routes/CartRoute.js";
import orderRouter from "./Routes/orderRoute.js";

//app congig
const app = express();
const port = 4000;

//middleware
app.use(express.json());
app.use(cors());


//db Connection
connectDB();

//api endpoints
app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)



app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});

//mongodb+srv://Visu2250:1572532@cluster0.g5cv7y5.mongodb.net/?
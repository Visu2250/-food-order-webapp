import express from "express"
import authMiddleware from "../middileware/auth.js";
import { addTocart,removeFromCart,getCart } from "../Controlers/CartControler.js"

const cartRouter=express.Router();


cartRouter.post("/add",authMiddleware, addTocart)
cartRouter.post("/remove",authMiddleware, removeFromCart)
cartRouter.post("/get",authMiddleware, getCart)
export default cartRouter;

import userModel from "../Models/UserModel.js"
//add items to user cart
const addTocart=async(req,res)=>{
    try{
        // let userData=await userModel.findById(req.body.userId);
        let userData=await userModel.findById(req.userId);
        let cartData=await userData.cartData;
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId]=1
        }
        else{
            cartData[req.body.itemId]+=1;

        }
        // await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        await userModel.findByIdAndUpdate(req.userId,{cartData});
        res.json({success:true,message:"Added To Cart"});

    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
//remove item from user cart
const removeFromCart=async(req,res)=>{
    try{
        // let userData=await userModel.findById(req.body.userId);
        let userData=await userModel.findById(req.userId);
        let cartData=await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId]-=1;
        }
        // await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        await userModel.findByIdAndUpdate(req.userId,{cartData});
        res.json({success:true,message:"Removed From Cart"})

    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
//fetch user cart data
// const getCart=async(req,res)=>{
//     try{
        
//         let userData=await userModel.findById(req.body.userId);
//         let cartData=await userData.cartData;
//         res.json({success:true,cartData});
//     }catch(error){
//         console.log(error);
//         res.json({success:false,message:"Error"})

//     }
// }

const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.userId); // ✅ ab direct req.userId se lo
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        let cartData = userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export {addTocart,removeFromCart,getCart}

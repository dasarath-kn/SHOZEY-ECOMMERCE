const user =require('../models/userModel');
const cart = require('../models/cartModel');
const product =require('../models/productModel');
const address = require('../models/addressModel');
const order = require('../models/orderModel');
const coupon = require('../models/couponModel');
const Razorpay = require('razorpay');
const crypto = require("crypto")
require('dotenv').config()

var instance = new Razorpay({
    key_id:process.env.RAZORPAYKEYID,
    key_secret:process.env.ROZORPAYSECRETKEY,
  });

  const checkoutdata = async(req,res)=>{
    try {
        const total = req.body.val
        console.log(total);
        if(total==0){
            res.json({result:false})
        }else{
            res.json({result:true})
        }
        
    } catch (error) {
        console.log(error.message);
    }
  }

const ProceedtoCheckout = async(req,res)=>{
    try {

        const coupondata = await coupon.find()
        const useraddress = await address.find({userId:req.session.userId});
        const id=req.session.userId;
        const data =await product.find()
        const total = await cart.findOne({ userid: id }).populate('items.total');
        const datatotal = total.items.map((item) => {
            return item.total * item.count;
        });
    
        let totalsum = 0;
        if (datatotal.length > 0) {
            totalsum = datatotal.reduce((x, y) => {
                return x + y;
            });
        }
        const cartdata = await cart.find({userid:id}).populate("items.productid")
        res.render('checkout',{user:req.session.name,data,cartdata,useraddress,totalsum,coupondata});
        
    } catch (error) {
        console.log(error.message);
    }
}

const ProceedOrder = async(req,res)=>{
    try {
        // const productdata = await product.findOne({_id:productid});
        const id = req.session.userId
        const payment = req.body.payment
        const addressid = req.body.address
        const status = payment=="Cash on delivery"?"placed":'pending'
      
        const addressdata = await address.findOne({_id:addressid})

    

        
       const carts = await cart.findOne({userid:id})
       const total = await cart.findOne({ userid: id }).populate('items.total');
       const datatotal = total.items.map((item) => {
           return item.total * item.count;
       });
   ///
     
   
   const cartData = await cart.findOne({userid:id})
  const cartitems = await cart.findOne({userid:id}).populate("items.productid") 
  ///

       let totalsum = 0;
       if (datatotal.length > 0) {
           totalsum = datatotal.reduce((x, y) => {
               return x + y;
           });
       
       const datas = new order({
        user_Id:id,
        deliveryDetails:addressdata.userdata[0],
        items:carts.items,
        purchaseDate:Date.now(),
        totalAmount:totalsum,
        status:"Pending",
        paymentMethod:payment,
        paymentStatus:"Pending",
        shippingMethod:"Express",
        shippingFee:"0"
       })
     const orderdata = await  datas.save();
      if(payment == "Cash on delivery"){
        let data = cartData.items
            
        for( let i=0;i<data.length;i++){
            let products = data[i].productid
            let count = data[i].count
            console.log(product);
            
            await product.updateOne({_id:products},{$inc:{quantity:-count}})
        }
        console.log("sdfewssdgdf");
        await cart.deleteOne({userid:id})
       return res.json({success:true}
       
        
        )
      }else if(payment == "Wallet"){
        return res.json({online:true})
  
      }else{
        const options ={
            amount: totalsum*100,
            currency: "INR",
            receipt: ""+orderdata._id,
          }
  
          instance.orders.create(options, function (err, order) {
  
           return res.json({ order });
          });
  
         }
  
        
      
    //   res.render('orderplaced',{user:req.session.name,data,cartdata});
    }

} catch (error) {
        console.log(error.message);
    }


}

//=================================== Order details =====================================//

const orderdetails = async(req,res)=>{

    try {
        const id=req.query.id;
        const data =await product.find()
        const cartdata = await cart.find({userid:id}).populate("items.productid")
        const orderdata = await order.find({_id:id}).populate("items.productid")
        
        console.log(orderdata);

        res.render('orderdetails',{orderdata,data,cartdata,user:req.session.name})
        
    } catch (error) {
        console.log(error.message);
        
    }

}

//===================================  Cancel Order  =====================================//

const cancelorder = async(req,res)=>{
    try {
        const id= req.query.id
        
    //   const data ="cancelled"
    //   console.log(id+"Fsdf",productid+"duhfisifhsh");
    //  const val= await order.updateOne({ _id: id, "items.productid": productid }, { $set: { 'items.$.status': data } })
   
     await order.findByIdAndUpdate(id,{status:"cancelled"})
      const cartitems = await cart.findOne({userid:id}).populate("items.productid") 
    //   const values = cartitems.items
      console.log(cartitems);
 
    //   for(let i=0;i<values.length;i++){
    //     let products = values[i].productid._id
    //      let data= values[i].count
    //       await product.updateOne({_id:products},{$inc:{quantity:+data}})
        
    //   }
      
        
      res.redirect('/profile')

    } catch (error) {
        console.log(error.message);
    }
}

//===================================   Order Placed  =====================================//

const orderplaced = async(req,res)=>{
    try {
        res.render('orderplaced')
        
    } catch (error) {
        console.log(error.message);
    }
}

const verifypayment = async(req,res)=>{
    try { 
          const user_id = req.session.userId
        const paymentData = req.body
        const cartData = await cart.findOne({userid:user_id})
        console.log(cartData);
    
        const hmac = crypto.createHmac("sha256", process.env.ROZORPAYSECRETKEY);
        hmac.update( paymentData.payment.razorpay_order_id  +"|" +  paymentData.payment.razorpay_payment_id );
        const hmacValue = hmac.digest("hex");
    
        if(hmacValue == paymentData.payment.razorpay_signature){
            let data = cartData.items
            
            for( let i=0;i<data.length;i++){
                let products = data[i].productid
                let count = data[i].count
                console.log(product);
                
                await product.updateOne({_id:products},{$inc:{quantity:-count}})
          }
    
          await order.findByIdAndUpdate(
            { _id: paymentData.order.receipt },
            { $set: { paymentStatus: "placed", paymentId: paymentData.payment.razorpay_payment_id } }
          );
      
          await cart.deleteOne({userid:user_id})
          res.json({placed:true})
        }
    
      
        
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    ProceedtoCheckout,
    ProceedOrder,
    orderdetails,
    cancelorder,
    orderplaced,
    verifypayment,
    checkoutdata
}
const coupon = require('../models/couponModel');


const coupondata = async(req,res)=>{

    try {

        const data =req.body.val
        const totalAmount =req.body.total
        const coupondata = await coupon.findOne({couponcode:data});
       if(coupondata){
        if(coupondata.couponcode==data){
            const discountamount= coupondata.discountamount;
            const reducedamount = totalAmount -discountamount
           console.log(reducedamount);
            res.json({result:true,reducedamount:reducedamount})
        }else{
            res.json({result:false})
        }}
        else{
            res.json({result:false})
        }
       

        
    } catch (error) {
        console.log(error.message);
    }

}


module.exports ={
    coupondata
};
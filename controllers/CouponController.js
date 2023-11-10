const coupon = require('../models/couponModel');


const coupondata = async (req, res) => {

    try {

        const data = req.body.val
        const totalAmount = req.body.total
        const coupondata = await coupon.findOne({ couponcode: data });
        const checkcoupon =await coupon.findOne({ couponcode: data,claimedusers: req.session.userId  })
        const  date = Date.now()
        console.log(coupondata);
        if (checkcoupon ) {
          res.json({res:false})
        }
        else {
                if(coupondata){
            if (coupondata.couponcode == data) {
                if(coupondata.expirydate >date){
                const discountamount = coupondata.discountamount;
                const reducedamount = totalAmount - discountamount

             
                res.json({ result: true, reducedamount: reducedamount, discountamount: discountamount })}
                else{
                    res.json({date:false})
                }
            }
            else {
                res.json({ result: false })
            }}
            else{
                res.json({ result: false })
            }
        }



    } catch (error) {
        console.log(error.message);
    }

}

const deletecoupon = async (req, res) => {

    try {
        const total = req.body.total
        console.log(total);
        const value = req.body.value
        const data = await coupon.findOne({ couponcode: value });
       

        if (data) {
            res.json({ result: true, total: total })
        } else {
            res.json({ result: false })
        }

    } catch (error) {
        console.log(error.message);
    }

}



module.exports = {
    coupondata,
    deletecoupon
};
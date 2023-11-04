
const address = require("../models/addressModel");
const cart = require('../models/cartModel')
//=================================== User Address =====================================//

const useraddress = async (req,res)=>{
    try {
        const cartdata = await cart.find().populate("items.productid")
        res.render('address',{user:req.session.name,cartdata})
    } catch (error) {
        console.log(error.message);;
    }
}

const addingAddress = async (req,res)=>{

    try{
        const userid = req.session.userId;
        const checkdata = await address.findOne({_id:userid});
        if(checkdata){
            await address.updateOne({userId:userid},{$set:{
                userdata:{
                    name:req.body.name,
                    phonenumber:req.body.phonenumber,
                    address:req.body.address,
                    city:req.body.city,
                    state:req.body.state,
                    country:req.body.country,
                    pincode:req.body.pincode

                }
            }})
            res.redirect('/profile');
        }
        else{
        const data = new address({
            userId:userid,
            userdata:[{

           name:req.body.name,
           phonenumber:req.body.phonenumber,
           address:req.body.address,
           city:req.body.city,
           state:req.body.state,
           country:req.body.country,
           pincode:req.body.pincode
            } ]
        })
        console.log(data);
        await data.save();

        res.redirect('/profile');
    }

    }
    catch(error){
        console.log(error.message);
    }
}

//=================================== Edit  Address =====================================//

const editaddress = async(req,res)=>{
    try {
        const id = req.query.id;
        const data = await address.findOne({_id:id})
        const cartdata = await cart.find().populate("items.productid")
       
        res.render('editaddress',{data,user:req.session.name,cartdata});
    } catch (error) {
        console.log(error.message);
        
    }
}

const updatingaddress = async(req,res)=>{
  try {
    const id = req.query.id;
    console.log(req.body.name);
    const result = await address.updateOne(
        { _id: id },
        {
          $set: {userdata: {
            name: req.body.name,
            phonenumber: req.body.phonenumber,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            pincode: req.body.pincode
          }
        }
    }
      );
      
    
        res.redirect('/profile');
    
    
    }catch (error) {
    console.log(error.message);
    
  }

}
//=================================== Deleting  Address =====================================//

const deletingAddress = async(req,res)=>{
    try {
        const deleteid = req.body.id;
        console.log(deleteid);
        await address.deleteOne({_id:deleteid});
        res.json({res:true})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports=({
    useraddress,
    addingAddress,
    editaddress,
    deletingAddress,
    updatingaddress
})
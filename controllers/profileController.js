const user = require('../models/userModel');
const address = require('../models/addressModel');
const cart = require('../models/cartModel')
const bcrypt = require('bcrypt')
const order = require('../models/orderModel');
const Wallet = require('../models/walletModel');


//=================================== DASH-BOARD =====================================//

const profile = async (req, res) => {
    try {
        const id = req.session.userId
        const users = await user.findOne({_id:req.session.userId});
        console.log(users);
        const userdata = await address.find({ userId: req.session.userId });
        const cartdata = await cart.find().populate("items.productid")
        const _id = req.query.id;
        const data = userdata
        const orderdata = await order.find({ user_Id: req.session.userId }).sort({ purchaseDate: -1 })
       
        res.render('profile', { data, user: req.session.name, cartdata, orderdata,users,id })

    } catch (error) {
        console.log(error.message);

    }
}
//=================================== BCRYPT PASSWORD =====================================//

const securepassword = async (password) => {
    try {
        const passwordhash = await bcrypt.hash(password, 10);
        return passwordhash;

    } catch (error) {
        console.log(error.message);

    }
}
//=================================== RESET PASSWORD =====================================//

const resetPassword = async (req, res) => {
    try {
        const CurrentPassword = req.body.CurrentPassword;
        const NewPassword = req.body.NewPassword;
        const ConfirmNewPassword = req.body.ConfirmNewPassword;
        const Email = req.body.Email;
        // const bcryptpassword = securepassword(ConfirmNewPassword);
        console.log(Email);
        const data = await user.findOne({ email: Email });
        const oldpassword = data.password;
        const check = await bcrypt.compare(CurrentPassword, oldpassword)

        if (check) {
            if (NewPassword === ConfirmNewPassword) {
                const hashedNewPassword = await bcrypt.hash(NewPassword, 10);
                await user.updateOne({ email: Email }, { $set: { password: hashedNewPassword } });
                const cartdata = await cart.find().populate("items.productid")
                res.render('signin', { user: req.session.name, cartdata })
            }
            else {
                console.log("notsame");
            }
        }
        else {
            res.redirect('/profile')
        }


        //  if(data){
        //     if(data.password == bcryptpassword){
        //      res.redirect('/profile')}
        //      else{
        //         console.log("wrong password");
        //      }

        //  }
        //  else{
        //     console.log("Email id can't access");
        //  }



    } catch (error) {
        console.log(error.message);
    }
}

const editprofile = async(req,res)=>{
    try {
        const id =req.session.userId
        const firstname =req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        
        const edit = await user.updateOne({_id:id},{$set:{
            firstname:firstname,
            lastname:lastname,
            email:email
        }})
        res.json({result:true})

    } catch (error) {
        console.log(error.message);
    }
}

const wallet = async(req,res)=>{
    try {

            const _id = req.session.id
            const id = req.session.userId
            const walletdata = await Wallet.findOne({ userid: req.session.userId });

            if (walletdata) {
              walletdata.items.sort((a, b) => b.date - a.date);
            }       
             const cartdata = await cart.find({ userid: _id }).populate("items.productid")

        res.render('wallet',{user:req.session.name,cartdata,walletdata,id})
        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    profile,
    resetPassword,
    securepassword,
    editprofile,
    wallet

}
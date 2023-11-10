const user = require('../models/userModel');
const address = require('../models/addressModel');
const cart = require('../models/cartModel')
const bcrypt = require('bcrypt')
const order = require('../models/orderModel');



//=================================== DASH-BOARD =====================================//

const profile = async (req, res) => {
    try {
        const userdata = await address.find({ userId: req.session.userId });
        console.log(userdata);
        const cartdata = await cart.find().populate("items.productid")
        const id = req.query.id;
        const data = userdata
        const orderdata = await order.find({ user_Id: req.session.userId }).sort({ purchaseDate: -1 })
        // console.log(orderdata,"yftftftftftftftftft");
        res.render('profile', { data, user: req.session.name, cartdata, orderdata })

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

module.exports = {
    profile,
    resetPassword,
    securepassword

}
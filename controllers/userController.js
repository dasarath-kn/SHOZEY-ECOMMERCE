const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const { render } = require('ejs');
const nodemailer = require('nodemailer');
const product = require('../models/productModel');
const session = require('express-session');
const cart = require('../models/cartModel');
const otpmodel = require('../models/otpModel');
const category = require('../models/categoryModel');
const { orderplaced } = require('./CheckoutController');
const { wallet } = require('./profileController');
const Wallet = require('../models/walletModel');
const Categoryoffer=require('../models/categoryofferModel');
const Productoffer = require('../models/productofferModel');

let nameResend
let email2
let items

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

const admin = async (req, res) => {
    try {
        res.render("otp")
    }
    catch (error) {
        console.log(error.message);
    }
}

//=================================== HIDING PASSWORD =====================================//

const securepassword = async (password) => {
    try {
        const passwordhash = await bcrypt.hash(password, 10);
        return passwordhash;
    }
    catch (error) {
        console.log(error.message);
    }
}
//=================================== HOME =====================================//


const home = async (req, res) => {
    try {
        const id = req.session.userId;
        const data = await product.find()
        const cartdata = await cart.find({ userid: id }).populate("items.productid")
        const Categoryofferdata = await Categoryoffer.find()
        const Productofferdata = await Productoffer.find()
        
       
        res.render("home", { data, user: req.session.name, cartdata, id,Categoryofferdata,Productofferdata })


    }
    catch (error) {
        console.log(error.message);
    }
}
//=================================== LOG-IN =====================================//


const register = async (req, res) => {
    try {
        const id = req.session.userId;
        const cartdata = await cart.find({ userid: id }).populate("items.productid")


        res.render('signin', { message: "", user: req.session.name, cartdata });
    }
    catch (error) {
        console.log(error.message);
    }

}

//=================================== PRODUCT DETAILS =====================================//

const productdetails = async (req, res) => {
    try {
        const id = req.query.id
        const userid = req.session.userId
        const data = await product.find({ _id: id });
        const sessionid = req.session.userId;
        const cartdata = await cart.find({ userid: sessionid }).populate("items.productid")
        res.render('productdetails', { data, user: req.session.name, cartdata, userid });
    }
    catch (error) {
        console.log(error.message);
    }
}
////////////////////////////////////////// LOGIN /////////////////////////////////////  
const validation = async (req, res) => {
    try {

        const check = await user.findOne({ email: req.body.email });

        console.log(check);
        const sessionid = req.session.userId;
        const cartdata = await cart.find({ userid: sessionid }).populate("items.productid")
        if (check) {
            const passwordMatch = await bcrypt.compare(req.body.password, check.password);

            if (passwordMatch) {
                if (check.is_verified == 1 && check.status == 0) {
                    req.session.userId = check._id;
                    req.session.name = check.firstname;
                    res.redirect('/home');
                }
                else if (check.is_verified == 0 && check.status == 0) {
                    console.log("hfghjhj");
                    const id = req.body.email
                    const username = await user.findOne({ email: id })
                    const name = username.name
                    const _id = username._id
                    sendVerifyMail(name, req.body.email);
                    const otpnumber = items.otp
                    res.render('otp', { userid: _id, otpnumber })

                    res.redirect('/cart')
                }
                else {

                    res.render('signin', { message: "Please verify your mail", user: req.session.name, cartdata });
                }

            }

        } else if (check != req.body.password) {
            res.render('signin', { message: "Invalid password and Email", user: req.session.name, cartdata })
        }
        else {
            res.render('signin', { message: "Invalid mail", user: req.session.name, cartdata });

        }


    } catch (error) {
        console.log(error.message);

    }
}

//=================================== SIGN-UP =====================================//

const sign = async (req, res) => {
    try {
        const id = req.session.userId
        const cartdata = await cart.find({ userid: id }).populate("items.productid")
        res.render('signup', { user: req.session.name, cartdata });
    }
    catch (error) {
        console.log(error.message);
    }

}



const insertdata = async (req, res) => {
    try {
        const referalcode = req.body.referalcode
        const emaildata = req.body.email;
        const item = await user.findOne({ email: emaildata });
        if (item) {
            console.log("Already exist");
            res.redirect('/signup');
        }
        else {
         const referalcode = req.body.referalcode
         console.log(referalcode);
            const spassword = await securepassword(req.body.password)
            const userdata = new user({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phonenumber: req.body.phonenumber,
                password: spassword,
                status: 0,
                refercode:generateRandomString(8)

            })

            const data = await userdata.save();
            const userdatas = await user.findOne({email:req.body.email});

            const walletdata = new Wallet({
                userid:userdatas._id
            })
           const walletitems = await walletdata.save();

            if(referalcode){
                const id = await user.findOne({refercode:referalcode})
                const value = await Wallet.updateOne(
                    { userid: id._id },
                    {
                        $inc: { balance: 100 },
                        $push: {
                            items: {
                                date: Date.now(),
                                amount: 100,
                                type: 'Referal Reward',
                                referaluser: userdatas._id
                            }
                        }
                    }
                );

                const  userwallet = await Wallet.updateOne({userid:userdatas._id},{$inc:{balance:100},
                    $push: {
                        items: {
                            date: Date.now(),
                            amount: 100,
                            type: 'Referal Reward',
                            
                        }
                    }
                })
                
            }

            if (userdata) {
                sendVerifyMail(req.body.firstname, req.body.email);
                email2 = req.body.email
                firstname = req.body.firstname
                const otpnumber = items.otp
                res.render('otp', { userid: data._id, otpnumber })

            } else {
                res.redirect('/signup');
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
//=================================== SEND FOR MAIL =====================================//

var otpsend = 0;


function otpgenerator() {
    otpsend = Math.floor(100000 + Math.random() * 900000);
}

const sendVerifyMail = async (name, email) => {
    try {

        otpgenerator();


        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {


                user: process.env.EMAIL,
                pass: process.env.PASS
            }

        });
        const mailoptions = {

            from: process.env.EMAIL,
            to: email,
            subject: "For Verification ",
            html: `<p>Hi,</p><p><b>${name}</b>Your OTP is: <strong>${otpsend}</strong></p>`
        }
        transporter.sendMail(mailoptions, (error, info) => {
            if (error) {
                console.log(error.message);
            } else {
                console.log("Email has been send:-", info.response, otpsend);
            }
        })
        items = new otpmodel({
            email: email,
            otp: otpsend
        })
        console.log(items);
        await items.save()
    }
    catch (error) {
        console.log(error.message);
    }
}
const verifymail = async (req, res) => {
    try {
        // console.log("curent otp"+otpsend);
        // console.log("user enterd otp"+req.body.otp);

        if (req.body.otp == otpsend) {
            console.log("helloooooooooooooooooooooooo");
            const id = req.query.id
            console.log(id);
            const updateinfo = await user.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });

            console.log(updateinfo);
            res.redirect('/signin')
        } else {
            console.log("Not verified");
        }
    }

    catch (error) {
        console.log(error.message);

    }
}

//=================================== RESEND OTP =====================================//
const resendOTP = async (req, res) => {
    try {
        otpsend = await Math.floor(10000 + Math.random() * 90000);
        console.log(otpsend)
        sendVerifyMail(nameResend, email2);
        res.render('otp', { userid: data._id });

    }

    catch (error) {
        console.log(error);
    }
}

//=================================== OTP =====================================//

const otp = async (req, res) => {
    try {

        res.render('signin', { user: req.session.name })
    }
    catch (error) {
        console.log(error.message);
    }

}

//=================================== SHOP =====================================//

const shop = async (req, res) => {
    try {
        const id = req.session.id

        const productcategory = await category.find()
        const productdata= await product.find()
        const cartdata = await cart.find({ userid: id }).populate("items.productid")

        res.render('shop', { user: req.session.name, cartdata, productdata, id, productcategory })

    } catch (error) {
        console.log(error.message);
    }
}
//=================================== SEARCH =====================================//

const search = async (req, res) => {

    try {
        console.log("fsfsfsdfds");
        const data = req.body.product
        const id = req.session.userId
        const productdata = await product.find({ productname: { $regex: data, $options: 'i' } });

        const cartdata = await cart.find({ userid: id }).populate("items.productid")

        res.render('shop', { user: req.session.name, productdata, cartdata, id })

    } catch (error) {
        console.log(error.message);
    }

}

const pricesort = async(req,res)=>{
    try {
        const val = req.body.val
        if(val==-1){
            res.json({result:true})
        }else if(val ==1){
            res.json({result:false})
        }
        
    } catch (error) {
        
        console.log(error.message);
    }
}

const pricehightolow = async(req,res)=>{
    try {
        const id = req.session.id

        const productcategory = await category.find()
        const productdata = await product.find().sort({price:-1})

        const cartdata = await cart.find({ userid: id }).populate("items.productid")

        res.render('shop', { user: req.session.name, cartdata, productdata, id, productcategory })

        
    } catch (error) {
        console.log(error.message);
    }
}

const pricelowtohigh = async(req,res)=>{
    try {
        const id = req.session.id

        const productcategory = await category.find()
        const productdata = await product.find().sort({price:1})

        const cartdata = await cart.find({ userid: id }).populate("items.productid")

        res.render('shop', { user: req.session.name, cartdata, productdata, id, productcategory })

        
    } catch (error) {
        console.log(error.message);
        
    }
}

const Menformalshoes = async(req,res)=>{
    try {
        
        const id =req.session.id
      
        const productdata = await product.find({ category: "Men's Formal Shoes" });
        console.log(productdata);
        const productcategory = await category.find()
        const cartdata = await cart.find({ userid: id }).populate("items.productid")
        res.render('filter', { user: req.session.name, cartdata, productdata, id, productcategory })
        
    } catch (error) {
        console.log(error.message);
    }
}

const Mencasualshoes =async(req,res)=>{
    try {
        const id =req.session.id
      
        const productdata = await product.find({ category: "Men's Casual Shoes" });
        console.log(productdata);
        const productcategory = await category.find()
        const cartdata = await cart.find({ userid: id }).populate("items.productid")
        res.render('filter', { user: req.session.name, cartdata, productdata, id, productcategory })
        
        
    } catch (error) {
       console.log(error.message); 
    }
}

const Mensportsshoes = async(req,res)=>{
    try {
        const id =req.session.id
      
        const productdata = await product.find({ category: "Men's Sport Shoes" });
        console.log(productdata);
        const productcategory = await category.find()
        const cartdata = await cart.find({ userid: id }).populate("items.productid")
        res.render('filter', { user: req.session.name, cartdata, productdata, id, productcategory })
        
        
    } catch (error) {
        console.log(error.message);
    }

}
const Womencasualshoes = async(req,res)=>{
    try {
        const id =req.session.id
      
        const productdata = await product.find({ category: "Women's casual" });
        console.log(productdata);
        const productcategory = await category.find()
        const cartdata = await cart.find({ userid: id }).populate("items.productid")
        res.render('filter', { user: req.session.name, cartdata, productdata, id, productcategory })
        
        
    } catch (error) {
        console.log(error.message);
    }

}


const categorysort = async(req,res)=>{

    try {
        console.log("uiujhhjjh");
        const id =req.session.id
        const categorys =req.query.category
        const categories =req.query.categories

         if(categorys){
        const productdata = await product.find({ category: categorys }).sort({price:1});  
      console.log(productdata);      
        const productcategory = await category.find()
        const cartdata = await cart.find({ userid: id }).populate("items.productid")
        res.render('filter', { user: req.session.name, cartdata, productdata, id, productcategory })
         }
         else{
            const productdata = await product.find({ category: categories }).sort({price:-1});  
            console.log(productdata);      
              const productcategory = await category.find()
              const cartdata = await cart.find({ userid: id }).populate("items.productid")
              res.render('filter', { user: req.session.name, cartdata, productdata, id, productcategory })
         }
        
        
    } catch (error) {
        console.log(error.message);
    }
}

// const errorpage = async (req,res) => {
//     try{
//       return res.status(404).render('404')
//     }
//     catch(error){
//         console.log(error.message);
//     }
// }
//=================================== LOG-OUT =====================================//

const logout = async (req, res) => {
    try {
        req.session.userId = false
        res.redirect('/');


    }
    catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    register,
    insertdata,
    otp,
    verifymail,
    home,
    validation,
    logout,
    admin,
    sign,
    productdetails,
    resendOTP,
    shop,
    search,
    pricehightolow,
    pricesort,
    pricelowtohigh,
    Menformalshoes,
    Mencasualshoes,
    Mensportsshoes,
    Womencasualshoes,
    categorysort
    // errorpage
}


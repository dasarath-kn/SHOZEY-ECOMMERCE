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
const Categoryoffer = require('../models/categoryofferModel');
const Productoffer = require('../models/productofferModel');
const banner =require('../models/bannerModel')

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
        res.render('500');
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
        res.render('500');
    }
}
//=================================== HOME =====================================//


const home = async (req, res) => {
    try {
        const id = req.session.userId;
        const data = await product.find().limit(4)
        const products = await product.find().skip(4)
        const mencategory = await product.find({ category: { $regex: /^M/i } });
        const womencategory = await product.find({category:{ $regex:/^W/i}});
        const bannerdata =await banner.find()
        // console.log(mencate);
       
        const cartdata = await cart.find({ userid: id }).populate("items.productid")
        const Categoryofferdata = await Categoryoffer.find()
        const Productofferdata = await Productoffer.find()


        res.render("home", { data, user: req.session.name, cartdata, id, Categoryofferdata, Productofferdata,products,mencategory,womencategory,bannerdata })
       
       

    }
    catch (error) {
        
        console.log(error.message);
        res.render('500');
    }
}
//=================================== LOG-IN =====================================//


const register = async (req, res) => {
    try {
        const id = req.session.userId;
        const cartdata = await cart.find({ userid: id }).populate("items.productid")


        res.render('signin', { message: "", user: req.session.name, cartdata,id });
    }
    catch (error) {
        console.log(error.message);
        res.render('500');

    }

}

const forgetpassword = async(req,res)=>{
    try {
        const id = req.session.userId;
        const cartdata = await cart.find({ userid: id }).populate("items.productid")


        res.render('forgetpassword',{ message: "", user: req.session.name, cartdata,id })
        
    } catch (error) {
        console.log(error.message);
    }
}
const forgetpasswordcheck =async(req,res)=>{
    try {
        const email = req.body.email
        const userdata = await user.findOne({email:email});
        const id = req.session.userId;
        const cartdata = await cart.find({ userid: id }).populate("items.productid")
  if(userdata){
        if(userdata.status!=1){
            const name = userdata.name
            const _id = userdata._id
            sendVerifyMail(name, req.body.email);
            const otpnumber = items.otp
            res.render('forgetpasswordotp', { message:" ",userid: _id, otpnumber ,id})

        
        }
        else{
            res.render('forgetpassword',{message:"Email not found",user:req.session.name,cartdata,id})  
        }}
        else{
            res.render('forgetpassword',{message:"Email not found",user:req.session.name,cartdata,id})  

        }
    } catch (error) {
        console.log(error.message);
        res.render('500');

    }
}

const forgetpasswordotpVerify = async(req,res)=>{
    try {
        const id = req.query.id
        const otp = req.body.otp
        if(otp ==otpsend){
           
            const _id = req.session.userId;
            const cartdata = await cart.find({ userid: id }).populate("items.productid")
            res.render('newpassword',{ message: "", user: req.session.name, cartdata,id })
        }else{
            res.render('forgetpasswordotp',{ userid: id,message:"Incorrect otp" });
        }
        
    } catch (error) {
        console.log(error.message);
        res.render('500');

    }
}

const resendotpforpassword =async(req,res)=>{
    try {
        const id = req.query.val
        console.log(id);
        const userdata = await user.findOne({_id:id})
        otpsend = await Math.floor(10000 + Math.random() * 90000);
        console.log(otpsend)
        sendVerifyMail(userdata.firstname, userdata.email);
        res.render('forgetpasswordotp', {message:"Your new otp has been sented to your registered mail" ,userid:id });


        
    } catch (error) {
        console.log(error.message);
        res.render('500');

    }
}




const newpasswordpage = async(req,res)=>{
    try {
        const id = req.session.userId;
     
        const cartdata = await cart.find({ userid: _id }).populate("items.productid")
        res.render('newpassword',{message:"Password is not match", user: req.session.name, cartdata,id})
    } catch (error) {
        console.log(error.message);
        res.render('500');

    }
}

const newpassword = async(req,res)=>{
    try {
        const id =req.query.id
        const password =req.body.password;
        const confirmpassword = req.body.confirmpassword
        console.log(password,confirmpassword,id);
        if(password == confirmpassword){
            const newpassword = await securepassword(confirmpassword);
            console.log(newpassword);
           const updatepassword= await user.updateOne({_id:id},{$set:{password:newpassword}});
         
          res.redirect('/signin');
        }else{
            const _id = req.session.userId;
            const cartdata = await cart.find({ userid: _id }).populate("items.productid")
           
             res.render('newpassword',{ message: "Password is not match", user: req.session.name, cartdata,id })
        }
        
    } catch (error) {
        console.log(error.message);
        res.render('500');

    }
}

//=================================== PRODUCT DETAILS =====================================//

const productdetails = async (req, res) => {
    try {
        const _id = req.query.id
        const id = req.session.userId
        const data = await product.find({ _id: _id });
        const sessionid = req.session.userId;
        const cartdata = await cart.find({ userid: sessionid }).populate("items.productid")
        res.render('productdetails', { data, user: req.session.name, cartdata, id });
    }
    catch (error) {
        console.log(error.message);
        res.render('500');

    }
}
////////////////////////////////////////// LOGIN /////////////////////////////////////  
const validation = async (req, res) => {
    try {

        const check = await user.findOne({ email: req.body.email });

        console.log(check);
        const id =req.session.userId
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
                    const id = req.body.email
                    const username = await user.findOne({ email: id })
                    const name = username.name
                    const _id = username._id
                    sendVerifyMail(name, req.body.email);
                    const otpnumber = items.otp
                    res.render('otp', { userid: _id, otpnumber,message:"" })

                }

                else {

                    res.render('signin', { message: "Your account has been blocked please contact the admin", user: req.session.name, cartdata,id });
                }

            }else{
                res.render('signin', { message: "Incorrect password", user: req.session.name, cartdata,id })

            }

        } else if (check != req.body.password) {
            res.render('signin', { message: "Invalid Email and password", user: req.session.name, cartdata,id })
        }
        else {
            res.render('signin', { message: "Invalid mail", user: req.session.name, cartdata,id });

        }


    } catch (error) {
        console.log(error.message);
        res.render('500');


    }
}

//=================================== SIGN-UP =====================================//

const sign = async (req, res) => {
    try {
        const id = req.session.userId
        const cartdata = await cart.find({ userid: id }).populate("items.productid")
        res.render('signup', { user: req.session.name, cartdata ,message:" ",id});
    }
    catch (error) {
        console.log(error.message);
        res.render('500');
        
    }

}



const insertdata = async (req, res) => {
    try {
        const referalcode = req.body.referalcode
        const emaildata = req.body.email;
        const id = req.session.userId;

        const item = await user.findOne({ email: emaildata });
        const cartdata = await cart.find({ userid: id }).populate("items.productid")

        if (item) {
            console.log("Already exist");
            res.render('signup',{ user: req.session.name, cartdata,message:"User already exist"});
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
                refercode: generateRandomString(8)

            })

            const data = await userdata.save();
            const userdatas = await user.findOne({ email: req.body.email });

            const walletdata = new Wallet({
                userid: userdatas._id
            })
            const walletitems = await walletdata.save();

            if (referalcode) {
                const id = await user.findOne({ refercode: referalcode })
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

                const userwallet = await Wallet.updateOne({ userid: userdatas._id }, {
                    $inc: { balance: 100 },
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
               
                res.render('otp', { userid: data._id, otpnumber,userid: userdatas._id,message:"" })

            } else {
                res.redirect('/signup');
            }
        }
    }
    catch (error) {
        console.log(error.message);
        res.render('500');

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
        const id = req.query.id
        console.log(id);
        const otp =req.body.otp
        if ( otp== otpsend) {
            const updateinfo = await user.updateOne({ _id: id }, { $set: { is_verified: 1 } });

            console.log(updateinfo);
            res.redirect('/signin')
        } else {
            res.render('otp',{ userid: id,message:"Incorrect otp" });
        }
    }

    catch (error) {
        console.log(error.message);
        res.render('500');


    }
}

//=================================== RESEND OTP =====================================//
const resendOTP = async (req, res) => {
    try {
        const id = req.query.val
        console.log(id);
        otpsend = await Math.floor(10000 + Math.random() * 90000);
        console.log(otpsend)
        const userdata = await user.findOne({_id:id})
         sendVerifyMail(userdata.firstname, userdata.email);
         res.render('otp', {message:"Your new otp has been sented to your registered mail" ,userid:id });

    }

    catch (error) {
        console.log(error.message);
        res.render('500');

    }
}

//=================================== OTP =====================================//

const otp = async (req, res) => {
    try {

        res.render('signin', { user: req.session.name })
    }
    catch (error) {
        console.log(error.message);
        res.render('500');

    }

}

//=================================== SHOP =====================================//

const shop = async (req, res) => {
    try {
        const sessionid = req.session.id
        const _id = req.query.id
        console.log(_id);
        const id = req.session.userId
        const categorydata = await category.find()
        const lowtohigh = req.query.lowtohigh;
        const hightolow = req.query.hightolow
        const Categoryofferdata = await Categoryoffer.find()
        const Productofferdata = await Productoffer.find()
        const value = req.query.val

        var val=0
        if(lowtohigh){
            val=1
        }else if(hightolow){
            val=-1
        }else{
            val=0
        }
        const cartdata = await cart.find({ userid: sessionid }).populate("items.productid")
        const productcount = await product.find().count();
         const categorys = req.query.categorys
         if(categorys){
          
                const productdata = await product.find({category:categorys}).sort({price:val})
                console.log(productdata);
            var products =0
            res.render('shop', { user: req.session.name, cartdata, productdata,products, sessionid, categorydata ,pagecount,categorys,Categoryofferdata,Productofferdata,id})
         }
        else{
            
        var pagecount = Math.floor(productcount / 6);
        if (productcount % 6 !== 0) {
            pagecount += 1;
          }
        
   if(value){
    const values = value-1
    const productdata = await product.find().skip(6*values).limit(6).sort({price:val})
    
   
        res.render('shop', { user: req.session.name, cartdata, productdata, sessionid, categorydata ,pagecount,categorys,Categoryofferdata,Productofferdata,id,value})
        
   }else{
    const productdata = await product.find().limit(6).sort({price:val})
    
        res.render('shop', { user: req.session.name, cartdata, productdata, sessionid, categorydata ,pagecount,categorys,Categoryofferdata,Productofferdata,id,value})
        
   }
          
        if(_id =='W'){
            const productdata = await product.find({category:{$regex:/^W/i}}).limit(6).sort({price:val})
 
            res.render('shop', { user: req.session.name, cartdata, productdata, sessionid, categorydata,pagecount,categorys,Categoryofferdata,Productofferdata,id})

        }else if(_id =='M'){
            const productdata = await product.find({category:{$regex:/^M/i}}).limit(6).sort({price:val})
 
            res.render('shop', { user: req.session.name, cartdata, productdata, sessionid, categorydata,pagecount,categorys,Categoryofferdata,Productofferdata,id})

        }
        else {
            const productdata = await product.find().limit(6).sort({price:val})

            res.render('shop', { user: req.session.name, cartdata, productdata, sessionid, categorydata,pagecount,categorys,Categoryofferdata,Productofferdata,id})
        }
    }
    } catch (error) {
        console.log(error.message);
        res.render('500');

    }
}
//=================================== SEARCH =====================================//

const search = async (req, res) => {

    try {
        const data = req.body.product
        const id = req.session.userId
        const sessionid = req.session.id
        var pagecount =0
        var productcategory=await category.find()
        const productdata = await product.find({ productname: { $regex: data, $options: 'i' } });
        const categorydata = await category.find()
        const cartdata = await cart.find({ userid: id }).populate("items.productid")

        res.render('shop', { user: req.session.name, productdata, cartdata, id,sessionid,pagecount,productcategory,categorys:0,categorydata })

    } catch (error) {
        console.log(error.message);
        res.render('500');

    }

}

const pricesort = async (req, res) => {
    try {
        const val = req.body.val
        if (val == -1) {
            res.json({ result: true })
        } else if (val == 1) {
            res.json({ result: false })
        }

    } catch (error) {

        console.log(error.message);
        res.render('500');

    }
}








const categorysort = async (req, res) => {

    try {
       
        const id = req.session.id
        const categorys = req.query.category
        const categories = req.query.categories

        if (categorys) {
            const productdata = await product.find({ category: categorys }).sort({ price: 1 });
            console.log(productdata);
            const productcategory = await category.find()
            const cartdata = await cart.find({ userid: id }).populate("items.productid")
            res.render('filter', { user: req.session.name, cartdata, productdata, id, productcategory })
        }
        else {
            const productdata = await product.find({ category: categories }).sort({ price: -1 });
            console.log(productdata);
            const productcategory = await category.find()
            const cartdata = await cart.find({ userid: id }).populate("items.productid")
            res.render('filter', { user: req.session.name, cartdata, productdata, id, productcategory })
        }


    } catch (error) {
        console.log(error.message);
        res.render('500');

    }
}

const sortproduct= async(req,res)=>{
    try {
        const categoryid = req.body.id

        const categoryname = await category.findOne({_id:categoryid})
        const products = await product.find({category:categoryname.productcategory})
        console.log(products)

    } catch (error) {
        console.log(error.message);
        res.render('500');

    }
}



//=================================== LOG-OUT =====================================//

const logout = async (req, res) => {
    try {
        req.session.userId = null
        res.redirect('/');


    }
    catch (error) {
        console.log(error.message);
        res.render('500');

    }
}


module.exports = {
    register,
    insertdata,
    forgetpassword,
    forgetpasswordcheck,
    forgetpasswordotpVerify,
    newpasswordpage,
    newpassword,
    otp,
    resendotpforpassword,
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
    pricesort,
    categorysort,
    sortproduct,
    
}


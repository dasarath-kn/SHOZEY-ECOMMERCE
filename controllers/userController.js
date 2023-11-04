const user=require('../models/userModel');
const bcrypt=require('bcrypt');
const { render } = require('ejs');
const nodemailer=require('nodemailer');
const product=require('../models/productModel');
const session = require('express-session');
const cart = require('../models/cartModel');
const otpmodel = require('../models/otpModel');
 
let nameResend
let email2


const admin=async(req,res)=>{
    try{
        res.render("otp")
    }
    catch(error){
        console.log(error.message);
    }
}

    //=================================== HIDING PASSWORD =====================================//

const securepassword=async(password)=>{
    try{
        const passwordhash=await bcrypt.hash(password,10);
        return passwordhash;
    }
    catch(error){
        console.log(error.message);
    }
}
    //=================================== HOME =====================================//


const home=async(req,res)=>{
    try{
        const id=req.session.userId;
        const data =await product.find()
        const cartdata = await cart.find({userid:id}).populate("items.productid")
        
        res.render("home",{data,user : req.session.name,cartdata,id})
        
        
    }
catch(error){
    console.log(error.message);
    }
}
    //=================================== LOG-IN =====================================//


const register = async(req,res)=>{
    try{
        const id =req.session.userId;
        const cartdata = await cart.find({userid:id}).populate("items.productid")
     
       
       res.render('signin',{message:"",user : req.session.name,cartdata});
    }
    catch(error){
        console.log(error.message);
    }

}

//=================================== PRODUCT DETAILS =====================================//

const productdetails= async(req,res)=>{
    try{
        const id=req.query.id
        const userid = req.session.userId
        const data = await product.find({_id:id});
        const sessionid =req.session.userId;
        const cartdata = await cart.find({userid:sessionid}).populate("items.productid")
        res.render('productdetails',{data,user : req.session.name,cartdata,userid});
    }
    catch(error){
        console.log(error.message);
    }
}
////////////////////////////////////////// LOGIN /////////////////////////////////////  
const validation = async (req, res) => {
    try {
        
        const check = await user.findOne({ email: req.body.email });
       
        console.log(check);
        const sessionid =req.session.userId;
        const cartdata = await cart.find({userid:sessionid}).populate("items.productid")
        if (check) {  
            const passwordMatch = await bcrypt.compare(req.body.password, check.password);      
            
            if(passwordMatch){
                if(check.is_verified==1 && check.status==0 ){
                    req.session.userId = check._id;
                    req.session.name = check.firstname;
                    res.redirect('/home');
                }
                else{
                  
                    res.render('signin',{message:"Please verify your mail",user:req.session.name,cartdata});
                }

            }
           
        } else if(check != req.body.password){
            res.render('signin',{message:"Invalid password",user:req.session.name.cartdata})
           }
        else  {
            res.render('signin',{message:"Invalid mail",user:req.session.name,cartdata});
           
        }
        
        
    } catch (error) {
        console.log(error.message);
        
    }
}

    //=================================== SIGN-UP =====================================//

const sign = async(req,res)=>{
    try{
        const id =req.session.userId
        const cartdata = await cart.find({userid:id}).populate("items.productid")
       res.render('signup',{user:req.session.name,cartdata});
    }
    catch(error){
        console.log(error.message);
    }

}



const insertdata=async(req,res)=>{
    try{
        const emaildata = req.body.email;
        const item = await user.findOne({email:emaildata});
        if(item){
            console.log("Already exist");
            res.redirect('/signup');
        }
        else{
        
        const spassword= await securepassword(req.body.password)
        const  userdata= new user({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        phonenumber:req.body.phonenumber,
        password:spassword,
        status:0

        })
       
        const data=await userdata.save();
        if(userdata){
            sendVerifyMail(req.body.firstname,req.body.email,userdata._id);
            email2 = req.body.email
            firstname= req.body.firstname
            res.render('otp',{userid:data._id})

        }else{
            res.redirect('/signup');
        }}
    }
    catch(error){
        console.log(error.message);
    }
}
    //=================================== SEND FOR MAIL =====================================//

var otpsend =0; 
 

function otpgenerator(){
    otpsend= Math.floor(100000 + Math.random() * 900000);}

const sendVerifyMail=async(name,email,user_id)=>{
    try{
        setTimeout(()=>{
             otpgenerator();
        },120000)
       
       const transporter= nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{

                
                user:process.env.EMAIL,
                pass:process.env.PASS
            }

        });
        const mailoptions={
          
            from:process.env.EMAIL, 
            to:email,
            subject:"For Verification ",
            html: `<p>Hi,</p><p>Your OTP is: <strong>${otpsend}</strong></p>`
        }
        transporter.sendMail(mailoptions,(error,info)=>{
            if(error){
                console.log(error.message);
            }else{
                console.log("Email has been send:-",info.response,otpsend);
            }
        })
        const items = new otpmodel({
            email:email,
            otp:otpsend
         })
         console.log(items);
         await items.save()
    }
    catch(error){
        console.log(error.message);
    }
} 
const verifymail=async(req,res)=>{
    try{ 
        // console.log("curent otp"+otpsend);
        // console.log("user enterd otp"+req.body.otp);
        
        if(req.body.otp==otpsend){
     const updateinfo = await user.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });

        console.log(updateinfo);
        res.redirect('/home')
    }else{
        console.log("Not verified");
    }}

    catch(error){
        console.log(error.message);

    }
}

//=================================== RESEND OTP =====================================//
const resendOTP = async (req,res)=>{
    try{
           otpsend = await Math.floor(10000 + Math.random() * 90000); 
           console.log(otpsend)
           sendVerifyMail(nameResend,email2);
           res.render('otp', {userid:data._id});
  
      }
    
    catch(error) {
     console.log(error);
  }
  }

//=================================== OTP =====================================//

const otp=async(req,res)=>{
    try{
        
        res.render('signin',{user:req.session.name})
    }
    catch(error){
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

const logout=async(req,res)=>{
    try{
        req.session.userId = false
        res.redirect('/');

       
    }
    catch(error){
        console.log(error.message);
    }
}


module.exports={
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
// errorpage
}


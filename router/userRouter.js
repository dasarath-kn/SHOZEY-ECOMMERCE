const express=require('express');
const router=express();
const session = require('express-session')
const usercontroller=require("../controllers/userController");
const cartcontroller=require("../controllers/cartController")
const profileController=require("../controllers/profileController");
const addresscontroller = require("../controllers/addressController");
const checkoutcontroller = require('../controllers/CheckoutController');
const couponcontroller = require('../controllers/CouponController')
const auth = require('../middleware/userAuth')

router.set('view engine', 'ejs')
router.set('views','./views/user')

router.use(session({
    secret:process.env.SESSIONSECRETKEY,
    resave:false,
    saveUninitialized:true

}));

//=================================== HOME-PAGE =====================================//

router.get('/', auth.is_Logout, usercontroller.home)
router.get('/home', auth.is_Login, usercontroller.home)

//=================================== LOG-IN =====================================//

router.post('/login',auth.is_Logout, usercontroller.validation);
router.get('/signin',auth.is_Logout,usercontroller.register);
router.get('/forgetpassword',usercontroller.forgetpassword);
router.post('/forgetpasswordcheck',usercontroller.forgetpasswordcheck);
router.post('/forgetpasswordotpVerify',usercontroller.forgetpasswordotpVerify);
 router.post('/resendotpforpassword',usercontroller.resendotpforpassword);
router.post('/newpassword',usercontroller.newpassword);
router.get('/newpasswordpage',usercontroller.newpasswordpage);


//=================================== SIGN-UP =====================================//

router.post  ('/show',usercontroller.insertdata);
router.get('/signup', auth.is_Logout,usercontroller.sign);
router.post('/verifymail', auth.is_Logout, usercontroller.verifymail);
router.post('/resendotp',usercontroller.resendOTP);

//=================================== PRODUCT-DETAILS =====================================//

router.get('/productdetails',usercontroller.productdetails);
router.post('/searchproduct',usercontroller.search)
//=================================== WISHLIST =====================================//

router.post('/addtowishlist',cartcontroller.addtowishlist)
router.get('/wishlist',cartcontroller.wishlistview);
router.delete('/deletewishlist',cartcontroller.deletewishlist)

//=================================== CART =====================================//

router.get('/cart',cartcontroller.cartRendering);
router.post('/addToCart',cartcontroller.cartAdding);
router.get('/deleteCartItems',cartcontroller.deleteCartItems);
router.post('/AddingProductCount',cartcontroller.AddingProductCount)

//=================================== CHECK-OUT =====================================//
router.post('/checkoutdata',checkoutcontroller.checkoutdata)
router.get('/ProceedtoCheckout',checkoutcontroller.ProceedtoCheckout)
router.post('/ProceedOrder',checkoutcontroller.ProceedOrder)
router.get('/orderdetails',checkoutcontroller.orderdetails)
router.post('/cancelorder',checkoutcontroller.cancelorder)
router.get('/orderplaced',checkoutcontroller.orderplaced);
router.post('/verify-payment',checkoutcontroller.verifypayment);
router.post('/returnorder',checkoutcontroller.returnorder)
//=================================== PROFILE =====================================//

router.get('/profile',profileController.profile);
router.post('/resetpassword',profileController.resetPassword);
router.put('/editprofile',profileController.editprofile);
router.get('/wallet',profileController.wallet);
//=================================== USER-ADDRESS =====================================//

router.get('/address',addresscontroller.useraddress);
router.post('/addaddress',addresscontroller.addingAddress);

router.get('/editaddress',addresscontroller.editaddress);
router.delete('/deleteaddress',addresscontroller.deletingAddress)
router.post('/updatingaddress',addresscontroller.updatingaddress);
router.post('/addnewaddress',addresscontroller.addnewaddress)

//=================================== SHOP =====================================//
router.get('/shop',usercontroller.shop);
router.post('/pricesort',usercontroller.pricesort);
router.get('/categorysort',usercontroller.categorysort)
router.post('/sortproduct',usercontroller.sortproduct)


//=================================== COUPON =====================================//

router.post('/coupondata',couponcontroller.coupondata);
router.delete('/deletecoupon',couponcontroller.deletecoupon)

//=================================== LOGOUT =====================================//
router.get('/logout', auth.is_Login, usercontroller.logout);

//=================================== MODULE--EXPORTS =====================================//

module.exports = router;
   
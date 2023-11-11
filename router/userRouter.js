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

//=================================== SIGN-UP =====================================//

router.post  ('/show', auth.is_Logout,usercontroller.insertdata);
router.get('/signup', auth.is_Logout,usercontroller.sign);
router.post('/verifymail', auth.is_Logout, usercontroller.verifymail);
router.get('/resendotp',usercontroller.resendOTP);

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
router.post('/verify-payment',checkoutcontroller.verifypayment)
//=================================== PROFILE =====================================//

router.get('/profile',profileController.profile);
router.post('/newPassword',profileController.resetPassword);

//=================================== USER-ADDRESS =====================================//

router.get('/address',addresscontroller.useraddress);
router.post('/addaddress',addresscontroller.addingAddress);

router.get('/editaddress',addresscontroller.editaddress);
router.delete('/deleteaddress',addresscontroller.deletingAddress)
router.post('/updatingaddress',addresscontroller.updatingaddress);
router.post('/addnewaddress',addresscontroller.addnewaddress)

//=================================== SHOP =====================================//
router.get('/shop',usercontroller.shop)

//=================================== COUPON =====================================//

router.post('/coupondata',couponcontroller.coupondata);
router.delete('/deletecoupon',couponcontroller.deletecoupon)

//=================================== LOGOUT =====================================//

router.get('/logout', auth.is_Login, usercontroller.logout);

//=================================== MODULE--EXPORTS =====================================//

module.exports = router;
   

const express = require('express');
const router = express();
const session = require('express-session')
const adminController = require('../controllers/adminController');
const auth = require('../middleware/adminAuth');
const multer = require('../middleware/multer');
const path=require('path');
const { admin } = require('../controllers/userController');


router.set('view engine', 'ejs');
router.set('views','./views/admin');

router.use(session({
  secret:process.env.SESSIONSECRETKEY,
  resave:false,
  saveUninitialized:true

}));


//=================================== LOG-IN =====================================//

router.get('/',auth.checkadminisLogout,adminController.adminlogin);
router.post('/login',adminController.admin);

//=================================== USER-MANAGEMENT =====================================//

router.get('/usermanagement',auth.checkadminisLogin,adminController.usermanagement);
router.get('/admin/block-user',auth.checkadminisLogin,adminController.blockuser);

//=================================== PRODUCT-MANAGEMENT =====================================//

router.get('/productmanagement',auth.checkadminisLogin,adminController.productmanagement);
router.post('/productadd',auth.checkadminisLogin,multer.upload.array('image', 4),adminController.newproduct);
router.get('/addproduct',auth.checkadminisLogin,adminController.addproduct);
router.get('/delete/product',auth.checkadminisLogin,adminController.deleteproduct);
router.get('/edit/product',auth.checkadminisLogin,adminController.editproduct);
router.get('/list/product',auth.checkadminisLogin,adminController.listproduct);
router.post('/editingproduct',auth.checkadminisLogin,multer.upload.array('image', 4),adminController.editingproduct);
router.delete('/deleteproductimage',auth.checkadminisLogin,adminController.deleteproductimage)

//=================================== CATEGORY-MANAGEMENT =====================================//

router.get('/productcategory',auth.checkadminisLogin,auth.checkadminisLogin,adminController.productcategory);
router.get('/addcategory',auth.checkadminisLogin,adminController.addcategory);
router.post('/category',auth.checkadminisLogin,adminController.adddata);
router.get('/delete/category',auth.checkadminisLogin,adminController.deletecategory);
router.get('/block/category',auth.checkadminisLogin,adminController.blockcategory);



//=================================== ORDERS =====================================//

router.get('/orders',auth.checkadminisLogin,adminController.orders)
router.post('/cartstatus',auth.checkadminisLogin,adminController.cartstatus)
router.get('/orderdetails',auth.checkadminisLogin,adminController.orderdetails);
//=================================== DASHBOARD =====================================//

router.get('/dashboard',auth.checkadminisLogin,adminController.dashboard)

//=================================== SALESREPORT =====================================//

router.get('/salesreport',auth.checkadminisLogin,adminController.salesreport)
router.post('/salessort',auth.checkadminisLogin,adminController.salessort)
router.post('/downloadreport',auth.checkadminisLogin,adminController.downloadreport)

//=================================== COUPON =====================================//

router.get('/coupon',auth.checkadminisLogin,adminController.couponmanagement);
router.get('/addcoupon',auth.checkadminisLogin,adminController.addcoupon);
router.post('/coupondata',auth.checkadminisLogin,adminController.coupondata)
router.get('/editingcoupon',auth.checkadminisLogin,adminController.editingcoupon);
router.post('/editedcoupondata',auth.checkadminisLogin,adminController.editedcoupondata);
router.post('/block-unblockcoupon',auth.checkadminisLogin,adminController.blockunblockcoupon);
router.delete('/deletecoupon',auth.checkadminisLogin,adminController.deletecoupon)

//=================================== Offer management =====================================//

router.get('/offermanagement',auth.checkadminisLogin,adminController.offermanagement)
router.get('/addoffer',auth.checkadminisLogin,adminController.addoffer);
router.post('/offerdata',auth.checkadminisLogin,adminController.categoryofferdata);
router.get('/editoffer',auth.checkadminisLogin,adminController.editoffer);
router.post('/block-unblockoffer',auth.checkadminisLogin,adminController.blockunblockoffer);
router.delete('/deleteoffer',auth.checkadminisLogin,adminController.deleteoffer);
router.get('/productoffer',auth.checkadminisLogin,adminController.productoffer);
router.get('/addproductoffer',auth.checkadminisLogin,auth.checkadminisLogin,adminController.addproductoffer)
router.post('/productofferdata',auth.checkadminisLogin,adminController.productofferdata)
router.delete('/deleteproductoffer',auth.checkadminisLogin,adminController.deleteproductoffer)
router.post('/block-unblockproductoffer',auth.checkadminisLogin,adminController.blockunblockproductoffer)
router.get('/editproductoffer',auth.checkadminisLogin,adminController.editproductoffer)

//=================================== Banner-Management =====================================//

router.get('/banner',auth.checkadminisLogin,adminController.bannermanagement)
router.get('/addbanner',auth.checkadminisLogin,adminController.addbanner)
router.post('/bannerdata',auth.checkadminisLogin,multer.uploadbanner.single('image'),adminController.bannerdata);
router.post('/block-unblockbanner',auth.checkadminisLogin,adminController.blockunblockbanner);
router.delete('/deletebanner',auth.checkadminisLogin,adminController.deletebanner)
//=================================== LOG-OUT =====================================//
router.get('/logout',auth.checkadminisLogin,adminController.logout);

//=================================== MODULE--EXPORTS =====================================//

module.exports = router;

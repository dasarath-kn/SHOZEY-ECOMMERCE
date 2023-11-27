
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
router.get('/admin/block-user',adminController.blockuser);

//=================================== PRODUCT-MANAGEMENT =====================================//

router.get('/productmanagement',auth.checkadminisLogin,adminController.productmanagement);
router.post('/productadd',multer.upload.array('image', 4),adminController.newproduct);
router.get('/addproduct',adminController.addproduct);
router.get('/delete/product',adminController.deleteproduct);
router.get('/edit/product',adminController.editproduct);
router.get('/list/product',adminController.listproduct);
router.post('/editingproduct',multer.upload.array('image', 4),adminController.editingproduct);
router.delete('/deleteproductimage',adminController.deleteproductimage)

//=================================== CATEGORY-MANAGEMENT =====================================//

router.get('/productcategory',auth.checkadminisLogin,adminController.productcategory);
router.get('/addcategory',adminController.addcategory);
router.post('/category',adminController.adddata);
router.get('/delete/category',adminController.deletecategory);
router.get('/block/category',adminController.blockcategory);



//=================================== ORDERS =====================================//

router.get('/orders',auth.checkadminisLogin,adminController.orders)
router.post('/cartstatus',adminController.cartstatus)
router.get('/orderdetails',adminController.orderdetails);
//=================================== DASHBOARD =====================================//

router.get('/dashboard',auth.checkadminisLogin,adminController.dashboard)

//=================================== SALESREPORT =====================================//

router.get('/salesreport',auth.checkadminisLogin,adminController.salesreport)
router.post('/salessort',adminController.salessort)
router.post('/downloadreport',adminController.downloadreport)

//=================================== COUPON =====================================//

router.get('/coupon',auth.checkadminisLogin,adminController.couponmanagement);
router.get('/addcoupon',adminController.addcoupon);
router.post('/coupondata',adminController.coupondata)
router.get('/editingcoupon',adminController.editingcoupon);
router.post('/editedcoupondata',adminController.editedcoupondata);
router.post('/block-unblockcoupon',adminController.blockunblockcoupon);
router.delete('/deletecoupon',adminController.deletecoupon)

//=================================== Offer management =====================================//

router.get('/offermanagement',auth.checkadminisLogin,adminController.offermanagement)
router.get('/addoffer',adminController.addoffer);
router.post('/offerdata',adminController.categoryofferdata);
router.get('/editoffer',adminController.editoffer);
router.post('/block-unblockoffer',adminController.blockunblockoffer);
router.delete('/deleteoffer',adminController.deleteoffer);
router.get('/productoffer',adminController.productoffer);
router.get('/addproductoffer',auth.checkadminisLogin,adminController.addproductoffer)
router.post('/productofferdata',adminController.productofferdata)
router.delete('/deleteproductoffer',adminController.deleteproductoffer)
router.post('/block-unblockproductoffer',adminController.blockunblockproductoffer)
router.get('/editproductoffer',adminController.editproductoffer)

//=================================== Banner-Management =====================================//

router.get('/banner',adminController.bannermanagement)
router.get('/addbanner',adminController.addbanner)
router.post('/bannerdata',multer.uploadbanner.single('image'),adminController.bannerdata);
router.post('/block-unblockbanner',adminController.blockunblockbanner);
router.delete('/deletebanner',adminController.deletebanner)
//=================================== LOG-OUT =====================================//
router.get('/logout',auth.checkadminisLogin,adminController.logout);

//=================================== MODULE--EXPORTS =====================================//

module.exports = router;

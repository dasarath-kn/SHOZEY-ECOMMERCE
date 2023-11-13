
const express = require('express');
const router = express();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/adminAuth');
const multer = require('multer');
const path=require('path')

// const p=require('../public/productimages')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/productimages"));
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' + file.originalname);
    cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  },
});

const upload = multer({ storage: storage });

router.set('view engine', 'ejs');
router.set('views','./views/admin');



//=================================== LOG-IN =====================================//

router.get('/',auth.checkadminisLogout,adminController.adminlogin);
router.post('/login',auth.checkadminisLogout,adminController.admin);

//=================================== USER-MANAGEMENT =====================================//

router.get('/usermanagement',adminController.usermanagement);
router.get('/admin/block-user',adminController.blockuser);

//=================================== PRODUCT-MANAGEMENT =====================================//

router.get('/productmanagement',adminController.productmanagement);
router.post('/productadd',upload.array('image', 4),adminController.newproduct);
router.get('/addproduct',adminController.addproduct);
router.get('/delete/product',adminController.deleteproduct);
router.get('/edit/product',adminController.editproduct);
router.get('/list/product',adminController.listproduct);
router.post('/editingproduct',adminController.editingproduct)

//=================================== CATEGORY-MANAGEMENT =====================================//

router.get('/productcategory',adminController.productcategory);
router.get('/addcategory',adminController.addcategory);
router.post('/category',adminController.adddata);
router.get('/delete/category',adminController.deletecategory);
router.get('/block/category',adminController.blockcategory);



//=================================== ORDERS =====================================//

router.get('/orders',adminController.orders)
router.post('/cartstatus',adminController.cartstatus)
router.get('/orderdetails',adminController.orderdetails);

//=================================== DASHBOARD =====================================//

router.get('/dashboard',adminController.dashboard)

//=================================== SALESREPORT =====================================//

router.get('/salesreport',adminController.salesreport)
router.post('/salessort',adminController.salessort)

//=================================== COUPON =====================================//

router.get('/coupon',adminController.couponmanagement);
router.get('/addcoupon',adminController.addcoupon);
router.post('/coupondata',adminController.coupondata)
router.get('/editingcoupon',adminController.editingcoupon);
router.post('/editedcoupondata',adminController.editedcoupondata);
router.post('/block-unblockcoupon',adminController.blockunblockcoupon);
router.delete('/deletecoupon',adminController.deletecoupon)
//=================================== LOG-OUT =====================================//



router.get('/logout',auth.checkadminisLogin,adminController.logout);



//=================================== MODULE--EXPORTS =====================================//

module.exports = router;

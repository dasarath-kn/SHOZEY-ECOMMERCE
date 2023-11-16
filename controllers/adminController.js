const user = require('../models/userModel');
const category = require('../models/categoryModel');
const product = require('../models/productModel');
const order = require('../models/orderModel');
const coupon = require("../models/couponModel");
const Categoryoffer =require('../models/categoryofferModel')
// const { render } = require('ejs');
const sharp = require('sharp');
const { render } = require('../router/userRouter');
const data = {
    email: "admin@gmail.com",
    password: "12345"
}

//=================================== ADMIN LOGINPAGE =====================================//
const adminlogin = async (req, res) => {
    try {

        res.render('adminlogin');
    }
    catch (error) {
        console.log(error.message);
    }
}



//=================================== ADMIN LOGIN =====================================//
const admin = async (req, res) => {
    try {
        if (req.body.email == data.email && req.body.password == data.password) {
            req.session.adminId = data._id;
            res.redirect('/admin/usermanagement');
        }
        else if (req.body.email != data.email && req.body.password != data.password) {
            res.render('adminlogin', { error: "Invalid email & password" })


        }
        else {
            res.render("adminlogin", { error: "Invalid admin Details" });
        }

    }
    catch (error) {
        console.log(error.message);
    }
}


//=================================== USER MANAGEMENT =====================================//

const usermanagement = async (req, res) => {
    try {
        const data = await user.find();
        res.redirect('/admin/dashboard');
    }
    catch (error) {
        console.log(error.message);
    }
}

//===================================== USER BLOCK AND UN-BLOCK =======================================

const blockuser = async (req, res) => {
    const userId = req.query.id;
    try {

        const data = await user.findOne({ _id: userId });

        if (data.status == 1) {
            await user.findByIdAndUpdate(userId, { status: 0 })
            res.redirect('/admin/usermanagement');
        }

        else {
            await user.findByIdAndUpdate(userId, { status: 1 })
            res.redirect('/admin/usermanagement');
        }

    }
    catch (error) {
        console.log(error.message);
    }
}
//=================================== PRODUCT MANAGEMENT =====================================//
const productmanagement = async (req, res) => {
    try {
        const data = await product.find();

        res.render('productmanagement', { data })
    }
    catch (error) {
        console.log(error.message);
    }
}
//=================================== DELETING PRODUCT =====================================//

const deleteproduct = async (req, res) => {
    try {

        const deleteid = req.query.id

        await product.deleteOne({ _id: deleteid });
        res.redirect('/admin/productmanagement');

    }
    catch (error) {
        console.log(error.message);
    }
}
//=================================== EDITING PRODUCT =====================================//

const editproduct = async (req, res) => {
    try {
        const editid = req.query.id
        const item = await product.findOne({ _id: editid })
        // console.log(items);
        const categorydata = await category.find()

        res.render('editproduct', { item ,categorydata});

    }
    catch (error) {
        console.log(error.message);

    }
}

const editingproduct = async (req, res) => {
    try {
        const editid = req.query.id;
        console.log(editid);
        await product.updateOne({ _id: editid }, {
            $set: {
                productname: req.body.product,
                quantity: req.body.quantity,
                price: req.body.price,
                category: req.body.category,
                description: req.body.description
            }
        })
        res.redirect('/admin/productmanagement');

    } catch (error) {
        console.log(error.message);
    }
}
//=================================== LIST PRODUCT=====================================//
const listproduct = async (req, res) => {
    const item = req.query.id
    try {
        const data = await product.findOne({ _id: item })

        if (data.status == 0) {
            await product.findByIdAndUpdate(item, { status: 1 });
            res.redirect('/admin/productmanagement');
        } else {
            await product.findByIdAndUpdate(item, { status: 0 })
            res.redirect('/admin/productmanagement')
        }
    }
    catch (error) {
        console.log(error.message);
    }

}
//=================================== PRODUCT CATEGORY =====================================//

const productcategory = async (req, res) => {
    try {
        const data = await category.find();

        res.render('productcategory', { data });
    }
    catch (error) {
        console.log(error.message);
    }
}

//=================================== ADD CATEGORY =====================================//
const addcategory = async (req, res) => {
    try {
        res.render('addcategory');
    }
    catch (error) {
        console.log(error.message);
    }
}
//=================================== ADDING CATEGORY TO THE PRODUCT CATEGORY  =====================================//
const adddata = async (req, res) => {
    try {
        const categoryname = req.body.category;
        console.log(categoryname);
        const cat = await category.findOne({ productcategory:{$regex:new RegExp(categoryname, 'i')} });
        console.log(cat);
        if (cat) {
            // res.redirect('/admin/productcategory');
            res.json({result:false})
        } else {
            const data = new category({
                productcategory: categoryname,
                status: 0
            });

            await data.save();
            res.json({result:true});
        }
    } catch (error) {
        console.log(error.message);

    }
}

//=================================== DELETING CATEGORY =====================================//

const deletecategory = async (req, res) => {
    try {
        const deleteId = req.query.id

        await category.deleteOne({ _id: deleteId })
        res.redirect('/admin/productcategory');
    }
    catch (error) {
        console.log(error.message);
    }
}
//=================================== BLOCK AND UNBLOCK CATEGORY =====================================//
const blockcategory = async (req, res) => {
    try {
        const blockId = req.query.id;
        console.log(blockId);
        const statusdata = await category.findOne({ _id: blockId })
        console.log("data", statusdata.status);
        if (statusdata.status == 0) {
            await category.findByIdAndUpdate(blockId, { status: 1 })
            res.redirect('/admin/productcategory');
        } else {
            await category.findByIdAndUpdate(blockId, { status: 0 });
            res.redirect('/admin/productcategory');

        }
    }
    catch (error) {
        console.log(error.message);
    }
}

//=================================== ADD PRODUCT =====================================//
const addproduct = async (req, res) => {
    try {
        const data = await category.find();


        res.render('addproduct', { data })

    }
    catch (error) {
        console.log(error.message);
    }
}
//=================================== ADDiING NEW PRODUCT =====================================//
const newproduct = async (req, res) => {
    try {
        const data = new product({
            productname: req.body.product,
            quantity: req.body.quantity,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            //   image:req.files.image,
            // status:0

        })
        data.image = req.files.map((file) => file.filename);
        const item = await data.save();
        for (let i = 0; i < req.files.length; i++) {
            await sharp("public/productimages/" + req.files[i].filename).resize(800, 800).toFile("public/sharpedimages/" + req.files[i].filename);
        }

        console.log(item);
        if (item) {
            res.redirect('/admin/productmanagement');
        }
        else {
            console.log("Failed upload");
        }

    }
    catch (error) {
        console.log(error.message);
    }
}

//=================================== ORDERS =====================================//
const orders = async (req, res) => {
    try {
        const id = req.query.id;
        const orderdata = await order.find().sort({ purchaseDate: -1 })
        var count = 0

        for (let i = 0; i < orderdata.length; i++) {
            const item = orderdata[i].items
            const updateid = orderdata[i]._id
            console.log(updateid);
            if (orderdata[i].status == "delivered") {
                console.log("Status Already delivered");
            }
            else {
                for (let i = 0; i < item.length; i++) {
                    if (item[i].status == "delivered") {
                        count++;
                    }

                }

                if (count == item.length) {
                    const value = await order.updateOne({ _id: updateid }, { $set: { status: "delivered" } })
                    console.log(value);
                }

                else {
                    console.log("Both of the status is not delivered");
                }
            }
        }

        res.render('orders', { orderdata });

    } catch (error) {
        console.log(error.message);

    }

}

const cartstatus = async (req, res) => {
    try {
        const id = req.body.id
        const datas = req.body.data
        const productid = req.body.product

        await order.updateOne({ _id: id, "items.productid": productid }, { $set: { 'items.$.status': datas } })
        console.log("ugygu");
        res.json({ result: true })

    } catch (error) {
        console.log(error.message);
    }
}
//=================================== ORDERS  DETAILS =====================================//

const orderdetails = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);
        const orderdata = await order.find({_id:id}).populate("items.productid");
        
        //  const cartdata = await cart.findOne({userid:id,"items.productid":productid});
        console.log(orderdata);
        res.render('orderdetails', { orderdata, id });
    } catch (error) {
        console.log(error.message);

    }
}

//=================================== DASHBOARD =====================================//

const dashboard = async (req, res) => {
    try {
        const orders = await order.find().sort({ purchaseDate: -1 }).populate("items.productid");
        const customer = await user.find().count();
        const ordercount = await order.find().count();
        const cancelledorders = await order.find({ status: 'cancelled' }).count();
        const orderdata = await order.aggregate([{ $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }])
        const data = orderdata[0].total
        const cod = await order.aggregate([{ $match: { status: 'delivered', paymentMethod: 'Cash on delivery' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])
        const codtotal = cod[0].total

        const totalcodorder = await order.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: null, total: { $sum: 1 } } }])
        const value = totalcodorder[0].total

        const totalstock = await product.aggregate([{ $group: { _id: null, total: { $sum: "$quantity" } } }])
        const stock = totalstock[0].total

        const codtotalcount = await order.aggregate([{ $match: { status: 'delivered', paymentMethod: 'Cash on delivery' } }, { $group: { _id: null, total: { $sum: 1 } } }])
        const codcount = codtotalcount[0].total

        const onlinetotalcount = await order.aggregate([{ $match: { paymentMethod: 'Online Payment', status: 'delivered' } }, { $group: { _id: null, total: { $sum: 1 } } }])
        const onlinecount = onlinetotalcount[0].total

        const online = await order.aggregate([{ $match: { status: 'delivered', paymentMethod: 'Online Payment' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])
        const onlinetotal = online[0].total

        res.render('dashboard', {
            orders,
            data,
            value,
            stock,
            codcount,
            onlinecount,
            codtotal,
            onlinetotal,
            customer,
            ordercount,
            cancelledorders
        })
    } catch (error) {
        console.log(error.message);
    }
}

//=================================== SALESREPORT =====================================//

const salesreport = async (req, res) => {
    try {
        var data = []
        var k = 0
        const orderdata = await order.find().populate('items.productid').sort({ purchaseDate: -1 })
        // const orderproducts = await order.aggregate([{$project:{"items.productid":productname}}]).populate("items.productid")
        // console.log(orderproducts);
        const week1 = await order.find({ status: "delivered" }).count()
        console.log(week1);

        console.log(data);
        res.render('salesreport', { orderdata, week1 })
    } catch (error) {
        console.log(error.message);
    }
}

const salessort = async (req, res) => {
    try {
        const datestart = req.body.datestart
        const dateend = req.body.dateend
        console.log(datestart + "dfdffd", dateend + "errereerre");
        const isoDate1 = new Date(datestart)
        const isoDate2 = new Date(dateend);

        const orderdata = await order.find({ purchaseDate: { $gte: isoDate1, $lte: isoDate2 } })
        const week1 = await order.find({ status: "delivered" }).count()
        console.log(week1);

        console.log(orderdata);
        res.render('salesreport', { orderdata, week1 })
        // console.log(data);
        // console.log(isoDate);

    } catch (error) {
        console.log(error.message);
    }
}

//=================================== COUPON =====================================//

const couponmanagement = async (req, res) => {
    try {
        const coupondata = await coupon.find()
        res.render('coupon', { coupondata });
    } catch (error) {
        console.log(error.message);
    }
}


const addcoupon = async (req, res) => {
    try {
        res.render('addcoupon')

    } catch (error) {
        console.log(error.message);
    }
}

const coupondata = async (req, res) => {
    try {

        const data = new coupon({
            couponname: req.body.couponname,
            couponcode: req.body.couponcode,
            discountamount: req.body.discountamount,
            activationdate: req.body.activationdate,
            expirydate: req.body.expirydate,
            criteriaamount: req.body.criteriaamount,
            userslimit: req.body.userslimit,
            description: req.body.description

        })
        await data.save()
        console.log(data);
        res.redirect('/admin/coupon')

    } catch (error) {
        console.log(error.message);
    }
}

const editingcoupon = async (req, res) => {
    try {
        const id = req.query.id
        const coupondata = await coupon.findOne({ _id: id });

        res.render('editcoupon', { coupondata })

    } catch (error) {
        console.log(error.message);
    }

}

const editedcoupondata = async (req, res) => {
    try {
        const id = req.query.id

        await coupon.updateOne({ _id: id }, {
            $set: {
                couponname: req.body.couponname,
                couponcode: req.body.couponcode,
                discountamount: req.body.discountamount,
                activationdate: req.body.activationdate,
                expirydate: req.body.expirydate,
                criteriaamount: req.body.criteriaamount,
                userslimit: req.body.userslimit,
                description: req.body.description
            }
        })
        res.redirect('/admin/coupon')


    } catch (error) {
        console.log(error.message);
    }
}

const blockunblockcoupon = async(req,res)=>{
    try {
        const id=req.body.id
        const couponid = req.body.couponid
        console.log(couponid,id);
        if(id==1){
            await coupon.updateOne({_id:couponid},{$set:{status:1}});
            res.json({result:true})
        }else{
            await coupon.updateOne({_id:couponid},{$set:{status:0}})
            res.json({result:true})
        }
    } catch (error) {
        console.log(error.message);
        
    }
}

const deletecoupon = async(req,res)=>{
    try {
        const id = req.body.id
        console.log(id);
        await coupon.deleteOne({_id:id})
        res.json({result:true})

    } catch (error) {
        console.log(error.message);
    }
}

//=================================== LOGOUT =====================================//
const logout = async (req, res) => {
    try {
        req.session.adminId = false;
        res.render('adminlogin')


    }
    catch (error) {
        console.log(error.message);
    }
}


const offermanagement = async(req,res)=>{
    try {
        const categoryofferdata = await Categoryoffer.find();
        console.log(categoryofferdata);
       res.render('offermanagement',{categoryofferdata})
        
    } catch (error) {
        console.log(error.message);
    }
}

const addoffer = async(req,res)=>{
    try {
        const categorydata = await category.find()
        res.render('addoffer',{categorydata});
    } catch (error) {
     console.log(error.message);   
    }
} 

const categoryofferdata = async(req,res)=>{
    try {
        const categoryname =req.body.categoryname;
        const startdate = req.body.startingdate;
        const enddate = req.body.expirydate;
        const offerpercentage = req.body.offerpercentage;
         console.log(categoryname,startdate,enddate,offerpercentage);
        const categorydata = new Categoryoffer({
            categoryname:categoryname,
            startingdate:startdate,
            expirydate:enddate,
            Offerpercentage:offerpercentage
        })
        const value = await  categorydata.save();
        const productcategorycount = await product.find({category:categoryname})
        
        for(let i=0 ;i<productcategorycount.length;i++){
            const reducedamount = (productcategorycount[i].price*offerpercentage)/100;
        //    const discountamount = productcategorycount[i].price-reducedamount;
            const productid =  productcategorycount[i]._id
           console.log(productid);
             await product.updateOne({_id:productid},{$set:{discountamount:productcategorycount[i].price-reducedamount,Offerpercentage:offerpercentage}},{upsert:true})
            
          
          
        }
     res.redirect('/admin/offermanagement');

    } catch (error) {
        console.log(error.message);
    }
} 

module.exports = {
    adminlogin,
    admin,
    logout,
    usermanagement,
    productmanagement,
    blockuser,
    productcategory,
    addcategory,
    adddata,
    deletecategory,
    blockcategory,
    addproduct,
    newproduct,
    deleteproduct,
    editproduct,
    listproduct,
    editingproduct,
    orders,
    cartstatus,
    orderdetails,
    dashboard,
    salesreport,
    salessort,
    couponmanagement,
    addcoupon,
    coupondata,
    editingcoupon,
    editedcoupondata,
    blockunblockcoupon,
    deletecoupon,
    offermanagement,
    addoffer,
    categoryofferdata
}
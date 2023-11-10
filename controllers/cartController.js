const user = require('../models/userModel');
const product = require('../models/productModel');
const cart = require('../models/cartModel');
const coupon = require('../models/couponModel');

//=================================== CART-MANAGEMENT =====================================//
const cartRendering = async (req, res) => {


    try {
        const coupondata = await coupon.find()
        const id = req.session.userId;
        const data = await cart.find({ userid: id });
        const total = await cart.findOne({ userid: id }).populate('items.total');
        const standard = 49
        const express = 99
        const datatotal = total.items.map((item) => {
            return item.total * item.count;
        });

        let totalsum = 0;
        if (datatotal.length > 0) {
            totalsum = datatotal.reduce((x, y) => {
                return x + y;
            });
        }

        const cartdata = await cart.find({ userid: id }).populate("items.productid");

        if (data) {
            res.render('cart', { user: req.session.name, cartdata, data, id, totalsum, express, standard, coupondata });
        } else {
            console.log("Your cart is empty.");
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
//=================================== ADDING TO CART =====================================//


const cartAdding = async (req, res) => {
    try {


        const id = req.session.userId
        const productid = req.body.id

        const data = await product.findOne({ _id: productid });
        const cartdata = await cart.findOne({ userid: id, "items.productid": productid });


        if (id) {

            if (data.quantity > 1) {

                if (cartdata) {
                    const cartitems = await cart.findOne({ userid: id, 'items.productid': productid }, { 'items.$': 1 })
                    const count = cartitems.items[0].count

                    if (data.quantity > count) {
                        console.log("Existing data on cart");
                        await cart.updateOne(
                            { userid: id, "items.productid": productid },
                            { $inc: { "items.$.count": 1 } }
                        );
                        console.log("Cart product count increased");
                        res.json({ count: true })
                    }
                    else {
                        res.json({ result: false })
                    }

                }
                else {

                    const cartitems = {
                        productid: data._id,
                        count: 1,
                        total: data.price
                    }

                    await cart.findOneAndUpdate({ userid: id }, { $set: { userid: id }, $push: { items: cartitems } }, { upsert: true, new: true });

                    console.log('product added to the cart')
                    res.json({ result: true })

                }
            }
            else {
                res.json({ result: false })
            }

        }
        else {
            console.log("Login required");
        }
    }
    catch (error) {
        console.log(error.message);

    }
}

//=================================== ADDING THE COUNT  OF THE PRODUCT =====================================//

const AddingProductCount = async (req, res) => {
    try {

        const productid = req.body.id;
        const id = req.session.userId
        const val = req.body.val
        const data = await product.findOne({ _id: productid })
        console.log(productid);
        const cartitems = await cart.findOne({ userid: id, 'items.productid': productid }, { 'items.$': 1 })
        const count = cartitems.items[0].count
        console.log(count);

        if (data.quantity > 0) {
            if (val == 1) {
                if (data.quantity > count) {
                    await cart.updateOne(
                        { userid: id, "items.productid": productid },
                        { $inc: { "items.$.count": 1 } });
                    console.log("count increased");

                    res.json({ result: true });

                }
                else {
                    res.json({ result: false })
                }
            }

            else if (val == -1) {
                if (count > 1) {
                    await cart.updateOne(
                        { userid: id, "items.productid": productid },
                        { $inc: { "items.$.count": -1 } });
                    console.log("count decreased");

                    res.json({ result: true })
                }
                else {
                    console.log("Count 1 is fixed");
                }

            }

        }


    } catch (error) {
        console.log(error.message);

    }
}



//=================================== DELETE THE PRODUCT =====================================//

const deleteCartItems = async (req, res) => {
    try {
        console.log("eiooijoewj");
        const id = req.query.id
        const sessionid = req.session.userId;

        const data = await cart.updateOne({ userid: sessionid }, { $pull: { items: { productid: id } } });
        console.log(data);
        if (data) {
            res.redirect('/cart');
        }
        else {
            console.log("error");
        }

    } catch (error) {
        console.log(error.message);

    }
}

module.exports = {
    cartAdding,
    cartRendering,
    AddingProductCount,
    deleteCartItems
}
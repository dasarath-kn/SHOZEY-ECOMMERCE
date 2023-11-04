const mongoose = require('mongoose');

const cartdata = mongoose.Schema({
    userid:{
        type:String,
        required:true,
        ref:"user"
    },
    items:[{
        productid:{
            type:String,
            required:true,
            ref:"product"
        },
        count:{
            type:Number,
            default:1
        },
        total:{
            type:Number,
            default:0
        },
    }]

    
});

module.exports = mongoose.model('cart',cartdata);
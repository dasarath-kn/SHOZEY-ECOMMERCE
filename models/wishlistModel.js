const mongoose = require('mongoose')

const data = new mongoose.Schema({
    userid:{
        type:String,
        required:true,
        ref:"user"
    },
    productid:{
        type:Array,
        required:true,
        ref:"product"
    }
})

module.exports = mongoose.model('wishlist',data)
const mongoose = require('mongoose');
const data = new mongoose.Schema({
    orderid:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    productid:{
        type:String,
        required:true
    },reason:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('return',data);
const mongoose= require('mongoose');
const offerdata = new mongoose.Schema({
    productname:{
        type:String,
        required:true,
        ref:'product'
    },
    startingdate:{
        type:Date,
        required:true
    },
    expirydate:{
        type:Date,
        required:true
    },
    Offerpercentage:{
        type:Number,
        required:true

    },
    status:{
        type:Number,
        default:0
    }  
})

module.exports = mongoose.model('productoffer',offerdata)
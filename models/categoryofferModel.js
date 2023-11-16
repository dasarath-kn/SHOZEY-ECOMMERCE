const mongoose= require('mongoose');
const categorydata= new mongoose.Schema({
    categoryname:{
        type:String,
        required:true
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

module.exports =mongoose.model('categoryoffer',categorydata)
const mongoose = require('mongoose');
const bannerdata = new mongoose.Schema({
    bannername:{
        type:String,
        required:true
    },
    bannerimage:{
        type:Array,
        required:true
    },
    status:{
        type:Number,
        default:0
    }
})


module.exports = mongoose.model('banner',bannerdata)
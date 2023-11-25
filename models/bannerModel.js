const mongoose = require('mongoose');
const bannerdata = new mongoose.Schema({
    bannername:{
        type:String,
        required:true
    },
    bannerimage:{
        type:Array,
        required:true
    }
})


module.exports = mongoose.model('banner',bannerdata)
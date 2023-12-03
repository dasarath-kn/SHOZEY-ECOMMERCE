const mongoose=require('mongoose');
const productcategory= new mongoose.Schema({
    productcategory:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        required:true
    },
    salescount:{
        type:Number,
        default:0
    }


})

module.exports=mongoose.model('category',productcategory);
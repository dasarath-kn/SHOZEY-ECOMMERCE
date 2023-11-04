const mongoose=require('mongoose');
const productcategory= new mongoose.Schema({
    productcategory:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        required:true
    }


})

module.exports=mongoose.model('category',productcategory);
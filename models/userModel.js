const mongoose = require("mongoose");
const users = new mongoose.Schema({
    firstname: {
        type: String, 
        required: true,
    },
    lastname:{
        type: String,
        required:true
    },
    email: {
        type: String, 
        required: true,
    },
    phonenumber:{
        type:Number,
        required:true
    },
    password: {
        type: String, 
        required: true,
    },
    is_verified:{
        type: Number,
        default:0
    },status:{
        type: Number,
        required:true
    },
    refercode:{
        type:String

    }
})



module.exports = mongoose.model("user", users);
// module.exports=mongoose.model('category',productcategory);
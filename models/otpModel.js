const mongoose = require("mongoose")

const data = mongoose.Schema({
    email:{
        type:String,
       
    },
    otp:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('otp',data);
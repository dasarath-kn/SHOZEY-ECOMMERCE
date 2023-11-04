const mongoose = require('mongoose')

const useraddress = {
    userId:{
        type:String,
        required:true
    },
    userdata:[{
        name:{
            type:String,
            required:true,
            trim:true
        },
        phonenumber:{
            type:Number,
            required:true,
            trim:true
        },
        address:{
            type:String,
            required:true,
            trim:true
        },
        city:{
            type:String,
            required:true,
            trim:true
        },
        state:{
            type:String,
            required:true,
            trim:true
        },
        country:{
            type:String,
            required:true,
            trim:true
        },
        pincode:{
            type:Number,
            required:true,
            trim:true
        }

    }]
}

module.exports= mongoose.model('address',useraddress);
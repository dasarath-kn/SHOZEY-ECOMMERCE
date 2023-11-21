const mongoose=require('mongoose')
const product=  mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
        price:{
            type:Number,
            required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        required:true

    },
    status:{
        type:Number,
        default:0
    },
    discountamount:{
        type:Number
       

    },
    Offerpercentage:{
        type:Number
        
    },
    offername:{
        type:String
    },
    offerstatus:{
        type:Number,
        default:0
    }

   
})
module.exports = mongoose.model('product',product);
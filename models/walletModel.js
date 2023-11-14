const mongoose =require('mongoose');

const walletdata = new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        
    },
    items:[{
        date:{
            type:Date  
        },
        amount:{
            type:Number   
        },
        type:{
            type:String
        },
        referaluser:{
            type:String,
            ref:'user'
        }
    }]
})

module.exports =mongoose.model('wallet',walletdata)
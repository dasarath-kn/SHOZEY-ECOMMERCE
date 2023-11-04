const mongoose = require('mongoose')
let dotenv = require('dotenv')
dotenv.config();
module.exports ={

mongoDB:()=>{
mongoose.connect(process.env.MONGODBKEY)
    .then(() => {
        console.log("Mongodb connected");
    })
    .catch(() => {
        console.log("Failed to connect");
    });
}
}
const Mongodb = require('./config/mongodb');
Mongodb.mongoDB()

const express = require("express");
const app = express();
const path = require('path');
const loginRouter = require('./router/userRouter');
const adminRouter=require('./router/adminRouter');
const nocache=require('nocache');
const createError = require('http-errors'); 
const session=require('express-session');
require('dotenv').config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(nocache())

app.set('view engine', 'ejs');
app.set('views','./views');



app.use('/', loginRouter);
 app.use('/admin',adminRouter);
app.use(async(req,res)=>{
    res.render(__dirname+'/views/user/404.ejs')
})
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

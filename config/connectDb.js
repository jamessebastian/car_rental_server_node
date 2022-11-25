const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
 const connectDB = async () => {
     try {
         await mongoose.connect(process.env.DATABASE_CONN,{useNewUrlParser:true,useUnifiedTopology:true});
         console.log('database connection');
         
     } catch (error) {
         console.log('Unable to connect');
     }

 }

 module.exports = connectDB;
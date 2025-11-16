const mongoose = require('mongoose')

const connectDB = ()=>{
  try {
    mongoose.connect(process.env.DB_URL)
    console.log('MongoDB Connected successfully!');
    
  } catch (error) {
    console.log(error);
    
  }
}

module.exports = connectDB;
const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();


const server = app.listen(process.env.PORT,()=>{
  console.log(`Working to port :${process.env.PORT} in ${process.env.NODE_ENV}`);
  connectDB();
})

process.on('unhandledRejection',(err)=>{
  console.log(`Error : ${err.message}`);
  console.log('Shut down the server');
  server.close(()=>{
    process.exit(1);
  })
})


process.on('uncaughtException',(err)=>{
  console.log(`Error : ${err.message}`);
  console.log('Shut down the server');
  server.close(()=>{
    process.exit(1);
  })
})


const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB BEFORE starting server
connectDB();

// Render requires a fallback port
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Working to port : ${PORT} in ${process.env.NODE_ENV}`);
});

// Handle Promise Rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error : ${err.message}`);
  console.log('Shutting down server due to unhandled promise rejection');
  server.close(() => process.exit(1));
});

// Handle Sync Errors
process.on('uncaughtException', (err) => {
  console.log(`Error : ${err.message}`);
  console.log('Shutting down server due to uncaught exception');
  server.close(() => process.exit(1));
});

const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB BEFORE starting server
connectDB();

// Render requires a fallback port
const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT} in ${process.env.NODE_ENV}`);
});

// Handle Promise Rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down server due to Unhandled Promise Rejection');
  server.close(() => process.exit(1));
});

// Handle Sync Errors
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down server due to Uncaught Exception');
  server.close(() => process.exit(1));
});

// Load environment variables from .env file into process.env
require('dotenv').config();

// Import the express application framework
const express = require('express');
// Import mongoose to configure connections to MongoDB
const mongoose = require('mongoose');
// Import cors to enable Cross-Origin Resource Sharing
const cors = require('cors');
// Import morgan HTTP request logger middleware
const morgan = require('morgan');

// Import routing modules
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urls');
const analyticsRoutes = require('./routes/analytics');
const redirectRoute = require('./routes/redirect');

// Instantiate the Express application
const app = express();

// Configure CORS middleware, allowing origins matching the FRONTEND_URL env value
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Use express.json() middleware to automatically parse incoming request bodies as JSON
app.use(express.json());

// Use morgan middleware to log HTTP request traces in development style
app.use(morgan('dev'));

// Connect to the MongoDB database using the MONGO_URI string
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // Log connection confirmation upon successful authentication
    console.log('Successfully connected to MongoDB database.');
  })
  .catch((err) => {
    // Log database connection failure details
    console.error('Database connection error:', err.message);
    // Exit application with code 1 indicating failure
    process.exit(1);
  });

// Mount user authentication routes under /api/auth path prefix
app.use('/api/auth', authRoutes);

// Mount URL resource management routes under /api/urls path prefix
app.use('/api/urls', urlRoutes);

// Mount analytics data routes under /api/analytics path prefix
app.use('/api/analytics', analyticsRoutes);

// Mount short URL redirection router at root level (MUST BE LAST to prevent routing collisions)
app.use('/', redirectRoute);

// Global express error handler middleware to intercept unexpected failures in the stack
app.use((err, req, res, next) => {
  // Log the complete error stack details in the terminal console
  console.error(err.stack);

  // Determine appropriate HTTP status code (default to 500 Server Error if unspecified)
  const statusCode = err.status || 500;

  // Return formatted JSON failure response back to the client
  return res.status(statusCode).json({
    success: false,
    data: null,
    message: err.message || 'An unexpected server error occurred',
    error: err.message || 'Internal Server Error'
  });
});

// Determine active port from environment config or fallback to default 5000
const PORT = process.env.PORT || 5000;

// Start listening for network traffic on the specified port
app.listen(PORT, () => {
  // Log server operations info
  console.log(`Server is running on port ${PORT}`);
});

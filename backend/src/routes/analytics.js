// Import the express package to set up the router
const express = require('express');
// Create a new router instance for analytics endpoints
const router = express.Router();
// Import the analytics controller containing HTTP handlers
const analyticsController = require('../controllers/analyticsController');
// Import authorization middleware to protect the analytics route
const authMiddleware = require('../middleware/auth');

// Secure all endpoints in this router using the authMiddleware
router.use(authMiddleware);

// Define route to fetch analytics details for a shortCode (e.g. GET /api/analytics/abc1234)
router.get('/:shortCode', analyticsController.getAnalytics);

// Export the analytics router to be mounted in server.js
module.exports = router;

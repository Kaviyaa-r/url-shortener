// Import the express package to set up the router
const express = require('express');
// Create a new router instance for authentication endpoints
const router = express.Router();
// Import the body validation method from express-validator
const { body } = require('express-validator');
// Import the authentication controller containing signup and login handlers
const authController = require('../controllers/authController');

// Define route for user registration (Signup) with input validations
router.post(
  '/signup',
  [
    // Validate that the name field exists, is not empty, and has at least 2 characters
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    // Validate that the email field exists and conforms to a standard email pattern
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email address'),
    // Validate that the password field exists and contains at least 6 characters
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  // Controller function executed after validations are attached to the request
  authController.signup
);

// Define route for user login with input validations
router.post(
  '/login',
  [
    // Validate that the email field exists, is not empty, and is a valid email
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email address'),
    // Validate that the password field exists and is not empty
    body('password')
      .notEmpty().withMessage('Password is required')
  ],
  // Controller function executed after validations are attached to the request
  authController.login
);

// Export the authentication router to be mounted in server.js
module.exports = router;

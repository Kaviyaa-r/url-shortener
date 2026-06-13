// Import the User mongoose model
const User = require('../models/User');
// Import jwt for creating session tokens
const jwt = require('jsonwebtoken');
// Import validationResult to process express-validator checks
const { validationResult } = require('express-validator');

// Controller handling new user registration
exports.signup = async (req, res, next) => {
  // Capture express-validator validation errors from the request
  const errors = validationResult(req);
  // If validation errors are present, abort and return a 400 response
  if (!errors.isEmpty()) {
    // Extract the first error message to present to the user
    const firstErrorMessage = errors.array()[0].msg;
    // Return structured failure response with validation error details
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Validation failed',
      error: firstErrorMessage
    });
  }

  // Extract name, email, and password from the request body
  const { name, email, password } = req.body;

  try {
    // Check if a user with the provided email address already exists in the database
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    // If the email is already registered, reject the signup attempt
    if (existingUser) {
      // Return a 400 Bad Request error indicating the email is taken
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Email address already registered',
        error: 'Email already exists'
      });
    }

    // Create a new instance of the User model
    const newUser = new User({
      name,
      email,
      password
    });

    // Save the user document to the MongoDB database (pre-save hook hashes the password)
    await newUser.save();

    // Generate a JWT token containing user id, email, and name (expires in 7 days)
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Format user response object to omit sensitive metadata or hidden passwords
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    };

    // Return a 201 Created success response containing the session token and user info
    return res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token: token
      },
      message: 'Account created successfully',
      error: null
    });
  } catch (error) {
    // Forward any server error to the global Express error handler
    next(error);
  }
};

// Controller handling user authentication (login)
exports.login = async (req, res, next) => {
  // Capture express-validator validation errors from the request
  const errors = validationResult(req);
  // If validation errors are present, abort and return a 400 response
  if (!errors.isEmpty()) {
    // Extract the first error message to present to the user
    const firstErrorMessage = errors.array()[0].msg;
    // Return structured failure response with validation error details
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Validation failed',
      error: firstErrorMessage
    });
  }

  // Extract email and password from the request body
  const { email, password } = req.body;

  try {
    // Find the user by email, explicitly requesting the password field (since select is false)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    // If the user does not exist in our database, return a 401 Unauthorized error
    if (!user) {
      // Return standardized 401 credentials mismatch error response
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password',
        error: 'Invalid credentials'
      });
    }

    // Compare the candidate password with the stored hashed password using User instance method
    const isMatch = await user.comparePassword(password);
    // If the passwords do not match, reject the request with a 401 status
    if (!isMatch) {
      // Return standardized 401 credentials mismatch error response
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password',
        error: 'Invalid credentials'
      });
    }

    // Generate a JWT token containing user id, email, and name (expires in 7 days)
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Format user response object to exclude the password field
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    // Return a 200 OK success response containing the session token and user info
    return res.status(200).json({
      success: true,
      data: {
        user: userResponse,
        token: token
      },
      message: 'Login successful',
      error: null
    });
  } catch (error) {
    // Forward any server error to the global Express error handler
    next(error);
  }
};

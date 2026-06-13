// Import the jsonwebtoken library to verify the authenticity of incoming tokens
const jwt = require('jsonwebtoken');

// Define the middleware function to authenticate user requests via JWT
module.exports = (req, res, next) => {
  // Retrieve the Authorization header value from the incoming request headers
  const authHeader = req.headers['authorization'];

  // Check if the Authorization header is completely missing from the request
  if (!authHeader) {
    // Return a 401 Unauthorized response structured with success, data, message, and error
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Access denied. No authorization header provided.',
      error: 'Unauthorized'
    });
  }

  // Check if the Authorization header does not start with the 'Bearer ' prefix
  if (!authHeader.startsWith('Bearer ')) {
    // Return a 401 Unauthorized response specifying the invalid format of the header
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Access denied. Invalid token format. Must be Bearer <token>.',
      error: 'Unauthorized'
    });
  }

  // Split the authorization header string by space to isolate the token value
  const parts = authHeader.split(' ');
  // Extract the token string which sits at the second index of the split array
  const token = parts[1];

  // Check if the extracted token string is undefined, null, or empty
  if (!token) {
    // Return a 401 Unauthorized response indicating the token value is missing
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Access denied. Token is missing.',
      error: 'Unauthorized'
    });
  }

  try {
    // Verify the token using the secret key from the environmental variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded token payload to the request object under req.user
    req.user = decoded;
    // Invoke the next middleware function in the request handling pipeline
    next();
  } catch (error) {
    // Check if the validation failed specifically because the JWT has expired
    if (error.name === 'TokenExpiredError') {
      // Return a 401 response explaining that the session has timed out
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Access denied. Token has expired.',
        error: 'Unauthorized'
      });
    }
    // Return a 401 response for any other general validation failures (e.g. invalid signature)
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Access denied. Invalid signature or malformed token.',
      error: 'Unauthorized'
    });
  }
};

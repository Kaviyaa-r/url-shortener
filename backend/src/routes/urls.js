// Import the express package to set up the router
const express = require('express');
// Create a new router instance for URL-related endpoints
const router = express.Router();
// Import body parameter validation check from express-validator
const { body } = require('express-validator');
// Import the URL controller containing HTTP handlers
const urlController = require('../controllers/urlController');
// Import authorization middleware to secure the URL endpoints
const authMiddleware = require('../middleware/auth');

// Mount the authorization middleware on all routes defined in this router
router.use(authMiddleware);

// Define route to create a new shortened URL
router.post(
  '/',
  [
    // Validate that originalUrl is present and is structured as a valid URL format
    body('originalUrl')
      .trim()
      .notEmpty().withMessage('Original URL is required')
      .isURL().withMessage('Please enter a valid URL format (e.g. https://google.com)'),
    // If a custom alias is provided, ensure it is alphanumeric or hyphens (optional check for clean codes)
    body('customAlias')
      .optional({ checkFalsy: true })
      .trim()
      .isAlphanumeric('en-US', { ignore: '-_' }).withMessage('Custom alias must contain only letters, numbers, hyphens or underscores'),
    // If expiresAt is provided, ensure it translates to a valid ISO 8601 date string and is in the future
    body('expiresAt')
      .optional({ checkFalsy: true })
      .isISO8601().withMessage('Expiry date must be a valid date format')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('Expiry date must be in the future');
        }
        return true;
      })
  ],
  // Controller function triggered upon successful routing
  urlController.createUrl
);

// Define route to retrieve all shortened URLs created by the logged-in user
router.get('/', urlController.getUrls);

// Define route to retrieve details of a specific shortened URL by MongoDB ID
router.get('/:id', urlController.getUrlById);

// Define route to update the original redirection target for a shortened link
router.patch(
  '/:id',
  [
    // Validate that the updated originalUrl is a valid URL format
    body('originalUrl')
      .trim()
      .notEmpty().withMessage('Original URL is required')
      .isURL().withMessage('Please enter a valid URL format (e.g. https://google.com)')
  ],
  // Controller function to apply target URL updates
  urlController.updateUrl
);

// Define route to delete a shortened URL and all of its associated click metrics
router.delete('/:id', urlController.deleteUrl);

// Export the router to be mounted in server.js
module.exports = router;

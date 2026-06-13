// Import the Url mongoose model to interact with the URLs database
const Url = require('../models/Url');
// Import the Visit mongoose model to delete corresponding clicks when a URL is removed
const Visit = require('../models/Visit');
// Import nanoid version 3 to generate unique shortcode identifiers
const { nanoid } = require('nanoid');
// Import validationResult to check express-validator errors
const { validationResult } = require('express-validator');

// Create a new shortened URL
exports.createUrl = async (req, res, next) => {
  // Check request validation rules
  const errors = validationResult(req);
  // Return early with 400 Bad Request if validation rules were violated
  if (!errors.isEmpty()) {
    // Return structured validation error response
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Validation failed',
      error: errors.array()[0].msg
    });
  }

  // Retrieve details from req.body
  const { originalUrl, customAlias, expiresAt } = req.body;
  // Fallback to extract userId from req.user object
  const userId = req.user.id || req.user._id;

  try {
    // If a custom alias is requested, check if it is already taken
    if (customAlias) {
      // Find one document with the same customAlias
      const existingAlias = await Url.findOne({ customAlias: customAlias.trim() });
      // If found, return a 400 Bad Request response indicating the alias is in use
      if (existingAlias) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Custom alias is already in use',
          error: 'Alias taken'
        });
      }
    }

    // Determine shortCode: use customAlias if provided, otherwise generate a 7-character nanoid
    const shortCode = customAlias ? customAlias.trim() : nanoid(7);

    // Make sure the shortCode does not collide with an existing code (defensive check)
    const existingCode = await Url.findOne({ shortCode });
    // If there's an unexpected collision, return a conflict error
    if (existingCode) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Generated short code collides with an existing URL. Please try again.',
        error: 'Shortcode collision'
      });
    }

    // Create a new Url document with user ownership references
    const newUrl = new Url({
      originalUrl: originalUrl.trim(),
      shortCode,
      customAlias: customAlias ? customAlias.trim() : undefined,
      user: userId,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    });

    // Save the new URL entry to MongoDB Atlas
    await newUrl.save();

    // Construct the full short URL using the BASE_URL env variable (fallback to localhost:5000)
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    // Convert Mongoose doc to plain JS object to safely append shortUrl property
    const urlResponse = newUrl.toObject();
    // Build shortUrl property
    urlResponse.shortUrl = `${baseUrl}/${shortCode}`;

    // Return the created URL details with success headers
    return res.status(201).json({
      success: true,
      data: urlResponse,
      message: 'Short URL created successfully',
      error: null
    });
  } catch (error) {
    // Forward error to global express handler
    next(error);
  }
};

// Retrieve all URLs created by the logged-in user
exports.getUrls = async (req, res, next) => {
  // Fallback to extract userId from req.user object
  const userId = req.user.id || req.user._id;

  try {
    // Find all links matching this user ID, sorted newest first
    const urls = await Url.find({ user: userId }).sort({ createdAt: -1 });
    // Get the base URL from settings (fallback to localhost:5000)
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    // Map through results to append calculated shortUrl string property
    const data = urls.map(url => {
      // Convert to plain object
      const urlObj = url.toObject();
      // Set shortUrl property
      urlObj.shortUrl = `${baseUrl}/${url.shortCode}`;
      return urlObj;
    });

    // Return the collection of URLs
    return res.status(200).json({
      success: true,
      data: data,
      message: 'URLs retrieved successfully',
      error: null
    });
  } catch (error) {
    // Forward error to global handler
    next(error);
  }
};

// Retrieve details for a single URL
exports.getUrlById = async (req, res, next) => {
  // Extract URL id from route parameters
  const { id } = req.params;
  // Fallback to extract userId from req.user object
  const userId = req.user.id || req.user._id;

  try {
    // Find the URL document by its Mongo ID
    const url = await Url.findById(id);
    // If the URL document does not exist, return a 404 response
    if (!url) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'URL not found',
        error: 'Not Found'
      });
    }

    // Verify if the logged-in user is indeed the owner of the link
    if (url.user.toString() !== userId.toString()) {
      // Return a 403 Forbidden response if ownership check fails
      return res.status(403).json({
        success: false,
        data: null,
        message: 'You are not authorized to view this URL',
        error: 'Forbidden'
      });
    }

    // Get the base URL from settings (fallback to localhost:5000)
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    // Convert to plain object
    const urlObj = url.toObject();
    // Build shortUrl property
    urlObj.shortUrl = `${baseUrl}/${url.shortCode}`;

    // Return URL details
    return res.status(200).json({
      success: true,
      data: urlObj,
      message: 'URL retrieved successfully',
      error: null
    });
  } catch (error) {
    // Forward error to global handler
    next(error);
  }
};

// Update the target originalUrl field for a shortcode
exports.updateUrl = async (req, res, next) => {
  // Check validation rules
  const errors = validationResult(req);
  // Return early if URL updates are invalid
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Validation failed',
      error: errors.array()[0].msg
    });
  }

  // Extract ID parameter and originalUrl payload
  const { id } = req.params;
  const { originalUrl } = req.body;
  // Fallback to extract userId from req.user object
  const userId = req.user.id || req.user._id;

  try {
    // Retrieve URL document by its MongoDB ID
    const url = await Url.findById(id);
    // If the URL does not exist, return 404
    if (!url) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'URL not found',
        error: 'Not Found'
      });
    }

    // Enforce ownership verification
    if (url.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        data: null,
        message: 'You are not authorized to update this URL',
        error: 'Forbidden'
      });
    }

    // Set updated originalUrl link
    url.originalUrl = originalUrl.trim();
    // Save modifications to database
    await url.save();

    // Get the base URL from settings (fallback to localhost:5000)
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    // Convert to plain object
    const urlObj = url.toObject();
    // Build shortUrl property
    urlObj.shortUrl = `${baseUrl}/${url.shortCode}`;

    // Return the updated URL details
    return res.status(200).json({
      success: true,
      data: urlObj,
      message: 'URL updated successfully',
      error: null
    });
  } catch (error) {
    // Forward error to global handler
    next(error);
  }
};

// Delete a shortened URL and all of its click visits data
exports.deleteUrl = async (req, res, next) => {
  // Extract URL id parameter
  const { id } = req.params;
  // Fallback to extract userId from req.user object
  const userId = req.user.id || req.user._id;

  try {
    // Find URL details by ID
    const url = await Url.findById(id);
    // Return 404 if no URL exists matching the given ID
    if (!url) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'URL not found',
        error: 'Not Found'
      });
    }

    // Enforce ownership verification
    if (url.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        data: null,
        message: 'You are not authorized to delete this URL',
        error: 'Forbidden'
      });
    }

    // Perform atomic deletion on the URL document
    await Url.deleteOne({ _id: url._id });
    // Wipe all visits records pointing to this URL ID to prevent orphans
    await Visit.deleteMany({ url: url._id });

    // Return confirmation response
    return res.status(200).json({
      success: true,
      data: null,
      message: 'Short URL and all associated visit metrics deleted successfully',
      error: null
    });
  } catch (error) {
    // Forward error to global handler
    next(error);
  }
};

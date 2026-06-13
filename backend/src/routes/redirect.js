// Import express library to set up redirect route
const express = require('express');
// Create a new router instance
const router = express.Router();
// Import the Url mongoose model to query target links
const Url = require('../models/Url');
// Import the Visit mongoose model to log access events
const Visit = require('../models/Visit');

// Helper function to extract browser name and device category from the User-Agent header
function parseUserAgent(uaString) {
  // Initialize default fallback values
  let browser = 'Unknown';
  let device = 'Desktop';

  // Return defaults immediately if user-agent header is empty
  if (!uaString) return { browser, device };

  // Detect device type based on keyword matches
  if (/mobile/i.test(uaString)) {
    device = 'Mobile';
  } else if (/tablet|ipad/i.test(uaString)) {
    device = 'Tablet';
  }

  // Detect browser brand based on signature tags
  if (/chrome|crios/i.test(uaString) && !/edge|edg/i.test(uaString) && !/opr|opios/i.test(uaString)) {
    browser = 'Chrome';
  } else if (/firefox|fxios/i.test(uaString)) {
    browser = 'Firefox';
  } else if (/safari/i.test(uaString) && !/chrome|crios/i.test(uaString)) {
    browser = 'Safari';
  } else if (/edge|edg/i.test(uaString)) {
    browser = 'Edge';
  } else if (/opr|opera/i.test(uaString)) {
    browser = 'Opera';
  }

  // Return the parsed user properties
  return { browser, device };
}

// Define the public route to catch shortCode parameters and redirect
router.get('/:shortCode', async (req, res, next) => {
  // Extract shortCode parameter from the path
  const { shortCode } = req.params;

  try {
    // Query MongoDB for Url document matching shortCode
    const url = await Url.findOne({ shortCode });

    // Return 404 if the shortCode does not map to any database record
    if (!url) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Short URL not found',
        error: 'Not Found'
      });
    }

    // Verify if the link is marked active
    if (!url.isActive) {
      return res.status(410).json({
        success: false,
        data: null,
        message: 'This short URL is no longer active',
        error: 'Gone'
      });
    }

    // Check if the link has expired (expiresAt timestamp exists and is in the past)
    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return res.status(410).json({
        success: false,
        data: null,
        message: 'This short URL has expired',
        error: 'Gone'
      });
    }

    // Read the User-Agent header string
    const userAgent = req.headers['user-agent'] || '';
    // Call the helper function to decode client properties
    const { browser, device } = parseUserAgent(userAgent);

    // Extract client IP address from request headers or socket connections
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'Unknown';
    // Extract referer link (fall back to Direct if headers do not specify it)
    const referer = req.headers['referer'] || 'Direct';

    // Build a new Visit record containing the client's information
    const newVisit = new Visit({
      url: url._id,
      shortCode,
      ipAddress,
      userAgent,
      browser,
      device,
      referer
    });
    // Save the Visit event to MongoDB
    await newVisit.save();

    // Increment click counts and update lastVisited date using atomic $inc/$set operators
    await Url.updateOne(
      { _id: url._id },
      {
        $inc: { clickCount: 1 },
        $set: { lastVisited: new Date() }
      }
    );

    // Debug print statement to verify the redirect process is occurring
    console.log("Redirecting shortCode to originalUrl");

    // Perform the HTTP 302 temporary redirection to prevent browser caching of redirects
    return res.redirect(302, url.originalUrl);
  } catch (error) {
    // Pass execution exceptions to general handler
    next(error);
  }
});

// Export the redirection router
module.exports = router;

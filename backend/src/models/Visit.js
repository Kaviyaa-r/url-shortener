// Import mongoose to interact with MongoDB database
const mongoose = require('mongoose');

// Define the schema for the Visit model
const visitSchema = new mongoose.Schema({
  // Reference to the Url model indicating which shortened URL was clicked
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: [true, 'Url reference is required']
  },
  // The specific short code visited (redundancy for faster querying by code)
  shortCode: {
    type: String,
    required: [true, 'Short code is required'],
    trim: true
  },
  // Timestamp when the visit occurred
  visitedAt: {
    type: Date,
    default: Date.now
  },
  // IP address of the visitor
  ipAddress: {
    type: String,
    trim: true
  },
  // The raw User-Agent header string sent by the browser
  userAgent: {
    type: String,
    trim: true
  },
  // Clean parsed browser name (e.g. Chrome, Firefox, Safari)
  browser: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  // Clean parsed device category (e.g. Mobile, Desktop, Tablet)
  device: {
    type: String,
    default: 'Desktop',
    trim: true
  },
  // The referrer URL that brought the visitor to our short link
  referer: {
    type: String,
    default: 'Direct',
    trim: true
  }
});

// Compound index on url and visitedAt for fetching individual link analytics over time
visitSchema.index({ url: 1, visitedAt: -1 });

// Compound index on shortCode and visitedAt for fetching analytics by shortCode directly
visitSchema.index({ shortCode: 1, visitedAt: -1 });

// Export the mongoose model for Visit
module.exports = mongoose.model('Visit', visitSchema);

// Import mongoose to interact with MongoDB database
const mongoose = require('mongoose');

// Define the schema for the Url model
const urlSchema = new mongoose.Schema({
  // The original full URL to be shortened
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true
  },
  // Unique 7-character generated code identifier for the short URL redirect
  shortCode: {
    type: String,
    required: [true, 'Short code is required'],
    unique: true,
    trim: true
  },
  // Optional custom URL alias provided by the user (must be unique if provided)
  customAlias: {
    type: String,
    sparse: true, // Allows multiple null/undefined customAlias records without uniqueness conflicts
    unique: true,
    trim: true
  },
  // Reference to the User model indicating who owns this link
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User owner reference is required']
  },
  // Counter tracking total redirection/clicks on this link
  clickCount: {
    type: Number,
    default: 0
  },
  // Timestamp indicating when the short URL was last visited/clicked
  lastVisited: {
    type: Date
  },
  // Optional expiry timestamp indicating when the link should expire
  expiresAt: {
    type: Date
  },
  // Flag determining whether the short link is currently operational
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  // Automatically add and manage createdAt and updatedAt fields
  timestamps: true
});

// Note: shortCode index is created automatically by unique:true above — no duplicate needed

// Explicitly define compound index on user and createdAt (for sorting newest first on dashboard)
urlSchema.index({ user: 1, createdAt: -1 });

// Export the mongoose model for Url
module.exports = mongoose.model('Url', urlSchema);

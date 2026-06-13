// Import mongoose to interact with MongoDB database
const mongoose = require('mongoose');
// Import bcryptjs for password hashing and validation
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  // User's full name, required and trimmed
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  // User's email, required, unique, lowercase, trimmed
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  // User's password, required, minimum 6 characters, and excluded from default queries
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Ensures password is not returned in queries by default
  },
  // Timestamp when the user profile was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware hook to hash the user's password before saving to the database
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a secure bcrypt salt with a cost factor of 12
    const salt = await bcrypt.genSalt(12);
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    // Move on to the next saving stage
    next();
  } catch (error) {
    // Pass any errors to mongoose pre-save handler
    next(error);
  }
});

// Instance method to compare a candidate password with the stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Compare the plain candidate password with this user's hashed password
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the mongoose model for User
module.exports = mongoose.model('User', userSchema);

// Import the React library and useState hook to manage form states
import React, { useState } from 'react';
// Import Link and useNavigate routing hooks from react-router-dom
import { Link, useNavigate } from 'react-router-dom';
// Import LinkIcon and Loader2 icons from lucide-react library
import { Link as LinkIcon, Loader2 } from 'lucide-react';
// Import the custom authentication hook to access login functionality
import { useAuth } from '../context/AuthContext';
// Import the configured axios client for trigger api requests
import axios from '../api/axios';
// Import the toast notification component
import { toast } from 'react-hot-toast';

// Define the Login page component
const Login = () => {
  // Local state to store the email address input value
  const [email, setEmail] = useState('');
  // Local state to store the password input value
  const [password, setPassword] = useState('');
  // Local state to track email format or missing inputs validation errors
  const [emailError, setEmailError] = useState('');
  // Local state to track password validation errors
  const [passwordError, setPasswordError] = useState('');
  // Local state to manage loading state when submitting credentials
  const [loading, setLoading] = useState(false);
  // Instantiate navigate hook to forward pages
  const navigate = useNavigate();
  // Retrieve the login handler from the auth context
  const { login } = useAuth();

  // Helper validation logic to verify correct email format
  const validateEmail = (val) => {
    // Regex expression checking for valid email formats
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Return test evaluation outcome
    return re.test(String(val).toLowerCase());
  };

  // Form submit handler to process user authentication
  const handleSubmit = async (e) => {
    // Prevent default form submit reload behavior
    e.preventDefault();
    // Reset any previous email validation errors
    setEmailError('');
    // Reset any previous password validation errors
    setPasswordError('');
    // Initialize verification flag to track form validity
    let isValid = true;

    // Check if email input is empty
    if (!email) {
      // Set email error message
      setEmailError('Email is required');
      // Set validity flag to false
      isValid = false;
    } else if (!validateEmail(email)) {
      // Set invalid email format message
      setEmailError('Please enter a valid email address');
      // Set validity flag to false
      isValid = false;
    }

    // Check if password input is empty
    if (!password) {
      // Set password error message
      setPasswordError('Password is required');
      // Set validity flag to false
      isValid = false;
    }

    // If any validation failed, exit submit process early
    if (!isValid) return;

    // Set loading spinner state to true
    setLoading(true);

    try {
      // Fire authentication request containing credentials to backend server
      const response = await axios.post('/auth/login', { email, password });
      
      // If the API response returns a successful status
      if (response.data.success) {
        // Trigger login context setup to store token and user object
        login(response.data.data.user, response.data.data.token);
        // Show success alert toast
        toast.success(response.data.message || 'Welcome back to SnapLink!');
        // Navigate the user to the secure dashboard
        navigate('/dashboard');
      } else {
        // Show server reported errors inside toast alert
        toast.error(response.data.error || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      // Read response error message or fallback to server error string
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Server error. Please try again.';
      // Present error string to user inside toast popups
      toast.error(errMsg);
    } finally {
      // Set loading spinner state back to false
      setLoading(false);
    }
  };

  return (
    // Outer layout wrapper styled with full screen dimensions and dark theme classes
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      {/* Centered card structure displaying rounded corners and shadows */}
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
        
        {/* Top brand header section */}
        <div className="flex flex-col items-center mb-8">
          {/* Brand icon container wrapped in circular background */}
          <div className="bg-indigo-600/10 p-3 rounded-full mb-3">
            {/* Brand logo icon */}
            <LinkIcon className="h-8 w-8 text-indigo-500" />
          </div>
          {/* Main title display */}
          <h2 className="text-3xl font-extrabold text-white">SnapLink</h2>
          {/* Subtitle tag */}
          <p className="mt-2 text-sm text-slate-400">Shorten URLs and track analytics</p>
        </div>

        {/* Credentials login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input field container */}
          <div>
            {/* Input label definition */}
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email-address">
              Email Address
            </label>
            {/* Main email text input component */}
            <input
              id="email-address"
              type="email"
              value={email}
              // Set value change handler to update state on input
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2.5 bg-slate-900 border ${emailError ? 'border-red-500' : 'border-slate-700'} rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="name@domain.com"
            />
            {/* Render validation error messages below if emailError exists */}
            {emailError && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{emailError}</p>
            )}
          </div>

          {/* Password input field container */}
          <div>
            {/* Input label definition */}
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">
              Password
            </label>
            {/* Main password text input component */}
            <input
              id="password"
              type="password"
              value={password}
              // Set value change handler to update state on input
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2.5 bg-slate-900 border ${passwordError ? 'border-red-500' : 'border-slate-700'} rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="••••••••"
            />
            {/* Render validation error messages below if passwordError exists */}
            {passwordError && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{passwordError}</p>
            )}
          </div>

          {/* Form submit container */}
          <button
            type="submit"
            // Deactivate button during loading cycles
            disabled={loading}
            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              // Loading spinner animation components
              <Loader2 className="animate-spin h-5 w-5 text-white" />
            ) : (
              // Standard button text
              'Sign In'
            )}
          </button>
        </form>

        {/* Toggle sign-in or register view link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            New to SnapLink?{' '}
            {/* Router Link element pointing to /signup */}
            <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

// Export the Login page component
export default Login;

// Import the Axios library to handle REST API communications
import axios from 'axios';

// Create a custom Axios instance configured with a base URL
const axiosInstance = axios.create({
  // Append /api to the base URL from environment configuration (fallback to localhost:5000)
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
});

// Configure request interceptor to automatically attach authorization tokens
axiosInstance.interceptors.request.use(
  (config) => {
    // Read the stored JWT token from localStorage
    const token = localStorage.getItem('token');
    
    // If a valid token is retrieved from storage, attach it to headers
    if (token) {
      // Configure Authorization header using standard Bearer token template
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Return request configuration back to axios execution lifecycle
    return config;
  },
  (error) => {
    // Forward request setup error to catch blocks
    return Promise.reject(error);
  }
);

// Configure response interceptor to intercept session validation errors (e.g. 401 errors)
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful response unchanged
    return response;
  },
  (error) => {
    // Capture status code from error response object if it exists
    const status = error.response ? error.response.status : null;
    
    // Intercept 401 Unauthorized errors indicating expired or invalid tokens
    if (status === 401) {
      // Clear token and user entries from localStorage to reset active session
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Perform client side routing redirect back to login page
      window.location.href = '/login';
    }
    
    // Forward error to target catch blocks in individual component triggers
    return Promise.reject(error);
  }
);

// Export the configured axios instance for REST API requests
export default axiosInstance;

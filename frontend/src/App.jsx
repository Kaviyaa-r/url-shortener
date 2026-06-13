// Import the React library for rendering components
import React from 'react';
// Import routing components from react-router-dom library
import { Routes, Route, Navigate } from 'react-router-dom';
// Import the custom authentication hook to read session status
import { useAuth } from './context/AuthContext';
// Import the Login page component
import Login from './pages/Login';
// Import the Signup page component
import Signup from './pages/Signup';
// Import the Dashboard page component
import Dashboard from './pages/Dashboard';
// Import the Analytics page component
import Analytics from './pages/Analytics';

// Create the ProtectedRoute wrapper component to secure private pages
const ProtectedRoute = ({ children }) => {
  // Read the current session token from the authentication context
  const { token } = useAuth();

  // If the user does not have an active session token, redirect to login page
  if (!token) {
    // Render redirect component navigating to /login page
    return <Navigate to="/login" replace />;
  }

  // Render children components if session token is valid and active
  return children;
};

// Define main App layout and client side route paths
function App() {
  // Read the current session token from the authentication context
  const { token } = useAuth();

  return (
    // Define the core routes mapping for the entire application
    <Routes>
      {/* Route for root path '/' redirecting based on authentication status */}
      <Route
        path="/"
        element={
          token ? (
            // Redirect logged-in users to /dashboard path
            <Navigate to="/dashboard" replace />
          ) : (
            // Redirect unauthenticated users to /login path
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Route for /login, preventing logged-in users from seeing it */}
      <Route
        path="/login"
        element={
          token ? (
            // Redirect authenticated users to /dashboard path
            <Navigate to="/dashboard" replace />
          ) : (
            // Render the Login page component
            <Login />
          )
        }
      />

      {/* Route for /signup, preventing logged-in users from registering again */}
      <Route
        path="/signup"
        element={
          token ? (
            // Redirect authenticated users to /dashboard path
            <Navigate to="/dashboard" replace />
          ) : (
            // Render the Signup page component
            <Signup />
          )
        }
      />

      {/* Route for /dashboard secured under ProtectedRoute wrapper */}
      <Route
        path="/dashboard"
        element={
          // Wrap Dashboard inside ProtectedRoute
          <ProtectedRoute>
            {/* Render Dashboard page component */}
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Route for /analytics/:shortCode secured under ProtectedRoute wrapper */}
      <Route
        path="/analytics/:shortCode"
        element={
          // Wrap Analytics inside ProtectedRoute
          <ProtectedRoute>
            {/* Render Analytics page component */}
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route redirecting unknown URL paths back to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Export the App component to be mounted in main.jsx
export default App;

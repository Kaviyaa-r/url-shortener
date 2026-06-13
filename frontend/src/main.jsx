// Import the React core library
import React from 'react';
// Import the ReactDOM client to mount React in the DOM
import ReactDOM from 'react-dom/client';
// Import BrowserRouter for frontend SPA routing capabilities
import { BrowserRouter } from 'react-router-dom';
// Import the Toaster element to display react-hot-toast notices
import { Toaster } from 'react-hot-toast';
// Import the AuthProvider context wrapper to provide user login state
import { AuthProvider } from './context/AuthContext';
// Import the main App component
import App from './App';
// Import the global index.css stylesheets (including Tailwind directives)
import './index.css';

// Select root DOM node and render the React component tree
ReactDOM.createRoot(document.getElementById('root')).render(
  // Wrap in React.StrictMode to verify potential runtime defects in development
  <React.StrictMode>
    {/* Wrap in BrowserRouter to enable React router behaviors across pages */}
    <BrowserRouter>
      {/* Wrap in AuthProvider to distribute user session states globally */}
      <AuthProvider>
        {/* Mount Toaster component configured with custom styles */}
        <Toaster
          position="top-right"
          toastOptions={{
            // Apply custom style parameters matching dark theme specifications
            style: {
              background: '#1e293b', // bg-slate-800
              color: '#ffffff', // white text
              border: '1px solid #334155', // border-slate-700
            },
          }}
        />
        {/* Render the core App layout wrapper */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Import defineConfig helper from vite to structure settings
import { defineConfig } from 'vite';
// Import react compiler plugin from @vitejs/plugin-react
import react from '@vitejs/plugin-react';

// Export Vite configurations
export default defineConfig({
  // Mount the React framework compiler plugin
  plugins: [react()],
  // Configure development server options
  server: {
    // Force the server to run on port 3000 (matching backend CORS settings)
    port: 3000,
  },
});

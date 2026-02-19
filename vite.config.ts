import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the app to securely read the API_KEY from your Netlify Environment Variables at build time.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
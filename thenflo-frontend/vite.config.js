import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Gateway base URL is read at runtime from VITE_API_BASE_URL (see .env.example).
// The frontend never talks to microservices directly — only to this Gateway.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});

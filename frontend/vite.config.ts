import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Only relevant for `npm run dev` outside Docker: keeps the frontend
    // and API on one origin so auth cookies work (see spec §14).
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});

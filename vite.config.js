import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  // Proxy /api/* to the CF Pages Function during local dev
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8788", // wrangler pages dev port
        changeOrigin: true,
      },
    },
  },
});

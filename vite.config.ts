import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        // These three are the heavy, stable dependencies the homepage
        // needs synchronously (App.tsx eagerly loads HomePage — see its
        // own comment on why), so no amount of route-level lazy-loading
        // keeps them out of the initial page load. Splitting them into
        // their own vendor chunks doesn't shrink that initial download,
        // but it does two things route-level splitting alone can't: lets
        // the browser fetch/parse them in parallel with the app-code
        // chunk instead of one serial blocking bundle, and — since these
        // rarely change between deploys, unlike app code — lets returning
        // visitors reuse them from cache across releases instead of
        // re-downloading everything on every deploy.
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-supabase": ["@supabase/supabase-js"],
        },
      },
    },
  },
});

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { abhiaiDevTokenEndpoint } from "./plugins/dev-token-endpoint";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Mirrors the /ingest rewrites in vercel.json so PostHog works in dev too.
    proxy: {
      "/ingest/static": {
        target: "https://us-assets.i.posthog.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ingest/, ""),
      },
      "/ingest": {
        target: "https://us.i.posthog.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ingest/, ""),
      },
    },
  },
  // loadEnv with an empty prefix reads LIVEKIT_* from .env.local for the dev-only token
  // endpoint without exposing them to the client bundle (only VITE_* is ever inlined).
  plugins: [tailwindcss(), react(), abhiaiDevTokenEndpoint(loadEnv(mode, process.cwd(), ""))],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

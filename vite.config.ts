import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
    chunkSizeWarningLimit: 800,
    assetsInlineLimit: 4096,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React — load first
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-router-dom/")) {
            return "react-vendor";
          }
          // Framer Motion — heavy, isolated
          if (id.includes("node_modules/framer-motion")) {
            return "animations";
          }
          // Lucide icons — large library
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
          // Supabase client
          if (id.includes("node_modules/@supabase")) {
            return "supabase";
          }
          // Tanstack Query
          if (id.includes("node_modules/@tanstack")) {
            return "query";
          }
          // Radix UI components
          if (id.includes("node_modules/@radix-ui")) {
            return "radix-ui";
          }
          // Zod validation
          if (id.includes("node_modules/zod")) {
            return "utils";
          }
        },
      },
    },
  },
}));

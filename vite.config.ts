import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  build: {
    outDir: "build",
    sourcemap: true,
    rollupOptions: {
      onLog(level, log, handler) {
        if (log.cause && (log.cause as any).message === `Can't resolve original location of error.`) {
          return
        }
        handler(level, log)
      }
    }
  },
  server: {
    open: true,
  },
  plugins: [
    react(),
    nodePolyfills({
      exclude: ["fs"],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
      process: "process/browser",
      path: "path-browserify",
      os: "os-browserify",
      stream: "stream-browserify",
    },
  },
});

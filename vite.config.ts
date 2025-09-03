import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname equivalent for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"), // frontend root folder
  build: {
    outDir: path.resolve(__dirname, "dist"), // ✅ final build will go into /dist
    emptyOutDir: true,
  },
  base: "./", // ✅ important for correct asset paths in production
  server: {
    host: "0.0.0.0",
    port: 5000,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

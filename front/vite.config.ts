import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  envDir: "../",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@contexts": path.resolve(__dirname, "./src/shared/contexts"),
      "@interfaces": path.resolve(__dirname, "./src/shared/interface"),
      "@utils": path.resolve(__dirname, "./src/shared/utils"),
      "@features": path.resolve(__dirname, "./src/features"),
    },
  },
  server: {
    host: true,
    allowedHosts: ["caminho.ngrok-free.app"],
  },
});

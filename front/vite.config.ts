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
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@interface": path.resolve(__dirname, "./src/interface"),
      "@connection": path.resolve(__dirname, "./src/connection"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  server: {
    host: true,
    allowedHosts: ["caminho.ngrok-free.app"],
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/web-app-assets/wheel-of-destiny/",

  build: {
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        chunkFileNames: "index.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.css$/.test(assetInfo.name)) {
            return "index.css";
          } else if (
            assetInfo.name &&
            /\.(png|jpe?g|svg|gif|tiff|bmp|webp)$/i.test(assetInfo.name)
          ) {
            return "assets/[name][extname]";
          }
          return "[name][extname]";
        },
      },
    },
  },
});

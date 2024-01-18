import { sveltekit } from "@sveltejs/kit/vite";
import { compression } from "vite-plugin-compression2";

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), compression({ algorithm: "gzip" })],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000/",
        changeOrigin: true,
      },
    },
  },
});

import { sveltekit } from "@sveltejs/kit/vite";
import viteCompression from "vite-plugin-compression";

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), viteCompression()],
  server: {
    host: "0.0.0.0",
    port: 3000
  }
});

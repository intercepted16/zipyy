import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-vercel";

let checkOrigin;
process.env.NODE_ENV == "development"
  ? (checkOrigin = false)
  : (checkOrigin = true);

const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    csrf: {
      checkOrigin: checkOrigin,
    },
  },
};

export default config;

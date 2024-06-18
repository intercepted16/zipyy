import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-cloudflare";

let checkOrigin;
process.env.NODE_ENV === "development" ? (checkOrigin = false) : (checkOrigin = true);

/** @type {import("@sveltejs/kit").Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    csrf: {
      checkOrigin: checkOrigin
    },
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    alias: {
      $ui: "./src/lib/components/ui",
      $store: "./src/routes/store.ts",
      $routes: "./src/routes",
      $lucide: "node_modules/lucide-svelte/dist/icons",
      $types: "./src/lib/types"
    }
  }
};

export default config;

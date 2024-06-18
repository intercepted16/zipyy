import { createBrowserClient, parse, isBrowser } from "@supabase/ssr";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import type { Database } from "$types/database/schema";

//@ts-expect-error depends implicitly has an any type
export const load = async ({ fetch, data, depends }) => {
  const supabase = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      fetch
    },
    cookies: {
      get(key) {
        if (!isBrowser()) {
          return JSON.stringify(data.session);
        }

        const cookie = parse(document.cookie);
        return cookie[key];
      }
    }
  });
  depends("supabase:auth");
  return { supabase, session: data.session };
};

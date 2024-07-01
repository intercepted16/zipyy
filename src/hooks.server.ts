import { redirect, type Handle, type RequestEvent } from "@sveltejs/kit";
import { RetryAfterRateLimiter } from "sveltekit-rate-limiter/server";
import { createServerClient } from "@supabase/ssr";
const limiter = new RetryAfterRateLimiter({
  IP: [50, "m"]
});
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";

export const handle: Handle = async ({ event, resolve }) => {
  if (!(process.env.NODE_ENV == "development")) {
    const status = await limiter.check(event);
    if (status.limited) {
      const response = new Response(
        `You are being rate limited. Please try after ${status.retryAfter} seconds.`,
        {
          status: 429,
          headers: { "Retry-After": status.retryAfter.toString() }
        }
      );
      return response;
    }
  }
  // for dev experience, check if on 127.0.0.1 and redirect to localhost instead for consistency
  if (event.url.hostname === "127.0.0.1") {
    const url = new URL(event.request.url);
    url.hostname = "localhost";
    return redirect(302, url.toString());
  }

  type CookieMethods = {
    get: (key: string) => string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (key: string, value: string, options: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    remove: (key: string, options: any) => void;
  };
  const cookieMethods = (event: RequestEvent): CookieMethods => {
    return {
      get: (key) => event.cookies.get(key),
      /**
       * Note: You have to add the `path` variable to the
       * set and remove method due to sveltekit's cookie API
       * requiring this to be set, setting the path to `/`
       * will replicate previous/standard behaviour (https://kit.svelte.dev/docs/types#public-types-cookies)
       */
      set: (key, value, options) => {
        event.cookies.set(key, value, { ...options, path: "/" });
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: "/" });
      }
    };
  };
  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: cookieMethods(event)
  });

  event.locals.supabaseAdmin = createServerClient(
    PUBLIC_SUPABASE_URL,
    PRIVATE_SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: cookieMethods(event)
    }
  );

  event.locals.getSession = async () => {
    return (await event.locals.supabase.auth.getSession()).data.session;
  };

  // Can only be used in a secure server context
  event.locals.userExists = async (email: string) => {
    const { data } = await supabaseAdmin.auth.admin.listUsers();
    const userEmails = data.users.map((user) => user.email);

    return userEmails.includes(email);
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === "content-range" || name === "x-supabase-api-version";
    }
  });
};

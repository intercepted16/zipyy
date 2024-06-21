import { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { createServerClient, type CookieMethods } from "@supabase/ssr";
import { redirect, type Handle, type RequestEvent } from "@sveltejs/kit";

import { RetryAfterRateLimiter } from "sveltekit-rate-limiter/server";

const limiter = new RetryAfterRateLimiter({
  IP: [15, "m"]
});

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
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: cookieMethods(event)
  });

  // for dev experience, check if on 127.0.0.1 and redirect to localhost instead for consistency
  if (event.url.hostname === "127.0.0.1") {
    const url = new URL(event.request.url);
    url.hostname = "localhost";
    return redirect(302, url.toString());
  }

  /**
   * a little helper that is written for convenience so that instead
   * of calling `const { data: { session } } = await supabase.auth.getSession()`
   * you just call this `await getSession()`
   */
  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    return session;
  };
  // helper function to check if a user exists, can only be run on server
  event.locals.userExists = async (email: string) => {
    const supabaseAdmin = createServerClient(
      PUBLIC_SUPABASE_URL,
      PRIVATE_SUPABASE_SERVICE_ROLE_KEY,
      {
        cookies: cookieMethods(event)
      }
    );
    const { data } = await supabaseAdmin.auth.admin.listUsers();
    const userEmails = data.users.map((user) => user.email);

    return userEmails.includes(email);
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    }
  });
};

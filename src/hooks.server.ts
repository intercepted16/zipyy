import { SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";
import { createServerClient, type CookieMethods } from "@supabase/ssr";
import type { Handle, RequestEvent } from "@sveltejs/kit";

const cookieMethods = (event: RequestEvent): CookieMethods => {
  return {
    get: (key) => event.cookies.get(key),
    set: (key, value, options) => {
      event.cookies.set(key, value, { ...options, path: "" });
    },
    remove: (key, options) => {
      event.cookies.delete(key, { ...options, path: "" });
    },
  };
};

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: cookieMethods(event),
    }
  );
  event.locals.supabaseAdmin = createServerClient(
    PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: cookieMethods(event),
    }
  );

  /**
   * a little helper that is written for convenience so that instead
   * of calling `const { data: { session } } = await supabase.auth.getSession()`
   * you just call this `await getSession()`
   */
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    return session;
  };
  // helper function to check if a user exists, can only be run on server
  event.locals.userExists = async (email: string) => {
    const { data } = await event.locals.supabaseAdmin.auth.admin.listUsers();
    const userEmails = data.users.map((user) => user.email);

    const isEmailInList = userEmails.includes(email);

    return isEmailInList;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    },
  });
};

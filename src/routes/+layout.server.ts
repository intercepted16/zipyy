import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { supabase, getSession } }) => {
  /* By default, use the "insecure" session, to minimize network latency.
   This is because in most cases,
   JWT verification is not necessary.
   However, in those few circumstances where it is,
    use the `getUser()` function manually.*/
  return {
    session: getSession()
  };
};

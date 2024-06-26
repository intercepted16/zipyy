import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = url.searchParams.get("next") ?? "/auth/success";
  /**
   * Clean up the redirect URL by deleting the Auth flow parameters.
   *
   * `next` is preserved for now, because it's needed in the error case.
   */
  const redirectTo = new URL(url);
  redirectTo.pathname = next;
  redirectTo.searchParams.append("type", type ?? "");
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("message");
  redirectTo.searchParams.delete("error");
  redirectTo.searchParams.delete("error_description");
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      redirectTo.searchParams.delete("next");
      redirectTo.searchParams.append("type", type ?? "");
      return redirect(303, redirectTo);
    } else {
      redirectTo.searchParams.append("error", JSON.stringify(error));
    }
  }

  redirectTo.pathname = "/auth/error";
  return redirect(303, redirectTo);
};

import { setError, superValidate } from "sveltekit-superforms/server";
import { fail, redirect } from "@sveltejs/kit";
import { loginSchema as schema } from "$types/validation/schema";
import { yup } from "sveltekit-superforms/adapters";
import type { AuthResponse } from "@supabase/supabase-js";
import type { ErrorCode } from "@supabase/auth-js/src/lib/error-codes";
import errors from "$lib/errors";
export const load = async ({ url, locals: { supabase } }) => {
  /* We don't need to use the JWT verified Session object.
     This is because it is not a security risk
     if the user modifies the Session object, as it is only used to check for the
     existence of a session.*/
  if (await supabase.auth.getSession()) {
    throw redirect(303, "/");
  }

  const form = await superValidate(yup(schema));

  return {
    form,
    url: url.origin
  };
};
export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, yup(schema));
    const signupOrLogin: string | null = formData.get("signupOrLogin") as string | null;
    let redirectTo: string = "";
    if (!form.valid) {
      return fail(400, { form });
    }

    let response: AuthResponse;
    switch (signupOrLogin) {
      case "signup": {
        response = await supabase.auth.signUp({
          email: form.data.email,
          password: form.data.password
        });
        const error =
          errors.get(response.error?.code as ErrorCode) ?? "An unexpected error occurred.";
        if (response.error) return setError(form, "password", error);
        redirectTo = "/auth/pending";
        break;
      }
      case "login": {
        response = await supabase.auth.signInWithPassword({
          email: form.data.email,
          password: form.data.password
        });
        let error: ErrorCode | string =
          errors.get(response.error?.code as ErrorCode) ?? "An unexpected error occurred.";
        /* To enhance security by obfuscating the existence of an account, the system does not disclose if verification is pending.
         Instead, it returns a generic 'wrong password' error. */
        if (response.error?.status == 400) error = "Wrong password.";
        if (response.error) return setError(form, "password", error);
        break;
      }
    }
    throw redirect(301, redirectTo);
  }
};

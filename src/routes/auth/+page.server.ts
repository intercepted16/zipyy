import { setError, superValidate } from "sveltekit-superforms/server";
import { fail, redirect } from "@sveltejs/kit";
import { loginSchema, resetPasswordSchema } from "$types/validation/schema";
import { yup } from "sveltekit-superforms/adapters";
import type { AuthResponse } from "@supabase/supabase-js";
import type { ErrorCode } from "@supabase/auth-js/src/lib/error-codes";
import errors from "$lib/errors";
export const load = async ({ url, locals: { session } }) => {
  /* We don't need to use the JWT verified Session object.
     This is because it is not a security risk
     if the user modifies the Session object, as it is only used to check for the
     existence of a session.*/
  if (session) {
    return redirect(303, "/");
  }

  const loginForm = await superValidate(yup(loginSchema));
  const resetPasswordForm = await superValidate(yup(resetPasswordSchema));

  return {
    loginForm,
    resetPasswordForm,
    url: url.origin
  };
};
export const actions = {
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, yup(loginSchema));
    const signupOrLogin: string | null = JSON.parse(formData.get("signupOrLogin") as string);
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
        redirectTo = "/";
        break;
      }
      case null:
        return { form };
    }
    throw redirect(301, redirectTo);
  },
  resetPassword: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, yup(resetPasswordSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const response = await supabase.auth.resetPasswordForEmail(form.data.email);
    if (response.error) {
      const error = errors.get(response.error.code as ErrorCode) ?? "An unexpected error occurred.";
      return setError(form, "email", error);
    }
    const redirectTo = new URL("/auth/pending", request.url);
    redirectTo.searchParams.set("type", "recovery");
    return redirect(303, redirectTo);
  }
};

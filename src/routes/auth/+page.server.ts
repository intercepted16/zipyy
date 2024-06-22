import { setError, superValidate } from "sveltekit-superforms/server";
import { fail, redirect } from "@sveltejs/kit";
import { loginSchema as schema } from "$types/validation/schema";
import { zod } from "sveltekit-superforms/adapters";
import type { AuthResponse } from "@supabase/supabase-js";

export const load = async ({ parent, url }) => {
  const session = (await parent()).session;

  if (session) {
    throw redirect(303, "/");
  }

  const form = await superValidate(zod(schema));

  return {
    form,
    url: url.origin
  };
};
export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, zod(schema));
    const signupOrLogin: string | null = formData.get("signupOrLogin") as string | null;

    if (!form.valid) {
      return fail(400, { form });
    }

    let response: AuthResponse;
    switch (signupOrLogin) {
      case "signup":
        response = await supabase.auth.signUp({
          email: form.data.email,
          password: form.data.password
        });
        if (response.error) return setError(form, "password", "User already exists.");
        break;
      case "login":
        response = await supabase.auth.signInWithPassword({
          email: form.data.email,
          password: form.data.password
        });
        if (response.error) return setError(form, "password", "Wrong password.");
        break;
    }
    throw redirect(301, "/");
  }
};

import { setError, superValidate } from "sveltekit-superforms/server";
import { fail, redirect } from "@sveltejs/kit";
import { loginSchema as schema } from "$lib/schema";
import { signupOrLogin } from "$store";
import { get } from "svelte/store";
import { zod } from "sveltekit-superforms/adapters";
import type { AuthResponse } from "@supabase/supabase-js";

export const load = async ({ parent, url, setHeaders }) => {
  const old = performance.now();

  const session = (await parent()).session;

  if (session) {
    throw redirect(303, "/");
  }

  const form = await superValidate(zod(schema));
  console.log((performance.now() - old).toFixed(3) + "s");

  return {
    form,
    url: url.origin
  };
};
export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(schema));

    if (!form.valid) {
      return fail(400, { form });
    }

    let response: AuthResponse;
    switch (get(signupOrLogin)) {
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

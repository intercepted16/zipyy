import { z } from "zod";
import { setError, superValidate } from "sveltekit-superforms/server";
import { fail, redirect } from "@sveltejs/kit";
import { schema } from "$lib/schemas/signup-login.js";
import { supabase } from "$lib/supabaseClient.js";
import { signupOrLogin } from "../store.js";
import { get } from "svelte/store";
import type { AuthResponse } from "@supabase/supabase-js";
export const load = async () => {
  // Server API:
  const form = await superValidate(schema);

  // Unless you throw, always return { form } in load and form actions.
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, schema);
    console.log(form.valid);

    // Convenient validation check:
    if (!form.valid) {
      // Again, return { form } and things will just work.
      return fail(400, { form });
    }

    // TODO: Do something with the validated form.data
    let response: AuthResponse;
    switch (get(signupOrLogin)) {
      case "signup":
        response = await supabase.auth.signUp({
          email: form.data.email,
          password: form.data.password,
        });
        if (response.error)
          return setError(form, "password", "User already exists.");
        break;
      case "login":
        response = await supabase.auth.signInWithPassword({
          email: form.data.email,
          password: form.data.password,
        });
        if (response.error)
          return setError(form, "password", "Wrong password.");
        break;
    }
    throw redirect(301, "/");
  },
};

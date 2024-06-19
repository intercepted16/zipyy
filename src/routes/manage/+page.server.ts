import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { accountFormSchema } from "$lib/components/AccountForm.svelte";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(accountFormSchema))
  };
};

export const actions: Actions = {
  default: async (event) => {
    const { supabase } = event.locals;
    const form = await superValidate(event, zod(accountFormSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }
    await supabase.auth.updateUser({ email: form.data.email });
    return {
      form
    };
  }
};

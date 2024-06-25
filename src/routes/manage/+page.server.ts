import { superValidate } from "sveltekit-superforms";
import { yup } from "sveltekit-superforms/adapters";
import { type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { accountFormSchema } from "$types/validation/schema";
export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(yup(accountFormSchema))
  };
};

export const actions: Actions = {
  default: async (event) => {
    const { supabase } = event.locals;
    const form = await superValidate(event, yup(accountFormSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }
    if (form.data.email) {
      //TODO: add an email changed confirmation page, handle errors
      await supabase.auth.updateUser({ email: form.data.email });
    }
    if (form.data.password) {
      //TODO: add a password changed confirmation page, handle errors
      await supabase.auth.updateUser({ password: form.data.password });
    }
    return {
      form
    };
  }
};

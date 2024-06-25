import { superValidate } from "sveltekit-superforms";
import { yup } from "sveltekit-superforms/adapters";
import { type Actions, fail, redirect } from "@sveltejs/kit";
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
    let updateType = "";

    if (form.data.email) {
      //TODO: add an email changed confirmation page, handle errors
      await supabase.auth.updateUser({ email: form.data.email });
      updateType = "email_change";
    }

    if (form.data.password) {
      //TODO: add a password changed confirmation page, handle errors
      await supabase.auth.updateUser({ password: form.data.password });
      updateType = updateType === "email_change" ? "multiple" : "recovery";
    }

    if (updateType) {
      return redirect(303, `/auth/pending?type=${updateType}`);
    }
    return {
      form
    };
  }
};

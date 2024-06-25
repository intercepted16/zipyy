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
    const formData = await event.request.formData();
    const { supabase, supabaseAdmin } = event.locals;
    if (formData.get("delete")) {
      console.log("running delete");
      // We *must* verify the JWT token, else anyone can delete ANY account
      // As we are on the /manage route, we can assume the user is authenticated.
      const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user!.id
      );
      console.log(data, error);
      if (error) {
        return redirect(303, `/auth/error?error=${JSON.stringify(error)}`);
      }
      await supabase.auth.signOut();
      return redirect(303, "/");
    }
    const form = await superValidate(formData, yup(accountFormSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }
    let updateType = "";

    if (form.data.email) {
      const { error } = await supabase.auth.updateUser({ email: form.data.email });
      if (error) {
        return redirect(303, `/auth/error?error=${JSON.stringify(error)}`);
      }
      updateType = "email_change";
    }

    if (form.data.password) {
      const { error } = await supabase.auth.updateUser({ password: form.data.password });
      if (error) {
        return redirect(303, `/auth/error?error=${JSON.stringify(error)}`);
      }
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

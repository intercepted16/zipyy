import { shortenSchema as schema } from "$types/validation/schema";
import { shortenedUrlsRoute } from "$store";
import { fail } from "@sveltejs/kit";
import { yup } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types";

export const load = async () => {
  const editForm = async () => {
    return await superValidate(yup(schema), { id: "editForm" });
  };
  return {
    form: await superValidate(yup(schema), { id: "createForm" }),
    editForm: editForm()
  };
};

export const actions: Actions = {
  shorten: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, yup(schema));
    if (!form.valid) return fail(400, { form });
    const shortened = `${shortenedUrlsRoute}/${
      (await supabase.rpc("shorten", { original: form.data.url })).data as string
    }`;
    return {
      form,
      original: form.data.url.startsWith("https://")
        ? form.data.url.slice("https://".length)
        : form.data.url,
      shortened
    };
  },
  edit: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();

    const form = await superValidate(formData, yup(schema));
    if (!form.valid) return fail(400, { form });
    await supabase
      .from("shortened_urls")
      .update({ original: formData.get("url") })
      .eq("id", formData.get("id"));
    return { form };
  }
};

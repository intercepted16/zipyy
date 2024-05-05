import type { Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { shortenSchema as schema } from "$lib/schema";
import { fail } from "@sveltejs/kit";
import { shortenedUrlsRoute } from "$store";

export const load = async () => {
  const editForm = async () => {
    return await superValidate(zod(schema), { id: "editForm" });
  };
  return {
    form: await superValidate(zod(schema), { id: "createForm" }),
    editForm: editForm()
  };
};

export const actions: Actions = {
  shorten: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, zod(schema));
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
    console.log("I am running");
    const formData = await request.formData();
    const form = await superValidate(formData, zod(schema));
    if (!form.valid) return fail(400, { form });
    console.log(
      await supabase
        .from("shortened_urls")
        .update({ original: formData.get("url") })
        .eq("id", formData.get("id"))
    );
    return { form };
  }
};

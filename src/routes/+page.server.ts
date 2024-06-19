import { shortenSchema as schema } from "$types/validation/schema";
import { shortenedUrlsRoute } from "$store";
import { fail } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types";

export const load = async ({ url }) => {
  const editForm = async () => {
    return await superValidate(zod(schema), { id: "editForm" });
  };
  const message = url.searchParams.get("message");
  const error = url.searchParams.get("error");
  return {
    form: await superValidate(zod(schema), { id: "createForm" }),
    editForm: editForm(),
    pkceFlow: { message, error }
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
    console.log(formData.get("id"));
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

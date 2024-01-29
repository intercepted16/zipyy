import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { shortenSchema as schema } from "$lib/schema";
import { fail } from "@sveltejs/kit";
export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(schema),
  };
};

export const actions: Actions = {
  default: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, schema);
    console.log(form.valid, form.errors);
    if (!form.valid) return fail(400, { form });
    const shortened = `sh.ps.ai/${
      (await supabase.rpc("shorten", { original: form.data.url }))
        .data as string
    }`;

    return { form, shortened };
  },
};

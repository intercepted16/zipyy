import { superValidate } from "sveltekit-superforms";
import { yup } from "sveltekit-superforms/adapters";
import { type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { appearanceFormSchema } from "$lib/components/AppearanceForm.svelte";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(yup(appearanceFormSchema))
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, yup(appearanceFormSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }
    return {
      form
    };
  }
};

import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { shortenSchema as schema } from '$lib/schema';
import '$lib/stringExtensions';
import { fail } from '@sveltejs/kit';
export const load = async ({ parent, depends, locals: { getSession, userExists, supabase } }) => {
  depends('urls');
  console.log('the load is running...');
  type urlData = {
    id: number;
    original: string;
    shortened: string;
    user_id: string;
  };
  const session = (await parent()).session;
  let urls = null;
  if (session?.user.id) {
    urls = (await supabase.from('shortened_urls').select().eq('user_id', session?.user.id))
      .data as urlData[];
  }
  return {
    form: await superValidate(zod(schema), { id: 'createForm' }),
    editForm: await superValidate(zod(schema), { id: 'editForm' }),
    urls
  };
};

export const actions: Actions = {
  shorten: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, zod(schema));
    if (!form.valid) return fail(400, { form });
    const shortened = `sh.ps.ai/${
      (await supabase.rpc('shorten', { original: form.data.url })).data as string
    }`;
    return {
      form,
      original: form.data.url.removePrefix('https://'),
      shortened
    };
  },
  edit: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, zod(schema));
    if (!form.valid) return fail(400, { form });
    console.log(
      await supabase
        .from('shortened_urls')
        .update({ original: formData.get('url') })
        .eq('id', formData.get('id'))
    );
    return { form };
  }
};

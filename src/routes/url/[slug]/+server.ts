import { json, redirect } from "@sveltejs/kit";

function allEqual(string: string) {
  let stringAENew = "";
  for (let i = 0; i < string.length; i++) {
    if (string[0] == string[i]) {
      stringAENew += string[i];
    }
  }
  return stringAENew == string;
}

export async function GET({ params, locals: { supabase } }) {
  const path: string = params.slug;
  if (!path || path.length != 6 || allEqual(path)) return json(false);
  const { data, error } = await supabase
    .from("shortened_urls")
    .select("original, shortened")
    .eq("shortened", path);
  if (data && data[0] && data[0].shortened) {
    return redirect(301, `https://${data[0].original}`);
  } else {
    return json(false);
  }
}

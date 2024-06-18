import { redirect } from "@sveltejs/kit";
import { allEqual } from "$lib/utils";

export async function GET({ params, locals: { supabase } }) {
  const path: string = params.slug;
  if (!path || path.length != 6 || allEqual(path)) return redirect(301, "/");
  const data = (
    await supabase.from("shortened_urls").select("original, shortened").eq("shortened", path)
  ).data;
  if (data && data[0]) {
    return redirect(302, `https://${data[0].original}`);
  } else {
    return redirect(302, "/");
  }
}

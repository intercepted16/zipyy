import { json } from "@sveltejs/kit";
export async function GET({ url, locals: { userExists } }) {
  if (!url.searchParams.get("email")) return json(false);
  return json(await userExists(url.searchParams.get("email") as string));
}

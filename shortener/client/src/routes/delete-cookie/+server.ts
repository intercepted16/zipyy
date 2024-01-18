import { json } from "@sveltejs/kit";

export async function POST({ cookies, url, request }) {
  const data = await request.json();
  if (!data.key) return json("", { status: 400 });
  console.log(data.key);
  console.log(cookies.delete(data.key, { path: "/" }));
  return json({ junk: "hi" });
}

export async function GET() {
  return json({ junk: "hi" });
}

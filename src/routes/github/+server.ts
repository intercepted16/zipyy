import { redirect } from "@sveltejs/kit";

export async function GET() {
  return redirect(301, "https://github.com/intercepted16/Shortly");
}

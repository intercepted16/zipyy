import { json, error } from "@sveltejs/kit";
import { RateLimiter } from "sveltekit-rate-limiter/server";
export async function GET(event) {
  if (process.env.NODE_ENV != "development") {
    const limiter = new RateLimiter({
      IP: [4, "m"] // IP address limiter
    });
    if (await limiter.isLimited(event)) throw error(409);
  }
  const {
    url,
    locals: { userExists }
  } = event;
  const email = url.searchParams.get("email");
  if (!email) return json(false);
  const exists = await userExists(email);
  return json(exists, {
    headers: {
      "Cache-Control": "public, s-maxage=60"
    }
  });
}

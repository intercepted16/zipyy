import * as db from "$lib/server/database.js";
/** @type {import('./$types').PageServerLoad} */ export async function load({
  cookies,
  fetch,
  request
}) {
//   const theme = request.headers.get("Sec-CH-Prefers-Color-Scheme") || "light";

// if (!cookies.get("theme")) {
//   cookies.set("theme", theme, {path: "/"});
// }

  return {
    // theme: theme,
    userData: await db.getUserData(fetch),
    entries: await db.getEntries(fetch),
  };
}

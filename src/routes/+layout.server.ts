import * as db from "$lib/server/database.js";
/** @type {import('./$types').PageServerLoad} */ export async function load({
  locals: { getSession },
  fetch,
}) {
  return {
    entries: await db.getEntries(fetch),
    session: await getSession(),
  };
}

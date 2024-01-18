import { type Handle, redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname == "/login") throw redirect(301, "/");
  const response = await resolve(event);
  const headers = new Headers(response.headers);
  headers.set("Set-Cookie", "myCookie=myValue; Path=/; HttpOnly");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
  });
};

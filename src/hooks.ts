import type { Reroute } from "@sveltejs/kit";
const translated: Record<string, string> = {
  "/signup": "/auth",
  "/login": "/auth",
  "/authorize": "/auth",
  "/authenticate": "/auth"
};
export const reroute: Reroute = ({ url }) => {
  if (url.pathname in translated) {
    return translated[url.pathname];
  }
};

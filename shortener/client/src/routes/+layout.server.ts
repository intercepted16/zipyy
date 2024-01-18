import { supabase } from "$lib/supabaseClient";
import * as db from "$lib/server/database.js";
import { redirect } from "@sveltejs/kit";
/** @type {import('./$types').PageServerLoad} */ export async function load({
  cookies,
  fetch,
  request,
  url,
}) {
  console.log(url.pathname);
  // const redirectToLogin: string[] = ["signup", "login"];
  // if (redirectToLogin.includes(url.pathname.slice(1))) {
  //   cookies.set("modal", "login", {
  //     path: "/",
  //   });
  //   throw redirect(301, "/");
  // }

  url.searchParams.forEach((val) => {
    console.log("hi", val);
  });
  //   const theme = request.headers.get("Sec-CH-Prefers-Color-Scheme") || "light";

  // if (!cookies.get("theme")) {
  //   cookies.set("theme", theme, {path: "/"});
  // }
  // const { data } = await supabase.from("countries").select();
  // await supabase.from("shortened_urls").insert({original: "google.com", shortened: "mNa0*2", user_id: (await supabase.auth.getUser()).data.user?.id})
  // console.log(await supabase.auth.signUp({email: "add_it_ab@proton.me", password: "Akshaj01!"}))
  // console.log(await supabase.auth.signInWithPassword({email: "add_it_ab@proton.me", password: ""}))
  // if (  url.hash == "error" && url.searchParams.get("error_description")) console.log(url.searchParams.get("error_description"))
  return {
    // theme: theme,
    userData: await db.getUserData(fetch),
    entries: await db.getEntries(fetch),
    session: await supabase.auth.getSession(),
    // user: await supabase.auth.getUser(),
    // urls: (await supabase.from("shortened_urls").select()).data
    modal: cookies.get("modal") ?? null,
  };
}

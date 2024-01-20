// src/routes/api/getUsers.js

import { supabase, supabaseAdmin } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";

const userExists = async (email: string) => {
  const { data } = await supabaseAdmin.auth.admin.listUsers();
  const userEmails = data.users.map((user) => user.email);

  const isEmailInList = userEmails.includes(email);

  return isEmailInList;
};

export async function POST({ request, params }) {
  const data = { ...(await request.json()) };
  let response;
  switch (params.slug) {
    case "signup":
      response = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      break;
    case "login":
      response = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      break;
    case "shorten":
      response = await supabase.rpc("shorten", { original: data.url });
      break;
  }
  console.log(response);
  if (!response)
    return json("", { status: 400, statusText: "MALFORMED_REQUEST" });
  // @ts-ignore
  return json(response, { status: response.status ?? 200 });
}

export async function GET({ url, params }) {
  console.log(params.slug);
  if (params.slug == "exists")
    return json(await userExists(url.searchParams.get("user") || ""));
  return json(await supabase.auth.getSession());
}

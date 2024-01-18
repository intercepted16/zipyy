// src/routes/api/getUsers.js

import { supabase, supabaseAdmin } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";

const userExists = async (email: string) => {
  const { data } = await supabaseAdmin.auth.admin.listUsers();
  const userEmails = data.users.map((user) => user.email);

  const isEmailInList = userEmails.includes(email);

  return isEmailInList;
};

export async function GET(request) {
  return json(await supabase.auth.getSession());
}

import { get } from "svelte/store";
import { databaseUrl } from "../../routes/store";

export const getUserData = async (fetch) => {
  const response = await fetch("/api/userdata", {
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export const getEntries = async (fetch) => {
  const response = await fetch("/api/urls", {
    method: "GET",
  });
  const data = await response.json();
  return data.entries;
};

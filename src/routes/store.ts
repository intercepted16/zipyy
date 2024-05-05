import { writable } from "svelte/store";
import { dev } from "$app/environment";

export const loginState = writable(0);
export const signupOrLogin = writable("login");
export const id = writable(0);
export const editDialog = writable(false);
export const invalidateUrlData = writable(false);
export const shortenedUrlsRoute = !dev ? "sh.ps.ai" : "/url";

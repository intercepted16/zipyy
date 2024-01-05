import { readable, writable } from "svelte/store";

// Create a writable store
export const url = writable("");
export const shortened = writable("");
export const userData = writable("");
export const databaseUrl = readable("http://127.0.0.1:5000");
export const deleteAccountModal = writable(false);
export const logoutModal = writable(false);
export const entries = writable([]);
export const shortenedDomain = readable("sh.ps.ai");
export const urlModal = writable(false);
export const viewAllModal = writable(false);
export const loginModal = writable(false);
export const loginState = writable(0);

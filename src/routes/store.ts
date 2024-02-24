import { readable, writable } from 'svelte/store';

export const url = writable('');
export const shortened = writable('');
export const entries = writable([]);
export const shortenedDomain = readable('sh.ps.ai');
export const loginState = writable(0);
export const signupOrLogin = writable('login');
export const id = writable(0);
export const editDialog = writable(false);

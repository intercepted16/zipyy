import type { Handle } from "@sveltejs/kit";

const headers = {
    'Accept-CH': 'Sec-CH-Prefers-Color-Scheme',
    'Vary': 'Sec-CH-Prefers-Color-Scheme',
    'Critical-CH': 'Sec-CH-Prefers-Color-Scheme',
}

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);

    // Create a new Headers object and set the headers
    const newHeaders = new Headers(response.headers);
    Object.entries(headers).forEach(
        ([header, value]) => newHeaders.set(header, value)
    );

    // Return a new response with the updated headers
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
}

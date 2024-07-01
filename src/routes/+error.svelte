<script>
  import { page } from "$app/stores";
</script>

<div class="container flex flex-col items-center text-center">
  <h1 class="font-thin leading-loose">{$page.status}</h1>
  <p><strong>{$page.error?.message.toLowerCase()}</strong></p>

  <p>This site does not contain the requested file.</p>

  <p>
    If you think this is an error, please wait for a while. I use Cloudflare as a hosting service,
    so they may be down.<br />
    Please make sure you are not typoing. Some older browsers may not support root URLs &/or domains
    without protocols, so try accessing the resource requested fully, like
  </p>
  <p class="italic">https://zipyy.pages.dev/resource.html</p>

  <p>
    <a href="/" class="text-blue-500">Return to homepage</a>
    for zipyy.
  </p>

  <p><strong>Is Cloudflare down?</strong></p>
  <div id="suggestions" class="mt-4">
    <a href="https://www.cloudflarestatus.com" class="text-blue-500">Cloudflare Status</a>
    &mdash;
    <a href="https://x.com/CloudflareHelp" class="text-blue-500">@CloudflareHelp</a>
  </div>

  <a href="/" class="inline-block mt-8 text-white logo logo-img-1x">
    <img width="32" height="32" alt="zipyy" src="/img/logo.webp" class="rounded-sm" />
  </a>
</div>

<style lang="postcss">
  h1 {
    @apply text-4xl;
  }
  a {
    @apply hover:underline;
  }
  p {
    @apply my-2;
    max-width: 500px;
  }
</style>

<script>
  import { page } from "$app/stores";
</script>

<div class="container flex flex-col items-center text-center">
  <h1 class="text-6xl font-thin leading-60">{$page.status}</h1>
  <p><strong>{$page.error?.message.toLowerCase()}</strong></p>

  <p>This site does not contain the requested file.</p>

  <p>
    If you think this is an error, please wait for a while. I use Vercel as a hosting service, so
    they may be down.<br />
    Please make sure you are not typoing. Some older browsers may not support root URLs &/or domains
    without protocols, so try accessing the resource requested fully, like
  </p>
  <p class="italic">https://passmgrgui.github.io/resource.html</p>

  <p>
    <a href="/" class="text-blue-500">Return to homepage</a>
    for passmgrgui.
  </p>

  <p><strong>Is Github down?</strong></p>
  <div id="suggestions" class="mt-8">
    <a href="https://www.vercel-status.com" class="text-blue-500">Vercel Status</a>
    &mdash;
    <a href="https://twitter.com/vercel_status" class="text-blue-500">@vercel_status</a>
  </div>

  <a href="/" class="inline-block mt-8 text-white logo logo-img-1x">
    <img width="32" height="32" alt="passmgrgui" src="images/icon.webp" />
  </a>
</div>

<style lang="postcss">
  a {
    @apply hover:underline;
  }
  p {
    @apply my-2;
    max-width: 500px;
  }
</style>

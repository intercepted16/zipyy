<script>
  import {
    Footer,
    FooterBrand,
    FooterLink,
    FooterLinkGroup,
  } from "flowbite-svelte";
</script>

<Footer
  footerType="socialmedia"
  class="border-t-2 border-gray-200 dark:border-gray-700"
>
  <div class="md:flex md:justify-between">
    <div class="max-w-sm max-[958px]:mr-10 mb-10 md:mb-0">
      <FooterBrand
        href="https://flowbite.com"
        src="https://flowbite-svelte.com/images/flowbite-svelte-icon-logo.svg"
        alt="Flowbite Logo"
        name="Flowbite"
      />
      <p
        class="max-w-sm mt-4 mb-3 text-gray-600 dark:text-gray-400"
        data-svelte-h="svelte-1qg946q"
      >
        Shortly is an open source, simple URL shortener, with no tracking,
        limits or paid plans.
      </p>
      <p
        class="max-w-sm mb-3 text-gray-600 dark:text-gray-400"
        data-svelte-h="svelte-1qsuv1p"
      >
        Code licensed
        <a
          href="https://github.com/themesberg/flowbite-svelte/blob/main/LICENSE"
          class="text-primary-600 hover:underline">MIT</a
        >.
      </p>
    </div>
    <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
      <div>
        <h2
          class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"
        >
          Resources
        </h2>
        <FooterLinkGroup>
          <FooterLink liClass="mb-4" href="/">Shorten a URL</FooterLink>
          <FooterLink liClass="mb-4" href="/signup">Signup</FooterLink>
          <FooterLink liClass="mb-4" href="/login">Login</FooterLink>
        </FooterLinkGroup>
      </div>
      <div>
        <h2
          class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"
        >
          Github
        </h2>
        <FooterLinkGroup>
          <FooterLink liClass="mb-4" href="/github">Source Code</FooterLink>
          <FooterLink liClass="mb-4" href="/github-discussions"
            >Discussions</FooterLink
          >
        </FooterLinkGroup>
      </div>
      <div>
        <h2
          class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"
        >
          Legal
        </h2>
        <FooterLinkGroup>
          <FooterLink liClass="mb-4" href="/privacy">Privacy Policy</FooterLink>
          <FooterLink liClass="mb-4" href="/terms"
            >Terms & Conditions</FooterLink
          >
        </FooterLinkGroup>
      </div>
    </div>
  </div>
</Footer>

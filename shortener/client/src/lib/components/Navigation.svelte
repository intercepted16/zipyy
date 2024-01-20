<script lang="ts">
  import {
    getModalStore,
    ListBox,
    ListBoxItem,
    popup,
    type ModalSettings,
    type PopupSettings,
  } from "@skeletonlabs/skeleton";
  import { browser } from "$app/environment";
  import type { PageData } from "../../routes/$types";
  export let data: PageData;
  const modalStore = getModalStore();
  const themes: string[] = ["light", "dark", "system"];
  let selectedTheme: string;
  const popupCombobox: PopupSettings = {
    event: "click",
    target: "popupCombobox",
    placement: "bottom",
    closeQuery: ".listbox-item",
  };

  const userCombobox: PopupSettings = {
    event: "click",
    target: "userCombobox",
    placement: "bottom",
    closeQuery: ".listbox-item",
  };

  // const loginModal: ModalSettings = {
  //   type: "component",
  //   component: "loginModal",
  // };

  $: if (browser && selectedTheme) {
    let theme = selectedTheme;
    if (selectedTheme == "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : selectedTheme;
    }
    document.documentElement.classList.remove("light", "dark", "system");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", selectedTheme);
  }

  if (browser) {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && themes.includes(storedTheme)) {
      selectedTheme = storedTheme;
    }
  }
</script>

<nav class="p-4 sm:p-0">
  <div class="flex flex-col space-y-2 sm:flex-row sm:space-y-0">
    <!-- if user has a data.session, hide the el -->
    <a
      href="/signup"
      class="rounded-md btn variant-filled-primary hover:variant-filled-secondary"
      class:!hidden={data.session ?? false}
      on:click={(e) => {
        e.preventDefault();
        // modalStore.trigger(loginModal);
      }}>Signup</a
    >
    <a
      href="/login"
      class="ml-2 rounded-md btn hover:variant-soft-surface un"
      class:!hidden={data.session}
      on:click={(e) => {
        e.preventDefault();
        // modalStore.trigger(loginModal);
      }}>Login</a
    >
    {#if data.session}
      <!-- <button class="opacity-80 hover:opacity-100"
        >{data.session.user.email}
        <i class="ml-1 bi bi-chevron-down"></i>
      </button> -->
      <button
        use:popup={userCombobox}
        class="flex items-center justify-center btn hover:variant-soft-primary"
      >
        {data.session.user.email}<i
          class="ml-2 font-extrabold opacity-50 bi bi-chevron-down"
        ></i></button
      >
      <div class="p-4 shadow-xl card w-60" data-popup="userCombobox">
        <div class="space-y-4">
          <div class="space-y-2 text-center">
            <span
              >{data.session.user.email?.charAt(0).toUpperCase() +
                data.session.user.email?.split("@")[0].slice(1)}</span
            >
            <hr />
          </div>
          <nav class="list-nav">
            <ul>
              <!-- <li>
                <a
                  href="https://github.com/sponsors/skeletonlabs"
                  target="_blank"
                  rel="noreferrer"
                  ><span class="w-6 text-center"
                    ><i class="bi bi-github"></i></span
                  > <span>GitHub</span></a
                >
              </li> -->
              <li>
                <button
                  class="btn !variant-filled hover:!variant-filled-secondary"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </nav>
          <hr />
          <button class="btn variant-filled-error"
            ><i class="bi bi-trash"></i> <span>Delete account</span></button
          >
        </div>
      </div>
      <!-- <div class="p-4 my-4 shadow-xl w-60 card" data-popup="userCombobox">
        <div class="mb-2 ml-2 space-y-2">
          <span>{data.session.user.email.split("@")[0].toUpperCase()}</span>
          <hr />
        </div>
        <div class="space-y-4">
          <nav class="list-nav">
            <ul>
              <li>
                <a href="/">James</a>
              </li>
              <li><button class="btn">1</button></li>
              <li><button class="btn">hib</button></li>
              <li><button class="btn">hi</button></li>
            </ul>
          </nav>
        </div>
        <div class="arrow bg-surface-100-800-token" />
      </div> -->
    {/if}

    <button
      use:popup={popupCombobox}
      class="flex items-center justify-center btn hover:variant-soft-primary lg:mr-16"
      ><i class="bi bi-moon-stars-fill"></i>
      <i class="font-extrabold opacity-50 bi bi-chevron-down"></i></button
    >
    <div
      class="w-48 py-2 my-4 rounded-lg shadow-xl card"
      data-popup="popupCombobox"
    >
      <ListBox rounded="rounded-none">
        {#each themes as theme}
          <ListBoxItem
            bind:group={selectedTheme}
            name={theme}
            aria-selected={selectedTheme === theme}
            active="bg-primary-active-token"
            value={theme}
            >{theme.charAt(0).toUpperCase() + theme.slice(1)}</ListBoxItem
          >
        {/each}
      </ListBox>
      <div class="arrow bg-surface-100-800-token" />
    </div>
    <a
      aria-label="View on Github"
      class="github-corner uk-visible@l uk-position-absolute uk-position-top-right absolute top-0 right-0 overflow-hidden w-[74px] h-[74px] hidden lg:block"
      href="https://github.com/keepassxreboot/keepassxc"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 250 250"
        class="w-full h-full text-white dark:text-black fill-gray-800 dark:fill-slate-50 excludedText"
      >
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor"
          style="transform-origin: 130px 106px;"
        ></path>
        <path
          class="octo-body"
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor"
        ></path>
      </svg>
    </a>
  </div>
</nav>

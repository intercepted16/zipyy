<script lang="ts">
  import { onMount } from "svelte";
  import { logoutModal, deleteAccountModal, userData } from "./store";
  import {
    LightSwitch,
    ListBox,
    ListBoxItem,
    popup,
    AppBar,
  } from "@skeletonlabs/skeleton";
  import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
  import DeleteAccountModal from "../lib/components/DeleteAccountModal.svelte";
  import LogoutModal from "../lib/components/LogoutModal.svelte";
  import { goto } from "$app/navigation";
  let comboboxValue: string;
  import type { PopupSettings } from "@skeletonlabs/skeleton";
  import { browser } from "$app/environment";
  const themes: string[] = ["light", "dark", "system"];
  let selectedTheme: string;
  import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";

  const modalStore = getModalStore();
  const loginModal: ModalSettings = {
    type: "component",
    component: "loginModal",
  };
  // $: console.log(selectedTheme);
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
  const popupCombobox: PopupSettings = {
    event: "click",
    target: "popupCombobox",
    placement: "bottom",
    closeQuery: ".listbox-item",
  };

  // const storeExample: Writable<string> = localStorageStore("theme", "system");
  // console.log(storeExample.set("light"));
  // storeExample.subscribe(() => {
  //   console.log(get(storeExample));
  // });
  onMount(() => {
    if (browser) {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme && themes.includes(storedTheme)) {
        selectedTheme = storedTheme;
      }
    }
  });
</script>

<header class="relative sticky top-0 z-20 py-3 md:py-5 bg-blue blur-filter">
  <div class="max-w-6xl px-4 mx-auto sm:px-6">
    <div class="flex items-center justify-between h-10">
      <div>
        <a
          class="block"
          href="https://cruip.com/"
          rel="home"
          style="outline: none"
        >
          <span class="sr-only">Cruip</span><svg
            width="28"
            height="28"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fill-rule="evenodd">
              <path d="M28 14a3.5 3.5 0 10-7 0 3.5 3.5 0 007 0" fill="#34D399"
              ></path>
              <path
                d="M23.865 23.9a13.932 13.932 0 01-6.377 3.66c-1.115.286-2.284.44-3.488.44a13.893 13.893 0 01-10.512-4.797A13.968 13.968 0 01.048 14c0-3.523 1.298-6.742 3.44-9.203A13.893 13.893 0 0114 0c1.204 0 2.373.154 3.488.44a13.932 13.932 0 016.377 3.66l-4.933 4.95A6.942 6.942 0 0014 7c-3.852 0-6.976 3.134-6.976 7l.002.18C7.122 17.964 10.208 21 14 21c1.926 0 3.67-.784 4.932-2.05l4.933 4.95z"
                fill="#6366F1"
                fill-rule="nonzero"
              ></path>
            </g>
          </svg>
        </a>
      </div>
      <div class="inline-flex items-center">
        <nav class="hidden md:flex md:grow">
          <ul class="flex flex-wrap items-center justify-end text-sm grow">
            <button
              class="px-4 py-2 mr-5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg signupBtn loggedOutElement hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              on:click={() => goto("/signup")}
            >
              Signup
            </button>
            <Button
              class="hidden px-4 py-2 font-medium text-center text-white bg-blue-700 rounded-lg loggedOutElement loginBtn hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:block no-js-hide"
              on:click={(e) => {
                e.preventDefault();
                modalStore.trigger(loginModal);
              }}
              id="toggleAuthBtn"
            >
              Login
            </Button>
            <Button
              href="/login"
              class="hidden px-4 py-2 font-medium text-center text-white bg-blue-700 rounded-lg loggedOutElement loginBtn hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:block js-hide"
              id="toggleAuthBtn"
            >
              Login
            </Button>
            {#if $userData["email"]}
              <li class="loggedInElement">
                <button class="opacity-80 hover:opacity-100"
                  >{$userData["email"]}
                  <i class="ml-1 bi bi-chevron-down"></i>
                </button>
                <Dropdown>
                  <div slot="header" class="px-4 py-2">
                    <span
                      class="block text-sm font-medium text-gray-900 dark:text-white"
                      >{$userData["email"].split("@")[0].toUpperCase()}</span
                    >
                    <span class="block text-sm truncate"
                      >{$userData["email"]}</span
                    >
                  </div>
                  <DropdownItem on:click={() => alert("HI")}
                    >Overview (close)</DropdownItem
                  >

                  <DropdownItem
                    on:click={() => logoutModal.set(true)}
                    class="flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >Sign out</DropdownItem
                  >
                  <DropdownItem
                    on:click={() => deleteAccountModal.set(true)}
                    class="flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >Delete account</DropdownItem
                  >
                </Dropdown>
              </li>
            {/if}
            <!-- <button
              id="theme-toggle"
              type="button"
              class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
              on:click={() => {
                document.documentElement.classList.toggle(
                  "dark",
                  localStorage.getItem("theme") == "light"
                );
                localStorage.setItem(
                  "theme",
                  String(
                    localStorage.getItem("theme") == "light" ? "dark" : "light"
                  )
                );
              }}
            >
              <svg
                id="theme-toggle-dark-icon"
                class="w-5 h-5 dark:hidden"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                ></path>
              </svg>
              <svg
                id="theme-toggle-light-icon"
                class="hidden w-5 h-5 dark:block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button> -->
            <!-- <AppBar background="bg-red-500 dark:bg-orange-500">Skeleton</AppBar> -->

            <button
              class="justify-between w-16 mx-2 btn variant-filled-primary flex-center no-js-hide"
              use:popup={popupCombobox}
            >
              <i class="text-white bi bi-moon-stars-fill"></i>
            </button>

            <!-- <div
              class="w-48 py-2 shadow-xl card no-js-hide"
              data-popup="popupCombobox"
            >
              <ListBox rounded="rounded-none">
                {#each themes as theme}
                  <ListBoxItem
                    bind:group={selectedTheme}
                    name="medium"
                    aria-selected={selectedTheme === theme}
                    active="bg-primary-active-token"
                    value={theme}
                    >{theme.charAt(0).toUpperCase() +
                      theme.slice(1)}</ListBoxItem
                  >
                {/each}
              </ListBox>
              <div class="arrow bg-surface-100-800-token" />
            </div> -->
            <li>
              <a
                aria-label="View on Github"
                class="github-corner uk-visible@l uk-position-absolute uk-position-top-right absolute top-0 right-0"
                href="https://github.com/keepassxreboot/keepassxc"
              >
                <svg
                  aria-hidden="true"
                  height="50"
                  viewBox="0 0 250 250"
                  width="50"
                  class="w-20 h-20 text-white dark:text-black fill-gray-800 dark:fill-slate-50 excludedText"
                >
                  <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"
                  ></path>
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
            </li>
          </ul>
        </nav>
        <div class="flex ml-3 md:hidden sm:ml-6">
          <button
            class="hamburger"
            data-collapse-toggle="hamburger-menu"
            aria-controls="hamburger-menu"
            aria-expanded="false"
            style="outline: none"
          >
            <span class="pointer-events-none sr-only">Menu</span>
            <svg
              class="w-6 h-6 pointer-events-none fill-current text-slate-900"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="4" width="24" height="2"></rect>
              <rect y="11" width="24" height="2"></rect>
              <rect y="18" width="24" height="2"></rect>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="items-center justify-between hidden w-full md:hidden md:w-auto md:order-1 dark:text-white"
    id="hamburger-menu"
  >
    <ul
      class="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg md:p-0 bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 dark:text-white"
    >
      <li class="dark:text-white">
        <a
          href="#"
          class="block px-3 py-2 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:text-white"
          aria-current="page">Home</a
        >
      </li>
      <li class="dark:text-white">
        <a
          href="#"
          class="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >About</a
        >
      </li>
      <li class="dark:text-white">
        <a
          href="#"
          class="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >Services</a
        >
      </li>
      <li class="dark:text-white">
        <a
          href="#"
          class="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >Pricing</a
        >
      </li>
      <li class="dark:text-white">
        <a
          href="#"
          class="block px-3 py-2 text-gray-900 rounded dark:text-white md:p-0 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          >Contact</a
        >
      </li>
    </ul>
  </div>
</header>
<LogoutModal></LogoutModal>
<DeleteAccountModal></DeleteAccountModal>

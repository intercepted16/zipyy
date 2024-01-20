const systemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)".matches) ? "dark" : "light";

let theme = localStorage.theme;
if (!theme) localStorage.theme = "system";
if (localStorage.theme == "system") theme = systemTheme();
document.documentElement.classList.add(theme);

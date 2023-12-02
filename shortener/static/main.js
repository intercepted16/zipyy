const shortenedUrlsDomainName = "sh.ps.ai";
const getStoredTheme = () => localStorage.getItem("theme");
const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const setTheme = (theme) => {
  if (
    theme === "auto" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    $("html").attr("data-bs-theme", "dark");
  } else {
    $("html").attr("data-bs-theme", theme);
  }
};

setTheme(getPreferredTheme());

const showActiveTheme = (theme, focus = false) => {
  const themeSwitcher = $("#bd-theme");

  if (!themeSwitcher.length) {
    return;
  }

  const themeSwitcherText = $("#bd-theme-text");
  const activeThemeIcon = $(".theme-icon-active use");
  const btnToActive = $(`[data-bs-theme-value="${theme}"]`);
  const svgOfActiveBtn = btnToActive.find("svg use").attr("href");

  $("[data-bs-theme-value]")
    .removeClass("active")
    .attr("aria-pressed", "false");
  btnToActive.addClass("active").attr("aria-pressed", "true");
  activeThemeIcon.attr("href", svgOfActiveBtn);
  const themeSwitcherLabel = `${themeSwitcherText.text()} (${btnToActive.data(
    "bs-theme-value"
  )})`;
  themeSwitcher.attr("aria-label", themeSwitcherLabel);

  if (focus) {
    themeSwitcher.focus();
  }
};

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    const storedTheme = getStoredTheme();
    if (storedTheme !== "light" && storedTheme !== "dark") {
      setTheme(getPreferredTheme());
    }
  });
showActiveTheme(getPreferredTheme());

$("[data-bs-theme-value]").on("click", function () {
  const theme = $(this).data("bs-theme-value");
  setStoredTheme(theme);
  setTheme(theme);
  showActiveTheme(theme, true);
});

$(document).ready(async function () {
  $(".loggedInElement").addClass("d-none");
  let path = window.location.pathname;
  await checkLoginStatus();
  $("nav").removeClass("d-none");
  $("main").removeClass("d-none");

  async function checkLoginStatus() {
    const response = await fetch("userdata", {
      method: "POST",
    });
    const data = await response.json();
    if (data["logged_in"] == true) {
      if (data["email"] == null) {
        fetch("logout", {
          method: "POST",
        });
        window.location.reload();
        return 1;
      }
      if (path == "/login" || path == "/signup") {
        window.location.replace("/");
        return 1;
      }
      $("#toggleAuthBtn")
        .text("Logout")
        .on("click", function (e) {
          e.preventDefault();
          fetch("logout", {
            method: "POST",
          });
          window.location.reload();
        });
      $("#navAccountDiv").html(data["email"] + $("#navAccountDiv").html());
      $(".loggedOutElement").addClass("d-none");
      $(".loggedInElement").removeClass("d-none");
    } else {
      $("#toggleAuthBtn").on("click", function () {
        if (path != "/login") {
          window.location.href = "login";
        }
      });
      $("#signupNav").on("click", function () {
        if (path != "/signup") {
          window.location.href = "signup";
        }
      });
    }
    addEventListeners();
  }
});

function addEventListeners() {
  $("#logoutBtn").on("click", function () {
    fetch("logout", {
      method: "POST",
    });
    window.location.reload();
  });

  $("#deleteAccountBtn").on("click", function () {
    fetch("deleteaccount", {
      method: "POST",
    });
    window.location.reload();
  });
}

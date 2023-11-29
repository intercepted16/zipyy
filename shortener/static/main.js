const shortenedUrlsDomainName = "sh.ps.ai"
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
    document.documentElement.setAttribute("data-bs-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }
};

setTheme(getPreferredTheme());

const showActiveTheme = (theme, focus = false) => {
  const themeSwitcher = document.querySelector("#bd-theme");

  if (!themeSwitcher) {
    return;
  }

  const themeSwitcherText = document.querySelector("#bd-theme-text");
  const activeThemeIcon = document.querySelector(".theme-icon-active use");
  const btnToActive = document.querySelector(
    `[data-bs-theme-value="${theme}"]`
  );
  const svgOfActiveBtn = btnToActive
    .querySelector("svg use")
    .getAttribute("href");

  document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
    element.classList.remove("active");
    element.setAttribute("aria-pressed", "false");
  });

  btnToActive.classList.add("active");
  btnToActive.setAttribute("aria-pressed", "true");
  activeThemeIcon.setAttribute("href", svgOfActiveBtn);
  const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
  themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

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

window.addEventListener("DOMContentLoaded", () => {
  showActiveTheme(getPreferredTheme());

  document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const theme = toggle.getAttribute("data-bs-theme-value");
      setStoredTheme(theme);
      setTheme(theme);
      showActiveTheme(theme, true);
    });
  });
});

$(document).ready(function () {
  let path = window.location.pathname;
  let page = path.split("/").pop().trim();

  fetch("menubar", {
    method: "POST",
  })
    .then((response) => response.text())
    .then(function (data) {
      let tempDiv = $("<div>").html(data);

      let navElement = tempDiv.find("nav");

      if (navElement.length) {
        $("body").prepend(navElement);
      }
      checkLoginStatus();
      $("nav").css({
        display: "block",
      });

      $("main").css("display", "block");
    })
    .catch(function (error) {
      console.error("Error fetching menubar.html:", error);
    });

  function checkLoginStatus() {
    fetch("userdata", {
      method: "POST",
    })
      .then((response) => response.json())
      .then(function (data) {
        if (data["logged_in"] == true) {
          if (data["email"] == null) {
            fetch("logout", {
              method: "POST",
            });
            window.location.reload();
            return 1;
          }
          if (page.endsWith("login") || page.endsWith("signup")) {
            window.location.replace("/");
            return 1;
          }
          $("#loginNav")
            .text("Logout")
            .on("click", function (e) {
              e.preventDefault();
              fetch("logout", {
                method: "POST",
              });
              window.location.reload();
            });
          $("#signupNav").css("display", "none");
          $("#menubarAccountDiv").removeClass("d-none").addClass("d-flex");
          $("#menubarAccountDiv").html(
            data["email"] + $("#menubarAccountDiv").html()
          );
          $("#emailLogoutLine").css("display", "block");
          if (page.endsWith("")) {
            $("#loggedInDiv").attr("style", "display: flex !important");
          }
        } else {
          $("#loginNav").on("click", function () {
            window.location.href = "login";
          });
          $("#signupNav")
            .css("display", "block")
            .on("click", function () {
              window.location.href = "signup";
            });
        }
        addEventListeners();
      })
      .catch(function (error) {
        console.error("Error fetching userdata:", error);
      });
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

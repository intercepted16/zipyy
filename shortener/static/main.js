let path = window.location.pathname;
let fullPath = window.location.href;
let page = path.split("/").pop().trim();

fetch("get?path=templates/menubar.html")
  .then(function (response) {
    return response.text();
  })
  .then(function (data) {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = data;

    let navElement = tempDiv.querySelector("nav");

    if (navElement) {
      document.body.prepend(navElement);
    }
    setTheme();
    checkLoginStatus();
    document.querySelector("main").style.display = "block";
  })
  .catch(function (error) {
    console.error("Error fetching menubar.html:", error);
  });

function setTheme() {
  // Check if the user has a preferred color scheme stored
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.body.setAttribute("data-bs-theme", savedTheme);
    if (savedTheme == "dark") {
      document.querySelector("#signupNav").classList.remove("btn-secondary");
      document.querySelector("#signupNav").classList.add("btn-dark");
      document.querySelector("#loginNav").classList.remove("btn-secondary");
      document.querySelector("#loginNav").classList.add("btn-dark");
    }
  } else {
    // If no preferred color scheme, check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.body.setAttribute("data-bs-theme", "dark");
      try {
        document.querySelector("#signupNav").classList.remove("btn-secondary");
        document.querySelector("#signupNav").classList.add("btn-dark");
        document.querySelector("#loginNav").classList.remove("btn-secondary");
        document.querySelector("#loginNav").classList.add("btn-dark");
      } catch (e) {}
    } else {
      document.body.setAttribute("data-bs-theme", "light");
    }
  }
}

function checkLoginStatus() {
  fetch("loggedin", {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data["logged_in"] == true) {
        console.log("User is logged in");
        document.querySelector("#loginNav").textContent = "Logout";
        document
          .querySelector("#loginNav")
          .addEventListener("click", function (e) {
            e.preventDefault();
            fetch("logout", {
              method: "POST",
            });
            window.location.reload();
          });
        document.querySelector("#signupNav").style.display = "none";
        document.querySelector("#accountEmailSpan").textContent =
          data["username"];
        document.querySelector("#usernameLogoutLine").style.display = "block";
        if (page.endsWith("")) {
          console.log(page);
          document
            .querySelector("#loggedInDiv")
            .setAttribute("style", "display: flex !important");
        }
      } else {
        console.log("User is not logged in");
        document
          .querySelector("#loginNav")
          .addEventListener("click", function () {
            window.location.href = "login";
          });
        document
          .querySelector("#signupNav")
          .addEventListener("click", function () {
            window.location.href = "signup";
          });
      }
    });
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches }) => {
    const theme = matches ? "dark" : "light";
    document.body.setAttribute("data-bs-theme", theme);
    // Save the user's preferred color scheme in localStorage
    localStorage.setItem("theme", theme);
    if (theme == "light") {
      document.querySelector("#signupNav").classList.remove("btn-dark");
      document.querySelector("#signupNav").classList.add("btn-secondary");
      document.querySelector("#loginNav").classList.remove("btn-dark");
      document.querySelector("#loginNav").classList.add("btn-secondary");
    } else {
      document.querySelector("#signupNav").classList.remove("btn-secondary");
      document.querySelector("#signupNav").classList.add("btn-dark");
      document.querySelector("#loginNav").classList.remove("btn-secondary");
      document.querySelector("#loginNav").classList.add("btn-dark");
    }
  });

function truncateText(elementId, maxLength) {
  let element = document.getElementById(elementId);

  if (element.textContent.length > maxLength) {
    // Truncate the text and append an ellipsis
    let truncatedText = element.textContent.substring(0, maxLength) + "...";
    element.textContent = truncatedText;
  }
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

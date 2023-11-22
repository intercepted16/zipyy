$(document).ready(function () {
  let path = window.location.pathname;
  let page = path.split("/").pop().trim();

  let systemTheme = "light";
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    systemTheme = "dark";
  }

  fetch("get?path=templates/menubar.html", {
    method: "GET",
  })
    .then((response) => response.text())
    .then(function (data) {
      let tempDiv = $("<div>").html(data);

      let navElement = tempDiv.find("nav");

      if (navElement.length) {
        $("body").prepend(navElement);
      }
      setTheme();
      checkLoginStatus();
      setTimeout(() => {
        // Apply styles to smoothly transition the nav element
        $("nav").css({
          display: "block",
          opacity: 1,
        });

        // Make signupNav and loginNav visible
        $("#loginNav").css("display", "block");
        $("main").css("display", "block");
      }, 50);
    })
    .catch(function (error) {
      console.error("Error fetching menubar.html:", error);
    });

  function setTheme() {
    // Check if the user has a preferred color scheme stored
    const savedTheme = localStorage.getItem("theme");

    // Check the current theme applied to the body

    if (savedTheme) {
      // If the saved theme is different from the current theme, update the local storage
      if (savedTheme !== systemTheme) {
        localStorage.setItem("theme", systemTheme);
      }

      // Apply the saved theme to the body
      $("body").attr("data-bs-theme", savedTheme);

      if (savedTheme == "dark") {
        $("#signupNav").removeClass("btn-secondary").addClass("btn-dark");
        $("#loginNav").removeClass("btn-secondary").addClass("btn-dark");
      }
    } else {
      // If no preferred color scheme, check system preference
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        const systemTheme = "dark";

        // If the system theme is different from the current theme, update the local storage
        if (systemTheme !== systemTheme) {
          localStorage.setItem("theme", systemTheme);
        }

        $("body").attr("data-bs-theme", systemTheme);

        try {
          $("#signupNav").removeClass("btn-secondary").addClass("btn-dark");
          $("#loginNav").removeClass("btn-secondary").addClass("btn-dark");
        } catch (e) {}
      } else {
        const defaultTheme = "light";

        // If the default theme is different from the current theme, update the local storage
        if (defaultTheme !== systemTheme) {
          localStorage.setItem("theme", defaultTheme);
        }

        $("body").attr("data-bs-theme", defaultTheme);
      }
    }
  }

  function checkLoginStatus() {
    fetch("userdata", {
      method: "POST",
    })
      .then((response) => response.json())
      .then(function (data) {
        if (data["logged_in"] == true) {
          console.log("User is logged in");
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
          $("#accountEmailSpan").text(data["email"]);
          $("#emailLogoutLine").css("display", "block");
          if (page.endsWith("")) {
            $("#loggedInDiv").attr("style", "display: flex !important");
          }
        } else {
          console.log("User is not logged in");
          $("#loginNav").on("click", function () {
            window.location.href = "login";
          });
          $("#signupNav")
            .css("display", "block")
            .on("click", function () {
              window.location.href = "signup";
            });
        }
      })
      .catch(function (error) {
        console.error("Error fetching userdata:", error);
      });
  }

  $(window.matchMedia("(prefers-color-scheme: dark)")).on("change", (event) => {
    const matches = event.target.matches;
    console.log(matches);
    const theme = matches ? "dark" : "light";
    $("body").attr("data-bs-theme", theme);
    // Save the user's preferred color scheme in localStorage
    localStorage.setItem("theme", theme);
    console.log(`Switched: ${theme}`);
    if (theme == "light") {
      $("#signupNav").removeClass("btn-dark").addClass("btn-secondary");
      $("#loginNav").removeClass("btn-dark").addClass("btn-secondary");
    } else {
      $("#signupNav").removeClass("btn-secondary").addClass("btn-dark");
      $("#loginNav").removeClass("btn-secondary").addClass("btn-dark");
    }
  });

  // Example starter JavaScript for disabling form submissions if there are invalid fields
  (() => {
    "use strict";

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = $(".needs-validation");

    // Loop over them and prevent submission
    $.each(forms, function (index, form) {
      $(form).on("submit", function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        $(form).addClass("was-validated");
      });
    });
  })();
});

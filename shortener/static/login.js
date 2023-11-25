$("#loginBtn").on("click", async function (e) {
  e.preventDefault();
  e.stopPropagation();

  const form = $("#loginForm")[0];
  const passwordInput = $("#loginPasswordInput")[0];
  const emailInput = $("#loginEmailInput")[0];

  const response = await fetch("login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: $("#loginEmailInput").val(),
      password: $("#loginPasswordInput").val(),
    }),
  });

  const status_code = await response.text();

  if (status_code == 401) {
    emailInput.setCustomValidity("Invalid email or password.");
    $(emailInput).next().html("");
    passwordInput.setCustomValidity("Invalid email or password.");
  } else {
    emailInput.setCustomValidity("");
    passwordInput.setCustomValidity("");
  }

  if (!form.checkValidity()) {
    $("#loginForm").addClass("was-validated");
    return 1;
  }

  window.location.replace("/");
});

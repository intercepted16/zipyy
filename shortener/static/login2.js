const form = $("#loginForm")[0];
const passwordInput = $("#loginPasswordInput")[0];
const emailInput = $("#loginEmailInput")[0];

$(form).on("input", function (e) {
  $(emailInput).next().html("Please enter a valid email address.");
  $(passwordInput)
    .next()
    .html("Your password must be at least 7 characters long.");
  emailInput.setCustomValidity("");
  passwordInput.setCustomValidity("");
  if (!form.checkValidity()) {
    $("#loginBtn").attr("disabled", true);
  } else {
    $("#loginBtn").removeAttr("disabled");
  }
});

$("#loginBtn").on("click", async function (e) {
  e.preventDefault();
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
    passwordInput.setCustomValidity("Invalid email or password.");
    $(emailInput).next().html("");
    $(passwordInput).next().html("Invalid email or password.");
  } else {
    emailInput.setCustomValidity("");
    passwordInput.setCustomValidity("");
  }

  if (!form.checkValidity()) {
    $("#loginBtn").attr("disabled", true);
    return 1;
  }

  window.location.replace("/");
});

function isValidEmail(email) {
  let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  let match = email.match(pattern);

  return Boolean(match);
}

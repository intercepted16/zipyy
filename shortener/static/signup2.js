const form = $("#signupForm");
const passwordInput = $("#signupPasswordInput");
const emailInput = $("#signupEmailInput");
const signupBtn = $("#signupBtn");

$(form).on("input", function () {
  emailInput.next().html("Please enter a valid email address.");
  passwordInput
    .next()
    .html("Your password must be at least 8 characters long.");
  emailInput[0].setCustomValidity("");
  passwordInput[0].setCustomValidity("");
  if (!form[0].checkValidity()) {
    signupBtn.attr("disabled", true);
  } else {
    signupBtn.removeAttr("disabled");
  }
});

signupBtn.on("click", async function (e) {
  e.preventDefault();
  const response = await fetch("signup", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailInput.val(),
      password: passwordInput.val(),
    }),
  });

  const responseBody = await response.json();
  if (response.status == 400) {
    if (responseBody["error"] == "INVALID_EMAIL") {
      emailInput[0].setCustomValidity("Invalid email.");
      emailInput.next().html("Please enter a valid email address.");
    } else if (responseBody["error"] == "INSECURE_PASSWORD") {
      passwordInput[0].setCustomValidity(
        "Please enter a password with 8 characters, and at least 1 symbol, 2 numbers, and 3 letters."
      );
    } else {
      emailInput[0].setCustomValidity("Invalid email.");
      emailInput.next().html("Please enter a valid email address.");
      passwordInput[0].setCustomValidity(
        "Please enter a password with 8 characters, and at least 1 symbol, 2 numbers, and 3 letters."
      );
    }
  } else if (response.status == 409) {
    emailInput[0].setCustomValidity("User already exists.");
    emailInput
      .next()
      .html("User already exists. Please try again with a different email.");
  }

  if (!form[0].checkValidity()) {
    signupBtn.attr("disabled", true);
    return 1;
  }

  window.location.replace("/");
});

function isValidEmail(email) {
  let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  let match = email.match(pattern);

  return Boolean(match);
}

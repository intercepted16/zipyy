$("#signupBtn").on("click", async function (e) {
  e.preventDefault();
  const form = $("#signupForm");
  const emailInput = $("#signupEmailInput");
  const passwordInput = $("#signupPasswordInput");

  emailInput[0].setCustomValidity("");

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

  const responseBody = await response.json(); // Store the response body

  if (response.status == 400) {
    console.log(responseBody["error"]);
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
  } else {
    console.log(response.status);
    window.location.replace("/");
  }

  if (!form[0].checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
    form[0].classList.add("was-validated");
    return 1;
  }
});

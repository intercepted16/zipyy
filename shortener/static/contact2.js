const form = $("#signupForm");
const passwordInput = $("#signupPasswordInput");
const emailInput = $("#signupEmailInput");
const signupBtn = $("#signupBtn");

$(form).on("input", function () {
  if (!form[0].checkValidity()) {
    signupBtn.attr("disabled", true);
  } else {
    signupBtn.removeAttr("disabled");
  }
});

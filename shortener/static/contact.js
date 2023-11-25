const form = $("#contactForm");
form.submit(function (e) {
  if (!isValidEmail($("#contactEmailInput").val())) {
    $("#contactEmailInput")[0].setCustomValidity("Please enter a valid email");
  }
  if (!form[0].checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
    form[0].classList.add("was-validated");
    return 1;
  }
});

function isValidEmail(email) {
  let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let match = pattern.test(email);
  return match;
}

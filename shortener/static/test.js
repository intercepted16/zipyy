const form = $("#urlForm");
const urlInput = $("#urlInput");
const shortenBtn = $("#shortenBtn");

$(form).on("input", function () {
  if (!form[0].checkValidity()) {
    shortenBtn.attr("disabled", true);
  } else {
    shortenBtn.removeAttr("disabled");
  }
});

const urlModal = $("#urlModal");
console.log(urlModal[0].isVisible());

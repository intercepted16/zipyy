document.addEventListener("DOMContentLoaded", function () {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document
      .getElementsByTagName("body")[0]
      .setAttribute("data-bs-theme", "dark");
  }
});
document.querySelector(".main").style.display = "block";

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches }) => {
    if (matches) {
      document
        .getElementsByTagName("body")[0]
        .setAttribute("data-bs-theme", "dark");
    } else {
      document
        .getElementsByTagName("body")[0]
        .setAttribute("data-bs-theme", "light");
    }
  });

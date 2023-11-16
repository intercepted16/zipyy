document.addEventListener("DOMContentLoaded", function () {
  // Check if the user has a preferred color scheme stored
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.body.setAttribute("data-bs-theme", savedTheme);
  } else {
    // If no preferred color scheme, check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.body.setAttribute("data-bs-theme", "dark");
    } else {
      document.body.setAttribute("data-bs-theme", "light");
    }
  }

  // Show the body after setting the theme
  document.querySelector(".main").style.display = "block";
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches }) => {
    const theme = matches ? "dark" : "light";
    document.body.setAttribute("data-bs-theme", theme);
    // Save the user's preferred color scheme in localStorage
    localStorage.setItem("theme", theme);
  });

function truncateText(elementId, maxLength) {
  var element = document.getElementById(elementId);

  if (element.textContent.length > maxLength) {
    // Truncate the text and append an ellipsis
    var truncatedText = element.textContent.substring(0, maxLength) + "...";
    element.textContent = truncatedText;
  }
}

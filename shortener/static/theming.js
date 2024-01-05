const htmlElement = document.querySelector("html");
const root = document.querySelector(":root");
const isDarkTheme = () =>
  localStorage.getItem("theme") == "dark" ||
  (!localStorage.getItem("theme") &&
    window.matchMedia("(prefers-color-scheme: dark)").matches);
// Array of classes and regular expressions to be excluded from 'dark:text-white' addition
const excludedClasses = [
  /text-blue-.*/,
  /text-green-.*/,
  /excludedElement/,
  /text-red-.*/,
  /text-gray-300/,
  /text-yellow-.*/,
  /text-sky-.*/,
];

const excludedTags = ["script"];

root.style.colorScheme = isDarkTheme() ? "dark" : "light";

function switchTheme(element, firstRun = true, fromButton = false) {
  if (fromButton) {
    // Execute local storage change only if it's not the first global run
    localStorage.setItem(
      "theme",
      htmlElement.classList.contains("dark") ? "dark" : "light"
    );
  }

  if (firstRun) {
    root.style.colorScheme = isDarkTheme() ? "dark" : "light";
  }
  if (isDarkTheme()) {
    if (element) {
      const hasExcludedClass = excludedClasses.some((excludedClass) => {
        if (excludedClass instanceof RegExp) {
          return excludedClass.test(element.className);
        } else {
          return element.classList.contains(excludedClass);
        }
      });
      const isExcludedTag = excludedTags.includes(
        element.tagName.toLowerCase()
      );
      if (!hasExcludedClass && !isExcludedTag) {
        element.classList.add("dark:text-white");
      }

      for (let i = 0; i < element.children.length; i++) {
        switchTheme(element.children[i], excludedClasses, false);
      }
    }
  } else {
    element.classList.remove("dark:text-white");
    for (let i = 0; i < element.children.length; i++) {
      switchTheme(element.children[i], excludedClasses, false);
    }
  }
}

// Add or remove 'dark' class based on user's preference
if (isDarkTheme()) {
  htmlElement.classList.add("dark");
} else {
  htmlElement.classList.remove("dark");
}
document.addEventListener("DOMContentLoaded", function () {
  switchTheme(document.body);
  // Toggle theme icons and update color theme in local storage

  const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
  const themeToggleLightIcon = document.getElementById(
    "theme-toggle-light-icon"
  );
  const themeToggleBtn = document.getElementById("theme-toggle");

  themeToggleBtn.addEventListener("click", function () {
    // Toggle icons inside the button
    themeToggleDarkIcon.classList.toggle("hidden");
    themeToggleLightIcon.classList.toggle("hidden");

    // Toggle the dark class on the document element
    htmlElement.classList.toggle("dark");
    switchTheme(document.body, true, true);
  });

  // Check the initial theme and update icons
  updateThemeIcons();

  function updateThemeIcons() {
    themeToggleLightIcon.classList.toggle("hidden", !isDarkTheme());
    themeToggleDarkIcon.classList.toggle("hidden", isDarkTheme());
  }
});

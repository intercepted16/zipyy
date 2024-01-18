(async () => {
  const response = await fetch("/api/userdata", {
    method: "POST",
  });
  const data = await response.json();

  document.documentElement.setAttribute("loggedin", data["logged_in"]);
})();

document.documentElement.classList.add("js");

(async () => {
  const response = await fetch("/api/userdata", {
    method: "POST",
  });
  const data = await response.json();

  document.querySelector("html").setAttribute("loggedin", data["logged_in"]);
})();

document
  .querySelector("#loginButton")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    const response = await fetch("login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: document.querySelector("#loginEmailInput").value,
        password: document.querySelector("#loginPasswordInput").value,
      }),
    });
    const status_code = await response.text();
    alert(status_code);
  });

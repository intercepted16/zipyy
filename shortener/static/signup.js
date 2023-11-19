document
  .querySelector("#signupBtn")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    if (!document.querySelector("#signupForm").checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      document.querySelector("#signupForm").classList.add("was-validated");
      return 1;
    }
    const response = await fetch("signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: document.querySelector("#signupEmailInput").value,
        password: document.querySelector("#signupPasswordInput").value,
      }),
    });
    const status_code = await response.text();
    alert(status_code);
  });

const originalUrl = document.querySelector("#originalUrl");

document
  .querySelector("#shortenButton")
  .addEventListener("click", async function () {
    let childElements = document.querySelector("#inputDiv").children;
    // Iterate over the child elements, excluding the first one
    for (let i = 1; i < childElements.length; i++) {
      // Perform your desired operation here
      childElements[i].style.display = "none";
    }
    originalUrl.style.display = "block";
    originalUrl.textContent = document.querySelector("#urlInput").value;
    const response = await fetch(`add?url=${originalUrl.textContent}`, {
      method: "get",
    });
    let id = await response.text();
    alert(id);
  });

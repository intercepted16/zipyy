const originalUrl = document.querySelector("#originalUrl");

document
  .querySelector("#shortenButton")
  .addEventListener("click", async function () {
    let childElements = document.querySelector("#inputDiv").children;
    // Iterate over the child elements, excluding the first one
    for (let i = 1; i < childElements.length - 1; i++) {
      // Perform your desired operation here
      childElements[i].style.display = "none";
    }
    originalUrl.textContent = document.querySelector("#urlInput").value;
    originalUrl.setAttribute(
      "href",
      `${
        document.querySelector("#urlInput").value.startsWith("http://") ||
        document.querySelector("#urlInput").value.startsWith("https://")
          ? ""
          : "http://"
      }${document.querySelector("#urlInput").value}`
    );

    const response = await fetch(`add?url=${originalUrl.textContent}`, {
      method: "get",
    });
    let id = await response.text();
    document
      .querySelector("#shortenedUrl")
      .setAttribute("href", `http://${window.location.hostname}/${id}`);
    document.querySelector(
      "#shortenedUrl"
    ).textContent = `${window.location.hostname}/${id}`;
    truncateText("originalUrl", 25); // Replace 'myTextElement' and 50 with your element ID and desired character length
  });

const originalUrl = document.querySelector("#originalUrl");

document
  .querySelector("#shortenButton")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    const inputUrl = document.querySelector("#urlInput").value;

    // Check if the input is not empty and is a valid domain or IP
    if (inputUrl != "" && isValidUrl(inputUrl)) {
      let childElements = document
        .querySelector("#inputDiv")
        .getElementsByTagName("form")[0].children;

      // Iterate over the child elements, excluding the last one
      for (let i = 0; i < childElements.length; i++) {
        // Perform your desired operation here
        childElements[i].style.display = "none";
      }

      originalUrl.textContent = inputUrl.replace(/(^\w+:|^)\/\//, "");
      originalUrl.setAttribute(
        "href",
        `http://${inputUrl.replace(/(^\w+:|^)\/\//, "")}`
      );

      const response = await fetch(`add?url=${originalUrl.textContent}`, {
        method: "get",
      });
      const id = await response.text();
      document
        .querySelector("#shortenedUrl")
        .setAttribute("href", `http://${window.location.hostname}/${id}`);
      document.querySelector(
        "#shortenedUrl"
      ).textContent = `${window.location.hostname}/${id}`;
      truncateText("originalUrl", 25);
    }
  });

// Function to check if a given string is a valid domain or IP
function isValidUrl(url) {
  const urlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
  const ipPattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

  return url.match(urlPattern) || url.match(ipPattern);
}

document
  .querySelector("#urlsTable")
  .getElementsByTagName("tbody")[0]
  .querySelectorAll("tr")
  .forEach(function (row) {
    row
      .querySelectorAll("td")[2]
      .querySelectorAll("button")[0]
      .addEventListener("click", function () {
        navigator.clipboard.writeText(
          row.querySelectorAll("td")[1].textContent
        );
      });
  });

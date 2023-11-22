$(document).ready(function () {
  const originalUrl = $("#originalUrl");

  $("#shortenButton").on("click", async function (e) {
    e.preventDefault();
    const inputUrl = $("#urlInput").val();

    // Check if the input is not empty and is a valid domain or IP
    if (inputUrl !== "" && isValidUrl(inputUrl)) {
      let childElements = $("#inputDiv form").children();

      // Iterate over the child elements, excluding the last one
      childElements.slice(0).hide();

      originalUrl.text(inputUrl.replace(/(^\w+:|^)\/\//, ""));
      originalUrl.attr(
        "href",
        `http://${inputUrl.replace(/(^\w+:|^)\/\//, "")}`
      );

      const response = await fetch(`add?url=${originalUrl.text()}`, {
        method: "get",
      });
      const id = await response.text();
      $("#shortenedUrl")
        .attr("href", `http://${window.location.hostname}/${id}`)
        .text(`${window.location.hostname}/${id}`);
      truncateText("originalUrl", 25);
    }
  });

  // Function to check if a given string is a valid domain or IP
  function isValidUrl(url) {
    const urlPattern =
      /^((https?:)?\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.\-&%+\?=]*)*\/?$/;
    const ipPattern =
      /^((https?:)?\/\/)?((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|([0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){7}))([/\w.\-&%+\?=]*)*\/?$/;

    return url.match(urlPattern) || url.match(ipPattern);
  }

  $("#urlsTable tbody tr").each(function () {
    const button = $(this).find("td:eq(2) button:eq(0)");

    button.on("click", function () {
      const textContent = $(this).closest("tr").find("td:eq(1)").text();
      navigator.clipboard.writeText(textContent);
    });
  });
  $("#exampleModal").on("show.bs.modal", function (e) {
    //get data-id attribute of the clicked element
    const id = $(e.relatedTarget).data("id");
    $("#exampleModal").attr("data-id", id);
    $("#editUrlChangesBtn").on("click", async function () {
      if (
        $("editUrlInput").val() != "" &&
        isValidUrl($("#editUrlInput").val())
      ) {
        await fetch("edit", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            modified: $("#editUrlInput").val(),
          }),
        });
        window.location.reload();
      }
    });
  });
  $("#deleteModal").on("show.bs.modal", function (e) {
    //get data-id attribute of the clicked element
    const id = $(e.relatedTarget).data("id");
    const shortened = $(e.relatedTarget).data("shortened");
    $("#deleteModal").attr("data-id", id);
    $("#deleteUrlConf").html(
      `Are you sure you want to delete the URL <strong>${shortened}</strong>?`
    );
    $("#deleteUrlBtn").on("click", async function () {
      await fetch("delete", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      window.location.reload();
    });
  });
  $("#urlsTable td.align-middle").each(function () {
    console.log($(this).text());
    truncateText($(this), 25);
  });
  function truncateText(element, maxLength) {
    // Wrap the element in a jQuery object if it's not already
    let $element = $(element);

    if ($element.text().length > maxLength) {
      // Truncate the text and append an ellipsis
      let truncatedText = $element.text().substring(0, maxLength) + "...";
      $element.text(truncatedText);
    }
  }
});

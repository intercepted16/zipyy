$(document).ready(function () {
  const originalUrl = $("#originalUrl");

  $("#shortenButton").on("click", async function (e) {
    e.preventDefault();
    const inputUrl = $("#urlInput").val();

    if (inputUrl !== "" && isValidUrl(inputUrl)) {
      const cleanedUrl = inputUrl.replace(/(^\w+:|^)\/\//, "");

      const response = await fetch(`add`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: cleanedUrl,
        }),
      });

      if (!response.ok) {
        return 1;
      }

      $("#urlModal").modal("show");
      const id = await response.text();
      originalUrl.attr("href", `http://${cleanedUrl})}`);
      originalUrl.text(cleanedUrl);

      $("#shortenedUrl")
        .attr("href", `http://${shortenedUrlsDomainName}/${id}`)
        .html(`${shortenedUrlsDomainName}/${id}`);
      truncateText("#originalUrl", 25);
    }
  });

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
      navigator.clipboard.writeText(
        `${shortenedUrlsDomainName}/${textContent}`
      );
    });
  });

  $(".deleteUrlTrigger").each(function () {
    $(this).on("click", function () {
      $("#deleteModal").modal("show");
      const id = $(this).data("id");
      const shortened = $(this).data("shortened");
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
  });

  $("#urlModal").on("hidden.bs.modal", function () {
    window.location.reload();
  });
  $(".editUrlBtn").each(function () {
    $(this).on("click", function () {
      $("#editModal").modal("show");
      const id = $(this).data("id");
      const shortened = $(this).data("shortened");
      $("#editModal").attr("dlwata-id", id);
      $("#editUrlLabel").text(`Editing URL ${shortened}`);
      $("#editUrlChangesBtn").on("click", async function () {
        if (
          $("editUrlInput").val() != "" &&
          isValidUrl($("#editUrlInput").val())
        ) {
          const response = await fetch("edit", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
              modified: $("#editUrlInput").val(),
            }),
          });
          if (!response.ok) {
            return 1;
          }
          window.location.reload();
        }
      });
    });
  });
  function truncateText(element, maxLength) {
    let $element = $(element);

    if ($element.text().length > maxLength) {
      let truncatedText = $element.text().substring(0, maxLength) + "...";
      $element.text(truncatedText);
    }
  }
  $("#urlsTable td.align-middle").each(function () {
    truncateText($(this), 25);
  });
});

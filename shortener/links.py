from init import *


@app.route("/<path:shortened>")
def _redirect(shortened):
    destination_url = get_destination_url(shortened)
    return (
        redirect(f"http://{destination_url}")
        if destination_url is not None
        else abort(404)
    )

@app.errorhandler(404)
def page_not_found(e):
    return redirect("https://shortly.duckdns.org/")
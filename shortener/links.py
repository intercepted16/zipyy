from init import *

init_()


@app.route("/<path:shortened>")
def redirect_(shortened):
    destination_url = get_destination_url(shortened)
    return (
        redirect(f"http://{destination_url}")
        if destination_url is not None
        else abort(404)
    )

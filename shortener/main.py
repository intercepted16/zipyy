from init import *


@app.route("/")
def index():
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("USE shortener")
        urls = []
        user_id = current_user.get_id()
        if user_id is not None:
            cur.execute(
                "SELECT original, shortened FROM urls WHERE user_id = %s",
                user_id,
            )
            rows = cur.fetchall()
            for row in rows:
                urls.append({"original": row[0], "shortened": row[1]})
    return render_template("index.html", urls=urls if urls else None)


@app.route("/<path:shortened>")
def _redirect(shortened):
    destination_url = get_destination_url(shortened)
    return (
        redirect(f"http://{destination_url}")
        if destination_url is not None
        else abort(404)
    )


@app.route("/add")
def add():
    url = request.args.get("url")
    ran_id = ""

    if url is not None and url != "":
        conn = get_connection()
        with conn.cursor() as cur:
            while (
                ran_id == ""
                or cur.execute(
                    "SELECT shortened FROM urls WHERE shortened=%s", (ran_id,)
                )
                > 0
            ):
                ran_id = "".join(
                    random.choice(string.ascii_letters + string.digits)
                    for _ in range(ID_LENGTH)
                )

            # Insert the new URL and its corresponding shortened ID into the database
            cur.execute(
                "INSERT INTO urls (ORIGINAL, shortened, user_id) VALUES (%s, %s, %s)",
                (url, ran_id, current_user.get_id()),
            )
            conn.commit()
        conn.close()
    return ran_id


@app.route("/cookie", methods=["POST"])
def add_cookies():
    data = request.json
    # Get the values of 'key' and 'value' from the POST request
    key = data["key"]
    value = data["value"]
    # Check if both 'key' and 'value' are present in the request
    if key is None or value is None:
        return "400"

    # Create a response object
    response = make_response("200")
    expiration_time = datetime.datetime.now() + datetime.timedelta(weeks=2)
    # Add the cookies to the response
    response.set_cookie(key, value, expires=expiration_time)

    return response


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


@app.route("/get")
def get():
    path = request.args.get("path")
    if path is not None and path != "" and os.path.exists(path):
        with open(path, "r") as file:
            return file.read()
    return "404"


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        data = request.json
        email = data["email"]
        password = data["password"]
        print(email, password)
        """Create an user object & call the signup method."""
        user = User(user=email, password=password)
        user.signup()
        return "200"
    else:
        return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.json
        email = data["email"]
        password = data["password"]
        """Create a user object & call the login method."""
        user = User(user=email, password=password)
        return user.login()
    else:
        return render_template("login.html")


@app.route("/userdata", methods=["GET", "POST"])
def logged_in():
    if not current_user.is_authenticated:
        return jsonify({"logged_in": False, "user_id": None, "username": None})
    return jsonify(
        {
            "logged_in": True,
            "user_id": current_user.get_id(),
            "username": current_user.get_username(),
            "urls": current_user.get_urls(),
        }
    )


@app.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return "200"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)

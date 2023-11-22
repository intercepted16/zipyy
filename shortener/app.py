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
                "SELECT original, shortened, id FROM urls WHERE user_id = %s",
                user_id,
            )
            rows = cur.fetchall()
            for row in rows:
                urls.append({"original": row[0], "shortened": row[1], "id": row[2]})
    conn.close()
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

            """Check if the entry before the current entry was an entry before the previous version of the current entry,
                implying that the current entry's ID should be subtracted by 1."""
            try:
                cur.execute("SELECT * FROM urls ORDER BY id DESC LIMIT 1")
                id = cur.fetchone()[0]
                cur.execute("SELECT deleted FROM urls WHERE id = %s", id)
                if bool(cur.fetchone()[0]):
                    cur.execute(
                        "INSERT INTO urls (id, ORIGINAL, shortened, user_id) VALUES (%s, %s, %s, %s)",
                        (id + 1, url, ran_id, current_user.get_id()),
                    )
                    cur.execute("UPDATE urls SET deleted = 0 WHERE id = %s", id)
                else:
                    print("not deleted above it")
                    cur.execute(
                        "INSERT INTO urls (ORIGINAL, shortened, user_id) VALUES (%s, %s, %s)",
                        (url, ran_id, current_user.get_id()),
                    )
            except TypeError:
                # First entry
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
        return jsonify({"logged_in": False, "user_id": None, "email": None})
    return jsonify(
        {
            "logged_in": True,
            "user_id": current_user.get_id(),
            "email": current_user.get_email(),
            "urls": current_user.get_urls(),
        }
    )


@app.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return "200"


@app.route("/delete", methods=["POST"])
def delete():
    id = request.json["id"]
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("USE shortener")
        if id != 1:
            cur.execute("UPDATE urls SET deleted = 1 WHERE id = %s", id - 1)
        cur.execute("DELETE FROM urls WHERE id = %s", id)
        conn.commit()
    conn.close()
    return "200"


@app.route("/edit", methods=["POST"])
def edit():
    data = request.json
    id = data["id"]
    modify = data["modified"]
    print(id, modify)
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("USE shortener")
        cur.execute(
            "UPDATE urls SET original = %s WHERE id = %s",
            (modify, id),
        )
        conn.commit()
    conn.close()
    return "200"


@app.route("/sourcecode")
def source_code():
    return redirect("https://github.com/passmgrgui/Shortly")


@app.route("/noscript")
def no_script():
    return render_template("noscript.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)

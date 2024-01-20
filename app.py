from init import *


@api.route("/urls")
def urls():
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
    print(urls)
    return jsonify({"entries": urls})


@api.route("/add", methods=["POST"])
def add():
    url = request.json["url"]
    ran_id = ""
    if url is not None and url != "" and isValidUrl(url):
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
                    cur.execute(
                        "INSERT INTO urls (ORIGINAL, shortened, user_id) VALUES (%s, %s, %s)",
                        (url, ran_id, current_user.get_id()),
                    )
            except TypeError:
                # First entry
                cur.execute(
                    "INSERT INTO urls (id, original, shortened, user_id) VALUES (1, %s, %s, %s)",
                    (url, ran_id, current_user.get_id()),
                )
            conn.commit()
        conn.close()
        return jsonify({"shortened": ran_id})
    else:
        abort(400)


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


@api.route("/signup", methods=["POST"])
def signup():
    if request.method == "POST":
        data = request.json
        email = data["email"]
        password = data["password"]
        if not is_valid_email(email) and not is_secure_password(password):
            return make_response(jsonify({"error": "ALL_INVALID"}), 400)
        if not is_valid_email(email):
            return make_response(jsonify({"error": "INVALID_EMAIL"}), 400)
        elif not is_secure_password(password):
            return make_response(jsonify({"error": "INSECURE_PASSWORD"}), 400)

        """Create an user object & call the signup method."""
        user = User(user=email, password=password)
        status = user.signup()
        if status == 409:
            return make_response(jsonify({"error": "USER_ALREADY_EXISTS"}), 409)
        user.login()
        return "200"


@api.route("/login", methods=["POST"])
def login():
    if request.method == "POST":
        data = request.json
        email = data["email"]
        password = data["password"]
        """Create a user object & call the login method."""
        user = User(user=email, password=password)
        return make_response("", user.login())


@api.route("/userdata", methods=["GET", "POST"])
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


@api.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return "200"


@api.route("/delete", methods=["POST"])
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


@api.route("/edit", methods=["POST"])
def edit():
    data = request.json
    id = data["id"]
    modify = data["modified"]
    if not isValidUrl(modify):
        abort(400)
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


@api.route("/sourcecode")
def source_code():
    return redirect("https://github.com/passmgrgui/Shortly")


@api.route("/noscript")
def no_script():
    return render_template("noscript.html")


@api.route("/deleteaccount", methods=["DELETE"])
def delete_account():
    current_user.delete_account()
    return "200"


@api.route("/contact2")
def contact2():
    return render_template("contact2.html")


def isValidUrl(url):
    url_pattern = r"^((https?:)?\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.\-&%+\?=]*)*\/?$"
    ip_pattern = r"^((https?:)?\/\/)?((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|([0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){7}))([/\w.\-&%+\?=]*)*\/?$"
    return re.match(url_pattern, url, re.IGNORECASE) or re.match(
        ip_pattern, url, re.IGNORECASE
    )


def is_valid_email(email):
    email_pattern = r"^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
    return re.match(email_pattern, email, re.IGNORECASE)


def is_secure_password(password):
    # Ensure the password is at least 8 characters long
    if len(password) < 8:
        return False

    # Ensure the password contains at least one symbol
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False

    # Ensure the password contains at least two numbers
    if not re.search(r"\d.*\d", password):
        return False

    # Ensure the password contains at least three letters
    if not re.search(r"[a-zA-Z].*[a-zA-Z].*[a-zA-Z]", password):
        return False

    # If all conditions are met, the password is considered secure
    return True


app.register_blueprint(api)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

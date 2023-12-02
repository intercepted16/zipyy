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


@app.route("/add", methods=["POST"])
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
        return ran_id
    else:
        abort(400)


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/nav", methods=["POST"])
def nav():
    with open(NAV_PATH, "r") as file:
        return file.read()


@app.route("/signup", methods=["GET", "POST"])
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
    else:
        if current_user.is_authenticated:
            return redirect("/")
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
        if current_user.is_authenticated:
            return redirect("/")
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


@app.route("/sourcecode")
def source_code():
    return redirect("https://github.com/passmgrgui/Shortly")


@app.route("/noscript")
def no_script():
    return render_template("noscript.html")


@app.route("/deleteaccount", methods=["POST"])
def delete_account():
    current_user.delete_account()
    return "200"


def isValidUrl(url):
    urlPattern = r"^((https?:)?\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.\-&%+\?=]*)*\/?$"
    ipPattern = r"^((https?:)?\/\/)?((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|([0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){7}))([/\w.\-&%+\?=]*)*\/?$"
    return re.match(urlPattern, url) or re.match(ipPattern, url)


def is_valid_email(email):
    # Define the regular expression pattern for a simple email validation
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    # Use re.match to check if the email matches the pattern
    match = re.match(pattern, email)

    # If there is a match, return True, otherwise return False
    return bool(match)


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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)

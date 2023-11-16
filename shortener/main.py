from os import abort, path
from conf import *
from flask import Flask, request, render_template, redirect, abort
import sys
import sqlite3
import random
import string


con = sqlite3.connect("database/urls.db", check_same_thread=False)
cur = con.cursor()


def get_destination_url(path):
    # Use proper SQL query to retrieve the destination_url based on the path
    cur.execute("SELECT ORIGINAL FROM URLS WHERE SHORTENED=?", (path,))
    result = cur.fetchone()

    if result:
        return result[0]
    else:
        return None


def get_html(path):
    with open(path, "r") as file:
        html = file.read()
    return html


if getattr(sys, "frozen", False):
    template_folder = path.join(sys._MEIPASS, "templates")
    static_folder = path.join(sys._MEIPASS, "static")
    app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)
else:
    app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/<path:path>")
def _redirect(path):
    return (
        redirect(f"http://{get_destination_url(path)}")
        if get_destination_url(path) is not None
        else abort(404)
    )


@app.route("/add")
def add():
    url = request.args.get("url")
    ran_id = ""

    if url is not None and url != "":
        while (
            ran_id == ""
            or cur.execute(
                "SELECT SHORTENED FROM URLS WHERE SHORTENED=?;", (ran_id,)
            ).fetchone()
        ):
            ran_id = "".join(
                random.choice(string.ascii_letters + string.digits)
                for _ in range(ID_LENGTH)
            )

        # Insert the new URL and its corresponding shortened ID into the database
        cur.execute(
            "INSERT INTO URLS (ORIGINAL, SHORTENED) VALUES (?, ?);", (url, ran_id)
        )
        con.commit()
    return ran_id


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)

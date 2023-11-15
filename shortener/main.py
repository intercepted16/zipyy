from os import path
import sys
from conf import *
from flask import Flask, request, render_template
import sys
import sqlite3
import random
import string
import os


def get_html(path):
    with open(path, "r") as file:
        html = file.read()
    return html


def update():
    for file in os.listdir("redirects"):
        name = file[:-5]
        print(name)
        print(get_html(f"redirects/{name}.html"))

        # Use a default argument to capture the current value of name
        app.route(f"/{name}", endpoint=name)(
            lambda n=name: get_html(f"redirects/{n}.html")
        )


con = sqlite3.connect("database/urls.db", check_same_thread=False)
cur = con.cursor()

if getattr(sys, "frozen", False):
    template_folder = path.join(sys._MEIPASS, "templates")
    static_folder = path.join(sys._MEIPASS, "static")
    app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)
else:
    app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/add")
def add():
    url = request.args.get("url")
    ran_id = ""

    if url is not None and url != "":
        while ran_id == cur.execute("SELECT SHORTENED FROM URLS;") or ran_id == "":
            ran_id = "".join(
                random.choice(string.ascii_letters + string.digits)
                for _ in range(ID_LENGTH)
            )

        # Insert the new URL and its corresponding shortened ID into the database
        cur.execute(
            "INSERT INTO URLS (ORIGINAL, SHORTENED) VALUES (?, ?);", (url, ran_id)
        )
        con.commit()

        # After an ID that is not in the database has been found,
        # dynamically create a webpage that redirects to the original URL
        with open(f"redirects/{ran_id}.html", "w") as file:
            html = f"""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Redirecting you...</title>
                </head>
                <body>
                    <noscript>
                      <meta http-equiv="refresh" content="0; URL=http://{url}">
                    </noscript>
                    <script>
                        window.location.replace('http://' + '{url}')
                    </script>
                </body>
                </html>
                """
            file.write(html)
    update()
    return ran_id


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    update()
    app.run(host="0.0.0.0", port=80, debug=True)

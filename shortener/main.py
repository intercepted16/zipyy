import os
from flask import Flask, request, render_template, redirect, abort
import random
import string
import pymysql
from conf import *
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

db_config = {
    "host": DATABASE_HOST,
    "port": DATABASE_PORT,
    "user": DATABASE_ROOT_USERNAME,
    "password": os.getenv("DATABASE_ROOT_PASSWORD"),
}


def create_database():
    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:
        cursor.execute("CREATE DATABASE IF NOT EXISTS shortener")
    connection.close()


def get_connection():
    conn = pymysql.connect(**db_config)
    conn.select_db("shortener")  # Select the 'shortener' database
    return conn


# Create the database if it doesn't exist
create_database()

# Create the table if it doesn't exist
conn = get_connection()
with conn.cursor() as cur:
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS urls (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            ORIGINAL VARCHAR(255) NOT NULL,
            SHORTENED VARCHAR(50) NOT NULL
        )
    """
    )
    conn.commit()
conn.close()


def get_destination_url(shortened):
    # Use proper SQL query to retrieve the destination_url based on the path
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT ORIGINAL FROM urls WHERE SHORTENED=%s", (shortened,))
        result = cur.fetchone()
    conn.close()

    if result:
        return result[0]
    else:
        return None


@app.route("/")
def index():
    return render_template("index.html")


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
                    "SELECT SHORTENED FROM urls WHERE SHORTENED=%s", (ran_id,)
                )
                > 0
            ):
                ran_id = "".join(
                    random.choice(string.ascii_letters + string.digits)
                    for _ in range(ID_LENGTH)
                )

            # Insert the new URL and its corresponding shortened ID into the database
            cur.execute(
                "INSERT INTO urls (ORIGINAL, SHORTENED) VALUES (%s, %s)",
                (url, ran_id),
            )
            conn.commit()
        conn.close()
    return ran_id


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)

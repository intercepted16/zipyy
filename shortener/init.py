from dotenv import load_dotenv
from logging import FileHandler, WARNING
import os
from markupsafe import Markup
from flask import (
    Flask,
    request,
    render_template,
    redirect,
    abort,
    make_response,
    jsonify,
    session,
)
import random
import string
import pymysql
import bcrypt
import datetime
from conf import *
from flask_login import (
    UserMixin,
    LoginManager,
    login_user,
    login_required,
    logout_user,
    current_user,
)
import re

load_dotenv()
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
login_manager = LoginManager(app)
login_manager.login_view = "login"  # Specify the login view route


db_config = {
    "host": DATABASE_HOST,
    "port": DATABASE_PORT,
    "user": DATABASE_ROOT_USERNAME,
    "password": os.getenv("DATABASE_ROOT_PASSWORD"),
}


def _init():
    create_database()

    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email TEXT,
                hash TEXT,
                deleted BOOLEAN DEFAULT FALSE
            )
            """
        )

        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS urls (
                id INT AUTO_INCREMENT PRIMARY KEY,
                original TEXT NOT NULL,
                shortened VARCHAR(%s) NOT NULL,
                deleted BOOLEAN DEFAULT FALSE,
                user_id INT
            )
            """,
            (ID_LENGTH,),
        )

        conn.commit()

    conn.close()


def get_destination_url(shortened):
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT ORIGINAL FROM urls WHERE shortened=%s", (shortened,))
        result = cur.fetchone()
    conn.close()

    if result:
        return result[0]
    else:
        return None


def get_connection():
    conn = pymysql.connect(**db_config)
    conn.select_db("shortener")  # Select the 'shortener' database
    return conn


def create_database():
    connection = pymysql.connect(**db_config)
    with connection.cursor() as cur:
        cur.execute("CREATE DATABASE IF NOT EXISTS shortener")
    connection.close()


class User(UserMixin):
    def __init__(self, user_id=None, user=None, password=None):
        self.user_id = user_id
        self.user = user
        self.password = password
        self.db_connection = None

    def get_email(self):
        conn = pymysql.connect(**db_config)
        with conn.cursor() as cur:
            cur.execute("USE shortener")
            cur.execute("SELECT email FROM users WHERE id = %s", self.user_id)
            user = cur.fetchone()
        return user[0] if user is not None else None

    def get_urls(self):
        conn = pymysql.connect(**db_config)
        with conn.cursor() as cur:
            cur.execute("USE shortener")
            cur.execute("SELECT shortened FROM urls WHERE user_id = %s", self.user_id)
            rows = cur.fetchall()
            urls = []
            for row in rows:
                urls.append(row[0])
            return urls

    def get_id(self):
        return str(self.user_id)

    def _connect_to_database(self):
        try:
            self.db_connection = pymysql.connect(
                host=DATABASE_HOST,
                user=DATABASE_ROOT_USERNAME,
                password=os.getenv("DATABASE_ROOT_PASSWORD"),
                db="shortener",
                charset="utf8mb4",
                cursorclass=pymysql.cursors.DictCursor,
            )
            return True
        except pymysql.Error as e:
            print(f"Error: {e}")
            return False

    def _close_database_connection(self):
        if self.db_connection and self.db_connection.open:
            self.db_connection.close()

    def signup(self):
        if not self._connect_to_database():
            return "Error connecting to the database"

        try:
            with self.db_connection.cursor() as cur:
                # Check if the user already exists
                cur.execute("SELECT * FROM users WHERE email = %s", (self.user,))
                existing_user = cur.fetchone()

                if existing_user:
                    return 409

                hashed_password = bcrypt.hashpw(
                    self.password.encode(), bcrypt.gensalt()
                ).decode("utf8")

                try:
                    cur.execute("SELECT * FROM users ORDER BY id DESC LIMIT 1")
                    id = cur.fetchone()["id"]
                    cur.execute("SELECT deleted FROM users WHERE id = %s", id)
                    if bool(cur.fetchone()["deleted"]):
                        cur.execute(
                            "INSERT INTO users (id, email, hash) VALUES (%s, %s, %s)",
                            (id + 1, self.user, hashed_password),
                        )
                        cur.execute("UPDATE users SET deleted = 0 WHERE id = %s", id)
                    else:
                        cur.execute(
                            "INSERT INTO users (email, hash) VALUES (%s, %s)",
                            (self.user, hashed_password),
                        )
                except TypeError:
                    # First entry
                    cur.execute(
                        "INSERT INTO users (id, email, hash) VALUES (1, %s, %s)",
                        (self.user, hashed_password),
                    )

                self.db_connection.commit()
                user_id = cur.lastrowid

                user_obj = User(
                    user_id=user_id, user=self.user, password=hashed_password
                )
                login_user(user_obj)

                return f"User created with ID: {user_id}"

        finally:
            self._close_database_connection()

    def login(self, remember=True):
        if not self._connect_to_database():
            return "Error connecting to the database"

        try:
            with self.db_connection.cursor() as cur:
                # Check if the user exists
                cur.execute("SELECT * FROM users WHERE email = %s", (self.user,))
                user = cur.fetchone()
                print(f"Logging in: {self.user}, {self.password}")

                if not user:
                    return "401"

                # Check if the password matches
                if not bcrypt.checkpw(
                    self.password.encode(), user["hash"].encode("utf-8")
                ):
                    return "401"

                # Create a User object and login the user
                user_obj = User(
                    user_id=user["id"], user=user["email"], password=user["hash"]
                )
                login_user(user_obj, remember=remember)

                return "200"

        except pymysql.Error as e:
            print(f"Error: {e}")
            return "Error during login"

        finally:
            self._close_database_connection()

    def delete_account(self):
        if not self._connect_to_database():
            return "Error connecting to the database"

        """Create a database connection, and execute a query to remove the row from the users table where the
        user ID is equal to the current user's ID."""
        with self.db_connection.cursor() as cur:
            print(f"Deleting: {self.user_id}")
            if self.user_id != 1:
                cur.execute(
                    "UPDATE users SET deleted = 1 WHERE id = %s", int(self.user_id) - 1
                )
            cur.execute("DELETE FROM users WHERE id = %s", self.user_id)
            """"Delete the row(s) from the users table where the user ID is equal to the current users ID."""
            cur.execute("DELETE FROM urls WHERE user_id = %s", self.user_id)

        # Commit changes to the database
        self.db_connection.commit()
        self._close_database_connection()


@login_manager.user_loader
def load_user(user_id):
    # This function is required by Flask-Login to reload a user from the user_id stored in the session
    return User(user_id=user_id)


_init()

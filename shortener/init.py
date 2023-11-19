from dotenv import load_dotenv
import os
from flask import (
    Flask,
    request,
    render_template,
    redirect,
    abort,
    make_response,
    jsonify,
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


load_dotenv()
app = Flask(__name__)
app.config["SECRET_KEY"] = "your_secret_key"  # Change this to a secure random key
login_manager = LoginManager(app)
login_manager.login_view = "login"  # Specify the login view route


db_config = {
    "host": DATABASE_HOST,
    "port": DATABASE_PORT,
    "user": DATABASE_ROOT_USERNAME,
    "password": os.getenv("DATABASE_ROOT_PASSWORD"),
}


def _init():
    # Create the database if it doesn't exist
    create_database()

    # Create the table if it doesn't exist
    conn = get_connection()
    with conn.cursor() as cur:
        # Create users table
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username TEXT,
                hash TEXT
            )
            """
        )

        # Create urls table
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS urls (
                id INT AUTO_INCREMENT PRIMARY KEY,
                original TEXT NOT NULL,
                shortened VARCHAR(%s) NOT NULL,
                user_id INT
            )
            """,
            (ID_LENGTH,),
        )

        conn.commit()

    conn.close()


def get_destination_url(shortened):
    # Use proper SQL query to retrieve the destination_url based on the path
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
    with connection.cursor() as cursor:
        cursor.execute("CREATE DATABASE IF NOT EXISTS shortener")
    connection.close()


class User(UserMixin):
    def __init__(self, user_id=None, user=None, password=None):
        self.user_id = user_id
        self.user = user
        self.password = password
        self.db_connection = None

    def get_username(self):
        conn = pymysql.connect(**db_config)
        with conn.cursor() as cur:
            cur.execute("USE shortener")
            cur.execute("SELECT username FROM users WHERE id = %s", self.user_id)
            user = cur.fetchone()
        return user

    def get_id(self):
        return str(self.user_id)  # Convert to string if the ID is not a string

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
            with self.db_connection.cursor() as cursor:
                # Check if the user already exists
                cursor.execute("SELECT * FROM users WHERE username = %s", (self.user,))
                existing_user = cursor.fetchone()

                if existing_user:
                    return "User already exists"

                # Create a new user with a hashed password
                hashed_password = bcrypt.hashpw(
                    self.password.encode(), bcrypt.gensalt()
                )
                cursor.execute(
                    "INSERT INTO users (username, hash) VALUES (%s, %s)",
                    (self.user, hashed_password.decode("utf-8")),
                )
                self.db_connection.commit()
                user_id = cursor.lastrowid

                # Log in the newly created user
                user_obj = User(
                    user_id=user_id, user=self.user, password=hashed_password
                )
                login_user(user_obj)

                return f"User created with ID: {user_id}"

        except pymysql.Error as e:
            print(f"Error: {e}")
            return "Error creating user"

        finally:
            self._close_database_connection()

    def login(self, remember=True):
        if not self._connect_to_database():
            return "Error connecting to the database"

        try:
            with self.db_connection.cursor() as cursor:
                # Check if the user exists
                cursor.execute("SELECT * FROM users WHERE username = %s", (self.user,))
                user = cursor.fetchone()
                print(f"Logging in: {self.user}, {self.password}")

                if not user:
                    return "User not found"

                # Check if the password matches
                if not bcrypt.checkpw(
                    self.password.encode(), user["hash"].encode("utf-8")
                ):
                    return "401"

                # Create a User object and login the user
                user_obj = User(
                    user_id=user["id"], user=user["username"], password=user["hash"]
                )
                login_user(user_obj, remember=remember)

                return "200"

        except pymysql.Error as e:
            print(f"Error: {e}")
            return "Error during login"

        finally:
            self._close_database_connection()

    def logout(self):
        # Check if the user is logged in and perform logout actions (session log-file, not implemented here)
        # Your implementation for logout goes here
        return "Logout successful"


@login_manager.user_loader
def load_user(user_id):
    # This function is required by Flask-Login to reload a user from the user_id stored in the session
    return User(user_id=user_id)


_init()

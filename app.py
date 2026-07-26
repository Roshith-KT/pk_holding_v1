from pathlib import Path
import os

from flask import Flask, abort, send_from_directory


BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__, static_folder=None)


PAGES = {
    "": "index.html",
    "home": "index.html",
    "about": "about.html",
    "showroom": "showroom.html",
    "achievements": "achievements.html",
}


def safe_send(relative_path: str):
    """Serve only files that are inside this website folder."""
    requested = (BASE_DIR / relative_path).resolve()
    if os.path.commonpath([str(BASE_DIR), str(requested)]) != str(BASE_DIR):
        abort(404)
    if not requested.is_file():
        abort(404)
    return send_from_directory(BASE_DIR, relative_path)


@app.route("/")
def home():
    return safe_send("index.html")


@app.route("/<path:path>")
def serve_website(path):
    clean_path = path.strip("/")

    if clean_path in PAGES:
        return safe_send(PAGES[clean_path])

    if clean_path.endswith("/"):
        clean_path = clean_path[:-1]
        if clean_path in PAGES:
            return safe_send(PAGES[clean_path])

    # Allows direct access to files like:
    # /styles.css, /app.js, /assets/showroom/walk-inside-showroom.mp4
    return safe_send(clean_path)


@app.errorhandler(404)
def not_found(_error):
    return (
        "<h1>PK Holding</h1>"
        "<p>Page not found.</p>"
        '<p><a href="/">Return to homepage</a></p>',
        404,
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    app.run(host="0.0.0.0", port=port)

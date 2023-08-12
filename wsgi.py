"""Application entry point."""
from app import App

app = App()

if __name__ == "__main__":
    app.run(host="0.0.0.0")

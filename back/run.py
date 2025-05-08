from src.main.server.configs import socketio
from src.main.server.server import app

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
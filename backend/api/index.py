import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set production data dir to /tmp
os.environ["DATA_DIR"] = "/tmp/securevault_data"
os.environ["DATABASE_PATH"] = "/tmp/database.db"

from app.main import app

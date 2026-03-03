# backend/celery_worker.py

from app import create_app
from app.celery_app import create_celery, celery

# Create Flask app
flask_app = create_app()

# Create Celery instance
celery = create_celery(flask_app)

# 🔥 Explicit import so tasks register
import app.tasks.etims_tasks
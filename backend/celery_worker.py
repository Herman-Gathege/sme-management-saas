#backend/celery_worker.py
from app import create_app
from app.celery_app import create_celery

flask_app = create_app()
celery = create_celery(flask_app)

# autodiscover tasks
celery.autodiscover_tasks(['app.tasks'])
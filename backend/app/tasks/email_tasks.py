# backend/app/tasks/email_tasks.py

# from celery_worker import celery

# @celery.task(name="tasks.send_email_task")
# def send_email_task(user_id, notification_id):
#     print(f"Sending email to user {user_id} for notification {notification_id}")

from app.celery_app import celery

@celery.task
def send_email_task(user_id, notification_id):
    print(f"Sending email to user {user_id} for notification {notification_id}")
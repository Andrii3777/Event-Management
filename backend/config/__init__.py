# Import the Celery app so `@shared_task` decorators register with it
# as soon as Django starts (standard Celery + Django wiring).
from .celery import celery_app

__all__ = ("celery_app",)

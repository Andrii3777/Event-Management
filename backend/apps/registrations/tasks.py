import logging
from smtplib import SMTPException

from celery import shared_task
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils import timezone

from apps.events.models import Event

logger = logging.getLogger(__name__)

User = get_user_model()


@shared_task(
    ignore_result=True,
    autoretry_for=(SMTPException, ConnectionError),
    retry_backoff=True,
    max_retries=3,
)
def send_registration_email(user_id: int, event_id: int) -> None:
    """Plain-text confirmation email. Takes ids, not model instances (spec §9):
    by the time the worker runs, the objects may already be gone or changed.
    """
    try:
        user = User.objects.get(pk=user_id)
        event = Event.objects.get(pk=event_id)
    except (User.DoesNotExist, Event.DoesNotExist):
        logger.warning(
            "Skipping registration email: user_id=%s event_id=%s no longer exists",
            user_id,
            event_id,
        )
        return

    local_date = timezone.localtime(event.date)
    subject = f"You are registered for {event.title}"
    message = (
        f"You are registered for {event.title}.\n"
        f"Date: {local_date.strftime('%Y-%m-%d %H:%M')}\n"
        f"Location: {event.location}\n\n"
        "This confirms your registration."
    )
    send_mail(subject, message, None, [user.email])

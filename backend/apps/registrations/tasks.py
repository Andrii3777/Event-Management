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
def send_join_confirmation_email(user_id: int, event_id: int) -> None:
    """Plain-text confirmation email. Takes IDs to avoid stale model instances."""
    try:
        user = User.objects.get(pk=user_id)
        event = Event.objects.get(pk=event_id)
    except (User.DoesNotExist, Event.DoesNotExist):
        logger.warning(
            "Skipping join confirmation email: user_id=%s event_id=%s no longer exists",
            user_id,
            event_id,
        )
        return

    user_email = getattr(user, "email", None)
    if not user_email:
        logger.warning("Skipping join confirmation email: user_id=%s has no email", user_id)
        return

    local_date = timezone.localtime(event.date)
    subject = f"You joined {event.title}"
    message = (
        f"You have joined {event.title}.\n"
        f"Date: {local_date.strftime('%Y-%m-%d %H:%M')}\n"
        f"Location: {event.location}\n\n"
        "This confirms your participation."
    )
    try:
        send_mail(subject, message, None, [user_email])
    except Exception as exc:
        logger.error(
            "Failed to send confirmation email to %s for event %s: %s",
            user_email,
            event_id,
            exc,
        )
        from django.conf import settings

        if not getattr(settings, "CELERY_TASK_ALWAYS_EAGER", False):
            raise


send_registration_email = send_join_confirmation_email

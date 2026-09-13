from django.db import IntegrityError, transaction
from django.utils import timezone

from .exceptions import AlreadyRegistered, EventAlreadyPast, NotRegistered
from .models import EventRegistration
from .tasks import send_registration_email


def register_user_for_event(user, event):
    """Create the registration and schedule the confirmation email.

    The uniqueness check is the database constraint itself, not a prior
    `.exists()` query: that is the only way it stays correct under two
    concurrent requests (spec §3, R54).
    """
    if event.date <= timezone.now():
        raise EventAlreadyPast()

    try:
        with transaction.atomic():
            registration = EventRegistration.objects.create(user=user, event=event)
            # Only schedule the email once this transaction is durably committed,
            # so a rolled-back registration never sends one (spec §9, R108).
            transaction.on_commit(lambda: send_registration_email.delay(user.id, event.id))
    except IntegrityError:
        raise AlreadyRegistered() from None

    return registration


def cancel_registration(user, event):
    deleted, _ = EventRegistration.objects.filter(user=user, event=event).delete()
    if not deleted:
        raise NotRegistered()

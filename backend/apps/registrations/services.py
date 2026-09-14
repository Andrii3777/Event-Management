from typing import TYPE_CHECKING

from django.db import IntegrityError, transaction
from django.utils import timezone

from .exceptions import AlreadyJoined, EventAlreadyPast, NotJoined
from .models import EventRegistration
from .tasks import send_join_confirmation_email

if TYPE_CHECKING:
    from apps.events.models import Event
    from apps.users.models import User


def join_event(user: "User", event: "Event") -> EventRegistration:
    """Create the event participation and schedule the confirmation email.

    The uniqueness check is enforced by the database constraint itself,
    preventing race conditions under concurrent requests.
    """
    if event.date <= timezone.now():
        raise EventAlreadyPast()

    try:
        with transaction.atomic():
            registration = EventRegistration.objects.create(user=user, event=event)
            transaction.on_commit(lambda: send_join_confirmation_email.delay(user.pk, event.pk))
    except IntegrityError:
        raise AlreadyJoined() from None

    return registration


def leave_event(user: "User", event: "Event") -> None:
    deleted, _ = EventRegistration.objects.filter(user=user, event=event).delete()
    if not deleted:
        raise NotJoined()


register_user_for_event = join_event
cancel_registration = leave_event
send_registration_email = send_join_confirmation_email

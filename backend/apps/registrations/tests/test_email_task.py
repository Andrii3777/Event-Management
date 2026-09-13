from datetime import timedelta
from unittest import mock

from django.contrib.auth import get_user_model
from django.db import transaction
from django.test import TestCase
from django.utils import timezone

from apps.events.models import Event
from apps.registrations import services
from apps.registrations.models import EventRegistration

User = get_user_model()


class RegistrationEmailSchedulingTests(TestCase):
    def setUp(self):
        self.organizer = User.objects.create_user(
            email="alice@example.com", username="alice", password="x"
        )
        self.user = User.objects.create_user(email="bob@example.com", username="bob", password="x")
        self.event = Event.objects.create(
            title="Meetup",
            description="desc",
            date=timezone.now() + timedelta(days=1),
            location="Kyiv",
            organizer=self.organizer,
        )

    def test_delay_called_with_two_ints_after_commit(self):
        with mock.patch("apps.registrations.services.send_registration_email.delay") as delay:
            with self.captureOnCommitCallbacks(execute=True):
                registration = services.register_user_for_event(self.user, self.event)
            delay.assert_called_once_with(self.user.id, self.event.id)
            self.assertEqual(registration.event_id, self.event.id)

    def test_delay_not_called_when_transaction_rolls_back(self):
        # Calls the real service, not a hand-rolled create/on_commit — a
        # regression that moves on_commit out of register_user_for_event
        # must fail this test.
        with mock.patch("apps.registrations.services.send_registration_email.delay") as delay:
            with self.captureOnCommitCallbacks(execute=True):
                with self.assertRaises(RuntimeError):
                    with transaction.atomic():
                        services.register_user_for_event(self.user, self.event)
                        raise RuntimeError("simulated failure after registration")
            delay.assert_not_called()
            self.assertFalse(
                EventRegistration.objects.filter(user=self.user, event=self.event).exists()
            )

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase
from django.utils import timezone

from apps.events.models import Event
from apps.registrations.models import EventRegistration

User = get_user_model()


class UniqueConstraintTests(TestCase):
    """The service's own duplicate handling isn't what guarantees no double
    row exists — the database constraint is (spec §3, R54). Prove it by
    going around the service entirely.
    """

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

    def test_duplicate_create_bypassing_service_raises_integrity_error(self):
        EventRegistration.objects.create(user=self.user, event=self.event)
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                EventRegistration.objects.create(user=self.user, event=self.event)
        self.assertEqual(
            EventRegistration.objects.filter(user=self.user, event=self.event).count(), 1
        )

    def test_duplicate_bulk_create_bypassing_service_raises_integrity_error(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                EventRegistration.objects.bulk_create(
                    [
                        EventRegistration(user=self.user, event=self.event),
                        EventRegistration(user=self.user, event=self.event),
                    ]
                )
        self.assertEqual(
            EventRegistration.objects.filter(user=self.user, event=self.event).count(), 0
        )

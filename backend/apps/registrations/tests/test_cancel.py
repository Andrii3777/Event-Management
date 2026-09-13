from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.events.models import Event
from apps.registrations.models import EventRegistration

User = get_user_model()


class CancelTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.organizer = User.objects.create_user(
            email="alice@example.com", username="alice", password="x"
        )
        self.user = User.objects.create_user(email="bob@example.com", username="bob", password="x")
        self.other = User.objects.create_user(
            email="carol@example.com", username="carol", password="x"
        )
        self.event = Event.objects.create(
            title="Meetup",
            description="desc",
            date=timezone.now() + timedelta(days=1),
            location="Kyiv",
            organizer=self.organizer,
        )
        self.register_url = f"/api/v1/events/{self.event.id}/register/"

    def test_cancel_own_registration(self):
        self.client.force_authenticate(self.user)
        self.client.post(self.register_url)
        response = self.client.delete(self.register_url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(
            EventRegistration.objects.filter(user=self.user, event=self.event).exists()
        )

    def test_cancel_without_registration_returns_404(self):
        self.client.force_authenticate(self.user)
        response = self.client.delete(self.register_url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["detail"], "You are not registered for this event.")

    def test_cannot_cancel_someone_elses_registration(self):
        # The endpoint only ever touches the caller's own row: `other` cancelling
        # leaves `user`'s registration untouched, and gets its own 404.
        self.client.force_authenticate(self.user)
        self.client.post(self.register_url)

        self.client.force_authenticate(self.other)
        response = self.client.delete(self.register_url)

        self.assertEqual(response.status_code, 404)
        self.assertTrue(EventRegistration.objects.filter(user=self.user, event=self.event).exists())

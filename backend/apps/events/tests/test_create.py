from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

User = get_user_model()
EVENTS_URL = "/api/v1/events/"


def future(days=1):
    return timezone.now() + timedelta(days=days)


class CreateEventTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="alice@example.com", username="alice", password="x"
        )

    def test_anonymous_cannot_create(self):
        response = self.client.post(
            EVENTS_URL,
            {
                "title": "Meetup",
                "description": "desc",
                "date": future().isoformat(),
                "location": "Kyiv",
            },
        )
        self.assertEqual(response.status_code, 401)

    def test_authenticated_create_sets_organizer_to_current_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            EVENTS_URL,
            {
                "title": "Meetup",
                "description": "desc",
                "date": future().isoformat(),
                "location": "Kyiv",
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["organizer"], {"id": self.user.id, "username": "alice"})

    def test_spoofed_organizer_field_is_ignored(self):
        other = User.objects.create_user(email="bob@example.com", username="bob", password="x")
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            EVENTS_URL,
            {
                "title": "Meetup",
                "description": "desc",
                "date": future().isoformat(),
                "location": "Kyiv",
                "organizer": other.id,
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["organizer"]["id"], self.user.id)

    def test_past_date_is_rejected(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            EVENTS_URL,
            {
                "title": "Meetup",
                "description": "desc",
                "date": (timezone.now() - timedelta(days=1)).isoformat(),
                "location": "Kyiv",
            },
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("date", response.data)

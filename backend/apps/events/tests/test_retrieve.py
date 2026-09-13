from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.events.models import Event

User = get_user_model()


class RetrieveEventTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.organizer = User.objects.create_user(
            email="alice@example.com", username="alice", password="x"
        )
        self.event = Event.objects.create(
            title="Meetup",
            description="desc",
            date=timezone.now() + timedelta(days=1),
            location="Kyiv",
            organizer=self.organizer,
        )

    def test_retrieve_existing_event(self):
        response = self.client.get(f"/api/v1/events/{self.event.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], self.event.id)
        self.assertEqual(response.data["title"], "Meetup")

    def test_retrieve_missing_event_returns_404(self):
        response = self.client.get("/api/v1/events/999999/")
        self.assertEqual(response.status_code, 404)

from django.test import TestCase
from rest_framework.test import APIClient

from apps.events.tests.factories import EventFactory


class RetrieveEventTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.event = EventFactory(title="Meetup")

    def test_retrieve_existing_event(self):
        response = self.client.get(f"/api/v1/events/{self.event.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], self.event.id)
        self.assertEqual(response.data["title"], "Meetup")

    def test_retrieve_missing_event_returns_404(self):
        response = self.client.get("/api/v1/events/999999/")
        self.assertEqual(response.status_code, 404)

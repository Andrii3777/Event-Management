from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.events.models import Event

User = get_user_model()


class DeleteEventTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.organizer = User.objects.create_user(
            email="alice@example.com", username="alice", password="x"
        )
        self.other = User.objects.create_user(email="bob@example.com", username="bob", password="x")
        self.event = Event.objects.create(
            title="Meetup",
            description="desc",
            date=timezone.now() + timedelta(days=1),
            location="Kyiv",
            organizer=self.organizer,
        )

    def test_organizer_can_delete_own_event(self):
        self.client.force_authenticate(self.organizer)
        response = self.client.delete(f"/api/v1/events/{self.event.id}/")
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Event.objects.filter(id=self.event.id).exists())

    def test_non_organizer_delete_is_forbidden(self):
        self.client.force_authenticate(self.other)
        response = self.client.delete(f"/api/v1/events/{self.event.id}/")
        self.assertEqual(response.status_code, 403)
        self.assertTrue(Event.objects.filter(id=self.event.id).exists())

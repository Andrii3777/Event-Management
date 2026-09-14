from django.test import TestCase
from rest_framework.test import APIClient

from apps.events.models import Event
from apps.events.tests.factories import EventFactory
from apps.users.tests.factories import UserFactory


class DeleteEventTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.organizer = UserFactory(email="alice@example.com", username="alice")
        self.other = UserFactory(email="bob@example.com", username="bob")
        self.event = EventFactory(title="Meetup", organizer=self.organizer)

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

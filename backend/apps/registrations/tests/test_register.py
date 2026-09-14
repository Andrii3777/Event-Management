from django.test import TestCase
from rest_framework.test import APIClient

from apps.events.tests.factories import EventFactory
from apps.events.tests.helpers import future
from apps.registrations.models import EventRegistration
from apps.users.tests.factories import UserFactory


class RegisterTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.organizer = UserFactory(email="alice@example.com", username="alice")
        self.user = UserFactory(email="bob@example.com", username="bob")
        self.event = EventFactory(title="Meetup", date=future(), organizer=self.organizer)

    def join_url(self, event_id=None):
        return f"/api/v1/events/{event_id or self.event.id}/join/"

    def register_url(self, event_id=None):
        return f"/api/v1/events/{event_id or self.event.id}/register/"

    def test_authenticated_user_can_register(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(self.join_url())
        self.assertEqual(response.status_code, 201)
        self.assertTrue(EventRegistration.objects.filter(user=self.user, event=self.event).exists())

    def test_organizer_can_register_for_own_event(self):
        self.client.force_authenticate(self.organizer)
        response = self.client.post(self.join_url())
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            EventRegistration.objects.filter(user=self.organizer, event=self.event).exists()
        )

    def test_anonymous_cannot_register(self):
        response = self.client.post(self.join_url())
        self.assertEqual(response.status_code, 401)

    def test_duplicate_registration_returns_409(self):
        self.client.force_authenticate(self.user)
        self.client.post(self.join_url())
        response = self.client.post(self.join_url())
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.data["detail"], "You have already joined this event.")
        self.assertEqual(
            EventRegistration.objects.filter(user=self.user, event=self.event).count(), 1
        )

    def test_registering_for_past_event_returns_400(self):
        past_event = EventFactory(
            title="Old Meetup",
            date=future(-1),
            organizer=self.organizer,
        )
        self.client.force_authenticate(self.user)
        response = self.client.post(self.join_url(past_event.id))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["detail"], "This event has already taken place.")

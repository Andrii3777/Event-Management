from django.test import TestCase
from rest_framework.test import APIClient

from apps.events.tests.factories import EventFactory
from apps.registrations.models import EventRegistration
from apps.users.tests.factories import UserFactory


class CancelTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.organizer = UserFactory(email="alice@example.com", username="alice")
        self.user = UserFactory(email="bob@example.com", username="bob")
        self.other = UserFactory(email="carol@example.com", username="carol")
        self.event = EventFactory(title="Meetup", organizer=self.organizer)
        self.join_url = f"/api/v1/events/{self.event.id}/join/"
        self.leave_url = f"/api/v1/events/{self.event.id}/leave/"
        self.register_url = f"/api/v1/events/{self.event.id}/register/"

    def test_cancel_own_registration(self):
        self.client.force_authenticate(self.user)
        self.client.post(self.join_url)
        response = self.client.delete(self.leave_url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(
            EventRegistration.objects.filter(user=self.user, event=self.event).exists()
        )

    def test_cancel_without_registration_returns_404(self):
        self.client.force_authenticate(self.user)
        response = self.client.delete(self.leave_url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["detail"], "You have not joined this event.")

    def test_cannot_cancel_someone_elses_registration(self):
        # The endpoint only ever touches the caller's own row: `other` cancelling
        # leaves `user`'s registration untouched, and gets its own 404.
        self.client.force_authenticate(self.user)
        self.client.post(self.join_url)

        self.client.force_authenticate(self.other)
        response = self.client.delete(self.leave_url)

        self.assertEqual(response.status_code, 404)
        self.assertTrue(EventRegistration.objects.filter(user=self.user, event=self.event).exists())

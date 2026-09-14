from django.test import TestCase
from rest_framework.test import APIClient

from apps.events.tests.factories import EventFactory
from apps.registrations.tests.factories import EventRegistrationFactory
from apps.users.tests.factories import UserFactory


class RegistrationStatsAnnotationTests(TestCase):
    """Verify registrations_count and is_registered annotations on EventSerializer."""

    def setUp(self):
        self.client = APIClient()
        self.organizer = UserFactory(email="alice@example.com", username="alice")
        self.user = UserFactory(email="bob@example.com", username="bob")
        self.event = EventFactory(title="Meetup", organizer=self.organizer)
        self.detail_url = f"/api/v1/events/{self.event.id}/"
        self.register_url = f"/api/v1/events/{self.event.id}/register/"

    def test_anonymous_sees_count_and_false_is_registered(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["registrations_count"], 0)
        self.assertIs(response.data["is_registered"], False)

    def test_counts_and_flag_flip_after_register_and_cancel(self):
        self.client.force_authenticate(self.user)

        response = self.client.get(self.detail_url)
        self.assertEqual(response.data["registrations_count"], 0)
        self.assertIs(response.data["is_registered"], False)

        self.client.post(self.register_url)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.data["registrations_count"], 1)
        self.assertIs(response.data["is_registered"], True)

        self.client.delete(self.register_url)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.data["registrations_count"], 0)
        self.assertIs(response.data["is_registered"], False)

    def test_is_registered_is_per_user_not_global(self):
        EventRegistrationFactory(user=self.organizer, event=self.event)

        self.client.force_authenticate(self.user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.data["registrations_count"], 1)
        self.assertIs(response.data["is_registered"], False)

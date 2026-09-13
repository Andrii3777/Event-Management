from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.events.models import Event
from apps.registrations.models import EventRegistration

User = get_user_model()


class RegistrationStatsAnnotationTests(TestCase):
    """D01 (spec §6): registrations_count/is_registered were deferred by
    ticket 03 until EventRegistration existed. Regression-tests them here,
    against the serializer they belong to, not against registrations
    business logic.
    """

    def setUp(self):
        self.client = APIClient()
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
        EventRegistration.objects.create(user=self.organizer, event=self.event)

        self.client.force_authenticate(self.user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.data["registrations_count"], 1)
        self.assertIs(response.data["is_registered"], False)

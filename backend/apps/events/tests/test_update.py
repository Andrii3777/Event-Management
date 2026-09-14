from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.events.tests.factories import EventFactory
from apps.users.tests.factories import UserFactory

from .helpers import future


class UpdateEventTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.organizer = UserFactory(email="alice@example.com", username="alice")
        self.other = UserFactory(email="bob@example.com", username="bob")
        self.future_event = EventFactory(
            title="Meetup",
            date=future(1),
            organizer=self.organizer,
        )
        self.past_event = EventFactory(
            title="Old Meetup",
            date=timezone.now() - timedelta(days=1),
            organizer=self.organizer,
        )

    def test_organizer_can_patch_own_event(self):
        self.client.force_authenticate(self.organizer)
        response = self.client.patch(
            f"/api/v1/events/{self.future_event.id}/", {"title": "New title"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "New title")

    def test_non_organizer_gets_403_not_404(self):
        self.client.force_authenticate(self.other)
        response = self.client.patch(f"/api/v1/events/{self.future_event.id}/", {"title": "Hack"})
        self.assertEqual(response.status_code, 403)

        get_response = self.client.get(f"/api/v1/events/{self.future_event.id}/")
        self.assertEqual(get_response.status_code, 200)

    def test_patch_past_event_without_changing_date_succeeds(self):
        self.client.force_authenticate(self.organizer)
        response = self.client.patch(
            f"/api/v1/events/{self.past_event.id}/", {"description": "updated"}
        )
        self.assertEqual(response.status_code, 200)

    def test_changing_date_to_past_is_rejected(self):
        self.client.force_authenticate(self.organizer)
        response = self.client.patch(
            f"/api/v1/events/{self.future_event.id}/",
            {"date": (timezone.now() - timedelta(days=1)).isoformat()},
        )
        self.assertEqual(response.status_code, 400)

    def test_put_is_not_allowed(self):
        self.client.force_authenticate(self.organizer)
        response = self.client.put(
            f"/api/v1/events/{self.future_event.id}/",
            {
                "title": "x",
                "description": "y",
                "date": future(1).isoformat(),
                "location": "Kyiv",
            },
        )
        self.assertEqual(response.status_code, 405)

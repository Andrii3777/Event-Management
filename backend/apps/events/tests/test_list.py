from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.events.models import Event

User = get_user_model()
EVENTS_URL = "/api/v1/events/"


class ListEventTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        organizer = User.objects.create_user(
            email="alice@example.com", username="alice", password="x"
        )
        Event.objects.bulk_create(
            [
                Event(
                    title=f"Event {i}",
                    description="desc",
                    date=timezone.now() + timedelta(days=i + 1),
                    location="Kyiv",
                    organizer=organizer,
                )
                for i in range(15)
            ]
        )

    def test_anonymous_can_list(self):
        response = self.client.get(EVENTS_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.data.keys()), {"count", "next", "previous", "results"})
        self.assertEqual(response.data["count"], 15)
        self.assertEqual(len(response.data["results"]), 9)  # default page_size (3x3 grid)

    def test_second_page_returns_remaining_events(self):
        response = self.client.get(EVENTS_URL, {"page": 2})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 6)

    def test_ordering_ascending_by_date(self):
        response = self.client.get(EVENTS_URL, {"ordering": "date", "page_size": 100})
        dates = [item["date"] for item in response.data["results"]]
        self.assertEqual(dates, sorted(dates))

    def test_ordering_descending_by_date(self):
        response = self.client.get(EVENTS_URL, {"ordering": "-date", "page_size": 100})
        dates = [item["date"] for item in response.data["results"]]
        self.assertEqual(dates, sorted(dates, reverse=True))

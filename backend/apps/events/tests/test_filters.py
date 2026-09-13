from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.events.models import Event

User = get_user_model()
EVENTS_URL = "/api/v1/events/"


def future(days):
    return timezone.now() + timedelta(days=days)


class EventFilterTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        organizer = User.objects.create_user(
            email="alice@example.com", username="alice", password="x"
        )
        self.django_meetup = Event.objects.create(
            title="Django Meetup",
            description="Talk about REST framework",
            location="Kyiv",
            date=future(1),
            organizer=organizer,
        )
        self.book_club = Event.objects.create(
            title="Book Club",
            description="Discuss novels",
            location="Lviv",
            date=future(2),
            organizer=organizer,
        )
        self.chess_night = Event.objects.create(
            title="Chess Night",
            description="Casual chess",
            location="Kyiv Center",
            date=future(3),
            organizer=organizer,
        )

    def titles(self, response):
        return {item["title"] for item in response.data["results"]}

    def test_search_matches_title(self):
        response = self.client.get(EVENTS_URL, {"search": "Django"})
        self.assertEqual(self.titles(response), {"Django Meetup"})

    def test_search_matches_description(self):
        response = self.client.get(EVENTS_URL, {"search": "novels"})
        self.assertEqual(self.titles(response), {"Book Club"})

    def test_search_matches_location(self):
        response = self.client.get(EVENTS_URL, {"search": "Lviv"})
        self.assertEqual(self.titles(response), {"Book Club"})

    def test_location_filter_is_case_insensitive_and_partial(self):
        response = self.client.get(EVENTS_URL, {"location": "kyiv"})
        self.assertEqual(self.titles(response), {"Django Meetup", "Chess Night"})

    def test_date_after_excludes_earlier_events(self):
        response = self.client.get(EVENTS_URL, {"date_after": future(1.5).isoformat()})
        self.assertEqual(self.titles(response), {"Book Club", "Chess Night"})

    def test_date_before_excludes_later_events(self):
        response = self.client.get(EVENTS_URL, {"date_before": future(1.5).isoformat()})
        self.assertEqual(self.titles(response), {"Django Meetup"})

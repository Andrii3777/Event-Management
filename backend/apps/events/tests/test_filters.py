from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.events.models import Event
from apps.registrations.models import EventRegistration

from .helpers import future

User = get_user_model()
EVENTS_URL = "/api/v1/events/"


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

    def test_organizer_filter_returns_only_that_organizers_events(self):
        other_organizer = User.objects.create_user(
            email="bob@example.com", username="bob", password="x"
        )
        Event.objects.create(
            title="Bob's Standup",
            description="Daily sync",
            location="Remote",
            date=future(4),
            organizer=other_organizer,
        )
        response = self.client.get(EVENTS_URL, {"organizer": other_organizer.id})
        self.assertEqual(self.titles(response), {"Bob's Standup"})

    def test_organizer_filter_with_unknown_id_returns_empty(self):
        response = self.client.get(EVENTS_URL, {"organizer": 999999})
        self.assertEqual(self.titles(response), set())

    def test_registered_true_returns_only_events_user_is_registered_for(self):
        user = User.objects.create_user(email="carol@example.com", username="carol", password="x")
        EventRegistration.objects.create(event=self.django_meetup, user=user)
        self.client.force_authenticate(user=user)
        response = self.client.get(EVENTS_URL, {"registered": "true"})
        self.assertEqual(self.titles(response), {"Django Meetup"})

    def test_registered_true_for_anonymous_returns_empty_not_error(self):
        response = self.client.get(EVENTS_URL, {"registered": "true"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.titles(response), set())

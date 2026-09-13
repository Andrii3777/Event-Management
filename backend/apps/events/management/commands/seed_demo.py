from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.events.models import Event
from apps.registrations.models import EventRegistration

User = get_user_model()

DEMO_USERS = [
    {"email": "alice@demo.local", "username": "alice"},
    {"email": "bob@demo.local", "username": "bob"},
]

# (title, location, days_offset from now) — negative offsets are past events,
# positive are future; a mix of both exercises pagination/filters realistically.
DEMO_EVENTS = [
    ("Kyiv Tech Meetup", "Kyiv", -30),
    ("Lviv Startup Weekend", "Lviv", -14),
    ("Odesa Design Sprint", "Odesa", -7),
    ("Kharkiv Data Day", "Kharkiv", -3),
    ("Dnipro DevOps Night", "Dnipro", -1),
    ("Warsaw Frontend Conf", "Warsaw", 1),
    ("Berlin Cloud Summit", "Berlin", 3),
    ("Prague Python Meetup", "Prague", 5),
    ("Vienna AI Workshop", "Vienna", 7),
    ("Krakow JS Days", "Krakow", 10),
    ("Wroclaw Product Talks", "Wroclaw", 14),
    ("Gdansk Security Conf", "Gdansk", 21),
    ("Poznan Mobile Dev Day", "Poznan", 30),
    ("Budapest UX Forum", "Budapest", 45),
    ("Bratislava Open Source Fest", "Bratislava", 60),
]

# Indexes into DEMO_EVENTS that get registrations from both demo users.
REGISTERED_EVENT_INDEXES = {0, 2, 4, 5, 7, 9, 11, 13}


class Command(BaseCommand):
    help = "Seed the database with demo users and events for manual review."

    def handle(self, *args, **options):
        users = [self._get_or_create_user(u) for u in DEMO_USERS]
        events = self._get_or_create_events(organizer=users[0])
        self._seed_registrations(users, events)

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(users)} users and {len(events)} events (idempotent)."
            )
        )

    def _get_or_create_user(self, data):
        user, created = User.objects.get_or_create(
            email=data["email"], defaults={"username": data["username"]}
        )
        if created:
            user.set_password(settings.DEMO_USER_PASSWORD)
            user.save(update_fields=["password"])
        return user

    def _get_or_create_events(self, organizer):
        now = timezone.now()
        events = []
        for title, location, days_offset in DEMO_EVENTS:
            event, _ = Event.objects.get_or_create(
                title=title,
                defaults={
                    "description": f"Demo event in {location}.",
                    "date": now + timedelta(days=days_offset),
                    "location": location,
                    "organizer": organizer,
                },
            )
            events.append(event)
        return events

    def _seed_registrations(self, users, events):
        for index in REGISTERED_EVENT_INDEXES:
            event = events[index]
            for user in users:
                EventRegistration.objects.get_or_create(user=user, event=event)

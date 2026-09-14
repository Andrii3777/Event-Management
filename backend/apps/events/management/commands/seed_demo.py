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

# days_offset: negative is a past event, positive is future — a mix of both
# exercises pagination/filters realistically. registered: both demo users
# get a registration for this event.
DEMO_EVENTS = [
    {"title": "Kyiv Tech Meetup", "location": "Kyiv", "days_offset": -30, "registered": True},
    {"title": "Lviv Startup Weekend", "location": "Lviv", "days_offset": -14},
    {"title": "Odesa Design Sprint", "location": "Odesa", "days_offset": -7, "registered": True},
    {"title": "Kharkiv Data Day", "location": "Kharkiv", "days_offset": -3},
    {"title": "Dnipro DevOps Night", "location": "Dnipro", "days_offset": -1, "registered": True},
    {"title": "Warsaw Frontend Conf", "location": "Warsaw", "days_offset": 1, "registered": True},
    {"title": "Berlin Cloud Summit", "location": "Berlin", "days_offset": 3},
    {"title": "Prague Python Meetup", "location": "Prague", "days_offset": 5, "registered": True},
    {"title": "Vienna AI Workshop", "location": "Vienna", "days_offset": 7},
    {"title": "Krakow JS Days", "location": "Krakow", "days_offset": 10, "registered": True},
    {"title": "Wroclaw Product Talks", "location": "Wroclaw", "days_offset": 14},
    {"title": "Gdansk Security Conf", "location": "Gdansk", "days_offset": 21, "registered": True},
    {"title": "Poznan Mobile Dev Day", "location": "Poznan", "days_offset": 30},
    {"title": "Budapest UX Forum", "location": "Budapest", "days_offset": 45, "registered": True},
    {"title": "Bratislava Open Source Fest", "location": "Bratislava", "days_offset": 60},
]


class Command(BaseCommand):
    help = "Seed the database with demo users and events for manual review."

    def handle(self, *args, **options):
        users = [self._get_or_create_user(u) for u in DEMO_USERS]
        events = self._get_or_create_events(organizer=users[0])
        self._seed_registrations(users, events)

        self.stdout.write(
            self.style.SUCCESS(f"Seeded {len(users)} users and {len(events)} events (idempotent).")
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
        for spec in DEMO_EVENTS:
            days = int(str(spec["days_offset"]))
            event, _ = Event.objects.get_or_create(
                title=spec["title"],
                defaults={
                    "description": f"Demo event in {spec['location']}.",
                    "date": now + timedelta(days=days),
                    "location": spec["location"],
                    "organizer": organizer,
                },
            )
            events.append((event, spec.get("registered", False)))
        return events

    def _seed_registrations(self, users, events):
        for event, registered in events:
            if not registered:
                continue
            for user in users:
                EventRegistration.objects.get_or_create(user=user, event=event)

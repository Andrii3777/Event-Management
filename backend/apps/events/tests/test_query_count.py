from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient

from apps.events.models import Event

User = get_user_model()


@pytest.mark.django_db
def test_list_query_count_is_constant_regardless_of_event_count(django_assert_num_queries):
    """select_related("organizer") must keep this at 2 queries (count + page)
    no matter how many events/organizers exist — no per-row N+1."""
    organizer = User.objects.create_user(email="alice@example.com", username="alice", password="x")
    client = APIClient()

    def add_events(n, offset):
        Event.objects.bulk_create(
            [
                Event(
                    title=f"Event {offset + i}",
                    description="desc",
                    date=timezone.now() + timedelta(days=offset + i + 1),
                    location="Kyiv",
                    organizer=organizer,
                )
                for i in range(n)
            ]
        )

    add_events(3, 0)
    with django_assert_num_queries(2):
        client.get("/api/v1/events/")

    add_events(10, 3)
    with django_assert_num_queries(2):
        client.get("/api/v1/events/")

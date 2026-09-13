from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from .models import Event

User = get_user_model()


class OrganizerSerializer(serializers.ModelSerializer):
    """Minimal organizer shape for a nested read (id + username only, no email)."""

    class Meta:
        model = User
        fields = ["id", "username"]


class EventSerializer(serializers.ModelSerializer):
    """Read shape.

    `registrations_count`/`is_registered` from spec §6 are intentionally
    absent: they require annotating over `EventRegistration`, which does not
    exist yet (apps.registrations has no models — ticket 04). See ticket 03
    handoff notes for the exact blocker.
    """

    organizer = OrganizerSerializer(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "date",
            "location",
            "organizer",
            "created_at",
            "updated_at",
        ]


class EventWriteSerializer(serializers.ModelSerializer):
    """No `organizer` field on purpose: the view sets it from `request.user`."""

    class Meta:
        model = Event
        fields = ["title", "description", "date", "location"]

    def validate_date(self, value):
        # Leaving an already-past event's date untouched on PATCH must still
        # succeed, so only a *changed* date is required to be in the future.
        if self.instance is not None and value == self.instance.date:
            return value
        if value <= timezone.now():
            raise serializers.ValidationError("Event date must be in the future.")
        return value

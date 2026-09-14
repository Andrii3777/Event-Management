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

    `participants_count` and `is_joined` are queryset annotations (see
    `EventViewSet.get_queryset`) — not model properties, preventing N+1 queries.
    """

    organizer = OrganizerSerializer(read_only=True)
    participants_count = serializers.IntegerField(read_only=True)
    is_joined = serializers.BooleanField(read_only=True)
    # Backward-compatible aliases
    registrations_count = serializers.IntegerField(read_only=True, source="participants_count")
    is_registered = serializers.BooleanField(read_only=True, source="is_joined")

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "date",
            "location",
            "organizer",
            "participants_count",
            "is_joined",
            "registrations_count",
            "is_registered",
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
        if (
            self.instance is not None
            and isinstance(self.instance, Event)
            and value == self.instance.date
        ):
            return value
        if value <= timezone.now():
            raise serializers.ValidationError("Event date must be in the future.")
        return value

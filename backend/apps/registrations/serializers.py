from rest_framework import serializers

from .models import EventRegistration


class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = ["id", "event", "user", "created_at"]
        read_only_fields = fields

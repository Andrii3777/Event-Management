from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.schema import error_detail_serializer
from apps.events.models import Event

from .serializers import EventParticipantSerializer, EventRegistrationSerializer
from .services import cancel_registration, join_event, leave_event, register_user_for_event

_error_response = error_detail_serializer("RegistrationErrorDetail")


class EventJoinView(APIView):
    """POST /api/v1/events/<pk>/join/ to join an event."""

    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={
            201: EventParticipantSerializer,
            400: _error_response,
            401: _error_response,
            404: _error_response,
            409: _error_response,
        },
    )
    def post(self, request, pk=None):
        event = get_object_or_404(Event, pk=pk)
        participant = join_event(request.user, event)
        serializer = EventParticipantSerializer(participant)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        responses={204: None, 401: _error_response, 404: _error_response},
    )
    def delete(self, request, pk=None):
        event = get_object_or_404(Event, pk=pk)
        leave_event(request.user, event)
        return Response(status=status.HTTP_204_NO_CONTENT)


class EventLeaveView(APIView):
    """DELETE or POST /api/v1/events/<pk>/leave/ to leave an event."""

    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={204: None, 401: _error_response, 404: _error_response},
    )
    def delete(self, request, pk=None):
        event = get_object_or_404(Event, pk=pk)
        leave_event(request.user, event)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        request=None,
        responses={204: None, 401: _error_response, 404: _error_response},
    )
    def post(self, request, pk=None):
        return self.delete(request, pk=pk)


class EventRegistrationView(APIView):
    """Legacy backward-compatible endpoint:
    POST /api/v1/events/<pk>/register/
    DELETE /api/v1/events/<pk>/register/
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={
            201: EventRegistrationSerializer,
            400: _error_response,
            401: _error_response,
            404: _error_response,
            409: _error_response,
        },
    )
    def post(self, request, pk=None):
        event = get_object_or_404(Event, pk=pk)
        registration = register_user_for_event(request.user, event)
        serializer = EventRegistrationSerializer(registration)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        responses={204: None, 401: _error_response, 404: _error_response},
    )
    def delete(self, request, pk=None):
        event = get_object_or_404(Event, pk=pk)
        cancel_registration(request.user, event)
        return Response(status=status.HTTP_204_NO_CONTENT)

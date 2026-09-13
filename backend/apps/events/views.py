from django.db.models import BooleanField, Count, Exists, OuterRef, Value
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view, inline_serializer
from rest_framework import filters as drf_filters
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.registrations.models import EventRegistration
from apps.registrations.serializers import EventRegistrationSerializer
from apps.registrations.services import cancel_registration, register_user_for_event

from .filters import EventFilter
from .models import Event
from .pagination import EventPagination
from .permissions import IsOrganizerOrReadOnly
from .serializers import EventSerializer, EventWriteSerializer

# Shared shape for every error body this app returns (spec: DRF's own
# {"detail": ...} format, no envelope) — used only to describe non-2xx
# responses that automatic schema generation cannot infer.
_error_response = inline_serializer(
    name="EventErrorDetail", fields={"detail": serializers.CharField()}
)


@extend_schema_view(
    create=extend_schema(
        responses={
            201: EventSerializer,
            400: _error_response,
            401: _error_response,
        }
    ),
    update=extend_schema(
        responses={
            200: EventSerializer,
            400: _error_response,
            403: _error_response,
            404: _error_response,
        }
    ),
    partial_update=extend_schema(
        responses={
            200: EventSerializer,
            400: _error_response,
            403: _error_response,
            404: _error_response,
        }
    ),
    destroy=extend_schema(responses={204: None, 403: _error_response, 404: _error_response}),
)
class EventViewSet(viewsets.ModelViewSet):
    # No PUT (spec §6): PATCH covers every write scenario the frontend needs.
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]
    pagination_class = EventPagination
    filter_backends = [DjangoFilterBackend, drf_filters.SearchFilter, drf_filters.OrderingFilter]
    filterset_class = EventFilter
    search_fields = ["title", "description", "location"]
    ordering_fields = ["date", "created_at", "title"]
    ordering = ["date"]

    def get_queryset(self):
        # Single-query annotations (spec §6, D01): a per-row query for either
        # field would undo the N+1 guarantee list/retrieve already give (R95).
        user = self.request.user
        if user.is_authenticated:
            is_registered = Exists(
                EventRegistration.objects.filter(event=OuterRef("pk"), user=user)
            )
        else:
            is_registered = Value(False, output_field=BooleanField())
        return Event.objects.select_related("organizer").annotate(
            registrations_count=Count("registrations"), is_registered=is_registered
        )

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return EventWriteSerializer
        return EventSerializer

    def get_permissions(self):
        if self.action in ("create", "register"):
            return [IsAuthenticated()]
        if self.action in ("update", "partial_update", "destroy"):
            return [IsAuthenticated(), IsOrganizerOrReadOnly()]
        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    def create(self, request, *args, **kwargs):
        # Respond with the read shape (organizer, timestamps) instead of the
        # write serializer's own (organizer-less) fields.
        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        self.perform_create(write_serializer)
        # A brand-new event was never fetched through get_queryset(), so it
        # carries no annotations — fill in the values a fresh event always
        # has instead of paying for an extra query.
        instance = write_serializer.instance
        instance.registrations_count = 0
        instance.is_registered = False
        read_serializer = EventSerializer(instance, context=self.get_serializer_context())
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        write_serializer = self.get_serializer(instance, data=request.data, partial=partial)
        write_serializer.is_valid(raise_exception=True)
        self.perform_update(write_serializer)
        read_serializer = EventSerializer(
            write_serializer.instance, context=self.get_serializer_context()
        )
        return Response(read_serializer.data)

    @extend_schema(
        methods=["POST"],
        request=None,
        responses={
            201: EventRegistrationSerializer,
            400: _error_response,
            401: _error_response,
            404: _error_response,
            409: _error_response,
        },
    )
    @extend_schema(
        methods=["DELETE"],
        responses={204: None, 401: _error_response, 404: _error_response},
    )
    @action(detail=True, methods=["post", "delete"], url_path="register")
    def register(self, request, pk=None):
        # HTTP only: all registration/cancellation rules live in
        # apps.registrations.services (spec §6, R83).
        event = self.get_object()
        if request.method == "POST":
            registration = register_user_for_event(request.user, event)
            serializer = EventRegistrationSerializer(registration)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        cancel_registration(request.user, event)
        return Response(status=status.HTTP_204_NO_CONTENT)

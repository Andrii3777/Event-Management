from django.db.models import BooleanField, Count, Exists, OuterRef, Value
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import filters as drf_filters
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.common.schema import error_detail_serializer

from .filters import EventFilter
from .models import Event
from .pagination import EventPagination
from .permissions import IsOrganizerOrReadOnly
from .serializers import EventSerializer, EventWriteSerializer

_error_response = error_detail_serializer("EventErrorDetail")


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
    # PATCH covers partial updates; PUT is not needed.
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]
    pagination_class = EventPagination
    filter_backends = [DjangoFilterBackend, drf_filters.SearchFilter, drf_filters.OrderingFilter]
    filterset_class = EventFilter
    search_fields = ["title", "description", "location"]
    ordering_fields = ["date", "created_at", "title"]
    ordering = ["date"]

    def get_queryset(self):
        # Annotations prevent N+1 queries on list and retrieve endpoints.
        user = self.request.user
        is_joined: Exists | Value
        if user.is_authenticated:
            is_joined = Exists(
                Event.objects.filter(pk=OuterRef("pk"), registrations__user=user)
            )
        else:
            is_joined = Value(False, output_field=BooleanField())
        return Event.objects.select_related("organizer").annotate(
            participants_count=Count("registrations"),
            is_joined=is_joined,
            registrations_count=Count("registrations"),
            is_registered=is_joined,
        )

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return EventWriteSerializer
        return EventSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ("update", "partial_update", "destroy"):
            return [IsAuthenticated(), IsOrganizerOrReadOnly()]
        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    def _read_data_for(self, write_serializer):
        # Respond with the read shape (organizer, timestamps) instead of the
        # write serializer's own (organizer-less) fields.
        return EventSerializer(
            write_serializer.instance, context=self.get_serializer_context()
        ).data

    def create(self, request, *args, **kwargs):
        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        self.perform_create(write_serializer)
        # A brand-new event was never fetched through get_queryset(), so it
        # carries no annotations — fill in the values a fresh event always
        # has instead of paying for an extra query.
        instance = write_serializer.instance
        if instance is not None:
            instance.participants_count = 0
            instance.is_joined = False
            instance.registrations_count = 0
            instance.is_registered = False
        data = self._read_data_for(write_serializer)
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        write_serializer = self.get_serializer(instance, data=request.data, partial=partial)
        write_serializer.is_valid(raise_exception=True)
        self.perform_update(write_serializer)
        return Response(self._read_data_for(write_serializer))

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters as drf_filters
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .filters import EventFilter
from .models import Event
from .pagination import EventPagination
from .permissions import IsOrganizerOrReadOnly
from .serializers import EventSerializer, EventWriteSerializer


class EventViewSet(viewsets.ModelViewSet):
    # No PUT (spec §6): PATCH covers every write scenario the frontend needs.
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]
    queryset = Event.objects.select_related("organizer").all()
    pagination_class = EventPagination
    filter_backends = [DjangoFilterBackend, drf_filters.SearchFilter, drf_filters.OrderingFilter]
    filterset_class = EventFilter
    search_fields = ["title", "description", "location"]
    ordering_fields = ["date", "created_at", "title"]
    ordering = ["date"]

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

    def create(self, request, *args, **kwargs):
        # Respond with the read shape (organizer, timestamps) instead of the
        # write serializer's own (organizer-less) fields.
        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        self.perform_create(write_serializer)
        read_serializer = EventSerializer(
            write_serializer.instance, context=self.get_serializer_context()
        )
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

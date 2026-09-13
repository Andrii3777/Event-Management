from django_filters import rest_framework as filters

from apps.registrations.models import EventRegistration

from .models import Event


class EventFilter(filters.FilterSet):
    location = filters.CharFilter(lookup_expr="icontains")
    date_after = filters.DateTimeFilter(field_name="date", lookup_expr="gte")
    date_before = filters.DateTimeFilter(field_name="date", lookup_expr="lte")
    organizer = filters.NumberFilter(field_name="organizer_id")
    registered = filters.BooleanFilter(method="filter_registered")

    class Meta:
        model = Event
        fields = ["location", "date_after", "date_before", "organizer", "registered"]

    def filter_registered(self, queryset, name, value):
        user = self.request.user
        if not value:
            return queryset
        if not user.is_authenticated:
            return queryset.none()
        return queryset.filter(
            id__in=EventRegistration.objects.filter(user=user).values("event_id")
        )

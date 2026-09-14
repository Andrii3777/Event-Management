from django_filters import rest_framework as filters

from .models import Event


class EventFilter(filters.FilterSet):
    location = filters.CharFilter(lookup_expr="icontains")
    date_after = filters.DateTimeFilter(field_name="date", lookup_expr="gte")
    date_before = filters.DateTimeFilter(field_name="date", lookup_expr="lte")
    organizer = filters.NumberFilter(field_name="organizer_id")
    joined = filters.BooleanFilter(method="filter_joined")
    registered = filters.BooleanFilter(method="filter_joined")

    class Meta:
        model = Event
        fields = ["location", "date_after", "date_before", "organizer", "joined", "registered"]

    def filter_joined(self, queryset, name, value):
        if not value:
            return queryset
        if not self.request.user.is_authenticated:
            return queryset.none()
        # is_joined is already annotated onto this queryset.
        return queryset.filter(is_joined=True)

    filter_registered = filter_joined

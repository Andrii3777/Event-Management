from django_filters import rest_framework as filters

from .models import Event


class EventFilter(filters.FilterSet):
    location = filters.CharFilter(lookup_expr="icontains")
    date_after = filters.DateTimeFilter(field_name="date", lookup_expr="gte")
    date_before = filters.DateTimeFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = Event
        fields = ["location", "date_after", "date_before"]

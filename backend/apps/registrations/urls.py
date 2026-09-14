from django.urls import path

from .views import EventJoinView, EventLeaveView, EventRegistrationView

urlpatterns = [
    path("events/<int:pk>/join/", EventJoinView.as_view(), name="event-join"),
    path("events/<int:pk>/leave/", EventLeaveView.as_view(), name="event-leave"),
    path("events/<int:pk>/register/", EventRegistrationView.as_view(), name="event-register"),
]

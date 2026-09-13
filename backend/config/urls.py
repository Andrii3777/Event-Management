from django.contrib import admin
from django.urls import path

# App URLs are added by later tickets (users/events/registrations) under
# /api/v1/. Until then, any /api/v1/... request falls through to Django's
# standard 404 — that is the expected response for this ticket.
urlpatterns = [
    path("admin/", admin.site.urls),
]

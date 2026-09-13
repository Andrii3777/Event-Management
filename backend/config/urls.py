from django.contrib import admin
from django.urls import include, path

# registrations URLs are added by a later ticket under /api/v1/.
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.users.urls")),
    path("api/v1/", include("apps.events.urls")),
]

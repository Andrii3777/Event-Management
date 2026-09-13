from django.contrib import admin
from django.urls import include, path

# events/registrations URLs are added by later tickets under /api/v1/.
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.users.urls")),
]

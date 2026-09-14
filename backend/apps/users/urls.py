from django.urls import path

from .views import CsrfView, LoginView, LogoutView, MeView, RefreshView, RegisterView, SignUpView

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="auth-signup"),
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("token/", LoginView.as_view(), name="auth-token"),
    path("token/refresh/", RefreshView.as_view(), name="auth-token-refresh"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("csrf/", CsrfView.as_view(), name="auth-csrf"),
]

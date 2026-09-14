from django.http import HttpResponse
from rest_framework import exceptions
from rest_framework.authentication import CSRFCheck
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

from .cookies import ACCESS_COOKIE_NAME


class CookieJWTAuthentication(JWTAuthentication):
    """Reads the access token from an HttpOnly cookie instead of the Authorization
    header, then runs the standard CSRF double-submit check that SessionAuthentication
    runs — cookie-based auth requires CSRF protection for mutating requests.
    """

    def authenticate(self, request):
        raw_token = request.COOKIES.get(ACCESS_COOKIE_NAME)
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except InvalidToken:
            # Stale/expired cookie: treat as anonymous rather than erroring,
            # so e.g. an expired access cookie doesn't break /auth/refresh/.
            return None

        user = self.get_user(validated_token)
        self.enforce_csrf(request)
        return user, validated_token

    def enforce_csrf(self, request):
        check = CSRFCheck(lambda req: HttpResponse())
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")

from rest_framework import exceptions
from rest_framework.authentication import CSRFCheck
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

from .cookies import ACCESS_COOKIE_NAME


class CookieJWTAuthentication(JWTAuthentication):
    """Reads the access token from a cookie instead of the `Authorization`
    header (brief R63/R64), then runs the same CSRF double-submit check
    `SessionAuthentication` runs — cookie-based auth is exactly the case
    CSRF protection exists for (spec §5), and DRF's `APIView` otherwise
    disables Django's own CsrfViewMiddleware for every API view.
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
        check = CSRFCheck(lambda req: None)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")

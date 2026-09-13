from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics, status
from rest_framework.exceptions import NotAuthenticated
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .cookies import REFRESH_COOKIE_NAME, clear_auth_cookies, set_auth_cookies
from .serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):
    """POST /auth/token/ — tokens never reach the response body (R65):
    they're set as cookies, the body only carries the user (spec §4).
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = TokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tokens = serializer.validated_data

        response = Response({"user": UserSerializer(serializer.user).data})
        set_auth_cookies(response, tokens["access"], tokens["refresh"])
        return response


class RefreshView(APIView):
    """POST /auth/token/refresh/ — refresh comes from the cookie, not the
    body; SimpleJWT's own serializer already rotates + blacklists (spec §4).
    """

    permission_classes = [AllowAny]

    def post(self, request):
        raw_refresh = request.COOKIES.get(REFRESH_COOKIE_NAME)
        if raw_refresh is None:
            raise NotAuthenticated("Refresh cookie is missing.")

        serializer = TokenRefreshSerializer(data={"refresh": raw_refresh})
        try:
            # A malformed, expired, or (post-logout) blacklisted refresh token
            # raises TokenError from the token constructor itself, before DRF
            # field validation runs — normalize it to the same 401 SimpleJWT
            # uses for every other "this token doesn't work" case.
            serializer.is_valid(raise_exception=True)
        except TokenError as exc:
            raise InvalidToken(exc.args[0]) from exc
        tokens = serializer.validated_data

        response = Response({"detail": "Token refreshed."})
        set_auth_cookies(response, tokens["access"], tokens["refresh"])
        return response


class LogoutView(APIView):
    """POST /auth/logout/ — idempotent: a missing or already-blacklisted
    refresh cookie is still a 204 (history 12), never an error.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        raw_refresh = request.COOKIES.get(REFRESH_COOKIE_NAME)
        if raw_refresh is not None:
            try:
                RefreshToken(raw_refresh).blacklist()
            except TokenError:
                pass

        response = Response(status=status.HTTP_204_NO_CONTENT)
        clear_auth_cookies(response)
        return response


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


@method_decorator(ensure_csrf_cookie, name="get")
class CsrfView(APIView):
    """GET /auth/csrf/ — issues the (non-HttpOnly) csrftoken cookie before
    the first unsafe request, including before login (spec §5).
    """

    permission_classes = [AllowAny]

    def get(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)

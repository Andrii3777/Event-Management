from django.conf import settings

ACCESS_COOKIE_NAME = "access_token"
REFRESH_COOKIE_NAME = "refresh_token"

# Different Path per cookie (spec §4): access rides on every /api/ call,
# refresh only leaves the two endpoints that need it.
ACCESS_COOKIE_PATH = "/api/"
REFRESH_COOKIE_PATH = "/api/v1/auth/"

_COMMON_KWARGS = {
    "httponly": True,
    "samesite": "Lax",
    "secure": settings.COOKIE_SECURE,
}


def set_auth_cookies(response, access, refresh):
    response.set_cookie(
        ACCESS_COOKIE_NAME,
        access,
        max_age=settings.ACCESS_TOKEN_LIFETIME_MINUTES * 60,
        path=ACCESS_COOKIE_PATH,
        **_COMMON_KWARGS,
    )
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        refresh,
        max_age=settings.REFRESH_TOKEN_LIFETIME_DAYS * 24 * 60 * 60,
        path=REFRESH_COOKIE_PATH,
        **_COMMON_KWARGS,
    )


def clear_auth_cookies(response):
    response.delete_cookie(ACCESS_COOKIE_NAME, path=ACCESS_COOKIE_PATH, samesite="Lax")
    response.delete_cookie(REFRESH_COOKIE_NAME, path=REFRESH_COOKIE_PATH, samesite="Lax")

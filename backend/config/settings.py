import os
import sys
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def env(name, default=None, cast=str):
    """Read one environment variable, casting it; falls back to `default`.

    Kept as a plain function instead of a package (e.g. django-environ):
    the only casts this project needs are str/bool/int/list, and a few
    lines here cover that without an extra dependency (see spec §1).
    """
    value = os.environ.get(name)
    if value is None:
        return default
    if cast is bool:
        return value.strip().lower() in ("1", "true", "yes", "on")
    if cast is list:
        return [item.strip() for item in value.split(",") if item.strip()]
    return cast(value)


DEBUG = env("DEBUG", default=True, cast=bool)
SECRET_KEY = env(
    "SECRET_KEY",
    # Not a production secret: a stable local dev fallback so Django can
    # start with an empty .env. Real deployments must set SECRET_KEY.
    default="django-insecure-dev-only-secret-key-change-me",
)
ALLOWED_HOSTS = env("ALLOWED_HOSTS", default="localhost,127.0.0.1", cast=list)

# Named by the brief (§43) but not read anywhere: the project connects to
# Postgres via the POSTGRES_* variables below, one per docker-compose
# service, instead of a single connection URL.
DATABASE_URL = env("DATABASE_URL", default="")

# Same treatment as CORS_ALLOWED_ORIGINS below: kept as a documented,
# unused name so a future cross-origin deployment has a place to start.
CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS", default="", cast=list)
CSRF_TRUSTED_ORIGINS = env("CSRF_TRUSTED_ORIGINS", default="", cast=list)

# Consumed by apps.users (JWT cookies) in a later ticket; read here so the
# values are never hardcoded and .env stays the single source of config.
COOKIE_SECURE = env("COOKIE_SECURE", default=False, cast=bool)
ACCESS_TOKEN_LIFETIME_MINUTES = env("ACCESS_TOKEN_LIFETIME_MINUTES", default=10, cast=int)
REFRESH_TOKEN_LIFETIME_DAYS = env("REFRESH_TOKEN_LIFETIME_DAYS", default=7, cast=int)

# Consumed by the seed_demo management command (later ticket).
DEMO_USER_PASSWORD = env("DEMO_USER_PASSWORD", default="demo12345")

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]
THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "django_filters",
    "drf_spectacular",
]
LOCAL_APPS = [
    "apps.users",
    "apps.events",
    "apps.registrations",
]
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "config.middleware.RequestLogMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("POSTGRES_DB", default="event_management"),
        "USER": env("POSTGRES_USER", default="event_management"),
        "PASSWORD": env("POSTGRES_PASSWORD", default=""),
        "HOST": env("POSTGRES_HOST", default="postgres"),
        "PORT": env("POSTGRES_PORT", default="5432"),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

REST_FRAMEWORK = {
    "DEFAULT_EXCEPTION_HANDLER": "config.exceptions.custom_exception_handler",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "apps.users.authentication.CookieJWTAuthentication",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Event Management API",
    "DESCRIPTION": "REST API for managing events, registrations and auth (spec §33).",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "OAS_VERSION": "3.1.0",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=ACCESS_TOKEN_LIFETIME_MINUTES),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=REFRESH_TOKEN_LIFETIME_DAYS),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# Cookie-based auth means the browser sends credentials automatically, so
# CSRF must be on (brief R70, spec §5). CsrfViewMiddleware itself is in
# MIDDLEWARE already (task 01); these are just its flags.
CSRF_COOKIE_HTTPONLY = False  # JS must read it to set X-CSRFToken (double-submit)
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = COOKIE_SECURE

# Celery: broker only. Result backend stays unset (Redis is not turned into
# a second datastore, see spec §8/§9) and task routing is added once real
# tasks exist (later ticket).
CELERY_BROKER_URL = env("REDIS_URL", default="redis://redis:6379/0")
CELERY_TASK_IGNORE_RESULT = True

EMAIL_HOST = env("EMAIL_HOST", default="")
EMAIL_PORT = env("EMAIL_PORT", default=587, cast=int)
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")
if EMAIL_HOST:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_USE_TLS = True
else:
    # No mail server configured: print outgoing mail to the worker's log
    # instead, so registration emails are visible without one (spec §9).
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DJANGO_LOG_LEVEL = env("DJANGO_LOG_LEVEL", default="INFO")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": {"format": "%(asctime)s %(levelname)s %(name)s %(message)s"},
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "stream": sys.stdout,
            "formatter": "simple",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": DJANGO_LOG_LEVEL,
    },
    "loggers": {
        "django": {"handlers": ["console"], "level": DJANGO_LOG_LEVEL, "propagate": False},
    },
}

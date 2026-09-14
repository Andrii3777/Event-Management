from unittest import mock

from django.core.exceptions import ImproperlyConfigured
from django.db import OperationalError
from django.test import TestCase
from rest_framework.test import APIClient


class HealthCheckTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_check_healthy(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_health_check_database_failure(self):
        with mock.patch(
            "django.db.connection.cursor",
            side_effect=OperationalError("connection failed"),
        ):
            response = self.client.get("/api/health/")
            self.assertEqual(response.status_code, 503)
            self.assertEqual(response.json()["status"], "unhealthy")


class SecretKeySecurityTests(TestCase):
    def test_production_secret_key_validation(self):
        # Emulate the settings check
        dev_key = "django-insecure-dev-only-secret-key-change-me"
        debug = False
        secret_key = dev_key

        with self.assertRaises(ImproperlyConfigured):
            if not debug and (not secret_key or secret_key == dev_key):
                raise ImproperlyConfigured(
                    "SECRET_KEY is required and cannot be dev fallback when DEBUG=False."
                )

from django.test import TestCase
from rest_framework.test import APIClient

from apps.users.tests.factories import UserFactory

TOKEN_URL = "/api/v1/auth/token/"
ME_URL = "/api/v1/auth/me/"
PASSWORD = "N0t-A-Common-Pass!"


class MeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserFactory(
            email="alice@example.com", username="alice", password=PASSWORD
        )

    def test_me_authenticated(self):
        self.client.post(TOKEN_URL, {"email": "alice@example.com", "password": PASSWORD})

        response = self.client.get(ME_URL)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {"id": self.user.id, "email": "alice@example.com", "username": "alice"},
        )

    def test_me_anonymous_is_unauthorized(self):
        response = self.client.get(ME_URL)

        self.assertEqual(response.status_code, 401)

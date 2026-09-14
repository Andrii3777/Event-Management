from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.users.tests.factories import UserFactory

User = get_user_model()

SIGNUP_URL = "/api/v1/auth/signup/"
REGISTER_URL = "/api/v1/auth/register/"


class SignUpTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_signup_success_returns_no_password(self):
        response = self.client.post(
            SIGNUP_URL,
            {"email": "alice@example.com", "username": "alice", "password": "N0t-A-Common-Pass!"},
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.data,
            {"id": response.data["id"], "email": "alice@example.com", "username": "alice"},
        )
        self.assertNotIn("password", response.data)
        self.assertTrue(
            User.objects.get(email="alice@example.com").check_password("N0t-A-Common-Pass!")
        )

    def test_legacy_register_url_also_works(self):
        response = self.client.post(
            REGISTER_URL,
            {"email": "legacy@example.com", "username": "legacy", "password": "N0t-A-Common-Pass!"},
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(email="legacy@example.com").exists())

    def test_duplicate_email_is_rejected(self):
        UserFactory(
            email="alice@example.com", username="alice", password="N0t-A-Common-Pass!"
        )

        response = self.client.post(
            SIGNUP_URL,
            {"email": "alice@example.com", "username": "alice2", "password": "N0t-A-Common-Pass!"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.data)

    def test_weak_password_lists_violated_validators(self):
        response = self.client.post(
            SIGNUP_URL,
            {"email": "bob@example.com", "username": "bob", "password": "12345678"},
        )

        self.assertEqual(response.status_code, 400)
        # Both the common-password and all-numeric validators reject this value.
        self.assertGreaterEqual(len(response.data["password"]), 2)
        self.assertFalse(User.objects.filter(email="bob@example.com").exists())

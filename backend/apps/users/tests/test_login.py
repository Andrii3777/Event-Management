from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

User = get_user_model()

TOKEN_URL = "/api/v1/auth/token/"
PASSWORD = "N0t-A-Common-Pass!"


class LoginTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="alice@example.com", username="alice", password=PASSWORD
        )

    def test_login_success_sets_both_cookies_and_no_tokens_in_body(self):
        response = self.client.post(TOKEN_URL, {"email": "alice@example.com", "password": PASSWORD})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {"user": {"id": self.user.id, "email": "alice@example.com", "username": "alice"}},
        )

        access = response.cookies["access_token"]
        refresh = response.cookies["refresh_token"]
        for cookie in (access, refresh):
            self.assertTrue(cookie["httponly"])
            self.assertEqual(cookie["samesite"], "Lax")
            self.assertFalse(cookie["secure"])  # COOKIE_SECURE=False in test settings
        self.assertEqual(access["path"], "/api/")
        self.assertEqual(refresh["path"], "/api/v1/auth/")

    def test_invalid_credentials_return_same_message_regardless_of_email_existing(self):
        wrong_password = self.client.post(
            TOKEN_URL, {"email": "alice@example.com", "password": "wrong-password"}
        )
        unknown_email = self.client.post(
            TOKEN_URL, {"email": "nobody@example.com", "password": "wrong-password"}
        )

        self.assertEqual(wrong_password.status_code, 401)
        self.assertEqual(unknown_email.status_code, 401)
        self.assertEqual(wrong_password.data["detail"], unknown_email.data["detail"])
        self.assertNotIn("access_token", wrong_password.cookies)

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

User = get_user_model()

TOKEN_URL = "/api/v1/auth/token/"
REFRESH_URL = "/api/v1/auth/token/refresh/"
LOGOUT_URL = "/api/v1/auth/logout/"
PASSWORD = "N0t-A-Common-Pass!"


class LogoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User.objects.create_user(email="alice@example.com", username="alice", password=PASSWORD)

    def test_logout_blacklists_refresh_and_clears_cookies(self):
        login = self.client.post(TOKEN_URL, {"email": "alice@example.com", "password": PASSWORD})
        old_refresh = login.cookies["refresh_token"].value

        response = self.client.post(LOGOUT_URL)

        self.assertEqual(response.status_code, 204)
        # A deleted cookie is re-sent with an empty value and a past expiry.
        self.assertEqual(response.cookies["access_token"].value, "")
        self.assertEqual(response.cookies["refresh_token"].value, "")

        # The blacklisted refresh must not work anymore, even resent by hand.
        self.client.cookies["refresh_token"] = old_refresh
        replay = self.client.post(REFRESH_URL)
        self.assertEqual(replay.status_code, 401)

    def test_logout_without_cookie_is_idempotent(self):
        response = self.client.post(LOGOUT_URL)

        self.assertEqual(response.status_code, 204)

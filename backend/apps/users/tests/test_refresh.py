from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

User = get_user_model()

TOKEN_URL = "/api/v1/auth/token/"
REFRESH_URL = "/api/v1/auth/token/refresh/"
PASSWORD = "N0t-A-Common-Pass!"


class RefreshTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User.objects.create_user(email="alice@example.com", username="alice", password=PASSWORD)

    def test_refresh_with_cookie_issues_new_pair(self):
        login = self.client.post(TOKEN_URL, {"email": "alice@example.com", "password": PASSWORD})
        old_access = login.cookies["access_token"].value

        response = self.client.post(REFRESH_URL)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"detail": "Token refreshed."})
        new_access = response.cookies["access_token"].value
        self.assertNotEqual(new_access, old_access)
        self.assertTrue(response.cookies["access_token"]["httponly"])
        self.assertTrue(response.cookies["refresh_token"]["httponly"])

    def test_refresh_without_cookie_is_unauthorized(self):
        response = self.client.post(REFRESH_URL)

        self.assertEqual(response.status_code, 401)

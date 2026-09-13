from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

User = get_user_model()

CSRF_URL = "/api/v1/auth/csrf/"
TOKEN_URL = "/api/v1/auth/token/"
LOGOUT_URL = "/api/v1/auth/logout/"
PASSWORD = "N0t-A-Common-Pass!"


class CsrfTests(TestCase):
    def test_csrf_endpoint_sets_readable_cookie(self):
        client = APIClient()

        response = client.get(CSRF_URL)

        self.assertEqual(response.status_code, 204)
        cookie = response.cookies["csrftoken"]
        self.assertFalse(cookie["httponly"])

    def test_authenticated_post_without_csrf_header_is_rejected(self):
        # enforce_csrf_checks=True: unlike the other test files, this test is
        # specifically about the CSRF mechanism, so it must not be bypassed
        # by the test client's usual `_dont_enforce_csrf_checks` shortcut.
        client = APIClient(enforce_csrf_checks=True)
        User.objects.create_user(email="alice@example.com", username="alice", password=PASSWORD)
        client.get(CSRF_URL)
        client.post(TOKEN_URL, {"email": "alice@example.com", "password": PASSWORD})

        response = client.post(LOGOUT_URL)  # no X-CSRFToken header

        self.assertEqual(response.status_code, 403)

    def test_authenticated_post_with_csrf_header_succeeds(self):
        client = APIClient(enforce_csrf_checks=True)
        User.objects.create_user(email="alice@example.com", username="alice", password=PASSWORD)
        csrf_response = client.get(CSRF_URL)
        csrf_token = csrf_response.cookies["csrftoken"].value
        client.post(TOKEN_URL, {"email": "alice@example.com", "password": PASSWORD})

        response = client.post(LOGOUT_URL, HTTP_X_CSRFTOKEN=csrf_token)

        self.assertEqual(response.status_code, 204)

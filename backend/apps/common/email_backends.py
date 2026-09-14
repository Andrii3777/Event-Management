import json
import logging
import urllib.error
import urllib.request

from collections.abc import Sequence

from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend
from django.core.mail.message import EmailMessage

logger = logging.getLogger(__name__)


class ResendEmailBackend(BaseEmailBackend):
    """Django email backend sending transactional emails over HTTPS via the Resend API.

    Bypasses cloud outbound SMTP port restrictions (e.g. Render free tier blocking 25/465/587).
    """

    API_URL = "https://api.resend.com/emails"

    def __init__(self, api_key: str | None = None, fail_silently: bool = False, **kwargs) -> None:
        super().__init__(fail_silently=fail_silently, **kwargs)
        self.api_key = api_key or getattr(settings, "RESEND_API_KEY", "")

    def send_messages(self, email_messages: Sequence[EmailMessage]) -> int:
        if not email_messages or not self.api_key:
            return 0

        sent_count = 0
        for message in email_messages:
            try:
                self._send_one(message)
                sent_count += 1
            except Exception as exc:
                logger.error("Resend API email sending failed: %s", exc)
                if not self.fail_silently:
                    raise

        return sent_count

    def _send_one(self, message: EmailMessage) -> None:
        from_email = message.from_email or getattr(
            settings, "DEFAULT_FROM_EMAIL", "onboarding@resend.dev"
        )
        if not from_email or "localhost" in from_email or "local" in from_email:
            from_email = "onboarding@resend.dev"

        payload = {
            "from": from_email,
            "to": list(message.to),
            "subject": message.subject,
            "text": message.body,
        }

        if getattr(message, "content_subtype", "plain") == "html":
            payload["html"] = message.body

        data = json.dumps(payload).encode("utf-8")
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "EventManagement-Django/1.0",
        }

        req = urllib.request.Request(self.API_URL, data=data, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status not in (200, 201):
                    raise RuntimeError(f"Resend returned unexpected HTTP status {resp.status}")
        except urllib.error.HTTPError as err:
            err_body = err.read().decode("utf-8", errors="replace")
            logger.error("Resend HTTP Error %s: %s", err.code, err_body)
            raise RuntimeError(f"Resend HTTP {err.code}: {err_body}") from err
        except urllib.error.URLError as err:
            logger.error("Resend URL Error: %s", err.reason)
            raise ConnectionError(f"Failed to reach Resend API: {err.reason}") from err


class BrevoEmailBackend(BaseEmailBackend):
    """Django email backend sending transactional emails over HTTPS via the Brevo API.

    Bypasses cloud outbound SMTP port restrictions (e.g. Render free tier blocking 25/465/587).
    Allows sending to arbitrary emails with a single verified sender email.
    """

    API_URL = "https://api.brevo.com/v3/smtp/email"

    def __init__(self, api_key: str | None = None, fail_silently: bool = False, **kwargs) -> None:
        super().__init__(fail_silently=fail_silently, **kwargs)
        self.api_key = api_key or getattr(settings, "BREVO_API_KEY", "")

    def send_messages(self, email_messages: Sequence[EmailMessage]) -> int:
        if not email_messages or not self.api_key:
            return 0

        sent_count = 0
        for message in email_messages:
            try:
                self._send_one(message)
                sent_count += 1
            except Exception as exc:
                logger.error("Brevo API email sending failed: %s", exc)
                if not self.fail_silently:
                    raise

        return sent_count

    def _send_one(self, message: EmailMessage) -> None:
        from_email = message.from_email or getattr(settings, "DEFAULT_FROM_EMAIL", "")

        payload = {
            "sender": {"email": from_email},
            "to": [{"email": to} for to in message.to],
            "subject": message.subject,
            "textContent": message.body,
        }

        if getattr(message, "content_subtype", "plain") == "html":
            payload["htmlContent"] = message.body

        data = json.dumps(payload).encode("utf-8")
        headers = {
            "api-key": str(self.api_key),
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "EventManagement-Django/1.0",
        }

        req = urllib.request.Request(self.API_URL, data=data, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status not in (200, 201, 202):
                    raise RuntimeError(f"Brevo returned unexpected HTTP status {resp.status}")
        except urllib.error.HTTPError as err:
            err_body = err.read().decode("utf-8", errors="replace")
            logger.error("Brevo HTTP Error %s: %s", err.code, err_body)
            raise RuntimeError(f"Brevo HTTP {err.code}: {err_body}") from err
        except urllib.error.URLError as err:
            logger.error("Brevo URL Error: %s", err.reason)
            raise ConnectionError(f"Failed to reach Brevo API: {err.reason}") from err

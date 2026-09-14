from unittest.mock import MagicMock, patch

from django.core.mail import EmailMessage

from apps.common.email_backends import ResendEmailBackend


def test_resend_backend_no_api_key():
    backend = ResendEmailBackend(api_key="")
    msg = EmailMessage("Subject", "Body", "onboarding@resend.dev", ["to@test.com"])
    assert backend.send_messages([msg]) == 0


@patch("urllib.request.urlopen")
def test_resend_backend_success(mock_urlopen):
    mock_resp = MagicMock()
    mock_resp.status = 200
    mock_resp.__enter__.return_value = mock_resp
    mock_urlopen.return_value = mock_resp

    backend = ResendEmailBackend(api_key="re_test_key")
    msg = EmailMessage("Subject", "Body", "onboarding@resend.dev", ["to@test.com"])
    sent = backend.send_messages([msg])

    assert sent == 1
    assert mock_urlopen.called
    req = mock_urlopen.call_args[0][0]
    assert req.full_url == "https://api.resend.com/emails"
    assert req.headers["Authorization"] == "Bearer re_test_key"

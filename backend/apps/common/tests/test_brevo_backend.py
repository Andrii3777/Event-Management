from unittest.mock import MagicMock, patch

from django.core.mail import EmailMessage

from apps.common.email_backends import BrevoEmailBackend


def test_brevo_backend_no_api_key():
    backend = BrevoEmailBackend(api_key="")
    msg = EmailMessage("Subject", "Body", "sender@test.com", ["to@test.com"])
    assert backend.send_messages([msg]) == 0


@patch("urllib.request.urlopen")
def test_brevo_backend_success(mock_urlopen):
    mock_resp = MagicMock()
    mock_resp.status = 201
    mock_resp.__enter__.return_value = mock_resp
    mock_urlopen.return_value = mock_resp

    backend = BrevoEmailBackend(api_key="xkeysib-test")
    msg = EmailMessage("Subject", "Body", "sender@test.com", ["to@test.com", "to2@test.com"])
    sent = backend.send_messages([msg])

    assert sent == 1
    assert mock_urlopen.called
    req = mock_urlopen.call_args[0][0]
    assert req.full_url == "https://api.brevo.com/v3/smtp/email"
    assert req.headers["Api-key"] == "xkeysib-test"

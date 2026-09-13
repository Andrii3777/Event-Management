import logging

from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger("config.exceptions")


def custom_exception_handler(exc, context):
    """Wrap DRF's default handler; only unhandled exceptions get a custom body.

    DRF's own error responses (400/401/403/404/409...) are returned untouched,
    keeping the standard DRF format (no response envelope, per spec). Anything
    DRF doesn't recognise becomes a 500 with a request id the client can quote
    back, while the real traceback goes to the logs, not the response body.
    """
    response = exception_handler(exc, context)
    if response is not None:
        return response

    request = context.get("request")
    request_id = getattr(request, "request_id", None)
    logger.exception("Unhandled exception (request_id=%s)", request_id)
    return Response(
        {"detail": "Internal server error.", "request_id": request_id},
        status=500,
    )

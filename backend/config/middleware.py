import logging
import time
import uuid

logger = logging.getLogger("config.request")


class RequestLogMiddleware:
    """Log one line per request: method, path, status, duration, request id."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.monotonic()
        request_id = request.headers.get("X-Request-ID") or uuid.uuid4().hex
        request.request_id = request_id

        response = self.get_response(request)

        duration_ms = round((time.monotonic() - start) * 1000, 2)
        user_id = getattr(getattr(request, "user", None), "id", None)
        response["X-Request-ID"] = request_id
        logger.info(
            "method=%s path=%s status=%s duration_ms=%s request_id=%s user_id=%s",
            request.method,
            request.path,
            response.status_code,
            duration_ms,
            request_id,
            user_id,
        )
        return response

from django.db import connection
from django.http import JsonResponse
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

_health_response = inline_serializer(
    name="HealthCheckResponse",
    fields={"status": serializers.CharField()},
)


@extend_schema(
    summary="Health check",
    description="Returns 200 OK if database and server are healthy, 503 otherwise.",
    responses={200: _health_response, 503: _health_response},
)
@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
        return JsonResponse({"status": "ok"}, status=200)
    except Exception as exc:
        return JsonResponse({"status": "unhealthy", "error": str(exc)}, status=503)

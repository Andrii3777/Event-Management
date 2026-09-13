from drf_spectacular.utils import inline_serializer
from rest_framework import serializers


def error_detail_serializer(name):
    # Shared shape for every error body in this project (DRF's own
    # {"detail": ...} format, no envelope) — used only to describe
    # non-2xx responses that automatic schema generation cannot infer.
    return inline_serializer(name=name, fields={"detail": serializers.CharField()})

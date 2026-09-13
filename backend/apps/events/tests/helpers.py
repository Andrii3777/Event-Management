from datetime import timedelta

from django.utils import timezone


def future(days=1):
    return timezone.now() + timedelta(days=days)

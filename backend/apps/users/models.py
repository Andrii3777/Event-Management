from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user with email as the login field (brief G01).

    `username` stays as a separate, still-unique field (inherited from
    AbstractUser unchanged) because the API represents an event's organizer
    by username, not email (spec §3).
    """

    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

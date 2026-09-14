from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Public shape of a user: excludes password and sensitive fields."""

    class Meta:
        model = User
        fields = ["id", "email", "username"]


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["id", "email", "username", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


RegisterSerializer = SignUpSerializer

from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsOrganizerOrReadOnly(BasePermission):
    """Object-level check: only the organizer may write; everyone may read.

    Used together with IsAuthenticated on update/destroy so an anonymous
    request still gets 401 (handled by IsAuthenticated) before this ever
    runs, and an authenticated non-organizer gets 403, not 404.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.organizer_id == request.user.id

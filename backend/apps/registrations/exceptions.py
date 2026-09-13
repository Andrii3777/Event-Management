from rest_framework.exceptions import APIException, NotFound


class AlreadyRegistered(APIException):
    status_code = 409
    default_detail = "You are already registered for this event."
    default_code = "already_registered"


class EventAlreadyPast(APIException):
    status_code = 400
    default_detail = "This event has already taken place."
    default_code = "event_already_past"


class NotRegistered(NotFound):
    default_detail = "You are not registered for this event."
    default_code = "not_registered"

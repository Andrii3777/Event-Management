from rest_framework.exceptions import APIException, NotFound


class AlreadyJoined(APIException):
    status_code = 409
    default_detail = "You have already joined this event."
    default_code = "already_joined"


class EventAlreadyPast(APIException):
    status_code = 400
    default_detail = "This event has already taken place."
    default_code = "event_already_past"


class NotJoined(NotFound):
    default_detail = "You have not joined this event."
    default_code = "not_joined"


AlreadyRegistered = AlreadyJoined
NotRegistered = NotJoined

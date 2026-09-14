import factory

from apps.events.tests.factories import EventFactory
from apps.registrations.models import EventRegistration
from apps.users.tests.factories import UserFactory


class EventRegistrationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventRegistration

    user = factory.SubFactory(UserFactory)
    event = factory.SubFactory(EventFactory)

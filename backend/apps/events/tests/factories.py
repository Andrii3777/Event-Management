import factory

from apps.events.models import Event
from apps.events.tests.helpers import future
from apps.users.tests.factories import UserFactory


class EventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Event

    title = factory.Sequence(lambda n: f"Event {n}")
    description = factory.Faker("paragraph")
    date = factory.LazyFunction(lambda: future(days=7))
    location = "Kyiv"
    organizer = factory.SubFactory(UserFactory)

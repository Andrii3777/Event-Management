# 04 — Записи на события и асинхронная почта

**Требования:** R06, R18, R53, R54, R74, R79, R80, R83, R84, R85, R88, R98, R104, R105, R106,
R107, R108, R109, R110, R130, R132, R148i

**Blocked by:** 03
**Зона:** `backend/apps/registrations/`, `backend/config/celery.py` (новый),
`backend/config/settings.py` (секции Celery/Email)
**Волна:** 4
**Status:** ready

## Что должно заработать

Аутентифицированный пользователь записывается на событие одним запросом; повторная запись даёт
внятный 409, а не вторую строку в базе — и это гарантировано ограничением базы, а не только
проверкой в коде. Отмена работает только со своей записью. После успешной записи в фоне уходит
письмо с названием, датой и местом; HTTP-ответ его не ждёт, и письмо не уходит, если запись в
итоге не сохранилась.

Это Phase 4 и Phase 6 из §68 брифа: «EventRegistration; uniqueness constraint;
registration/cancellation; service logic; transactions» и «Redis; Celery; registration email
task; transaction-safe task scheduling.»

## Из брифа, дословно

> «Add a database-level uniqueness constraint: unique(user, event). This is important because
> application-level duplicate checks alone are not sufficient under concurrent requests.» (§10)

> «Registration has enough business logic to justify a small service... register_user_for_event(user, event)» (§25)

> «Pass primitive identifiers to Celery tasks. Prefer: send_registration_email.delay(user_id,
> event_id)... Do not pass Django model instances to Celery.» (§37)

> «Do not enqueue the email before the registration transaction is safely committed. Prefer
> transaction hooks such as transaction.on_commit()... This prevents sending an email for a
> registration that ultimately does not exist.» (§38)

> «Do not use Celery Beat. There are no periodic tasks in the requirements.» (§39)

> «Do not add Redis caching just because Redis is available. Redis is used as the Celery
> broker.» (§40)

## Разделы спецификации

Истории 29–44, §3 (модель `EventRegistration`), §6 (эндпоинты записи, коды 409), §9 (почта
целиком).

## Критерии приёмки

- [ ] `EventRegistration`: `event` (FK, `CASCADE`), `user` (FK, `CASCADE`), `created_at`;
      `UniqueConstraint(fields=["user", "event"], name="uniq_user_event")`
- [ ] `apps/registrations/services.py`: `register_user_for_event(user, event)` и
      `cancel_registration(user, event)` — вся бизнес-логика здесь, во вьюхе только HTTP
- [ ] `POST /api/v1/events/{id}/register/` → 201 с телом записи; повторно → 409
      `{"detail": "You are already registered for this event."}`; на прошедшее событие → 400
      `{"detail": "This event has already taken place."}`; анониму → 401
- [ ] `AlreadyRegistered(APIException)` с `status_code = 409` — отдельный класс, не собранный
      руками `Response`
- [ ] `DELETE /api/v1/events/{id}/register/` → 204; без существующей записи → 404
      `{"detail": "You are not registered for this event."}`; работает только с записью текущего
      пользователя, чужая недостижима по URL
- [ ] Тест гонки: создание дубля в обход сервиса (два прямых `EventRegistration.objects.create`
      либо `bulk_create`) ловит `IntegrityError` — ограничение реально в базе, не только в
      сериализаторе
- [ ] Создание записи — внутри `transaction.atomic`; постановка Celery-задачи — строго внутри
      `transaction.on_commit(...)`
- [ ] `send_registration_email(user_id: int, event_id: int)` — сигнатура принимает два `int`,
      не объекты; `task_ignore_result = True`
- [ ] Тест: после успешной записи `.delay` вызван ровно с `(user.id, event.id)` (мок на `.delay`)
- [ ] Тест: если транзакция откатывается (например, исключение после создания записи внутри
      того же блока в тестовом сценарии), `.delay` не вызывается —
      `django_capture_on_commit_callbacks`
- [ ] Письмо: тема `You are registered for {title}`, тело — `title`, `date` (локализованно),
      `location`, строка подтверждения; обычный текст, без HTML
- [ ] `EMAIL_BACKEND` — `django.core.mail.backends.console.EmailBackend` по умолчанию, переходит
      на SMTP при заданном `EMAIL_HOST` (условие в `settings.py` по наличию переменной)
- [ ] `autoretry_for=(SMTPException, ConnectionError)`, `retry_backoff=True`, `max_retries=3`;
      `DoesNotExist` (пользователь или событие удалены до выполнения) — `logger.warning`, выход
      без ретрая
- [ ] `config/celery.py`: `Celery("config")`, `broker_url` из `REDIS_URL`, автозагрузка задач;
      Celery Beat не подключается ни в каком виде
- [ ] Redis используется только как брокер: ни `CACHES`, ни `cache.set/get` нигде в проекте
- [ ] Тесты (`apps/registrations/tests/`): успешная запись → 201 · повторная → 409 · запись
      анониму → 401 · запись на прошедшее → 400 · отмена → 204 · отмена без записи → 404 · чужая
      запись недостижима · дубль в обход сервиса → `IntegrityError` · `.delay` вызван с двумя int
      после коммита · `.delay` не вызван при откате · `registrations_count`/`is_registered` на
      `Event` меняются после записи и после отмены

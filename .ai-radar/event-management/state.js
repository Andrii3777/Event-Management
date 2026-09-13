window.STATE =
{
  "slug": "event-management",
  "title": "Event Management — Django REST API + React",
  "runId": "260912-01",
  "sessionId": "d75f47c6",
  "projectName": "JoinToIT",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T2 (+1 постфактум, D03)",
  "briefFile": "2026-09-12-brief.md",
  "memoryFile": "CLAUDE.md",
  "startedAt": "2026-09-12T20:24:55+03:00",
  "updatedAt": "2026-09-13T14:28:52+03:00",
  "finishedAt": "2026-09-13T14:28:52+03:00",
  "stages": [
    {
      "id": "preflight",
      "status": "done",
      "startedAt": "2026-09-12T20:24:55+03:00",
      "finishedAt": "2026-09-12T20:25:42+03:00"
    },
    {
      "id": "manifest",
      "status": "done",
      "startedAt": "2026-09-12T20:25:42+03:00",
      "finishedAt": "2026-09-12T20:28:56+03:00"
    },
    {
      "id": "briefing",
      "status": "done",
      "startedAt": "2026-09-12T20:28:56+03:00",
      "finishedAt": "2026-09-12T20:31:49+03:00"
    },
    {
      "id": "spec",
      "status": "done",
      "startedAt": "2026-09-12T20:31:49+03:00",
      "finishedAt": "2026-09-12T20:44:44+03:00"
    },
    {
      "id": "plan",
      "status": "done",
      "startedAt": "2026-09-12T20:44:44+03:00",
      "finishedAt": "2026-09-12T20:55:25+03:00"
    },
    {
      "id": "build",
      "status": "done",
      "startedAt": "2026-09-12T20:55:25+03:00",
      "note": "9 из 9 тасков готово",
      "finishedAt": "2026-09-13T14:19:16+03:00"
    },
    {
      "id": "review",
      "status": "done",
      "startedAt": "2026-09-12T20:25:42+03:00",
      "finishedAt": "2026-09-13T14:19:16+03:00",
      "note": "все таски прошли ревью по 3 осям"
    },
    {
      "id": "final",
      "status": "done",
      "finishedAt": "2026-09-13T14:28:52+03:00",
      "startedAt": "2026-09-13T14:28:52+03:00"
    }
  ],
  "requirements": {
    "total": 154,
    "done": 156,
    "inTicket": 0,
    "inSpec": 0,
    "placeholder": 0,
    "deferred": 1,
    "dropped": 0
  },
  "tickets": [
    {
      "id": "01",
      "title": "Скелет проекта: Django, Docker, конфигурация",
      "description": "docker compose up --build поднимает все пять сервисов, миграции применяются, каркас приложений готов.",
      "requirements": [
        "R01",
        "R15",
        "R25",
        "R26",
        "R27",
        "R28",
        "R29",
        "R30",
        "R31",
        "R32",
        "R33",
        "R34",
        "R35",
        "R36",
        "R43",
        "R44",
        "R45",
        "R46",
        "R47",
        "R48",
        "R55",
        "R57",
        "R99",
        "R101",
        "R102",
        "R103",
        "R111",
        "R112",
        "R113",
        "R114",
        "R133",
        "R134",
        "R135",
        "R136",
        "R137",
        "R140",
        "R141",
        "R142",
        "R143",
        "R144",
        "R146",
        "R151i"
      ],
      "blockedBy": [],
      "wave": 1,
      "zone": [
        "backend/config/",
        "docker-compose.yml",
        "Dockerfile*",
        "frontend/ (скелет)"
      ],
      "status": "done",
      "startedAt": "2026-09-12T20:56:36+03:00",
      "finishedAt": "2026-09-12T21:12:28+03:00",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [
        "backend/config/*",
        "backend/apps/{users,events,registrations}/*",
        "backend/manage.py",
        "backend/requirements*.txt",
        "backend/pyproject.toml",
        "backend/Dockerfile",
        "backend/entrypoint.sh",
        "docker-compose.yml",
        ".env.example",
        ".pre-commit-config.yaml",
        "frontend/* (skeleton)"
      ],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "commit": "6f072d1",
      "concerns": [
        "backend/config/settings.py: SECRET_KEY dev-заглушка не пустая (осознанно, иначе Django не стартует) — не секрет прод-окружения",
        "backend/Dockerfile, backend/entrypoint.sh: нет collectstatic — whitenoise ManifestStaticFilesStorage упадёт на /admin/ до исправления (не блокирует 02-07, событийный API статику не отдаёт)"
      ],
      "repairNote": null
    },
    {
      "id": "02",
      "title": "Пользователи и аутентификация",
      "description": "Регистрация, вход по email, JWT в HttpOnly-cookie, refresh, logout с blacklist, /me, CSRF.",
      "requirements": [
        "R12",
        "R13",
        "R49",
        "R50",
        "R51",
        "R58",
        "R59",
        "R60",
        "R61",
        "R62",
        "R63",
        "R64",
        "R65",
        "R66",
        "R67",
        "R68",
        "R69",
        "R70",
        "R71",
        "R72",
        "R128",
        "R149i"
      ],
      "blockedBy": [
        "01"
      ],
      "wave": 2,
      "zone": [
        "backend/apps/users/",
        "backend/config/settings.py (auth/csrf)"
      ],
      "status": "done",
      "startedAt": "2026-09-12T21:12:28+03:00",
      "finishedAt": "2026-09-12T21:28:24+03:00",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [
        "backend/apps/users/*",
        "backend/config/settings.py",
        "backend/config/urls.py"
      ],
      "tests": {
        "passed": 14,
        "failed": 0
      },
      "commit": "6aacae9",
      "concerns": [
        "backend/apps/users/tests/*.py: пароль-константа и создание тестового пользователя дублируются в 6 файлах — общий fixture убрал бы копипасту (не блокирует)"
      ],
      "repairNote": null
    },
    {
      "id": "03",
      "title": "События: CRUD, права, фильтры, производительность",
      "description": "Список публичный, CRUD только для организатора, поиск/фильтры/сортировка/пагинация, без N+1.",
      "requirements": [
        "R02",
        "R03",
        "R04",
        "R05",
        "R07",
        "R08",
        "R09",
        "R10",
        "R11",
        "R17",
        "R52",
        "R56",
        "R73",
        "R75",
        "R76",
        "R77",
        "R78",
        "R81",
        "R82",
        "R86",
        "R87",
        "R89",
        "R90",
        "R91",
        "R92",
        "R93",
        "R94",
        "R95",
        "R96",
        "R97",
        "R98",
        "R129",
        "R131",
        "R150i",
        "R154i"
      ],
      "blockedBy": [
        "02"
      ],
      "wave": 3,
      "zone": [
        "backend/apps/events/"
      ],
      "status": "done",
      "startedAt": "2026-09-12T21:26:14+03:00",
      "finishedAt": "2026-09-13T01:04:18+03:00",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [
        "backend/apps/events/*",
        "backend/config/urls.py"
      ],
      "tests": {
        "passed": 24,
        "failed": 0
      },
      "commit": "ee56962",
      "concerns": [
        "backend/apps/events/views.py: create()/update() повторяют одну и ту же форму (валидация -> save -> обёртка в EventSerializer) — стоило бы вынести в приватный хелпер (не блокирует)",
        "backend/apps/events/tests/*.py: локальные future()/future(days) хелперы продублированы с разными сигнатурами в 3 файлах — общий фикстур убрал бы дубли (не блокирует)"
      ],
      "repairNote": null
    },
    {
      "id": "04",
      "title": "Записи на события и асинхронная почта",
      "description": "Запись/отмена с ограничением базы на дубли, письмо после коммита через Celery.",
      "requirements": [
        "R06",
        "R18",
        "R53",
        "R54",
        "R74",
        "R79",
        "R80",
        "R83",
        "R84",
        "R85",
        "R88",
        "R98",
        "R104",
        "R105",
        "R106",
        "R107",
        "R108",
        "R109",
        "R110",
        "R130",
        "R132",
        "R148i"
      ],
      "blockedBy": [
        "03"
      ],
      "wave": 4,
      "zone": [
        "backend/apps/registrations/",
        "backend/config/celery.py"
      ],
      "status": "done",
      "startedAt": "2026-09-13T01:04:43+03:00",
      "finishedAt": "2026-09-13T01:22:19+03:00",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "files": [
        "backend/apps/registrations/*",
        "backend/apps/events/serializers.py",
        "backend/apps/events/views.py",
        "backend/apps/events/tests/test_registration_stats.py"
      ],
      "tests": {
        "passed": 52,
        "failed": 0
      },
      "commit": "5d46948",
      "concerns": [
        "дублирующая проверка на .exists() перед созданием записи намеренно опущена — единственная защита от дублей это перехват IntegrityError от ограничения базы (так и задумано спекой §26, не пробел)"
      ],
      "repairNote": "1 находка: тест отката транзакции не гонял настоящий сервис (проверял механизм on_commit, а не размещение внутри register_user_for_event) — переписан на реальный вызов, закрыто одним дозапросом."
    },
    {
      "id": "05",
      "title": "Документация API и демо-данные",
      "description": "Swagger/ReDoc с реальными кодами ошибок, seed_demo с двумя пользователями и 15 событиями.",
      "requirements": [
        "R14",
        "R99",
        "R100",
        "R153i"
      ],
      "blockedBy": [
        "04"
      ],
      "wave": 5,
      "zone": [
        "backend/config/ (spectacular)",
        "backend/apps/*/views.py (аннотации)",
        "backend/apps/events/management/"
      ],
      "status": "done",
      "startedAt": "2026-09-13T01:22:27+03:00",
      "finishedAt": "2026-09-13T01:40:26+03:00",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "files": [
        "backend/config/settings.py",
        "backend/config/urls.py",
        "backend/apps/events/views.py",
        "backend/apps/users/views.py",
        "backend/apps/events/management/commands/seed_demo.py"
      ],
      "tests": {
        "passed": 56,
        "failed": 0
      },
      "commit": "1d9d6fd",
      "concerns": [
        "backend/apps/events/views.py, backend/apps/users/views.py: одинаковый inline_serializer для {\"detail\": str} продублирован в двух файлах — общий хелпер в apps/common/schema.py убрал бы дубль (не блокирует)",
        "seed_demo.py: REGISTERED_EVENT_INDEXES завязан на позиции в списке событий — именованная константа была бы устойчивее к переупорядочиванию (не блокирует)"
      ],
      "repairNote": "1 находка: create() не имел @extend_schema, Swagger показывал неверную форму 201-ответа — закрыто одним дозапросом."
    },
    {
      "id": "06",
      "title": "Фронтенд: каркас, вход, регистрация, макет",
      "description": "Приложение открывается, вход/регистрация работают, сессия держится сама, базовые компоненты готовы.",
      "requirements": [
        "R20",
        "R21",
        "R23",
        "R24",
        "R37",
        "R38",
        "R39",
        "R40",
        "R41",
        "R42",
        "R115",
        "R118",
        "R119",
        "R120",
        "R121",
        "R122",
        "R123",
        "R124",
        "R125",
        "R126",
        "R127"
      ],
      "blockedBy": [
        "02"
      ],
      "wave": 3,
      "zone": [
        "frontend/src/ (кроме features/events, pages/Events*)"
      ],
      "status": "done",
      "startedAt": "2026-09-12T21:26:14+03:00",
      "finishedAt": "2026-09-13T01:07:22+03:00",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "files": [
        "frontend/src/*",
        "frontend/package.json"
      ],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "commit": "6ed2cfa",
      "concerns": [
        "frontend/src/pages/{Login,Register}Page.tsx: дублируют цикл раскладки серверных 400-ошибок — общий хелпер убрал бы дубль (не блокирует)",
        "frontend/src/features/auth/schemas.ts: loginSchema/registerSchema дублируют правило валидации email (не блокирует)"
      ],
      "repairNote": "2 находки: 401 логина запускал refresh+редирект (R13.1); /events был защищён (R76). Обе закрыты одним дозапросом."
    },
    {
      "id": "07",
      "title": "Фронтенд: события и записи",
      "description": "Список с поиском/фильтрами, карточка события, запись/отмена, создание/правка/удаление, /my-events.",
      "requirements": [
        "R22",
        "R116",
        "R117",
        "R125",
        "R154i"
      ],
      "blockedBy": [
        "06",
        "04"
      ],
      "wave": 5,
      "zone": [
        "frontend/src/features/events/",
        "frontend/src/pages/Events*.tsx"
      ],
      "status": "done",
      "startedAt": "2026-09-13T01:22:27+03:00",
      "finishedAt": "2026-09-13T01:35:11+03:00",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [
        "frontend/src/features/events/*",
        "frontend/src/components/{EventCard,EventForm,Pagination}.tsx",
        "frontend/src/pages/{Events,EventDetails,CreateEvent,EditEvent,MyEvents}Page.tsx",
        "frontend/src/router.tsx"
      ],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "commit": "629ff53",
      "concerns": [
        "EventCard/EventDetailsPage дублируют логику кнопки записи/отмены — общий хук/компонент убрал бы дубль (не блокирует)",
        "EventForm дублирует цикл раскладки серверных 400-ошибок, уже отмеченный у LoginPage/RegisterPage (таск 06) — общий хелпер закрыл бы все три (не блокирует)",
        "Пограничная находка: организатор может записаться на своё событие через EventCard в списке, хотя EventDetailsPage прячет от него эту кнопку — ни манифест, ни спека правила не задают; на заметку в финальный отчёт, не в исправление"
      ],
      "repairNote": null
    },
    {
      "id": "08",
      "title": "Приёмка и доводка",
      "description": "Чеклист §70 брифа прогнан целиком, README дописан, ruff/pre-commit чисты, лишнее удалено.",
      "requirements": [
        "R16",
        "R19",
        "R138",
        "R139",
        "R140",
        "R141",
        "R142",
        "R144",
        "R145",
        "R147"
      ],
      "blockedBy": [
        "05",
        "07"
      ],
      "wave": 6,
      "zone": [
        "весь репозиторий"
      ],
      "status": "done",
      "startedAt": "2026-09-13T01:40:26+03:00",
      "finishedAt": "2026-09-13T14:19:16+03:00",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "files": [
        "README.md",
        "backend/apps/common/*",
        "backend/apps/events/*",
        "backend/apps/users/views.py",
        "backend/config/*",
        "backend/entrypoint.sh",
        "frontend/src/components/RegistrationButton.tsx",
        "frontend/src/features/shared/formErrors.ts",
        "frontend/src/{pages,components,features}/* (dedup fixes)"
      ],
      "tests": {
        "passed": 57,
        "failed": 0
      },
      "commit": "15f1097",
      "concerns": [],
      "repairNote": "1 находка: RegistrationButton скрывал запись от организатора без спроса — пользователь ответил напрямую «Разрешить везде» (G05), закрыто одним дозапросом."
    },
    {
      "id": "09",
      "title": "Фильтры organizer/registered для /my-events (D03)",
      "description": "EventFilter получает organizer и registered — без них обе вкладки /my-events показывают весь список.",
      "requirements": [
        "R116"
      ],
      "blockedBy": [
        "04"
      ],
      "wave": 5,
      "zone": [
        "backend/apps/events/filters.py",
        "backend/apps/events/tests/"
      ],
      "status": "done",
      "startedAt": "2026-09-13T01:31:08+03:00",
      "finishedAt": "2026-09-13T01:38:32+03:00",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [
        "backend/apps/events/filters.py",
        "backend/apps/events/tests/test_filters.py"
      ],
      "tests": {
        "passed": 56,
        "failed": 0
      },
      "commit": "867572f",
      "concerns": [
        "filter_registered пересчитывает то, что уже есть аннотацией is_registered на queryset (D01) — можно было бы queryset.filter(is_registered=True) вместо своего подзапроса (не блокирует)"
      ],
      "repairNote": null
    }
  ],
  "singlePass": null,
  "tests": {
    "passed": 57,
    "failed": 0
  },
  "debt": {
    "placeholders": [],
    "assumptions": [],
    "emptyEnv": []
  },
  "additions": [],
  "coverage": {
    "findings": 36,
    "missing": 6,
    "half": 7,
    "extra": 23,
    "resolved": "6 пропусков дописаны разделами; 7 полупокрытий доопределены; 23 добавления привязаны к требованиям-родителям в §18, из них одно изменено: request_id убран из тела ошибок DRF и оставлен только в заголовке X-Request-ID и в 500"
  },
  "blind": {
    "checkedAt": "2026-09-13T14:28:52+03:00",
    "verdicts": {
      "mandatory": "все обязательные требования реализованы, подтверждено запуском",
      "bonus": "оба бонуса (поиск/фильтры, email) реализованы и работают по сути",
      "frontend": "весь путь пройден вручную без обрывов",
      "checklist_70": "все пункты чеклиста подтверждены запуском или кодом, невыполненных не найдено",
      "forbidden_list": "ничего из §66 брифа в проект не попало"
    },
    "mismatches": []
  }
}

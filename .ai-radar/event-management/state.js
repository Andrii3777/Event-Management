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
  "tier": "T2",
  "briefFile": "2026-09-12-brief.md",
  "memoryFile": "CLAUDE.md",
  "startedAt": "2026-09-12T20:24:55+03:00",
  "updatedAt": "2026-09-12T20:56:36+03:00",
  "finishedAt": null,
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
      "status": "active",
      "startedAt": "2026-09-12T20:55:25+03:00"
    },
    {
      "id": "review",
      "status": "pending"
    },
    {
      "id": "final",
      "status": "pending"
    }
  ],
  "requirements": {
    "total": 154,
    "done": 0,
    "inTicket": 153,
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
      "status": "in-progress",
      "startedAt": "2026-09-12T20:56:36+03:00",
      "finishedAt": null,
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "commit": null,
      "concerns": [],
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
      "status": "pending",
      "startedAt": null,
      "finishedAt": null,
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "commit": null,
      "concerns": [],
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
      "status": "pending",
      "startedAt": null,
      "finishedAt": null,
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "commit": null,
      "concerns": [],
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
      "status": "pending",
      "startedAt": null,
      "finishedAt": null,
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "commit": null,
      "concerns": [],
      "repairNote": null
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
      "status": "pending",
      "startedAt": null,
      "finishedAt": null,
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "commit": null,
      "concerns": [],
      "repairNote": null
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
      "status": "pending",
      "startedAt": null,
      "finishedAt": null,
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "commit": null,
      "concerns": [],
      "repairNote": null
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
      "status": "pending",
      "startedAt": null,
      "finishedAt": null,
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "commit": null,
      "concerns": [],
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
      "status": "pending",
      "startedAt": null,
      "finishedAt": null,
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "files": [],
      "tests": {
        "passed": 0,
        "failed": 0
      },
      "commit": null,
      "concerns": [],
      "repairNote": null
    }
  ],
  "singlePass": null,
  "tests": null,
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
  "blind": null
}

# Stage 1: Production runtime (minimal, non-root execution, production dependencies only)
FROM python:3.12-slim AS production

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install gosu for secure, rootless process step-down
RUN apt-get update && apt-get install -y --no-install-recommends gosu && rm -rf /var/lib/apt/lists/*
RUN groupadd -r -g 1000 appgroup && useradd -r -g appgroup -u 1000 -m appuser

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=appuser:appgroup . .
RUN mkdir -p /app/staticfiles && chown -R appuser:appgroup /app/staticfiles && chmod +x entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]

# Stage 2: Development & testing (inherits production, adds pytest, ruff, etc.)
FROM production AS development

COPY requirements-dev.txt ./
RUN pip install --no-cache-dir -r requirements-dev.txt

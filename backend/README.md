# Backend (Django) — Documentation

This document describes the `backend/` Django application inside the repository, its purpose, files, and how to set up, run, test and professionally prepare it for GitHub.

Quick summary
- Purpose: API/backend for the Shipperd project (Django + DRF)
- Location: `backend/`
- Main concerns: models, serializers, API views, management commands, migrations and tests

Prerequisites
- macOS, zsh (your environment)
- Python 3.10 (virtualenv provided in `shipperdenv/` but recommended to create a fresh venv locally)
- PostgreSQL (or adjust DATABASES in settings to your DB)
- Node/React is in `react-dashboard/` (not covered here)

Quick setup (from repo root)
```bash
# create virtualenv (if not using provided one)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# migrate and seed minimal data
python manage.py migrate
python manage.py loaddata initial_data  # if you have fixtures
# or use the provided management command to seed sample data
python manage.py seed_data

# run tests (see Testing below)
python manage.py test backend

# run dev server
python manage.py runserver
```

Structure and file descriptions
Wraps the `backend` Django app and a `models/` package for split model files.

- `backend/__init__.py`
  - Marks the directory as a Python package. No runtime logic expected.

- `backend/admin.py`
  - Django admin site registrations for models. Add or customize admin models here for admin UI.

- `backend/apps.py`
  - Django `AppConfig` for the `backend` app. Use for app-ready signals if needed.

- `backend/models.py`
  - Historically-used monolithic models file (if present). In this codebase models are split into `backend/models/` files; this file may be minimal or unused — keep or remove only after verifying references.

- `backend/serializers.py`
  - Django REST Framework serializers for converting model instances to/from JSON for API endpoints.

- `backend/tests.py`
  - App-level tests. Add unit and integration tests here. Prefer splitting tests into `tests/` package for larger projects.

- `backend/urls.py`
  - App-specific URL routing (include these into the project `urls.py`). Document API paths here and point to `views`.

- `backend/views.py`
  - App views (class-based or function-based) for non-API endpoints. API views are located in `backend/views/api_views.py`.

- `backend/views/` (package)
  - `api_views.py`: Django REST Framework views or viewsets exposing the API endpoints. Prefer viewsets with routers for consistent routing.

- `backend/management/commands/` (management commands)
  - `seed_data.py`: Script to populate DB with test/demo data. Use `python manage.py seed_data`.
  - `clear_data.py`: Script to clear seeded/test data. Use `python manage.py clear_data`.
  - Document any CLI options implemented by these commands here or in the command docstrings.

- `backend/migrations/`
  - Django migrations. Keep these committed. They are necessary to recreate schema and avoid migration conflicts.
  - `0001_initial.py`, `0002_alter_locker_...` etc — do not edit after being committed, create new migrations for schema changes.

- `backend/models/` (package)
  - `__init__.py` — package init; usually imports or exposes model classes.
  - `audit_models.py` — models used for auditing/changelogs.
  - `base.py` — base model classes and shared model behavior.
  - `enums.py` — shared Enum types for model choices.
  - `items_models.py` — item-related models.
  - `logistics_models.py` — models for logistics domain.
  - `shipping_models.py` — shipping-specific models.
  - `signals.py` — Django signals hooking into model lifecycle for side effects (e.g., create ledger entries, send notifications).
  - `user_models.py` — custom user model and user/profile related models.

Recommended documentation per file (what I created here)
- Add a short module docstring at the top of each Python file describing its role, public API (exported classes/functions), and any side-effects (signals, admin registrations).
- For each view/serializer/command add a one-paragraph description and example usage (e.g., URL path or management command invocation).

Running and testing
- Run the app locally
  - Activate venv and run `python manage.py runserver` (see Quick setup above).
- Running tests
  - `python manage.py test backend` runs tests for the app. For more focused tests:
    - `python manage.py test backend.tests.TestClass.test_method`
- Linting and formatting
  - Add/run `black` and `flake8` or `ruff` as part of pre-commit hooks. Example:
```bash
pip install black ruff
black .
ruff check .
```

Recommended Git/GitHub checklist before pushing
- .gitignore: ensure environment artifacts and secrets are ignored (see Suggested `.gitignore` below).
- Secrets: remove any hard-coded secrets and add instructions for env vars in README (example: `DATABASE_URL`, `SECRET_KEY`).
- Migrations: commit any new migrations and ensure they are tested.
- Tests: run tests locally and CI should run them on PRs.
- Commit message style: use conventional commits or similar (e.g., `feat: add shipment model`, `fix: correct serializer validation`).
- Branch protection: enable required checks (tests, lint) before merge.

Suggested `.gitignore` entries (not added automatically)
```
# Python
venv/
.venv/
*.pyc
__pycache__/
shipperdenv/

# Environment
.env
.env.*

# IDE
.vscode/
.idea/

# OS
.DS_Store
```

Secrets and environment variables
- Do NOT commit `SECRET_KEY` or any production credentials. Use environment variables or GitHub Secrets.
- Add a sample env file (e.g., `backend/.env.example`) listing required variables like:
  - `SECRET_KEY` (placeholder)
  - `DATABASE_URL`
  - `DJANGO_DEBUG=true|false`

CI & GitHub Actions suggestions
- Add a workflow to run tests on PRs and pushes to `main` (run `python -m pip install -r requirements.txt` then `python manage.py test`).
- Add a job for linting with `ruff`/`flake8` and formatting check with `black --check`.

How to contribute (short)
- Fork → branch off `main` → create a PR with a descriptive title and linked issue.
- Include tests for new features or bug fixes.
- Describe manual testing steps in PR description and add screenshots if relevant.

Appendix: Example documentation snippets (copy into module files)
- At top of Python files
```py
"""Module: `backend.serializers`

Holds Django REST Framework serializers for the API.
Exported:
- ShipmentSerializer: serializes `Shipping` model fields `id`, `status`, `items`.

Example:
  serializer = ShipmentSerializer(shipment_instance)
  data = serializer.data
"""
```

Files created/modified by this change:
- `backend/README.md` (new)


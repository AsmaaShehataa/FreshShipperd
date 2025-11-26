# Shipperd — Django + React

Monorepo containing the Shipperd project: a Django backend and a React dashboard frontend.

Overview
- Backend: Django REST API located in `backend/`.
- Frontend: React single-page app located in `react-dashboard/`.
- Virtual environment (optional): `shipperdenv/` (not committed).

Repository structure (top-level)
- `manage.py` — Django CLI entrypoint.
- `requirements.txt` — Python dependencies.
- `backend/` — Django app and split `models/` package, serializers, views, migrations, management commands, and docs.
- `react-dashboard/` — React app (frontend), with its own `package.json` and `README.md`.
- `shipperdV1/` — Django project settings files (settings, wsgi, asgi).

Quickstart (macOS / zsh)

1) Python environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2) Database & migrations
- Configure your DB via environment variables (recommended) or in `shipperdV1/settings.py`.
- Run migrations:
```bash
python manage.py migrate
```

3) Seed development data (optional)
```bash
python manage.py seed_data
```

4) Run development server
```bash
python manage.py runserver
# Open http://127.0.0.1:8000/
```

5) Frontend (React)
```bash
cd react-dashboard
npm install          # or `yarn`
npm start            # runs dev server (usually on :3000)
npm run build        # production build -> react-dashboard/build/
```

Tests
- Backend tests: `python manage.py test backend`
- Frontend tests: from `react-dashboard/` run `npm test` (or `yarn test`).

Linting and formatting
- Python: use `black` and `ruff` or `flake8`
- JS: use `eslint` and Prettier if configured

Recommended .gitignore
Make sure you have a `.gitignore` that excludes environment builds and caches. Example entries:
```
# Python
*.pyc
__pycache__/
.venv/
shipperdenv/

# Node
node_modules/
react-dashboard/build/

# Environment files
.env
.env.*

# IDE
.vscode/
.idea/

# OS
.DS_Store
```

Committing and pushing
- Commit code and manifest files only (do not commit `node_modules/` or `shipperdenv/`).
- Commit lockfiles for deterministic installs: `package-lock.json` or `yarn.lock` for the frontend and `requirements.txt`/`poetry.lock` for Python if used.

CI / GitHub Actions
- Add workflows to run tests and lint on PRs and pushes to `main`/`master`.
- Typical steps: checkout, setup Python, pip install, run `python manage.py test`, setup Node, `npm ci`, `npm run build` and run frontend tests.

Security and secrets
- Do NOT commit secrets (Django `SECRET_KEY`, DB passwords, API tokens). Use environment variables and a `backend/.env.example` to document required env vars.

Contributing
- Fork → branch → PR with descriptive title and tests.
- Run tests and lint locally before opening a PR.

Contact / Maintainers
- If you're the repo owner, add contact info or a link to issues.

License
- Add a `LICENSE` file to the repo root if you intend to open-source the code.

---

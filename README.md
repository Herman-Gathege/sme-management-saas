# SME Management SaaS — Developer Setup Guide

Welcome! This README is designed to let any new developer pick up the project and continue smoothly.

---

## Backend Setup (Python + Flask + SQLite/UV)

1. Navigate to the backend folder:

```bash
cd backend
```

2. Initialize Python project using UV:

```bash
uv init
```

3. Install required dependencies:

```bash
uv add flask flask-sqlalchemy flask-migrate flask-jwt-extended flask-cors python-dotenv
```
# or !!!!!!!!!

```bash
uv init
uv shell
pip install -r requirements.txt
```
4. Backend folder structure:

```
backend/
├── app/
│   ├── __init__.py           # App factory, create_app()
│   ├── config.py             # Config & environment settings
│   ├── extensions.py         # DB, JWT, CORS, Migrate initialization
│   ├── models/               # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── organization.py
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── customer.py
│   │   ├── sale.py
│   │   └── sale_item.py
│   │
│   ├── modules/              # Feature modules with routes & services
│   │   ├── __init__.py
│   │   ├── sales/
│   │   │   ├── routes.py
│   │   │   └── services.py
│   │   ├── stock/
│   │   │   ├── routes.py
│   │   │   └── services.py
│   │   ├── customers/
│   │   │   ├── routes.py
│   │   │   └── services.py
│   │   ├── staff/
│   │   │   ├── routes.py
│   │   │   └── services.py
│   │   └── reports/
│   │       ├── routes.py
│   │       └── services.py
│   │
│   └── auth/                 # Authentication & role management
│       ├── routes.py
│       └── services.py
├── migrations/               # DB migrations (Flask-Migrate)
├── .env                      # Environment variables
└── run.py                    # Entry point to start server
```

5. Initialize and apply database migrations:

```bash
uv run python manage.py db init
uv run python manage.py db migrate -m "Initial auth + organization schema"
uv run python manage.py db upgrade
```

6. Start the backend server:

```bash
uv run python run.py
```

> Your backend should now be running on [http://127.0.0.1:5000](http://127.0.0.1:5000) with CORS enabled for development.

---

## Frontend Setup (React + Vite)

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the Vite development server:

```bash
npm run dev
```

> Your frontend should now be running on [http://localhost:5173](http://localhost:5173)

4. Modular frontend structure:

```
frontend/src/
├── api/                  # API calls (auth, sales, stock, etc.)
├── components/           # Reusable UI components
├── features/             # Feature-based folders (auth, dashboard, sales, etc.)
├── pages/                # Pages like Home, Dashboard
├── routes/               # App routing logic
└── App.jsx               # Root component
```

---

## Testing Authentication Flow

1. Visit `/register` → create organization + owner
2. Visit `/login` → login and store JWT
3. Visit `/dashboard` → verify role and organization info

---

## Notes for Developers

* Backend: keep feature modules in `app/modules/` for clean separation
* Frontend: keep features under `features/` and reusable UI in `components/`
* JWT is stored in localStorage for auth; use it in headers for future API calls
* CORS is enabled for `localhost:5173` in development
* Use `uv run python manage.py db migrate` for DB changes

This README should be the **single reference for onboarding any new developer** to pick up and continue work smoothly.

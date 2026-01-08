# cd backend
# uv init
# uv add flask flask-sqlalchemy flask-migrate flask-jwt-extended python-dotenv

# backend structure│
├── app/
│   ├── __init__.py           # App factory, create_app()
│   ├── config.py             # Config & environment settings
│   ├── extensions.py         # DB, JWT, other extensions
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
│
├── migrations/               # DB migrations (Flask-Migrate)
├── .env                      # Environment variables
└── run.py                    # Entry point to start server


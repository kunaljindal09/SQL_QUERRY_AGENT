# SQL Query Builder Agent

An AI-powered SQL query builder that converts natural language questions into SQL queries using local LLM (Ollama).

---

## Overview

SQL Query Builder Agent enables users to interact with databases using natural language. The system leverages Large Language Models to translate user questions into SQL queries, execute them safely, and present results in an intuitive interface.

### Key Features

- Natural language to SQL query conversion
- JWT-based authentication and authorization
- Real-time database schema introspection
- Query history with bookmarking capability
- SQL syntax highlighting and result visualization
- Safety validation for SQL queries

---

## Quick Access

| Service | URL |
|---------|-----|
| Frontend Application | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |

### Test Credentials

- **Email:** `newuser@example.com`
- **Password:** `test123`

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.0 (running on port 3306)
- Ollama server (configured endpoint)

---

## Installation

### Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows | source venv/bin/activate (Linux/Mac)
pip install -r requirements.txt
copy .env.example .env  # Windows | cp .env.example .env (Linux/Mac)
# Edit .env with your configuration
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Configuration

Edit `backend/.env`:

```env
# Database Configuration
APP_DATABASE_URL=mysql+aiomysql://root:12345@localhost:3306/sqlquerrydb
DEFAULT_TARGET_DB_URL=mysql+aiomysql://root:12345@localhost:3306/sql_agent_db

# LLM Settings
LLM_PROVIDER=llama
LLAMA_BASE_URL=https://aimodels.jadeglobal.com:8082/ollama/api
LLAMA_MODEL=deepseek-coder:6.7b
LLAMA_VERIFY_SSL=false

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Query Settings
MAX_QUERY_ROWS=100
QUERY_TIMEOUT_SECONDS=30
```

**Security Note:** Change `SECRET_KEY` before production deployment.

---

## Usage

1. Navigate to http://localhost:3000
2. Register a new account or login with test credentials
3. Click "Database Schema" in the sidebar to load tables
4. Type natural language questions in the input field
5. View generated SQL, results, and analysis

### Example Queries

- "Show all employees"
- "List products sorted by price"
- "Count employees by department"
- "Find employees with salary greater than 50000"

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/auth/me` | Get current user info |

### Query

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/query/schema` | Get database schema |
| POST | `/api/query/ask` | Submit natural language query |
| POST | `/api/query/statistics` | Get schema statistics |

### History

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/history/` | Get query history |
| POST | `/api/history/{id}/bookmark` | Toggle bookmark |
| DELETE | `/api/history/{id}` | Delete history item |

---

## Database Schema

### Application Database (sqlquerrydb)

- `users` - User accounts with authentication
- `query_history` - Historical record of queries
- `schema_statistics` - Cached schema statistics

### Target Database (sql_agent_db)

- `departments` - Company departments
- `employees` - Employee records (links to departments)
- `products` - Product catalog
- `orders` - Customer orders (links to products)

---

## Project Structure

```
sql-agent/
├── backend/
│   ├── app/
│   │   ├── api/              # API route handlers
│   │   ├── core/             # Config, database, security
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── services/         # Business logic layer
│   │   └── main.py           # FastAPI entry point
│   ├── alembic/              # Database migrations
│   ├── tests/                # Test suite
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API client
│   │   └── main.jsx          # Entry point
│   └── package.json          # Node.js dependencies
└── README.md
```

---

## Troubleshooting

### "No schema loaded" Message

- Ensure backend is running: `uvicorn app.main:app --reload`
- Verify you are logged in
- Click "Database Schema" in the sidebar

### Database Connection Issues

```bash
# Verify MySQL is running
Get-Service -Name "MySQL80"  # Windows
mysql -u root -p -e "SHOW DATABASES;"  # Linux/Mac

# Check database exists
mysql -u root -p -e "USE sql_agent_db; SHOW TABLES;"
```

### Missing Dependencies

```bash
cd backend
pip install -r requirements.txt
pip install groq  # If missing
```

### Port Conflicts

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

---

## License

MIT License - See LICENSE file for details.

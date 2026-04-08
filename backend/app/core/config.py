from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database for users, auth, and query history
    APP_DATABASE_URL: str = "mysql+aiomysql://root:M%40nu3112@localhost:3306/sqlquerrydb"
    
    # Default target database for querying (sample data)
    DEFAULT_TARGET_DB_URL: str = "mysql+aiomysql://root:M%40nu3112@localhost:3306/sql_agent_db"
    GOOGLE_API_KEY: str="AIzaSyC9m9FQXEVAt_r5nVdjQnawTgwk0WIVnhw"
    # JWT Settings
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # LLM Settings (Ollama)
    LLM_PROVIDER: str = "llama"  # or "openai"
    LLAMA_BASE_URL: str = "https://aimodels.jadeglobal.com:8082/ollama/api"
    LLAMA_MODEL: str = "deepseek-coder:6.7b"
    LLAMA_VERIFY_SSL: bool = False
    
    # OpenAI Settings (alternative)
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    
    # Query Settings
    MAX_QUERY_ROWS: int = 100
    QUERY_TIMEOUT_SECONDS: int = 30

    class Config:
        env_file = ".env"


settings = Settings()
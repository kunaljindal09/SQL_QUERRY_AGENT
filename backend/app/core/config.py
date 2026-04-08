from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

class Settings(BaseSettings):
    # Database for users, auth, and query history
    APP_DATABASE_URL: str = os.getenv("APP_DATABASE_URL")
    
    # Default target database for querying (sample data)
    DEFAULT_TARGET_DB_URL: str = os.getenv("DEFAULT_TARGET_DB_URL")
    
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # LLM Settings (Ollama)
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER")  
    LLAMA_BASE_URL: str = os.getenv("LLAMA_BASE_URL")
    LLAMA_MODEL: str = os.getenv("LLAMA_MODEL")
    LLAMA_VERIFY_SSL: bool =os.getenv("LLAMA_VERIFY_SSL")
    
    # germini Settings (alternative)
    GOOGLE_API_KEY: str=str(os.getenv("GOOGLE_API_KEY"))
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    
    # Query Settings
    MAX_QUERY_ROWS: int = os.getenv("MAX_QUERY_ROWS")
    QUERY_TIMEOUT_SECONDS: int = os.getenv("QUERY_TIMEOUT_SECONDS")

    class Config:
        env_file = ".env"


settings = Settings()

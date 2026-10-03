import os
import json
from pathlib import Path
from typing import List
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Explicitly load .env from backend directory
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

class Settings(BaseSettings):
    PROJECT_NAME: str = "Healthcare Resource & Supply Chain Resilience Platform"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./healthcare_dev.db")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_jwt_key_hackathon_demo_2025_aarogya")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Parse CORS
    _raw_cors = os.getenv("CORS_ORIGINS", '["http://localhost:3000","http://127.0.0.1:3000"]')
    try:
        CORS_ORIGINS: List[str] = json.loads(_raw_cors)
    except Exception:
        CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

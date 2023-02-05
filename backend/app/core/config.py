from pydantic import BaseSettings


class Settings(BaseSettings):
    class Config:
        case_sensitive = True
        env_file = '.env'
        env_file_encoding = 'utf-8'

    # App
    NAME: str
    VERSION: str | None

    # Environment
    ENVIRONMENT: str
    DEBUG: bool

    # Database
    DATABASE_URL: str
    READ_ONLY_DATABASE_URL: str | None
    DATABASE_LOG_QUERIES: bool


settings = Settings()

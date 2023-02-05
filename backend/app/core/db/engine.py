from sqlalchemy.engine import create_engine

from app.core.config import settings


engine = create_engine(
    url=settings.DATABASE_URL,
    echo=settings.DATABASE_LOG_QUERIES,
    pool_pre_ping=True,
)

read_only_engine = NotImplemented
if settings.READ_ONLY_DATABASE_URL:
    read_only_engine = create_engine(
        url=settings.READ_ONLY_DATABASE_URL,
        echo=settings.DATABASE_LOG_QUERIES,
        pool_pre_ping=True,
    )

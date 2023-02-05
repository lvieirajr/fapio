from sqlalchemy.orm import sessionmaker

from app.core.db.engine import engine, read_only_engine


DBSession = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

ReadOnlyDBSession = NotImplemented
if read_only_engine is not NotImplemented:
    ReadOnlyDBSession = sessionmaker(
        bind=read_only_engine,
        autoflush=False,
        autocommit=False,
    )

from typing import Generator

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.db.session import DBSession, ReadOnlyDBSession


def get_db() -> Generator[Session, None, None]:
    session = DBSession()

    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_read_only_db() -> Generator[Session, None, None]:
    session = ReadOnlyDBSession()

    try:
        yield session

        if session.info.get("has_flushed", False):
            raise RuntimeError("Uncommitted data in readonly database transaction")
    finally:
        session.close()


DB = Depends(get_db)
ReadOnlyDB = Depends(get_read_only_db)

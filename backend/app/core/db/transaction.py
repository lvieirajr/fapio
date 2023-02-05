from contextlib import contextmanager

from app.core.db.db import get_db, get_read_only_db


db_transaction = contextmanager(get_db)
read_only_db_transaction = contextmanager(get_read_only_db)

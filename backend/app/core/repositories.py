from typing import Generic, Type, TypeVar

from sqlalchemy.orm import Session as DBSession

from app.core.db import BaseDBObject


ModelType = TypeVar("ModelType", bound=BaseDBObject)


class BaseRepository(Generic[ModelType]):
    def __init__(self, *, db: DBSession, model: Type[ModelType]) -> None:
        self._db = db
        self._model = model

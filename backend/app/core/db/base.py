from re import sub as regex_substitute
from typing import Any

from sqlalchemy.ext.declarative import as_declarative, declared_attr


@as_declarative()
class BaseDBObject:
    id: Any

    __name__: str

    @classmethod
    @declared_attr
    def __tablename__(cls) -> str:
        return regex_substitute(r"(?<!^)(?=[A-Z])", "_", cls.__name__).lower()




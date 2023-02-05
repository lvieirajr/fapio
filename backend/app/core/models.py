from uuid import uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID


class BaseModel:
    id = Column("id", UUID(as_uuid=True), primary_key=True, default=uuid4)

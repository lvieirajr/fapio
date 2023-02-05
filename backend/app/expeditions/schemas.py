from typing import Literal, List
from uuid import UUID

from pydantic import BaseModel


class ExpeditionOptimizationParameters(BaseModel):
    farmer_id: UUID
    equipped_pets: List[int]
    objective: Literal["damage", "tokens", "rewards"]

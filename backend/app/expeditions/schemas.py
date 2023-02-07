from typing import List
from uuid import UUID

from pydantic import BaseModel


class ExpeditionOptimizationParameters(BaseModel):
    farmer_id: UUID
    equipped_pets: List[int]
    objectives: List[str]


class OptimizedExpeditionTeam(BaseModel):
    team: List[int]
    base_damage: float
    total_damage: float
    tokens: float
    rewards: float

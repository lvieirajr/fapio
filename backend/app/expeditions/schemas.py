from typing import List, Literal
from uuid import UUID

from pydantic import BaseModel


class ExpeditionOptimizationObjective(BaseModel):
    name: Literal["base_damage", "total_damage", "tokens", "rewards"]
    min: float
    max: float


class ExpeditionOptimizationParameters(BaseModel):
    farmer_id: UUID
    equipped_pets: List[int]
    excluded_pets: List[int]
    objectives: List[ExpeditionOptimizationObjective]


class OptimizedExpeditionTeam(BaseModel):
    team: List[int]
    base_damage: float
    total_damage: float
    tokens: float
    rewards: float


class PetExpeditionData(BaseModel):
    id: int
    type: int

    # Damage
    base_damage: float
    total_damage: float

    # Bonuses
    damage: float
    time: float
    tokens: float
    rewards: float

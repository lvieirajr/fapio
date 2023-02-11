from typing import List, Literal
from uuid import UUID

from pydantic import BaseModel, Field


class ExpeditionOptimizationObjective(BaseModel):
    name: Literal["base_damage", "total_damage", "tokens", "rewards"]

    min: float = float("-inf")
    max: float = float("inf")


class ExpeditionOptimizationParameters(BaseModel):
    farmer_id: UUID

    equipped_pets: List[int] = Field(default_factory=list)
    excluded_pets: List[int] = Field(default_factory=list)

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

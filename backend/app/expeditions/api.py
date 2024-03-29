from typing import List

from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.core.db import DB
from app.expeditions.optimization import ExpeditionOptimizer
from app.expeditions.schemas import (
    ExpeditionOptimizationParameters,
    OptimizedExpeditionTeam,
)


router = APIRouter(prefix="/expeditions")


@router.post("/optimize", status_code=200)
async def optimize_expedition(
    optimization_parameters: ExpeditionOptimizationParameters,
    db: Session = DB,
) -> List[OptimizedExpeditionTeam]:
    optimizer = ExpeditionOptimizer(
        db=db,
        parameters=optimization_parameters,
    )

    optimized_expedition_teams = optimizer.optimize()

    optimizer.clean()
    del optimizer

    return optimized_expedition_teams

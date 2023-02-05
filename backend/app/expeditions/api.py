from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.core.db import DB
from app.expeditions.optimization import ExpeditionOptimizer
from app.expeditions.schemas import ExpeditionOptimizationParameters


router = APIRouter(prefix="/expeditions")


@router.post("/optimize", status_code=200)
async def optimize_expedition(
    optimization_parameters: ExpeditionOptimizationParameters,
    db: Session = DB,
) -> dict:
    optimal_team, optimal_team_damage = ExpeditionOptimizer(
        db=db,
        parameters=optimization_parameters,
    ).optimize()

    return {"team": optimal_team, "damage": optimal_team_damage}
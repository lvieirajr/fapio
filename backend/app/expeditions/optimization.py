from collections import Counter
from itertools import combinations
from functools import cache
from typing import List, Tuple

from sqlalchemy.orm import Session

from app.expeditions.schemas import ExpeditionOptimizationParameters
from app.farmer.repositories import FarmerRepository
from app.pets.constants import PET_COMBOS


class ExpeditionOptimizer:
    def __init__(
        self,
        *,
        db: Session,
        parameters: ExpeditionOptimizationParameters,
    ) -> None:
        self._farmer = FarmerRepository(db=db).get_one(farmer_id=parameters.farmer_id)
        self._equipped_pets = parameters.equipped_pets
        self._objective = parameters.objective

        self._available_pets = {
            int(pet_id): {
                **pet,
                "total_damage": self._calculate_pet_damage(
                    base_damage=pet["base_damage"],
                    rank=pet["rank"],
                ),
            }
            for pet_id, pet in self._farmer.pets.items()
            if pet["captured"] and int(pet_id) not in self._equipped_pets
        }

    def optimize(self) -> Tuple[Tuple[int], float]:
        if self._objective == "damage":
            return self._optimize_damage()
        elif self._objective == "tokens":
            return self._optimize_damage()
        elif self._objective == "rewards":
            return self._optimize_damage()

    def _optimize_damage(self) -> Tuple[Tuple[int], float]:
        pets = self._available_pets

        expedition_teams = {
            expedition_team: self._calculate_expedition_team_damage(
                expedition_team=list(expedition_team),
            )
            for expedition_team in combinations(pets, min(len(pets), 4))
        }

        optimal_expedition_team = max(expedition_teams, key=expedition_teams.get)
        optimal_expedition_team_damage = expedition_teams[optimal_expedition_team]

        return optimal_expedition_team, optimal_expedition_team_damage

    @cache
    def _calculate_pet_damage(self, *, base_damage: float, rank: int) -> float:
        farmer = self._farmer

        @cache
        def _get_number_of_active_expedition_damage_combos():
            active_expedition_damage_combos = 0

            for combo_id in [34, 35, 36]:
                if set(PET_COMBOS[combo_id]["combo"]).issubset(self._equipped_pets):
                    active_expedition_damage_combos += 1

            return active_expedition_damage_combos

        return (
            base_damage
            * 5.0
            * (1.0 + rank * 0.05)
            * (
                1.0
                * (
                    1.0
                    + farmer.infinity_corner_pet_damage_level
                    * 0.02
                    * (1.0 + farmer.infinity_corner_star_level * 0.01)
                    * (
                        (1.01 + farmer.infinity_corner_star_level * 0.0001)
                        ** farmer.expedition_shop_pet_damage_level
                    )
                )
                * (1.0 + int(farmer.soul_shop_protein_shake) * 0.25)
                * (1.05 ** (farmer.ascensions - 8 if farmer.ascensions > 8 else 0))
                * (
                    1.0
                    + max(0, farmer.reincarnation_level - 9500)
                    * (0.0001 + 5e-06 * farmer.ascensions)
                    * (1.0002 ** min(max(farmer.reincarnation_level - 9501, 0), 3000))
                )
                * (1.0 + (farmer.ascensions - 8 if farmer.ascensions > 8 else 0) * 0.25)
                * (1.0 + farmer.expedition_shop_pet_damage_level * 0.05)
                * (1.0 + _get_number_of_active_expedition_damage_combos() * 0.25)
            )
        )

    def _calculate_expedition_team_damage(self, *, expedition_team: List[int]) -> float:
        expedition_team_damage = 0.0
        damage_bonus = 1.0
        time_bonus = 1.0
        synergy_bonus = len(expedition_team) * 0.25
        pet_types = Counter()

        for pet_id in expedition_team:
            pet = self._available_pets[pet_id]

            expedition_team_damage += pet["total_damage"]

            damage_bonus += pet["bonuses"].get("expedition_damage", 0)
            time_bonus += pet["bonuses"].get("expedition_time", 0)

            pet_types[pet["type"]] += 1

        synergy_bonus += 0.25 * int(pet_types[1] > 0 and pet_types[2] > 0)
        synergy_bonus += 0.25 * int(pet_types[1] > 1 and pet_types[2] > 1)

        return expedition_team_damage * damage_bonus * time_bonus * synergy_bonus

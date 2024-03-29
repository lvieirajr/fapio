from collections import Counter
from itertools import combinations
from functools import cache
from math import log
from typing import List

from sqlalchemy.orm import Session

from app.expeditions.schemas import (
    ExpeditionOptimizationParameters,
    OptimizedExpeditionTeam,
    PetExpeditionData,
)
from app.farmer.repositories import FarmerRepository


class ExpeditionOptimizer:
    def __init__(
        self,
        *,
        db: Session,
        parameters: ExpeditionOptimizationParameters,
    ) -> None:
        self._farmer = FarmerRepository(db=db).get_one(farmer_id=parameters.farmer_id)
        self._equipped_pets = parameters.equipped_pets
        self._excluded_pets = parameters.excluded_pets
        self._objectives = parameters.objectives

        self._pets = {
            pet.id: pet
            for pet in self._sort_by_objectives(
                to_sort=[
                    PetExpeditionData(
                        id=int(pet_id),
                        type=pet["type"],
                        base_damage=self._calculate_pet_damage(
                            base_damage=pet["base_damage"],
                            rank=0,
                        ),
                        total_damage=self._calculate_pet_damage(
                            base_damage=pet["base_damage"],
                            rank=pet["rank"],
                        ),
                        damage=pet["bonuses"].get("1013", 0.0),
                        time=pet["bonuses"].get("1012", 0.0),
                        tokens=pet["bonuses"].get("1016", 0.0),
                        rewards=pet["bonuses"].get("1011", 0.0),
                    )
                    for pet_id, pet in self._farmer.pets.items()
                    if pet["captured"] and int(pet_id) not in self._excluded_pets
                ]
            )[:70]
        }

    def clean(self) -> None:
        del self._pets
        del self._farmer
        del self

    def optimize(self) -> List[OptimizedExpeditionTeam]:
        expedition_teams_dict = {
            expedition_team: OptimizedExpeditionTeam(
                team=list(expedition_team),
                base_damage=self._calculate_expedition_team_damage(
                    expedition_team=list(expedition_team),
                    use_base_damage=True,
                ),
                total_damage=self._calculate_expedition_team_damage(
                    expedition_team=list(expedition_team),
                    use_base_damage=False,
                ),
                tokens=self._calculate_expedition_team_tokens_bonus(
                    expedition_team=list(expedition_team),
                ),
                rewards=self._calculate_expedition_team_rewards_bonus(
                    expedition_team=list(expedition_team),
                ),
            )
            for expedition_team in combinations(self._pets, min(len(self._pets), 4))
        }

        for team_pets, expedition_team in list(expedition_teams_dict.items()):
            for objective in self._objectives:
                objective_value = getattr(expedition_team, str(objective.name))

                if objective_value < objective.min or objective_value > objective.max:
                    expedition_teams_dict.pop(team_pets)
                    break

        expedition_teams = self._sort_by_objectives(
            to_sort=list(expedition_teams_dict.values()),
        )

        del expedition_teams_dict

        team_slots = (
            1
            + self._farmer.json["ExpeShopSlotLevel"]
            + self._farmer.json["CowShopExpeditionSlot"]
        )
        optimal_teams = []
        while expedition_teams:
            optimal_team = expedition_teams.pop(0)
            optimal_teams.append(optimal_team)

            if len(optimal_teams) == team_slots:
                break

            expedition_teams = [
                expedition_team for expedition_team in expedition_teams
                if not set(expedition_team.team).intersection(optimal_team.team)
            ]

        del expedition_teams

        return optimal_teams

    def _sort_by_objectives(
        self,
        *,
        to_sort: List[OptimizedExpeditionTeam | PetExpeditionData],
    ) -> List[OptimizedExpeditionTeam | PetExpeditionData]:
        def _get_objectives(element: OptimizedExpeditionTeam | PetExpeditionData):
            sorting_objectives = [
                -getattr(element, str(objective.name))
                for objective in self._objectives
            ] + [-element.total_damage]

            if hasattr(element, "damage"):
                sorting_objectives.append(
                    -(element.damage + element.time + element.tokens + element.rewards)
                )
            else:
                sorting_objectives.append(-(element.tokens + element.rewards))

            return sorting_objectives

        return sorted(to_sort, key=_get_objectives)

    def _calculate_expedition_team_damage(
        self,
        *,
        expedition_team: List[int],
        use_base_damage: bool = False,
    ) -> float:
        expedition_team_damage = 0.0
        damage_bonus = 1.0
        time_bonus = 1.0
        synergy_bonus = len(expedition_team) * 0.25
        pet_types = Counter()

        for pet_id in expedition_team:
            pet = self._pets[pet_id]

            if use_base_damage:
                expedition_team_damage += pet.base_damage
            else:
                expedition_team_damage += pet.total_damage

            damage_bonus += pet.damage
            time_bonus += pet.time

            pet_types[pet.type] += 1

        synergy_bonus += 0.25 * int(pet_types[1] > 0 and pet_types[2] > 0)
        synergy_bonus += 0.25 * int(pet_types[1] > 1 and pet_types[2] > 1)

        return round(
            expedition_team_damage * damage_bonus * time_bonus * synergy_bonus,
            2,
        )

    def _calculate_expedition_team_tokens_bonus(
        self,
        *,
        expedition_team: List[int],
    ) -> float:
        return round(
            1.0 + sum(self._pets[pet_id].tokens for pet_id in expedition_team),
            2,
        )

    def _calculate_expedition_team_rewards_bonus(
        self,
        *,
        expedition_team: List[int],
    ) -> float:
        time_bonus = sum(self._pets[pet_id].time for pet_id in expedition_team)
        rewards_bonus = sum(self._pets[pet_id].rewards for pet_id in expedition_team)

        return round((1.0 + time_bonus) * (1.0 + rewards_bonus), 2)

    @cache
    def _calculate_pet_damage(self, *, base_damage: float, rank: int) -> float:
        farmer = self._farmer

        @cache
        def _get_number_of_active_expedition_damage_combos():
            active_expedition_damage_combos = 0

            for pet_combo in farmer.json["PetsSpecial"]:
                if pet_combo["ID"] in [34, 35, 36, 57, 58]:
                    if set(pet_combo["PetID"]).issubset(self._equipped_pets):
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
                * (1.0 + _get_number_of_active_expedition_damage_combos() * 0.1)
                * (1.0 + self._calculate_gear_pet_damage_bonus())
            )
        )

    @cache
    def _calculate_gear_pet_damage_bonus(self) -> float:
        enhancing_power = self._farmer.json["EnhancingPower"]
        ascension_best_item_rating = self._farmer.json["AscensionBestItemRating"]

        gear = []
        for item in self._farmer.json["EquippedItems"]:
            if not item:
                continue

            piece = {
                "area": item["AreaDropped"],
                "refine": item["RefineLevel"],
                "total_rating": 0.0,
                "pet_damage": 0.0,
            }
            for bonus in item["BonusList"]:
                piece["total_rating"] += bonus["Power"]

                if bonus["BonusID"] == 24:
                    piece["pet_damage"] = bonus["Power"]

            gear.append(piece)

        pet_damage_bonus = 0.0
        for piece in gear:
            if not piece["pet_damage"]:
                continue

            pet_damage_bonus += (
                1.13
                ** log(
                    (
                        piece["pet_damage"]
                        * (1.0 + piece["refine"] * enhancing_power)
                        * min(1.0, ascension_best_item_rating / piece["total_rating"])
                    ),
                    1.65,
                )
            ) * 5e-5

        return pet_damage_bonus

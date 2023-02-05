from json import loads
from typing import Type, TypeVar
from uuid import UUID, uuid4

from sqlalchemy.orm import Session as DBSession
from sqlalchemy.exc import NoResultFound

from app.core.db import BaseDBObject
from app.core.repositories import BaseRepository
from app.farmer.models import Farmer
from app.pets.constants import PETS, PET_BONUSES


FarmerType = TypeVar("FarmerType", bound=[BaseDBObject, Farmer])


class FarmerRepository(BaseRepository[FarmerType]):
    def __init__(self, *, db: DBSession, model: Type[FarmerType] = Farmer) -> None:
        super().__init__(db=db, model=model)

    def get_one(self, *, farmer_id: UUID | str) -> Farmer:
        return self._db.query(self._model).filter(self._model.id == farmer_id).one()

    def store_farmer_save(
        self,
        *,
        farmer_id: UUID | None,
        save_file_contents: str,
    ) -> Farmer:
        save_data = loads(save_file_contents)

        try:
            farmer = self.get_one(farmer_id=farmer_id)
        except NoResultFound:
            farmer = self._model(id=farmer_id or uuid4())

        farmer.blob = save_file_contents
        farmer.json = save_data
        farmer.farmer_level = save_data["Class1Level"]
        farmer.smasher_level = save_data["Class2Level"]
        farmer.hoer_level = save_data["Class3Level"]
        farmer.harvester_level = save_data["Class4Level"]
        farmer.rancher_level = save_data["Class5Level"]
        farmer.freeloader_level = save_data["Class6Level"]
        farmer.reincarnation_level = save_data["ReincarnationLevel"]
        farmer.ascensions = save_data["AscensionCount"]
        farmer.soul_shop_protein_shake = save_data["SoulProteinShake"]
        farmer.infinity_corner_pet_damage_level = save_data["REP3PetDmgLevel"]
        farmer.infinity_corner_star_level = save_data["REP3UpgradeAllLevel"]
        farmer.expedition_shop_pet_damage_level = save_data["ExpeShopPetDamageLevel"]
        farmer.pets = {
            int(pet["ID"]): {
                "id": int(pet["ID"]),
                "name": PETS[int(pet["ID"])]["name"],
                "location": PETS[int(pet["ID"])]["location"],
                "type": int(pet["Type"]),
                "rarity": int(pet["Rarity"]),
                "base_damage": float(pet["BaseDungeonDamage"]),
                "captured": pet["Locked"] == 1,
                "rank": int(pet["Rank"]),
                "rank_exp": float(pet["RankExp"]),
                "rank_exp_required": float(pet["RankExpRequired"]),
                "level": int(pet["Level"]),
                "level_exp": float(pet["LevelExp"]),
                "level_exp_required": float(pet["LevelExpRequired"]),
                "bonuses": {
                    PET_BONUSES[int(bonus["ID"])]["bonus"]: (
                        bonus[PET_BONUSES[int(bonus["ID"])]["key"]]
                    )
                    for bonus in pet["BonusList"]
                },
            }
            for pet in save_data["PetsCollection"]
            if int(pet["ID"]) != 0
        }

        self._db.add(farmer)
        self._db.commit()
        self._db.refresh(farmer)

        return farmer

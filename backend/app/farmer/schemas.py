from uuid import UUID

from pydantic import BaseModel, Field


class Farmer(BaseModel):
    class Config:
        orm_mode = True

    # ID
    id: UUID

    # Farmer
    farmer_level: int
    smasher_level: int
    hoer_level: int
    harvester_level: int
    rancher_level: int
    freeloader_level: int

    # Reincarnation
    reincarnation_level: int

    # Ascension
    ascensions: int

    # Soul Shop:
    soul_shop_protein_shake: bool

    # Infinity Corner
    infinity_corner_pet_damage_level: int
    infinity_corner_star_level: int

    # Expedition Shop
    expedition_shop_pet_damage_level: int

    # Pets
    pets: dict

    # Json
    farmer_json: dict = Field(alias="json")

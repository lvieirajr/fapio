from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.core.db import BaseDBObject
from app.core.models import BaseModel


class Farmer(BaseModel, BaseDBObject):
    # Save Data
    blob = Column(
        "blob",
        String,
        nullable=False,
        default="",
    )
    json = Column(
        "json",
        JSONB,
        nullable=False,
        default=dict,
    )

    # Farmer
    farmer_level = Column(
        "farmer_level",
        Integer,
        nullable=False,
        default=0,
    )
    smasher_level = Column(
        "smasher_level",
        Integer,
        nullable=False,
        default=0,
    )
    hoer_level = Column(
        "hoer_level",
        Integer,
        nullable=False,
        default=0,
    )
    harvester_level = Column(
        "harvester_level",
        Integer,
        nullable=False,
        default=0,
    )
    rancher_level = Column(
        "rancher_level",
        Integer,
        nullable=False,
        default=0,
    )
    freeloader_level = Column(
        "freeloader_level",
        Integer,
        nullable=False,
        default=0,
    )

    # Reincarnation
    reincarnation_level = Column(
        "reincarnation_level",
        Integer,
        nullable=False,
        default=0,
    )

    # Ascension
    ascensions = Column(
        "ascensions",
        Integer,
        nullable=False,
        default=0,
    )

    # Soul Shop
    soul_shop_protein_shake = Column(
        "soul_shop_protein_shake",
        Boolean,
        nullable=False,
        default=False,
    )

    # Whack Shop

    # Infinity Corner
    infinity_corner_pet_damage_level = Column(
        "infinity_corner_pet_damage_level",
        Integer,
        nullable=False,
        default=0,
    )
    infinity_corner_star_level = Column(
        "infinity_corner_star_level",
        Integer,
        nullable=False,
        default=0,
    )

    # Ascension Perks
    # Cow Factory Shop

    # Expedition Shop
    expedition_shop_pet_damage_level = Column(
        "expedition_shop_pet_damage_level",
        Integer,
        nullable=False,
        default=0,
    )

    # Challenges

    # Pets
    pets = Column(
        "pets",
        JSONB,
        nullable=False,
        default=dict,
    )

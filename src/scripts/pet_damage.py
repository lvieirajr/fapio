from functools import cache
from itertools import combinations
from json import load


Cocorico = 1
Rico = 2
Trevor = 3
Bingo = 4
Primfeet = 5
Nidhogg = 6
Vidar = 7
Hiko = 8
Murphy = 9
Aphrodite = 10
Nuts = 11
Alvin = 12
Flash = 13
Cid = 14
Tango = 15
Darti = 16
Arizona = 17
Suijin = 18
JohnyBeGood = 19
Nucifera = 20
Barney = 21
Seth = 22
Plyne = 23
Zac = 24
Tock = 25
TheGoverness = 26
SwampKing = 27
Itzamna = 28
Julian = 29
Yuhuang = 30
Serket = 31
Fujin = 32
Ulrich = 33
Huginn = 34
Esus = 35
Hera = 36
Asterios = 37
Odile = 38
Anubis = 39
Garuda = 40
Tsukuyomi = 41
Nanbozo = 42
Ra = 43
Vishnou = 44
Icare = 45
Olaf = 46
Fafnir = 47
Quetzalcoalt = 48
ProfessorInderwind = 49
Dangun = 50

PET_DATA = load(open("src/fixtures/pets.json"))


class ExpeditionCalculator:
    def __init__(
        self,
        *,
        pets: dict,
        protein_shake: bool,
        ascensions: int,
        reincarnation_level: int,
        infinity_corner_pet_damage_level: int,
        infinity_corner_star_level: int,
        expedition_shop_pet_damage_level: int,
        expedition_damage_combo_active: bool,
    ):
        self.pets = pets

        self.protein_shake = protein_shake
        self.ascensions = ascensions
        self.reincarnation_level = reincarnation_level
        self.infinity_corner_pet_damage_level = infinity_corner_pet_damage_level
        self.infinity_corner_star_level = infinity_corner_star_level
        self.expedition_shop_pet_damage_level = expedition_shop_pet_damage_level
        self.expedition_damage_combo_active = expedition_damage_combo_active

    @classmethod
    @cache
    def calculate_base_pet_damage(cls, *, pet_id: int, pet_rank: int) -> float:
        return (
            PET_DATA[str(pet_id)]["expedition"]["damage"]
            * 5.0
            * (1.0 + pet_rank * 0.05)
        )

    @classmethod
    @cache
    def calculate_damage_multipliers(
        cls,
        *,
        protein_shake: bool,
        ascensions: int,
        reincarnation_level: int,
        infinity_corner_pet_damage_level: int,
        infinity_corner_star_level: int,
        expedition_shop_pet_damage_level: int,
        expedition_damage_combo_active: bool,
    ) -> float:
        return (
            1.0
            * (
                1.0
                + infinity_corner_pet_damage_level
                * 0.02
                * (1.0 + infinity_corner_star_level * 0.01)
                * (
                    (1.01 + infinity_corner_star_level * 0.0001)
                    ** expedition_shop_pet_damage_level
                )
            )
            * (1.0 + int(protein_shake) * 0.25)
            * (1.05 ** (ascensions - 8 if ascensions > 8 else 0))
            * (
                1.0
                + max(0, reincarnation_level - 9500)
                * (0.0001 + 5e-06 * ascensions)
                * (1.0002 ** min(max(reincarnation_level - 9501, 0), 3000))
            )
            * (1.0 + (ascensions - 8 if ascensions > 8 else 0) * 0.25)
            * (1.0 + expedition_shop_pet_damage_level * 0.05)
            * (1.0 + int(expedition_damage_combo_active) * 0.25)
        )

    @classmethod
    @cache
    def calculate_pet_damage(
        cls,
        *,
        pet_id: int,
        pet_rank: int,
        protein_shake: bool,
        ascensions: int,
        reincarnation_level: int,
        infinity_corner_pet_damage_level: int,
        infinity_corner_star_level: int,
        expedition_shop_pet_damage_level: int,
        expedition_damage_combo_active: bool,
    ) -> float:
        return cls.calculate_base_pet_damage(
            pet_id=pet_id, pet_rank=pet_rank
        ) * cls.calculate_damage_multipliers(
            protein_shake=protein_shake,
            ascensions=ascensions,
            reincarnation_level=reincarnation_level,
            infinity_corner_pet_damage_level=infinity_corner_pet_damage_level,
            infinity_corner_star_level=infinity_corner_star_level,
            expedition_shop_pet_damage_level=expedition_shop_pet_damage_level,
            expedition_damage_combo_active=expedition_damage_combo_active,
        )

    @classmethod
    def calculate_pet_team_damage_per_hour(
        cls,
        *,
        pet_team: dict,
        protein_shake: bool,
        ascensions: int,
        reincarnation_level: int,
        infinity_corner_pet_damage_level: int,
        infinity_corner_star_level: int,
        expedition_shop_pet_damage_level: int,
        expedition_damage_combo_active: bool,
    ):
        pet_team_damage_per_hour = 0

        for pet_id, pet_rank in pet_team.items():
            pet_team_damage_per_hour += cls.calculate_pet_damage(
                pet_id=pet_id,
                pet_rank=pet_rank,
                protein_shake=protein_shake,
                ascensions=ascensions,
                reincarnation_level=reincarnation_level,
                infinity_corner_pet_damage_level=infinity_corner_pet_damage_level,
                infinity_corner_star_level=infinity_corner_star_level,
                expedition_shop_pet_damage_level=expedition_shop_pet_damage_level,
                expedition_damage_combo_active=expedition_damage_combo_active,
            )

        damage_bonus, time_bonus = 1.0, 1.0
        pet_types = {"Ground": 0, "Air": 0}
        for pet_id in pet_team:
            pet_data = PET_DATA[str(pet_id)]
            pet_types[pet_data["type"]] += 1

            pet_expedition_bonuses = pet_data["expedition"]["bonuses"]
            time_bonus += pet_expedition_bonuses.get("time", 0)
            damage_bonus += pet_expedition_bonuses.get("damage", 0)

        synergy_bonus = len(pet_team) * 0.25
        if pet_types["Ground"] > 0 and pet_types["Air"] > 0:
            synergy_bonus += 0.25

            if pet_types["Ground"] > 1 and pet_types["Air"] > 1:
                synergy_bonus += 0.25

        return pet_team_damage_per_hour * damage_bonus * time_bonus * synergy_bonus

    def calculate_optimal_pet_team(self):
        optimal_team, optimal_team_damage = None, 0

        for team in set(combinations(self.pets, min(len(self.pets), 4))):
            team_damage = self.calculate_pet_team_damage_per_hour(
                pet_team={pet_id: self.pets[pet_id] for pet_id in team},
                protein_shake=True,
                ascensions=6,
                reincarnation_level=12032,
                infinity_corner_pet_damage_level=0,
                infinity_corner_star_level=19,
                expedition_shop_pet_damage_level=6,
                expedition_damage_combo_active=True,
            )

            if team_damage > optimal_team_damage:
                optimal_team = team
                optimal_team_damage = team_damage

                print(
                    f"Current optimal team: {optimal_team}\n"
                    f"Damage: {optimal_team_damage}"
                )



# from src.scripts.pet_damage import *
#
# expedition_calculator = ExpeditionCalculator(
#     pets={
#         Cocorico: 53,
#         Rico: 38,
#         Trevor: 45,
#         Bingo: 49,
#         Vidar: 41,
#         Primfeet: 15,
#         Hiko: 42,
#         Murphy: 40,
#         Aphrodite: 0,
#         Nidhogg: 31,
#         Nuts: 49,
#         Cid: 11,
#         Flash: 29,
#         Tango: 0,
#         Darti: 23,
#         Alvin: 44,
#         JohnyBeGood: 28,
#         Arizona: 0,
#         Suijin: 23,
#         Nucifera: 0,
#         Barney: 0,
#         Seth: 0,
#         Serket: 0,
#         Fujin: 0,
#         Huginn: 0,
#         Esus: 16,
#         Hera: 18,
#         Odile: 18,
#         Anubis: 16,
#         Tsukuyomi: 0,
#         Nanbozo: 18,
#         Ra: 0,
#         Vishnou: 18,
#         Icare: 0,
#         Olaf: 0,
#     },
#     protein_shake=True,
#     ascensions=6,
#     reincarnation_level=12032,
#     infinity_corner_pet_damage_level=0,
#     infinity_corner_star_level=19,
#     expedition_shop_pet_damage_level=6,
#     expedition_damage_combo_active=True,
# )
#
# expedition_calculator.calculate_optimal_pet_team()
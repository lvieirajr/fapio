import { combinations } from "combinatorial-generators";

import { type PetType } from "../types/pets";


export const calculateTeamDamage = (team: Array<PetType>) => {
  let teamDamage = 0;

  team.forEach((pet) => {teamDamage += pet.totalDamage});

  let damageBonus = 1.0;
  let timeBonus = 1.0;
  const petTypes: { [key: string]: number } = {"Ground": 0, "Air": 0};
  team.forEach((pet) => {
    petTypes[pet.type] += 1;

    damageBonus += pet.bonuses["expedition_damage"] ? pet.bonuses["expedition_damage"] : 0;
    timeBonus += pet.bonuses["expedition_time"] ? pet.bonuses["expedition_time"] : 0;
  });

  let synergy_bonus = team.length * 0.25;
  if (petTypes["Ground"] as number > 0 && petTypes["Air"] as number > 0) {
    synergy_bonus += 0.25;

    if (petTypes["Ground"] as number > 1 && petTypes["Air"] as number > 1) {
      synergy_bonus += 0.25;
    }
  }

  return teamDamage * damageBonus * timeBonus * synergy_bonus;
};

export const calculateOptimalTeam = (
  pets: {[key: string]: PetType},
  equippedPets: Array<number>,
) => {
  let optimalTeam: Array<PetType> = [];
  let optimalTeamDamage = 0;

  const availablePets = Object.values(pets).filter((pet) => {
    return !(pet["id"] in equippedPets) && pet["captured"];
  });
  const teamSize = Math.min(4, availablePets.length);

  [...combinations(availablePets, teamSize)].forEach((team) => {
    const teamDamage = calculateTeamDamage(team);

    if (teamDamage > optimalTeamDamage) {
      optimalTeam = team;
      optimalTeamDamage =  teamDamage;
    }
  });

  return [optimalTeam, optimalTeamDamage];
};



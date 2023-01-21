import { useEffect, useState } from "react";
import { type Farmer } from "@prisma/client";

import { type PetType } from "../types/pets";
import petsJson from "../../public/pets/pets.json";
import petCombosJson from "../../public/pets/combos.json";


export const calculateTotalDamage = (
  baseDamage: number,
  rank: number,
  proteinShake: boolean,
  ascensions: number,
  reincarnationLevel: number,
  infinityCornerPetDamageLevel: number,
  infinityCornerStarLevel: number,
  expeditionShopPetDamageLevel: number,
  equippedPets: Array<number>,
) => {
  const petDamage = baseDamage * 5.0 * (1.0 + rank * 0.05);

  let expeditionDamageComboActive = false;
  [petCombosJson["34"], petCombosJson["35"], petCombosJson["36"]].forEach((combo) => {
      if (combo["pet_ids"].every(petId => equippedPets.includes(petId))) {
        expeditionDamageComboActive = true;
      }
  });

  const multipliers = (
      (
        1.0
        + infinityCornerPetDamageLevel
        * 0.02
        * (1.0 + infinityCornerStarLevel * 0.01)
        * Math.pow(
          (1.01 + infinityCornerStarLevel * 0.0001),
          infinityCornerPetDamageLevel
        )
      )
      * (1.0 + (+proteinShake) * 0.25)
      * Math.pow(1.05, (ascensions > 8 ? ascensions - 8 : 0))
      * (
          1.0
          + Math.max(0, reincarnationLevel - 9500)
          * (0.0001 + 5e-06 * ascensions)
          * (1.0002 ** Math.min(Math.max(reincarnationLevel - 9501, 0), 3000))
      )
      * (1.0 + (ascensions > 8 ? ascensions - 8 : 0) * 0.25)
      * (1.0 + expeditionShopPetDamageLevel * 0.05)
      * (1.0 + (+expeditionDamageComboActive) * 0.25)
  )

  return petDamage * multipliers;
};


export const usePets = (farmer: Farmer | null | undefined) => {
  const [pets, setPets] = useState<{[key: string]: PetType}>({});

  useEffect(() =>{
    if (farmer) {
      const farmerPets = farmer.pets as object;
      const parsedPets: { [key: string]: PetType } = {};

      Object.entries(petsJson).forEach((entry) => {
        const [petId, pet] = entry;

        const petData: PetType = {
          "id": +petId,
          "name": pet["name"],
          "location": pet["location"],
          "type": pet["type"],
          "rarity": pet["rarity"],
          "pity": pet["pity"],
          "baseDamage": pet["damage"],
          "bonuses": pet["bonuses"] as { [key: string]: number },
          "captured": false,
          "rank": 0,
          "level": 0,
          "totalDamage": 0,
        }

        if (petId in farmerPets) {
          petData["captured"] = true;
          petData["rank"] = +farmerPets[pet["id"] as keyof object]["rank"];
          petData["level"] = +farmerPets[pet["id"] as keyof object]["level"];

          if (farmer.soulShop && farmer.infinityCorner && farmer.expeditionShop){
            petData["totalDamage"] = calculateTotalDamage(
              petData["baseDamage"],
              petData["rank"],
              farmer.soulShop["proteinShake" as keyof object],
              farmer.ascensions,
              farmer.reincarnationLevel,
              farmer.infinityCorner["petDamageLevel" as keyof object],
              farmer.infinityCorner["starLevel" as keyof object],
              farmer.expeditionShop["petDamageLevel" as keyof object],
              farmer.equippedPets as Array<number>,
            );
          }
        }

        parsedPets[petId] = petData;
      });

      setPets(parsedPets);
    }
  }, [farmer]);

  return pets;
};

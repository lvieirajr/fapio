import { z } from "zod";

import {createTRPCRouter, protectedProcedure, publicProcedure} from "../trpc";

interface Pet {
  id: number,
  level: number,
  rank: number,
}

export const farmerRouter = createTRPCRouter({
  getFarmer: publicProcedure
    .input(z.object({}))
    .query(({ ctx }) => {
      return ctx.prisma.farmer.findUnique({where: {userId: ctx.session?.user?.id}}).then((farmer) => {
        return farmer;
      }).catch(() => { return null; })

    }),
  loadSave: protectedProcedure
    .input(z.object({saveData: z.string()}))
    .mutation(({ctx, input}) => {
      const saveData = JSON.parse(input.saveData) as object;

      const pets: { [key: number]: Pet } = {};
      (saveData["PetsCollection" as keyof object] as Array<object>).forEach((pet) => {
        if (pet["Locked" as keyof object] == 1) {
          pets[+pet["ID" as keyof object]] = {
            "id": +pet["ID" as keyof object],
            "level": +pet["Level" as keyof object],
            "rank": +pet["Rank" as keyof object],
          }
        }
      });

      const equippedPets = (saveData["EquipedPetID" as keyof object] as Uint8Array).filter((petId) => {
        return petId > 0;
      });

      const farmerData = {
        saveData: input.saveData,
        farmerLevel: saveData["Class1Level" as keyof object],
        smasherLevel: saveData["Class2Level" as keyof object],
        hoerLevel: saveData["Class3Level" as keyof object],
        harvesterLevel: saveData["Class4Level" as keyof object],
        rancherLevel: saveData["Class5Level" as keyof object],
        freeloaderLevel: saveData["Class6Level" as keyof object],
        reincarnationLevel: saveData["ReincarnationLevel" as keyof object],
        ascensions: saveData["AscensionCount" as keyof object],
        challenges: {},
        ascensionPerks: {},
        infinityCorner: {
          petDamageLevel: saveData["REP3PetDmgLevel" as keyof object],
          starLevel: saveData["REP3UpgradeAllLevel" as keyof object],
        },
        soulShop: {
          proteinShake: saveData["SoulProteinShake" as keyof object],
        },
        whackShop: {},
        cowFactoryShop: {},
        expeditionShop: {
          petDamageLevel: saveData["ExpeShopPetDamageLevel" as keyof object],
        },
        pets: pets as object,
        equippedPets: equippedPets as object,
      };

      return ctx.prisma.farmer.upsert({
        where: { userId: ctx.session.user.id },
        create: { userId: ctx.session.user.id, ...farmerData },
        update: {...farmerData },
      });
    }),
});

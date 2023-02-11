import axios from 'axios';

export const optimizeExpedition = (
  farmerId: string,
  equippedPets: Array<number>,
  excludedPets: Array<number>,
  objectives: Array<string>,
) => {
  return axios
    .post(`${import.meta.env.VITE_API_URL}/expeditions/optimize`, {
      farmer_id: farmerId,
      equipped_pets: equippedPets,
      excluded_pets: excludedPets,
      objectives: objectives.map((objective) => {
        return { name: objective };
      }),
    })
    .then((response) => response.data);
};

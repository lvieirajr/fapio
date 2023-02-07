import axios from 'axios';

export const optimizeExpedition = (farmerId: string, equippedPets: Array<number>) => {
  return axios
    .post(`${import.meta.env.VITE_API_URL}/expeditions/optimize`, {
      farmer_id: farmerId,
      equipped_pets: equippedPets,
      objectives: ['total_damage'],
    })
    .then((response) => response.data);
};

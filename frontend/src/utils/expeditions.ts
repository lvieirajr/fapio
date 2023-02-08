import axios from 'axios';

export const optimizeExpedition = (farmerId: string, equippedPets: Array<number>) => {
  return axios
    .post(`${import.meta.env.VITE_API_URL}/expeditions/optimize`, {
      farmer_id: farmerId,
      equipped_pets: equippedPets,
      excluded_pets: [],
      objectives: [{ name: 'total_damage', min: 0.0, max: 999999999999.9 }],
    })
    .then((response) => response.data);
};

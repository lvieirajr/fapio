import axios from 'axios';

export const getFarmer = (farmerId: string) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/farmer/${farmerId}`).then((response) => {
    return response.data;
  });
};

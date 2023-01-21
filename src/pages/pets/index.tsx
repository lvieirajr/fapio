import { Fragment } from 'react';
import { type NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import NavBar from "../components/NavBar";
import PetGrid from "./PetGrid";

import { useFarmer } from "../hooks/farmer";
import { type PetType } from "../../types/pets";

import petsJson from "../../../public/pets/pets.json";

const Pets: NextPage = () => {
  const { session, farmer } = useFarmer();

  if (!session || !farmer.data) {
    return <main />;
  }

  const pets: Array<PetType> = [];
  Object.entries(petsJson).forEach((entry) => {
    const [petId, pet] = entry;

    pets.push({
      "id": +petId,
      "name": pet["name"],
      "location": pet["location"],
      "type": pet["type"],
      "rarity": pet["rarity"],
      "pity": pet["pity"],
      "damage": pet["damage"] as number,
      "bonuses": pet["bonuses"] as { [key: string]: number },
      "captured": false,
      "rank": 0,
      "level": 0,
    });
  });

  const farmerPets = farmer?.data?.pets as object;
  pets.forEach((pet) => {
    if (pet["id"] in farmerPets){
      pet["captured"] = true;
      pet["rank"] = +farmerPets[pet["id"] as keyof object]["rank"];
      pet["level"] = +farmerPets[pet["id"] as keyof object]["level"];
    }
  });

  return (
    <Fragment>
      <NavBar />
      <main>
        <Container sx={{pt: 4, pb: 4}}>
          <Typography
            component="h1"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Pets
          </Typography>
        </Container>
        <Container sx={{ py: 4 }} maxWidth="md">
          <PetGrid pets={pets} />
        </Container>
      </main>
    </Fragment>
  );
};

export default Pets;

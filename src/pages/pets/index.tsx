import { Fragment, useEffect, useState } from 'react';
import { type NextPage } from "next";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import NavBar from "../components/NavBar";
import { type PetType } from "../../types/pets";
import { useFarmer } from "../../hooks/farmer";
import { usePets } from "../../hooks/pets";
import { calculateOptimalTeam } from "./expeditionOptimization";

interface TeamType {
  pets: Array<PetType>,
  damage: number,
}

const Pets: NextPage = () => {
  const [team, setTeam] = useState<TeamType>({"pets": [], "damage": 0})
  const { session, farmer } = useFarmer();
  const pets = usePets(farmer.data);


  useEffect(() => {
    if (farmer.data && pets) {
      const [optimalTeam, optimalTeamDamage] = calculateOptimalTeam(
        pets,
        farmer.data.equippedPets as Array<number>,
      );

      setTeam({
        "pets": optimalTeam as Array<PetType>,
        "damage": optimalTeamDamage as number,
      });
    }
  }, [session, farmer, pets, team, setTeam]);

  if (!session || !farmer.data) {
    return <main />;
  }

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
          <Fragment>
            <p>This is your optimal expedition team and it deals {Math.round(team.damage)} damage per hour.</p>
            {team.pets.map((pet) => (
              <Image key={pet.id} src={`/pets/${pet.name}.png`} alt={pet.name} width={100} height={100} />
            ))}
          </Fragment>
        </Container>
      </main>
    </Fragment>
  );
};

export default Pets;

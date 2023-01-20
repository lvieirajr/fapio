import { Fragment } from 'react';
import { type NextPage } from "next";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";

import NavBar from "../components/NavBar";
import PetCard from "./PetCard";

import { useFarmer } from "../hooks/farmer";

const Pets: NextPage = () => {
  const { session, farmer } = useFarmer();

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
        {farmer.data &&
          <Container sx={{py: 4}} maxWidth="md">
            <Grid container spacing={2}>
              {(farmer.data.pets as Array<object>)?.map((pet) => (
                <Grid item key={pet["id" as keyof object]} xs={2} sm={2} md={2}>
                  <PetCard
                    id={1}
                    name={"Cocorico"}
                    location={"3-2"}
                    type={"Ground"}
                    rarity={1}
                    pity={null}
                    expeditionBaseDamage={10.0}
                    equippedBonuses={{}}
                    expeditionBonuses={{}}
                    captured={false}
                    rank={50}
                    level={100}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        }
      </main>
    </Fragment>
  );
};

export default Pets;

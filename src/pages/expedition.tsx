import { Fragment } from 'react';
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import NavBar from "./components/NavBar";

import { api } from "../utils/api";

const Expedition: NextPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const farmer = api.farmer.getFarmer.useQuery({});

  if (sessionStatus === "loading" || farmer.isLoading ) {
    return <main />;
  }

  if (!session) {
    void router.push(`/`);
    return <main />;
  } else {
    return (
      <Fragment>
        <NavBar />
        <main>
          <Container maxWidth="sm" sx={{pt: 4, pb: 4}}>
            <Typography
              component="h1"
              variant="h3"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Expeditions
            </Typography>
          </Container>
        </main>
      </Fragment>
    );
  }
};

export default Expedition;

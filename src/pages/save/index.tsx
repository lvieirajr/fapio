import { Fragment, useEffect } from 'react';
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import NavBar from "../components/NavBar";

import { useFarmer } from "../../hooks/farmer";

const Save: NextPage = () => {
  const { session, farmer } = useFarmer();
  const router = useRouter();

  useEffect(() => {
    if (farmer.data) {
      void router.push("/pets");
    }
  }, [farmer, router]);

  if (!session || farmer.isLoading || farmer.data) {
    return <main />;
  }

  return (
    <Fragment>
      <NavBar />
      <main>
        <Container sx={{pt: 4, pb: 4}}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Upload your save to proceed<br/>
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            It should be stored under:<br/>
            %APPDATA%\..\LocalLow\Oni Gaming\Farmer Against Potatoes Idle\fapi-save.txt
          </Typography>
        </Container>
      </main>
    </Fragment>
  );
};

export default Save;

import { useEffect } from 'react'
import { type NextPage } from "next";
import { useRouter } from "next/router"
import { signIn, useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Image from "next/image"

const Home: NextPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && sessionStatus) {
      void router.push("/pets");
    }
  }, [sessionStatus]);

  if (sessionStatus === "loading" || session) {
    return <main />;
  }

  return (
    <Container component="main" maxWidth={"xs"}>
      <Box
        sx={{
          marginTop: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Image src="/logo.png" alt="logo" width={400} height={200} priority />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 6, mb: 2 }}
          onClick={() => void signIn("discord", { callbackUrl: "/pets" })}
        >
            Sign In With Discord
        </Button>
      </Box>
    </Container>
  );
};

export default Home;

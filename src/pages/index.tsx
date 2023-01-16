import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession()

  return (
    <>
      <Head>
        <title>FAPIO</title>
        <meta name="description" content="FAPIO - Farmer Against Potatoes Idle Optimizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <button onClick={sessionData ? () => void signOut() : () => void signIn()}>
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    </>
  );
};

export default Home;

import { type NextPage } from "next";
import { useRouter } from 'next/router'
import {signIn, useSession} from "next-auth/react";

const Home: NextPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  if (sessionStatus === "loading") {
    return <main />;
  }

  if (session && session.user) {
    void router.push(`/fapio/`)
    return <main />;
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <img className="justify-center align-center mb-4 py-4 px-2" src="/fapi.png" />

        <button
          className="justify-center rounded-md border border-transparent bg-indigo-500 mt-4 py-4 px-8 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => void signIn()}
        >
          Sign in with Discord
        </button>
      </main>
    );
  }


};

export default Home;

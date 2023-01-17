import { type NextPage } from "next";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const Fapio: NextPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  if (sessionStatus === "loading") {
    return <main />;
  }

  if (!session) {
    void router.push(`/`);
    return <main />;
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <img className="justify-center align-center mb-4 py-4 px-2" src="/fapi.png" />

        <button
          className="justify-center rounded-md border border-transparent bg-indigo-500 mt-4 py-4 px-8 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      </main>
    );
  }
};

export default Fapio;

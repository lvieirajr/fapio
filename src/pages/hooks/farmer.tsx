import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "../../utils/api";


export const useFarmer = () => {
  const { data: session, status: sessionStatus } = useSession();
  const farmer = api.farmer.getFarmer.useQuery({});
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus !== "loading" && !session) {
      void router.push("/");
    }
  }, [session]);

  useEffect(() => {
    if (session && !farmer.isLoading && !farmer.data) {
      void router.push("/save");
    }
  }, [session, farmer]);

  return {session, farmer};
};

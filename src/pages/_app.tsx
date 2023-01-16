import { type AppType } from "next/app";
import { type Session } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const title = "FAPIO";
  const description = "Farmer Against Potatoes Idle Optimizer"


  return (
    <SessionProvider session={session}>
      <Head>
        <title>{title}</title>

        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

import "@/styles/globals.css";
import type { AppType } from "next/app";
// import { SessionProvider } from "next-auth/react";

import { trpc } from "./utils/trpc";

const App: AppType = ({ Component, pageProps }) => {
  return (
    // <SessionProvider session={session}>
    <Component {...pageProps} />
    // </SessionProvider>
  );
};

export default trpc.withTRPC(App);

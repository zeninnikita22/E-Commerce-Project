import "@/styles/globals.css";
import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { UserProvider } from "./UserContext";
import { trpc } from "./utils/trpc";
import Layout from "./Layout";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(App);

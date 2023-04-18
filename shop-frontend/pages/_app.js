import "@/styles/globals.css";
import Layout from "../components/Layout";
// import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App({ Component, pageProps }) {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <ChakraProvider> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {/* </ChakraProvider> */}
      </QueryClientProvider>
    </>
  );
}

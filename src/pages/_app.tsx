import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Provider } from "react-redux";
import { store } from "../store/store";
import Head from "next/head";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import {
  StarknetConfig,
  InjectedConnector,
  StarknetProvider,
} from "@starknet-react/core";

const theme = extendTheme({
  components: {
    Tabs: {
      baseStyle: {
        tab: {
          _disabled: {
            background:"#101216",
            opacity:"100%",
            cursor:'pointer',
          },
          "> *:first-of-type": {
             background:"#101216",
             opacity:"100%",
          },
        },
      },
    },
  },
  colors: {
    customBlue: {
      500: "#0969DA",
    },
  },
  fonts: {
    body: "Inter, sans-serif",
  },
});
import { UserbackProvider } from "@userback/react";

export default function App({ Component, pageProps }: AppProps) {
  const connectors = [
    new InjectedConnector({ options: { id: "braavos" } }),
    new InjectedConnector({ options: { id: "argentX" } }),
  ];

  return (
    <>
    <Head>
    <meta httpEquiv="Cache-Control" content="no-cache, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
    <title>HashStack | Under-collateralised loans | Defi</title>
        <meta name="description" content="Hashstack provides a permissionless zk-native money market protocol enabling secure under-collateralised loans to the crypto retail. Built on Starknet L2 [announcement], Hashstack leverages the capability of zero-knowledge proofs to provide a cost & capital-efficient lending solution." />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
    </Head>
    <UserbackProvider token="40202|80442|mX2ZdYcMxJbcQjhQu6EJB9M9S">
      <ChakraProvider theme={theme}>
        <StarknetProvider autoConnect={true} connectors={connectors}>
        <Provider store={store}>
          <StarknetProvider connectors={connectors}>
            <Component {...pageProps} />
          </StarknetProvider>
        </Provider>

        </StarknetProvider>
      </ChakraProvider>
    </UserbackProvider>
    </>
  );
}

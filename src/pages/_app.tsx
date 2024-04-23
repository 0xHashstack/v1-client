import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { goerli, mainnet,sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  alchemyProvider,
  argent,
  braavos,
  infuraProvider,
  useInjectedConnectors,
} from "@starknet-react/core";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PostHogProvider } from "posthog-js/react";
import { useState } from "react";
import { Provider } from "react-redux";

import Layout from "@/components/layouts/toasts";
import "@/styles/globals.css";
import { store } from "../store/store";

export const theme = extendTheme({
  components: {
    Tabs: {
      baseStyle: {
        tab: {
          _disabled: {
            background: "#676D9A1A",
            opacity: "100%",
            cursor: "pointer",
          },
          "> *:first-of-type": {
            background: "#676D9A1A",
            opacity: "100%",
          },
        },
      },
    },
    Checkbox: {
      baseStyle: {
        icon: {
          bg: "#4D59E8",
          color: "white",
          borderWidth: "0px",
          _disabled: {
            borderWidth: "0px",
            padding: "0px",
            color: "#4D59E8",
            bg: "#4D59E8",
            colorScheme: "#4D59E8",
          },
        },
        control: {
          borderRadius: "base",
          _disabled: {
            borderWidth: "0px",
            padding: "0px",
            color: "black",
            bg: "#4D59E8",
          },
        },
      },
    },
  },

  colors: {
    customBlue: {
      500: "#0969DA",
    },
    customPurple: {
      500: "#4D59E8",
    },
  },
  fonts: {
    body: "Inter, sans-serif",
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const apikey: string = process.env.NEXT_PUBLIC_INFURA_MAINNET as string;

  const provider = infuraProvider({ apiKey: apikey.split('/')[4]});

  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random",
  });

  const options = {
    api_host: process.env.NEXT_PUBLIC_HOSTHOG_HOST,
  };

  return (
    <>
      <Head>
        <meta httpEquiv="Cache-Control" content="no-cache, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta
          name="google-site-verification"
          content="9U0-YnKdWueBdZmj8Y5_JEkGNPOiV-_d8cPrmjIgifs"
        />
        <title>Hashstack | Under-collateralised loans | Defi</title>
        <meta
          name="description"
          content="Hashstack provides a permissionless zk-native money market protocol enabling secure under-collateralised loans to the crypto retail. Built on Starknet L2 [announcement], Hashstack leverages the capability of zero-knowledge proofs to provide a cost & capital-efficient lending solution."
        />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
      </Head>

      <PostHogProvider
        apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
        options={options}
      >
        <ChakraProvider theme={theme}>
          <StarknetConfig
            chains={[mainnet, goerli,sepolia]}
            provider={provider}
            connectors={connectors}
          >
            <Provider store={store}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Provider>
          </StarknetConfig>
        </ChakraProvider>
      </PostHogProvider>
    </>
  );
}

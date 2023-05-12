import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Provider } from "react-redux";
import { store } from "../store/store";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  StarknetConfig,
  InjectedConnector,
  StarknetProvider,
} from "@starknet-react/core";

const theme = extendTheme({
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
    <UserbackProvider token="40202|80442|mX2ZdYcMxJbcQjhQu6EJB9M9S">
      <ChakraProvider theme={theme}>
        <StarknetProvider connectors={connectors}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>

        </StarknetProvider>
      </ChakraProvider>
    </UserbackProvider>
  );
}

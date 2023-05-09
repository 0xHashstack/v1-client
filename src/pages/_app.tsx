import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Provider } from "react-redux";
import { store } from "../store/store";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import spaceApiKey from "../utils/constants/keys";
import { loadSpace } from "@usersnap/browser";
import { useEffect, useRef } from "react";

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
  return (
    <UserbackProvider token="40202|80442|mX2ZdYcMxJbcQjhQu6EJB9M9S">
      <ChakraProvider theme={theme}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ChakraProvider>
    </UserbackProvider>
  );
}

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
    // heading: "Georgia, serif",
    // mono: "Menlo, monospace",
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const feedbackinitialized = useRef(false);
  console.log("api");
  useEffect(() => {
    if (!feedbackinitialized.current) {
      loadSpace(spaceApiKey).then((api) => {
        api.init();
      });
    }
    feedbackinitialized.current = true;
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
}

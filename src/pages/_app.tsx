import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Provider } from "react-redux";
import { store } from "../store/store";

import { ChakraProvider } from "@chakra-ui/react";

import spaceApiKey from "../utils/constants/keys";
import { loadSpace } from "@usersnap/browser";
import { useEffect, useRef } from "react";

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
    <ChakraProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
}

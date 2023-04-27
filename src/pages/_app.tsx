import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Provider } from "react-redux";
import { store } from "../store/store";

import { ChakraProvider } from "@chakra-ui/react";

import spaceApiKey from "../utils/constants/keys";
import { loadSpace } from "@usersnap/browser";

export default function App({ Component, pageProps }: AppProps) {
  loadSpace(spaceApiKey).then((api) => {
    api.init();
  });
  return (
    <ChakraProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
}

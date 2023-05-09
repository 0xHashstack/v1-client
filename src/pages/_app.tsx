import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import { Provider } from "react-redux";
import { store } from "../store/store";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";


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
import { UserbackProvider } from "@userback/react";

const inter = Inter({ subsets: ["latin"] });

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

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import { Provider } from "react-redux";
import { store } from "../store/store";

import { ChakraProvider } from "@chakra-ui/react";

import { UserbackProvider } from "@userback/react";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserbackProvider token="40202|80442|mX2ZdYcMxJbcQjhQu6EJB9M9S">
      <ChakraProvider>
        <Provider store={store}>
          <main className={inter.className}>
            <Component {...pageProps} />
          </main>
        </Provider>
      </ChakraProvider>
    </UserbackProvider>
  );
}

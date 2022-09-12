import "../styles/globals.css";

import type { AppProps } from "next/app";
import loadable from "@loadable/component";

import "../assets/scss/theme.scss";
// import "../assets/fonts/AvenirNextLTPro-Regular.otf";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

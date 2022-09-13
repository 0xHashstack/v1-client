// import "../styles/globals.css";

import type { AppProps } from "next/app";
import loadable from "@loadable/component";

import Layout from "../components/layout";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "../store";
import "../assets/scss/theme.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ToastContainer />
      </Provider>
    </>
  );
}

export default MyApp;

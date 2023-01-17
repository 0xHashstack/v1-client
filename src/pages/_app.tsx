// import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import loadable from "@loadable/component";

import Layout from "../components/layout";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { DetailsProvider } from "../hooks/contextHooks/recordContext";
import store from "../store";
import "../assets/scss/theme.scss";
import "./scrollbar.css";

import { InjectedConnector, StarknetProvider } from "@starknet-react/core";
import { SequencerProvider } from "starknet";
import ErrorBoundary from "../components/ErrorComponent";
import { IdentifierProvider } from "../blockchain/hooks/context/identifierContext";
import ConnectionDetails from "../components/walletIdentifier/connectionDashboard";

const { chains, provider } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Hashstack",
  chains,
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  const connectors = [
    new InjectedConnector({ options: { id: "braavos" } }),
    new InjectedConnector({ options: { id: "argentX" } }),
  ];
  return (
    <>
      <ErrorBoundary>
        <IdentifierProvider>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <StarknetProvider
                connectors={connectors}
                autoConnect
                defaultProvider={
                  new SequencerProvider({
                    baseUrl: "https://alpha4-2.starknet.io",
                  })
                }
              >
                <Provider store={store}>
                  <DetailsProvider>
                    {/* <ConnectionDetails /> */}

                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                    <ToastContainer />
                  </DetailsProvider>
                </Provider>
              </StarknetProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </IdentifierProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;

// import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import loadable from "@loadable/component";
import Image from "next/image";
import Layout from "../components/layout";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { DetailsProvider } from "../hooks/contextHooks/recordContext";
import store from "../store";
import "../assets/scss/theme.scss";
import "./scrollbar.css";
import { TabsProvider } from "../hooks/contextHooks/TabContext";
// import Ellipse1 from "../assets/images/Ellipse 59.svg";
// import Ellipse2 from "../assets/images/Ellipse 60.svg";
import {SecTabsProvider} from "../hooks/contextHooks/SecTabContext"
import {
  InjectedConnector,
  StarknetProvider,
  useAccount,
} from "@starknet-react/core";
import { SequencerProvider, RpcProvider } from "starknet";
import ErrorBoundary from "../components/ErrorComponent";
import { IdentifierProvider } from "../blockchain/hooks/context/identifierContext";

if (typeof window !== "undefined") {
  const amplitude = require("@amplitude/analytics-browser");
  /* Initializing amplitude analytics */
  amplitude.init("0c6ca142b8f758aec64963ebdea8fdb1", undefined, {
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: true,
      fileDownloads: true,
    },
  });
}

/******************************************************************/

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
    <div
      style={{
        backgroundColor: "#1C202F",
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      <div style={{ position: "fixed", bottom: "0px", left: "0px" }}>
        <img
          src="./Ellipse 59.svg"
          alt="ellipse"
          width="750px"
          height="750px"
        />
      </div>
      <div style={{ position: "fixed", bottom: "0px", right: "0px" }}>
        <img
          src="./Ellipse 60.svg"
          alt="ellipse"
          width="800px"
          height="800px"
        />
      </div>
      <ErrorBoundary>
        <IdentifierProvider>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <StarknetProvider
                connectors={connectors}
                autoConnect
                defaultProvider={
                  // @todo to move this to env variables
                  // @Rajeebs's Infura project
                  new RpcProvider({
                    nodeUrl:
                      "https://starknet-mainnet.infura.io/v3/c93242f6373647c7b5df8e400f236b7c",
                  })
                }
              >
                <Provider store={store}>
                  <DetailsProvider>
                    <SecTabsProvider>
                    <TabsProvider>
                      {/* <ConnectionDetails /> */}
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                      <ToastContainer />
                    </TabsProvider>
                    </SecTabsProvider>
                  </DetailsProvider>
                </Provider>
              </StarknetProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </IdentifierProvider>
      </ErrorBoundary>
    </div>
  );
}

export default MyApp;

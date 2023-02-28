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
import Ellipse1 from "../assets/images/Ellipse 59.svg";
import Ellipse2 from "../assets/images/Ellipse 60.svg";
import {
  InjectedConnector,
  StarknetProvider,
  useAccount,
} from "@starknet-react/core";
import { SequencerProvider, RpcProvider } from "starknet";
import ErrorBoundary from "../components/ErrorComponent";
import { IdentifierProvider } from "../blockchain/hooks/context/identifierContext";
import ConnectionDetails from "../components/walletIdentifier/connectionDashboard";
import ConnectWalletModal from "../components/layout/connectWalletModal";


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
    <div style={{ backgroundColor: "#1C202F", height: "100vh" }}>
      <div style={{ position: "fixed", bottom: "0px", left: "0px" }}>
        <img
          src={`${Ellipse1.src}`}
          alt="ellipse"
          width="750px"
          height="750px"
        />
      </div>
      <div style={{ position: "fixed", bottom: "0px", right: "0px" }}>
        <img
          src={`${Ellipse2.src}`}
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
                  new RpcProvider({
                    nodeUrl:
                      "https://starknet-goerli.infura.io/v3/3274a9630231466681b6300375f517f2",
                  })
                }
              >
                <Provider store={store}>
                  <DetailsProvider>
                    <TabsProvider>
                      {/* <ConnectionDetails /> */}
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                      <ToastContainer />
                    </TabsProvider>
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

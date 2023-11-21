import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Provider } from "react-redux";
import { store } from "../store/store";
import Head from "next/head";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { loadSpace } from "@usersnap/browser";

import {
  StarknetConfig,
  InjectedConnector,
  StarknetProvider,
} from "@starknet-react/core";
const theme = extendTheme({
  components: {
    Tabs: {
      baseStyle: {
        tab: {
          _disabled: {
            background: "#676D9A1A",
            opacity: "100%",
            cursor: "pointer",
          },
          "> *:first-of-type": {
            background: "#676D9A1A",
            opacity: "100%",
          },
        },
      },
    },
    // Checkbox: {
    //   parts: ["control","icon"],
    //   baseStyle: {
    //     control: {
    //       _checked: {
    //         _disabled: {
    //           bg: "#4D59E8",
    //           borderColor:"#2B2F35",

    //         }
    //       }
    //     },
    //     icon:{
    //       bg:"white.600"
    //     }
    //   }
    // }
       Checkbox: {
      baseStyle: {
// {color:'black',}
        icon: {
          // color: 'white',
          bg: '#4D59E8',
          color:'white',
          borderWidth:'0px',
          

          // borderColor: '#4D59E8',
          _disabled: {
          borderWidth:'0px',
          padding:'0px',
            color:'#4D59E8',
          bg: '#4D59E8',
            colorScheme:"#4D59E8",
            // iconColor:'white.800'
            // borderColor: '#4D59E8',
            // bg: 'red.800',
            
          },


        },
        control: {
          // border: '1px',
          // borderColor: 'gray.300',
          borderRadius: 'base',
          _disabled: {
            borderWidth: '0px',
            padding:'0px',
            color:'black',
          bg: '#4D59E8',


              // borderColor: '#4D59E8',
            // bg: '#4D59E8',
          },
        },
        
      },
    },
    // Radio: {
    //   control: {
    //     _checked: {
    //       color: "red.800",
    //       bg:"red.800"
    //     },
    //   },
      
    // },
    // Radio: {
    //       bg:'red.800',
    //       control: {
    //         _checked: {
    //           color: 'green.800',
    //           bg:`black`,
    //         },
    //       },
    
    
    // },
  },


  colors: {
    customBlue: {
      500: "#0969DA",
    },
    customPurple:{
      500:"#4D59E8",
    }
  },
  fonts: {
    body: "Inter, sans-serif",
  },
});
const lightTheme = extendTheme({
  // Add your light theme styles here
});
import { UserbackProvider } from "@userback/react";
import Layout from "@/components/layouts/toasts";
import spaceApiKey from "@/utils/constants/keys";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const connectors = [
    new InjectedConnector({ options: { id: "braavos" } }),
    new InjectedConnector({ options: { id: "argentX" } }),
  ];
  const [feedback, setFeedback] = useState(false);
  // loadSpace(spaceApiKey)
  //   .then((api) => {
  //     if (!feedback) {
  //       api.init();
  //       setFeedback(true);
  //     }
  //   })
  //   .catch((err) =>//console.log(err));

  return (
    <>
      <Head>
        <meta httpEquiv="Cache-Control" content="no-cache, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="google-site-verification" content="9U0-YnKdWueBdZmj8Y5_JEkGNPOiV-_d8cPrmjIgifs" />
        <title>Hashstack | Under-collateralised loans | Defi</title>
        <meta
          name="description"
          content="Hashstack provides a permissionless zk-native money market protocol enabling secure under-collateralised loans to the crypto retail. Built on Starknet L2 [announcement], Hashstack leverages the capability of zero-knowledge proofs to provide a cost & capital-efficient lending solution."
        />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
      </Head>
      <UserbackProvider token="41130|83179|yuKUdxxi1Q2T4EFo0Sg7Zbmbz">
        <ChakraProvider theme={theme}>
          <StarknetProvider autoConnect={true} connectors={connectors}>
            <Provider store={store}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Provider>
          </StarknetProvider>
        </ChakraProvider>
      </UserbackProvider>
    </>
  );
}

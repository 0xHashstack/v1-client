import Navbar from "@/components/layouts/navbar/Navbar";
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Stack, StackProps, Text, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import React, { ReactNode, useCallback, useEffect, useState } from "react";

import { useAccount, useConnectors } from "@starknet-react/core";


import { useRouter } from "next/router";

import { AccountInterface } from "starknet";

interface Props extends StackProps {
  children: ReactNode;
}
interface ExtendedAccountInterface extends AccountInterface {
  provider?: {
    chainId: string;
  };
}

const PageCard: React.FC<Props> = ({ children, className, ...rest }) => {
  const [render, setRender] = useState(true);
  const [isLargerThan1280] = useMediaQuery("(min-width: 1248px)");
  const classes = [];
  const { account, address, status, isConnected } = useAccount();
  const extendedAccount = account as ExtendedAccountInterface;
  const [loading, setLoading] = useState(true);
  const { available, disconnect, connect, connectors } = useConnectors();
  if (className) classes.push(className);
  const router = useRouter();
  const {pathname}=router;

  // const handleRouteChange = () => {
  //   if (!_account) {
  //     const walletConnected = localStorage.getItem("lastUsedConnector");
  //     if (walletConnected == "braavos") {
  //       connect(connectors[0]);
  //     } else if (walletConnected == "argentx") {
  //       connect(connectors[0]);
  //     }
  //   }
  // };
  // const handleRouteChangeComplete = (url: string) => {
  //   setTimeout(handleRouteChange, 200);
  // };
  // useEffect(() => {
  //   router.events.on("routeChangeComplete", handleRouteChangeComplete);

  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChangeComplete);
  //   };
  // }, [handleRouteChange, router.events]);
  // connect(connectors[0])
  ////console.log(connectors)

  // useEffect(() => {
  //   // if (status == "connected") {
  //   // alert(account?.address);

  //   dispatch(setAccount(account));
  //   // }
  // }, [account, status,dispatch]);
  useEffect(() => {
    setRender(true);
  }, []);
  useEffect(() => {
    const walletConnected = localStorage.getItem("lastUsedConnector");
    const connected = localStorage.getItem("connected");
    if (walletConnected == "") {
      router.push("/");
    }
    if (!account) {
      if (walletConnected == "braavos") {
        localStorage.setItem("connected", "braavos");
        disconnect();
        connect(connectors[0]);
      } else if (walletConnected == "argentX") {
        localStorage.setItem("connected", "argentX");
        disconnect();
        connect(connectors[1]);
      } else {
        if (connected == "braavos") {
          localStorage.setItem("lastUsedConnector", "braavos");
          disconnect();
          connect(connectors[0]);
        } else if (connected == "argentX") {
          localStorage.setItem("lastUsedConnector", "argentX");
          disconnect();
          connect(connectors[1]);
        } else {
          router.push("/");
        }
        // disconnect();
        // connect(connectors[0]);
        // localStorage.setItem("lastUsedConnector", "braavos");
      }
    }
  }, [account]);
 

  useEffect(() => {
    function isCorrectNetwork() {
      const walletConnected = localStorage.getItem("lastUsedConnector");
      const network = process.env.NEXT_PUBLIC_NODE_ENV;

      if (walletConnected == "braavos") {
        if (network == "testnet") {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")
            extendedAccount.provider?.chainId == process.env.NEXT_PUBLIC_TESTNET_CHAINID
          );
        } else {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")
            extendedAccount.provider?.chainId == process.env.NEXT_PUBLIC_MAINNET_CHAINID
          );
        }
      } else if (walletConnected == "argentX") {
        // Your code here
        if (network == "testnet") {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")

            extendedAccount.provider?.chainId === process.env.NEXT_PUBLIC_TESTNET_CHAINID
          );
        } else {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")

            extendedAccount.provider?.chainId === process.env.NEXT_PUBLIC_MAINNET_CHAINID
          );
        }
      }
      ////console.log("starknetAccount", account?.provider?.chainId);
    }


  
    if ((account && !isCorrectNetwork())) {
      setRender(false);
    } else {
     
        setRender(true);
      
    }
  }, [account ]);




  // const [dataDeposit, setDataDeposit] = useState<any>()


  const { isOpen, onOpen, onClose } = useDisclosure();
 

  return loading && pathname=="/" ?
    (
      <>
        <Box background={`
            radial-gradient(circle 1800px at top left, rgba(115, 49, 234, 0.10), transparent) top left,
            radial-gradient(circle 1200px at bottom right, rgba(115, 49, 234, 0.10), transparent) bottom right,
            black
          `} position={'fixed'} zIndex={3} >
          <Navbar />
        </Box>
        <Stack
          alignItems="center"
          justifyContent="center"
          minHeight={"100vh"}
          pt="8rem"
          backgroundColor="#010409"
          pb={isLargerThan1280 ? "7rem" : "0rem"}
          className={classes.join(" ")}
          {...rest}
        >

          {/* <Text color="#FFFFFF" fontSize="20px">
          Loading...
        </Text> */}
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#010409"
            size="xl"
          />
          {/* <YourBorrowModal
          buttonText="Borrow assets"
          variant="link"
          fontSize="16px"
          fontWeight="400"
          display="inline"
          color="#0969DA"
          cursor="pointer"
          ml="0.4rem"
          lineHeight="24px"
        /> */}
        </Stack>
      </>
    )
    : (
      <>
        {render  ? (
          <>
            <Box background={`
            radial-gradient(circle 1800px at top left, rgba(115, 49, 234, 0.10), transparent) top left,
            radial-gradient(circle 1200px at bottom right, rgba(115, 49, 234, 0.10), transparent) bottom right,
            black
          `} position={'fixed'} zIndex={3} >
              <Navbar  />
            </Box>
         
            <Stack
              zIndex={1}

              alignItems="center"
              minHeight={"100vh"}

              pt="8rem"
              background={`
            radial-gradient(circle 1800px at top left, rgba(115, 49, 234, 0.15), transparent) top left,
            radial-gradient(circle 1300px at bottom right, rgba(115, 49, 234, 0.15), transparent) bottom right,
            black
          `}
              pb={isLargerThan1280 ? "7rem" : "0rem"}
              className={classes.join(" ")}
              {...rest}
            >
              {children}
            </Stack>
            {/* <Box
            bgColor="red"
            display={toastTransactionStarted ? "block" : "none"}
          >
            <AnimatedButton
              position="fixed"
              bgColor="#101216"
              // p={0}
              color="#8B949E"
              size="sm"
              width="20%"
              // mt="1.5rem"
              // mb="1.5rem"
              right="2rem"
              bottom="3rem"
              borderRadius="2px"
              labelSuccessArray={[
                "Deposit Amount approved",
                "Successfully transferred to Hashstack’s supply vault.",
                "Determining the rToken amount to mint.",
                "rTokens have been minted successfully.",
                "Transaction complete.",
                // <ErrorButton errorText="Transaction failed" />,
                // <ErrorButton errorText="Copy error!" />,
                <SuccessButton key={"successButton"} successText={"Success"} />,
              ]}
              labelErrorArray={[
                "Deposit Amount approved",
                "Successfully transferred to Hashstack’s supply vault.",
                <ErrorButton errorText="Transaction failed" />,
                <ErrorButton errorText="Copy error!" />,
              ]}
              // transactionStarted={(depostiTransactionHash!="" || transactionFailed==true)}
              _disabled={{ bgColor: "white", color: "black" }}
              isDisabled={toastTransactionStarted != true}
              // onClick={}
            >
              Supply
            </AnimatedButton>
          </Box> */}
            {/* <ToastContainer theme="dark" /> */}
            </>
        ) : (
          <>
            <Box background={`
            radial-gradient(circle 1800px at top left, rgba(115, 49, 234, 0.10), transparent) top left,
            radial-gradient(circle 1200px at bottom right, rgba(115, 49, 234, 0.10), transparent) bottom right,
            black
          `} position={'fixed'} zIndex={3} >
              <Navbar />
            </Box>
            <Stack
              alignItems="center"
              minHeight={"100vh"}
              pt="8rem"
              backgroundColor="#010409"
              pb={isLargerThan1280 ? "7rem" : "0rem"}
              className={classes.join(" ")}
              {...rest}
            >
              <Box>
                { <Text color="white" fontSize="25px">
                    Please switch to Starknet {process.env.NEXT_PUBLIC_NODE_ENV == "testnet" ? "Goerli" : "Mainnet"} and refresh
                  </Text>
                }

              </Box>
            </Stack>
          </>
        )}
      </>
    );
};

export default PageCard;

// let r = 2;
// useEffect(() => {
//   alert("connect");
//   connect(connectors[0]);
// }, [r]);
// function changeR() {
//   alert("connect");
//   // clearTimeout(timeout);
// }
// const timeout = setTimeout(changeR, 3000);
// function handleRouteChange(url: string) {
//  //console.log("hunny", _account, localStorage.getItem("lastUsedConnector"));
//   // if (!_account) {
//   const walletConnected = localStorage.getItem("lastUsedConnector");
//   if (walletConnected == "braavos") {
//    //console.log("hunny");
//     connect(connectors[0]);
//   } else if (walletConnected == "argentx") {
//     connect(connectors[1]);
//   }
//  //console.log(status);
//   // }
// }

// useEffect(() => {
// if (!_account) {
//   const walletConnected = localStorage.getItem("lastUsedConnector");
//   if (walletConnected == "braavos") {
//     disconnect();
//     connect(connectors[0]);
//   } else if (walletConnected == "argentx") {
//     disconnect();
//     connect(connectors[0]);
//   }
// }
// const handleRouteChange = () => {
// connect(connectors[0]); // Replace this with your actual code
// setInterval(
//   () =>
//    //console.log(
//       "hunny",
//       _account,
//       status,
//       localStorage.getItem("lastUsedConnector")
//     ),
//   14000
// );
// };

// router.events.on("routeChangeComplete", handleRouteChange);

// Clean up the event listener
// return () => {
//   router.events.off("routeChangeComplete", handleRouteChange);
// };
// }, []);

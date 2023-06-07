import Navbar from "@/components/layouts/navbar/Navbar";
import { Box, Stack, StackProps, useMediaQuery } from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  useAccount,
  useConnectors,
  useStarknet,
  useBlock,
} from "@starknet-react/core";
import { useContract } from "@starknet-react/core";
import { setAccount } from "@/store/slices/userAccountSlice";
import { useRouter } from "next/router";
interface Props extends StackProps {
  children: ReactNode;
}

const PageCard: React.FC<Props> = ({ children, className, ...rest }) => {
  const [render, setRender] = useState(true);
  const [isLargerThan1280] = useMediaQuery("(min-width: 1248px)");
  const classes = [];
  const { account, address, status } = useAccount();

  const { available, disconnect, connect, connectors } = useConnectors();
  const dispatch = useDispatch();
  if (className) classes.push(className);
  const router = useRouter();
  const handleRouteChange = () => {
    if (!_account) {
      const walletConnected = localStorage.getItem("lastUsedConnector");
      if (walletConnected == "braavos") {
        connect(connectors[0]);
      } else if (walletConnected == "argentx") {
        connect(connectors[0]);
      }
    }
  };
  const handleRouteChangeComplete = (url: string) => {
    setTimeout(handleRouteChange, 4000);
  };
  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [handleRouteChange, router.events]);
  const { account: _account } = useAccount();
  // connect(connectors[0])
  // console.log(connectors)

  // useEffect(() => {
  //   // if (status == "connected") {
  //   // alert(account?.address);

  //   dispatch(setAccount(account));
  //   // }
  // }, [account, status,dispatch]);
  // useEffect(() => {
  //   setRender(true);
  // }, []);
  useEffect(() => {
    const walletConnected = localStorage.getItem("lastUsedConnector");
    if(walletConnected==""){
      router.push('/');
    }
    if (!_account) {
      if (walletConnected == "braavos") {
        disconnect();
        connect(connectors[0]);
      } else if (walletConnected == "argentx") {
        disconnect();
        connect(connectors[0]);
      }
    }
  }, []);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     connect(connectors[0]);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <>
      {render && (
        <>
          <Navbar />
          <Stack
            alignItems="center"
            minHeight={"100vh"}
            pt="8rem"
            backgroundColor="#010409"
            pb={isLargerThan1280 ? "7rem" : "0rem"}
            className={classes.join(" ")}
            {...rest}
          >
            {children}
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
//   console.log("hunny", _account, localStorage.getItem("lastUsedConnector"));
//   // if (!_account) {
//   const walletConnected = localStorage.getItem("lastUsedConnector");
//   if (walletConnected == "braavos") {
//     console.log("hunny");
//     connect(connectors[0]);
//   } else if (walletConnected == "argentx") {
//     connect(connectors[1]);
//   }
//   console.log(status);
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
//     console.log(
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

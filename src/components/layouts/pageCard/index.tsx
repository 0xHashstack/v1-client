import Navbar from "@/components/layouts/navbar/Navbar";
import { Box, Stack, StackProps, useMediaQuery } from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  useAccount,
  useConnectors,
  useStarknet,
  useBlock,
} from "@starknet-react/core";
import { useContract } from "@starknet-react/core";
import {
  selectToastTransactionStarted,
  setAccount,
  setAssetWalletBalance,
  setUserLoans,
} from "@/store/slices/userAccountSlice";
import { useRouter } from "next/router";
import Footer from "../footer";
import AnimatedButton from "@/components/uiElements/buttons/AnimationButton";
import SuccessButton from "@/components/uiElements/buttons/SuccessButton";
import ErrorButton from "@/components/uiElements/buttons/ErrorButton";
import TransactionToast from "./transactionToast";
import { ILoan } from "@/Blockchain/interfaces/interfaces";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
interface Props extends StackProps {
  children: ReactNode;
}

const PageCard: React.FC<Props> = ({ children, className, ...rest }) => {
  const [render, setRender] = useState(true);
  const [isLargerThan1280] = useMediaQuery("(min-width: 1248px)");
  const classes = [];
  const { account, address, status } = useAccount();
  const dispatch = useDispatch();

  const { available, disconnect, connect, connectors } = useConnectors();
  if (className) classes.push(className);
  const router = useRouter();

  const toastTransactionStarted = useSelector(selectToastTransactionStarted);

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
  // console.log(connectors)

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
    if (walletConnected == "") {
      router.push("/");
    }
    if (!account) {
      if (walletConnected == "braavos") {
        disconnect();
        connect(connectors[0]);
      } else if (walletConnected == "argentX") {
        disconnect();
        connect(connectors[1]);
      }
    }
  }, []);
  const [UserLoans, setuserLoans] = useState<ILoan[] | null>([]);
  useEffect(() => {
    const loan = async () => {
      try {
        const loans = await getUserLoans(address || "");
        // console.log(loans,"Loans from your borrow index page")

        // loans.filter(
        //   (loan) =>
        //     loan.collateralAmountParsed &&
        //     loan.collateralAmountParsed > 0 &&
        //     loan.loanAmountParsed &&
        //     loan.loanAmountParsed > 0
        // );
        if (loans) {
          setuserLoans(
            loans.filter(
              (loan) =>
                loan?.collateralAmountParsed &&
                loan?.collateralAmountParsed > 0 &&
                loan?.loanAmountParsed &&
                loan?.loanAmountParsed > 0
            )
          );
        }
        dispatch(
          setUserLoans(
            loans.filter(
              (loan) =>
                loan.collateralAmountParsed &&
                loan.collateralAmountParsed > 0 &&
                loan.loanAmountParsed &&
                loan.loanAmountParsed > 0
            )
          )
        );
      } catch (err) {
        console.log("your-borrow : unable to fetch user loans");
      }
      // console.log("loans", loans);
    };
    if (account) {
      loan();
    }
  }, [account, UserLoans]);
  // const dispatch=useDispatch();
  interface assetB {
    USDT: any;
    USDC: any;
    BTC: any;
    ETH: any;
    DAI: any;
  }
  const assetBalance: assetB = {
    USDT: useBalanceOf(tokenAddressMap["USDT"] || ""),
    USDC: useBalanceOf(tokenAddressMap["USDC"] || ""),
    BTC: useBalanceOf(tokenAddressMap["BTC"] || ""),
    ETH: useBalanceOf(tokenAddressMap["ETH"] || ""),
    DAI: useBalanceOf(tokenAddressMap["DAI"] || ""),
  };
  useEffect(() => {
    try{
      dispatch(setAssetWalletBalance( assetBalance));
    }catch(err){
      console.log(err);
    }
    
  }, [assetBalance]);
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
          <TransactionToast />
          <Footer block={83207} />
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

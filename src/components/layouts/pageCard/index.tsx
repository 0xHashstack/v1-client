// @ts-nocheck

import Navbar from "@/components/layouts/navbar/Navbar";
import { Box, Stack, StackProps, Text, useMediaQuery } from "@chakra-ui/react";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  useAccount,
  useConnectors,
  useStarknet,
  useBlock,
} from "@starknet-react/core";
import { useContract } from "@starknet-react/core";
import {
  setProtocolReserves,
  selectToastTransactionStarted,
  setAccount,
  setAssetWalletBalance,
  setUserLoans,
  selectProtocolReserves,
  selectYourSupply,
  selectNetWorth,
  selectNetAPR,
  selectYourBorrow,
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
import { ToastContainer, toast } from "react-toastify";
import { callWithRetries } from "@/utils/functions/apiCaller";
import { getUserDeposits } from "@/Blockchain/scripts/Deposits";
import {
  getProtocolReserves,
  getProtocolStats,
} from "@/Blockchain/scripts/protocolStats";
import YourBorrow from "@/pages/v1/your-borrow";
import { getTotalBorrow } from "@/Blockchain/scripts/userStats";

interface Props extends StackProps {
  children: ReactNode;
}

const PageCard: React.FC<Props> = ({ children, className, ...rest }) => {
  const [render, setRender] = useState(true);
  const [isLargerThan1280] = useMediaQuery("(min-width: 1248px)");
  const classes = [];
  const { account, address, status, isConnected } = useAccount();
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
              (loan) => loan?.loanAmountParsed && loan?.loanAmountParsed > 0
            )
          );
        }
        dispatch(
          setUserLoans(
            loans.filter(
              (loan) => loan.loanAmountParsed && loan.loanAmountParsed > 0
            )
          )
        );
      } catch (err) {
        console.log("your-borrow : unable to fetch user loans");
      }
      // console.log("loans", loans);
    };
    if (account && isConnected) {
      // callWithRetries(loan, [], 3);
      loan();
    }
  }, [account, isConnected]);
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
  // useEffect(() => {
  //   // console.log(assetBalance);
  //   try {
  //     dispatch(setAssetWalletBalance(assetBalance));
  //   } catch (error) {
  //     console.log("serializing warning");
  //   }
  // }, [assetBalance]);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     connect(connectors[0]);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    const walletConnected = localStorage.getItem("lastUsedConnector");
    if (walletConnected == "") {
      router.push("/");
    }
    if (account) {
      if (walletConnected == "braavos") {
        disconnect();
        connect(connectors[0]);
      } else if (walletConnected == "argentX") {
        disconnect();
        connect(connectors[1]);
      }
    }
  }, []);
  useEffect(() => {
    function isCorrectNetwork() {
      console.log("starknetAccount", account);
      return (
        account?.baseUrl?.includes("https://alpha4.starknet.io") ||
        account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")
      );
    }
    if (account && !isCorrectNetwork()) {
      setRender(false);
    } else {
      setRender(true);
    }
  }, [account]);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     connect(connectors[0]);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  const [validRTokens, setValidRTokens] = useState([]);
  useEffect(() => {
    if (validRTokens.length === 0) {
      fetchUserDeposits();
    }
  }, [validRTokens]);

  const fetchUserDeposits = async () => {
    try {
      const reserves = await getUserDeposits(address || "");
      console.log("got reservers", reserves);

      const rTokens: any = [];
      if (reserves) {
        reserves.map((reserve: any) => {
          if (reserve.rTokenAmountParsed > 0) {
            rTokens.push({
              rToken: reserve.rToken,
              rTokenAmount: reserve.rTokenAmountParsed,
            });
          }
        });
      }
      console.log("rtokens", rTokens);
      if (rTokens.length === 0) return;
      setValidRTokens(rTokens);
      console.log("valid rtoken", validRTokens);
      console.log("market page -user supply", reserves);
    } catch (err) {
      console.log("Error fetching protocol reserves", err);
    }
  };
  const protocolReserves = useSelector(selectProtocolReserves);
  const yourSupply = useSelector(selectYourSupply);
  const yourBorrow = useSelector(selectYourBorrow);
  const netWorth = useSelector(selectNetWorth);
  const netAPR = useSelector(selectNetAPR);
  useEffect(() => {
    try {
      const fetchProtocolStats = async () => {
        const reserves = await getProtocolReserves();
        dispatch(
          setProtocolReserves({
            totalReserves: 123,
            availableReserves: 123,
            avgAssetUtilisation: 1233,
          })
        );
        dispatch(setProtocolReserves(reserves));
        console.log("protocol reserves called ");
      };
      if (
        protocolReserves &&
        (protocolReserves.totalReserves == null ||
          protocolReserves.availableReserves == null ||
          protocolReserves.avgAssetUtilisation == null)
      ) {
        fetchProtocolStats();
      }
    } catch (err) {
      console.log("error fetching protocol reserves ", err);
    }
  }, [protocolReserves]);

  // useEffect(() => {
  //   console.log("protocol reserves here ", protocolReserves);
  // }, [protocolReserves]);

  // useEffect(() => {
  //   try {
  //     const fetchTotalBorrow = async () => {
  //       const data = await getTotalBorrow();
  //       console.log("getTotalBorrow", data);
  //     };
  //     fetchTotalBorrow();
  //   } catch (err) {
  //     console.log("getTotalBorrow error");
  //   }
  // }, [netWorth, yourSupply, yourBorrow, netWorth]);

  return (
    <>
      {render ? (
        <>
          <Navbar validRTokens={validRTokens} />
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
          <Footer block={83207} />
        </>
      ) : (
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
            <Box>
              <Text color="white" fontSize="25px">
                Please switch to Starknet Goerli and refresh
              </Text>
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

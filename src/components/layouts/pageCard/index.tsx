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
  useWaitForTransaction,
  useBlockNumber,
  UseWaitForTransactionResult,
  useTransactions,
  useTransaction,
  useTransactionManager,
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
  selectActiveTransactions,
  setActiveTransactions,
  setTransactionStatus,
  setNetWorth,
  setYourSupply,
  selectUserLoans,
  setYourBorrow,
  setNetAPR,
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
import { getNetApr, getNetworth, getTotalBorrow } from "@/Blockchain/scripts/userStats";
import useToastHandler from "@/hooks/useToastHandler";
import useFetchToastStatus from "../toasts/transactionStatus";
import CopyToClipboard from "react-copy-to-clipboard";
// import { useFetchToastStatus } from "../toasts";
import { getTotalSupply } from "@/Blockchain/scripts/userStats";
import { getOraclePrices } from "@/Blockchain/scripts/getOraclePrices";
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
    if (validRTokens?.length === 0) {
      fetchUserDeposits();
    }
  }, [validRTokens, address]);

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
      if (rTokens?.length === 0) return;
      setValidRTokens(rTokens);
      console.log("valid rtoken", validRTokens);
      console.log("market page -user supply", reserves);
    } catch (err) {
      console.log("Error fetching protocol reserves", err);
    }
  };
  const protocolReserves = useSelector(selectProtocolReserves);
  const yourSupply = useSelector(selectYourSupply);
  const userLoans=useSelector(selectUserLoans);
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
  }, []);

  // useEffect(() => {
  //   console.log("protocol reserves here ", protocolReserves);
  // }, [protocolReserves]);

    useEffect(()=>{
      try{
        const fetchUserSupply=async()=>{
          // console.log(getUserDeposits(address),"deposits in pagecard")
          const dataDeposit=await getUserDeposits(address || "");
          const dataOraclePrices=await getOraclePrices();
          const dataMarket=await getProtocolStats();
          // console.log(dataMarket,"data market page")
          // console.log(dataDeposit,"deposit array");
          const dataBorrow=await getTotalBorrow(userLoans,dataOraclePrices,dataMarket);
          const dataTotalBorrow=dataBorrow?.totalBorrow;
          const dataNetWorth=await getNetworth(data,dataTotalBorrow,dataBorrow?.totalCurrentAmount);
          dispatch(setNetWorth(dataNetWorth));
          dispatch(setYourBorrow(dataTotalBorrow));
          if(dataDeposit){
            const data= getTotalSupply(dataDeposit,dataOraclePrices);
            // console.log(data,"pagecard user supply");
            // console.log(dataBorrow?.totalBorrow,"data borrow page")
            // console.log(dataNetApr,"data net apr in pagecard");
           
            const dataNetApr=await getNetApr(dataDeposit,userLoans,dataOraclePrices,dataMarket);
            dispatch(setYourSupply(data));
            dispatch(setNetAPR(dataNetApr))
          
          }


        }
        if(yourSupply==null || yourBorrow==null || netWorth==null ||netAPR==null ){
          fetchUserSupply();
        }
        // fetchUserSupply();
      }catch(err){
        console.log(err)

      }
    },[])
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
  const activeTransactions = useSelector(selectActiveTransactions);
  // console.log("activeTransactions", activeTransactions);

  const [transactions, setTransactions] = useState([]);
  const toastHash = [""];
  useEffect(() => {
    // console.log("trans activeTransactions useEffect called");
    if (activeTransactions) {
      const data = activeTransactions.map(
        (transaction) => transaction.transaction_hash
      );
      setTransactions(data);
    }
  }, [activeTransactions]);

  // const results = useTransactions({
  //   hashes: [...transactions],
  //   watch: true,
  // });
  // const { hashes, addTransaction } = useTransactionManager();
  const results = useTransactions({
    hashes: [...transactions],
    watch: true,
  });

  // const data = useTransaction()
  console.log("trans toastHash", toastHash);
  console.log("transaction results - ", results);
  useEffect(() => {
    console.log("transaction active transactions ", activeTransactions);
    console.log("transaction transactions ", transactions);
    console.log("transaction results ", results);
    let transactionData = results?.filter((transaction, idx) => {
      transaction.refetch();
      if (
        transaction?.data?.transaction?.transaction_hash == "" ||
        activeTransactions.transaction_hash == ""
      ) {
        return false;
      }
      const transaction_hxh = activeTransactions[idx]?.transaction_hash;
      if (
        transaction?.data?.status == "PENDING" ||
        transaction?.data?.status == "ACCEPTED_ON_L2"
      ) {
        if (!toastHash.includes(transaction_hxh)) {
          dispatch(setTransactionStatus("success"));
          activeTransactions[idx].setCurrentTransactionStatus("success");
          toast.success(
            activeTransactions?.[idx]?.message ||
              `You have successfully supplied`,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
            }
          );
        }
        toastHash.push(transaction_hxh);
        toastHash.push(activeTransactions[idx]?.transaction_hash);
        toastHash.push(transaction?.data?.transaction?.transaction_hash);
      } else if (transaction?.data?.status == "REJECTED") {
        console.log("treans rejected", transaction?.data?.error);
        const toastContent = (
          <div>
            Transaction failed{" "}
            <CopyToClipboard text={"Transaction failed"}>
              <Text as="u">copy error!</Text>
            </CopyToClipboard>
          </div>
        );
        // setFailureToastDisplayed(true);
        if (!toastHash.includes(transaction_hxh)) {
          dispatch(setTransactionStatus("failed"));
          activeTransactions[idx].setCurrentTransactionStatus("failed");
          toast.error(toastContent, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
          });
        }
        toastHash.push(transaction_hxh);
        toastHash.push(activeTransactions?.transaction_hash);
        toastHash.push(transaction?.data?.transaction?.transaction_hash);
      }
      if (
        transaction?.data?.status == "PENDING" ||
        transaction?.data?.status == "ACCEPTED_ON_L2" ||
        transaction?.data?.status == "ACCEPTED_ON_L1" ||
        transaction?.data?.status == "REJECTED"
      ) {
        if (activeTransactions[idx].transaction_hash == "") {
          return false;
        }
        toastHash.push(transaction_hxh);
        toastHash.push(activeTransactions?.transaction_hash);
        toastHash.push(transaction?.data?.transaction?.transaction_hash);
        const newData = [...activeTransactions]; // Create a new array with the same values
        newData[idx] = {
          ...newData[idx],
          transaction_hash: "", // Modify the specific property with the new value
        };
        toast.dismiss(activeTransactions?.[idx]?.toastId);
        dispatch(setActiveTransactions(newData));
        return false;
      } else {
        return true;
      }
    });
    // if (transactionData?.length != activeTransactions?.length) {
    //   dispatch(setActiveTransactions(transactionData));
    // }
  }, [results]);

  // async function waitForTransaction(hash: string) {
  //   return new Promise<UseWaitForTransactionResult>((resolve, reject) => {
  //     const result = useWaitForTransaction({
  //       hash,
  //       watch: false,
  //     });

  //     if (result.isError) {
  //       reject(result.error);
  //     } else {
  //       resolve(result);
  //     }
  //   });
  // }
  // async function processTransactions() {
  //   for (const transaction of activeTransactions) {
  //     console.log("transactionData ", transaction);
  //     // if (!transaction || !transaction.transaction_hash) {
  //     //   continue;
  //     // }
  //     try {
  //       // waitForTransaction(transaction?.transaction_hash);
  //       useWaitForTransaction({
  //         hash: transaction?.transaction_hash,
  //         watch: false,
  //       });
  //       // Process the transaction data here
  //       // console.log("transactionData ", transactionData);
  //     } catch (error) {
  //       console.error("Error fetching transaction data:", error);
  //     }
  //   }
  // }
  // processTransactions();
  // useEffect(() => {
  //   if (activeTransactions && activeTransactions?.length > 0) {
  //   }
  // }, [activeTransactions]);
  // if (activeTransactions) {
  //   for (const transaction of activeTransactions) {
  //     console.log("transactionData ", transaction);
  //     if (!transaction || !transaction?.transaction_hash) {
  //       continue;
  //     }
  //     const transactionData = await useWaitForTransaction({
  //       hash: transaction?.transaction_hash,
  //       watch: false,
  //       // onReceived: () => {
  //       //   console.log("trans received");
  //       // },
  //       // onPending: () => {
  //       //   // setCurrentTransactionStatus(true);
  //       //   toast.dismiss(transaction?.toastId);
  //       //   console.log("trans pending");
  //       //   // if (isToastDisplayed == false) {
  //       //   toast.success(
  //       //     transaction?.message || `You have successfully supplied`,
  //       //     {
  //       //       position: toast.POSITION.BOTTOM_RIGHT,
  //       //     }
  //       //   );
  //       //   //   setToastDisplayed(true);
  //       //   // }
  //       // },
  //       // onRejected(result: any) {
  //       //   toast.dismiss(transaction?.toastId);
  //       //   // if (!failureToastDisplayed) {
  //       //   console.log("treans rejected", result);
  //       //   // dispatch(setTransactionStatus("failed"));
  //       //   const toastContent = (
  //       //     <div>
  //       //       Transaction failed{" "}
  //       //       <CopyToClipboard text={"Transaction failed"}>
  //       //         <Text as="u">copy error!</Text>
  //       //       </CopyToClipboard>
  //       //     </div>
  //       //   );
  //       //   // setFailureToastDisplayed(true);
  //       //   toast.error(toastContent, {
  //       //     position: toast.POSITION.BOTTOM_RIGHT,
  //       //     autoClose: false,
  //       //   });
  //       // },
  //       // onAcceptedOnL1: (result: any) => {
  //       //   // setCurrentTransactionStatus(true);
  //       //   console.log("trans onAcceptedOnL1");
  //       // },
  //       // onAcceptedOnL2(result: any) {
  //       //   toast.dismiss(transaction?.toastId);
  //       //   // setCurrentTransactionStatus(true);
  //       //   // if (!isToastDisplayed) {
  //       //   toast.success(
  //       //     transaction?.message || `You have successfully supplied`,
  //       //     {
  //       //       position: toast.POSITION.BOTTOM_RIGHT,
  //       //     }
  //       //   );
  //       //   // setToastDisplayed(true);
  //       //   // }
  //       //   console.log("trans onAcceptedOnL2 - ", result);
  //       // },
  //     });
  //     // console.log("transactionData received ", transactionData);
  //     // if (
  //     //   transactionData?.data?.status == "PENDING" ||
  //     //   transactionData?.data?.status == "ACCEPTED_ON_L2" ||
  //     //   transactionData?.data?.status == "ACCEPTED_ON_L1" ||
  //     //   transactionData?.data?.status == "PENDING" ||
  //     //   transactionData?.data?.status == "REJECTED"
  //     // ) {
  //     //   toast.dismiss(transaction?.toastID);
  //     // } else {
  //     //   return transaction;
  //     // }
  //   }
  // }
  // useEffect(() => {
  //   // console.log("trans activeTransactions useEffect called");
  //   if (!activeTransactions || !transactions) {
  //     return;
  //   }
  //   if (activeTransactions?.length != transactions?.length) {
  //     console.log("setActiveTransactions called");
  //     dispatch(setActiveTransactions(transactions));
  //   }
  // }, [transactions]);

  // const { data } = useBlockNumber({
  //   refetchInterval: 10000,
  // });

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
          {/* <Footer block={data} />  */}
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
          <Footer />
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

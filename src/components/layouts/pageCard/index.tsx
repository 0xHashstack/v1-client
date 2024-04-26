import Navbar from "@/components/layouts/navbar/Navbar";
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Stack, StackProps, Text, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useAccount, useConnect, useDisconnect, useNetwork, useWaitForTransaction} from "@starknet-react/core";
import {
  selectToastTransactionStarted,
  selectActiveTransactions,
} from "@/store/slices/userAccountSlice";
import {
  selectUserDeposits,
  selectProtocolStats,
  selectOraclePrices,
  selectProtocolReserves,
  selectNetWorth,
  selectreferral,
  setMessageHash,
  setSignature,
  selectUserType,
  setUserWhiteListed,
} from "@/store/slices/readDataSlice";
import {
  selectUserLoans,
  selectYourSupply,
} from "@/store/slices/readDataSlice";
import { useRouter } from "next/router";
import Footer from "../footer";

import { ILoan } from "@/Blockchain/interfaces/interfaces";

import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
import useTransactionHandler from "@/hooks/useTransactionHandler";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { AccountInterface } from "starknet";
import FeedbackModal from "@/components/modals/feedbackModal";
import InfoIcon from "@/assets/icons/infoIcon";
import axios from "axios";
import Link from "next/link";
import posthog from "posthog-js";
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
  const extendedAccount:any = account as ExtendedAccountInterface;
  const [loading, setLoading] = useState(true);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  if (className) classes.push(className);
  const router = useRouter();
  const {pathname}=router;

  useTransactionHandler();
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
        // disconnect();
        connectors.map((connector:any)=>{
          if(connector.id=="braavos"){
            console.log('working bravoos no account')
            connect({connector});
          }
        })
      } else if (walletConnected == "argentX") {
        localStorage.setItem("connected", "argentX");
        // disconnect();
        connectors.map((connector)=>{
          if(connector.id=="argentX"){
            console.log('working')
            connect({connector});
          }
        })
      } else {
        if (connected == "braavos") {
          localStorage.setItem("lastUsedConnector", "braavos");
          // disconnect();
          connectors.map((connector:any)=>{
            if(connector.id=="braavos"){
              console.log('working bravoos')
              connect({connector});
            }
          })
        } else if (connected == "argentX") {
          localStorage.setItem("lastUsedConnector", "argentX");
          // disconnect();
          connectors.map((connector)=>{
            if(connector.id=="argentX"){
              console.log('working')
              connect({connector});
            }
          })
        } else {
          router.push("/v1");
        }
        // disconnect();
        // connect(connectors[0]);
        // localStorage.setItem("lastUsedConnector", "braavos");
      }
    }
  }, [account]);
  const [UserLoans, setuserLoans] = useState<ILoan[] | null>([]);
  const ref = useSelector(selectreferral)
  // useEffect(() => {
  //   const loan = async () => {
  //     try {
  //       if (!address) {
  //         return;
  //       }
  //       const loans = await getUserLoans(address);
  //       ////console.log(loans,"Loans from your borrow index page")

  //       // loans.filter(
  //       //   (loan) =>
  //       //     loan.collateralAmountParsed &&
  //       //     loan.collateralAmountParsed > 0 &&
  //       //     loan.loanAmountParsed &&
  //       //     loan.loanAmountParsed > 0
  //       // );
  //       if (loans) {
  //         setuserLoans(
  //           loans?.filter(
  //             (loan) => loan?.loanAmountParsed && loan?.loanAmountParsed > 0
  //           )
  //         );
  //       }
  //       dispatch(
  //         setUserLoans(
  //           loans?.filter(
  //             (loan) => loan.loanAmountParsed && loan.loanAmountParsed > 0
  //           )
  //         )
  //       );
  //     } catch (err) {
  //      //console.log("your-borrow : unable to fetch user loans");
  //     }
  //     ////console.log("loans", loans);
  //   };
  //   if (address && address != "") {
  //     // callWithRetries(loan, [], 3);
  //     loan();
  //   }
  // }, [address]);
  // const dispatch=useDispatch();

  // useEffect(() => {
  //   const walletConnected = localStorage.getItem("lastUsedConnector");
  //   if (walletConnected == "") {
  //     router.push("/");
  //   }
  //   if (account) {
  //     if (walletConnected == "braavos") {
  //       disconnect();
  //       connect(connectors[0]);
  //     } else if (walletConnected == "argentX") {
  //       disconnect();
  //       connect(connectors[1]);
  //     }
  //   }
  // }, []);
  const [whitelisted, setWhitelisted] = useState(true)
  const [uniqueToken, setUniqueToken] = useState("")
  const [referralLinked, setRefferalLinked] = useState(false)
  const userType = useSelector(selectUserType)
  const dispatch = useDispatch();
  const {chain}=useNetwork();
  useEffect(() => {
    function isCorrectNetwork() {
      const walletConnected = localStorage.getItem("lastUsedConnector");
      const network = process.env.NEXT_PUBLIC_NODE_ENV;

      if (walletConnected == "braavos") {
        if (network == "testnet") {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")
            // chain.network!="mainnet" && chain?.name!="Starknet Goerli Testnet"
            extendedAccount?.provider.chainId==="0x534e5f5345504f4c4941"
          );
        } else {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")
            extendedAccount?.provider.chainId==="0x534e5f4d41494e"
          );
        }
      } else if (walletConnected == "argentX") {
        // Your code here
        if (network == "testnet") {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")

            extendedAccount?.provider.chainId==="0x534e5f5345504f4c4941"
          );
        } else {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")
            extendedAccount?.provider.chainId==="0x534e5f4d41494e"
          );
        }
      }
      ////console.log("starknetAccount", account?.provider?.chainId);
    }
    setLoading(false)
    const isWhiteListed = async () => {
      try {
        if (!address) {
          return;
        }
            if (userType == "U1") {
              await axios.post('https://hstk.fi/nft-sign', { address: address })
                .then((response) => {
                 //console.log(response, "hash");
                  if (response) {
                    dispatch(setMessageHash(response?.data?.msg_hash))
                    dispatch(setSignature(response?.data?.signature))
                  }
                  // Log the response from the backend.
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            }
      } catch (err) {
       //console.log(err, "err in whitelist")
      }
    }
    isWhiteListed()

    const referal = async () => {
      try {
        if(process.env.NEXT_PUBLIC_NODE_ENV=="testnet"){
          
        }else{
          if (ref) {
            const response = await axios.get(`https://hstk.fi/get_token/${ref}`);
           //console.log(response?.data, "refer")
            if (response) {
              axios.post('https://hstk.fi/link-referral', { address: address }, {
                headers: {
                  "reftoken": response.data
                }
              })
                .then((response) => {
                  setRefferalLinked(response?.data?.success)
                 //console.log(response, "linked"); // Log the response from the backend.
                  // isWhiteListed();
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            }
           //console.log("hi")
           //console.log(response.data, "token")
            setUniqueToken(response.data);
          }

        }
      } catch (err) {
       //console.log(err, "err in token")
      }

    }
    referal();
    if ((account && !isCorrectNetwork())) {
      setRender(false);
    } else {
        setRender(true);
    }
  }, [account, whitelisted, referralLinked, userType]);

  const [validRTokens, setValidRTokens] = useState([]);
  const userDepositsRedux = useSelector(selectUserDeposits);
  useEffect(() => {
    if (validRTokens.length === 0) {
      fetchUserDeposits();
    }
  }, [validRTokens, userDepositsRedux, address]);
  // const [dataDeposit, setDataDeposit] = useState<any>()

  const fetchUserDeposits = async () => {
    try {
      if (!address) {
        return;
      }
      const reserves = userDepositsRedux;
      // setDataDeposit(reserves);
      ////console.log("got reservers page card", reserves);
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
      ////console.log("rtokens", rTokens);
      if (rTokens.length === 0) return;
      setValidRTokens(rTokens);
      ////console.log("valid rtoken", validRTokens);
      ////console.log("market page -user supply", reserves);
    } catch (err) {
     //console.log("Error fetching protocol reserves", err);
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const protocolReserves = useSelector(selectProtocolReserves);

  // const dataDeposit = useSelector(selectUserDeposits);
  // const protocolStats = useSelector(selectProtocolStats);
  // const dataOraclePrices = useSelector(selectOraclePrices);
  // //  const dataMarket=useSelector(selectProtocolStats);
  // const yourSupply = useSelector(selectYourSupply);
  // const userLoans = useSelector(selectUserLoans);
  // const yourBorrow = useSelector(selectYourBorrow);
  // const netWorth = useSelector(selectNetWorth);
  // const netAPR = useSelector(selectNetAPR);

  // useEffect(()=>{
  //  //console.log(netAPR,"net apr in pagecard");
  // },[netAPR])
  // useEffect(() => {
  //   try {
  //     const fetchTotalBorrow = async () => {
  //       const data = await getTotalBorrow();
  //      //console.log("getTotalBorrow", data);
  //     };
  //     fetchTotalBorrow();
  //   } catch (err) {
  //    //console.log("getTotalBorrow error");
  //   }
  // }, [netWorth, yourSupply, yourBorrow, netWorth]);

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
  //    //console.log("transactionData ", transaction);
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
  //       ////console.log("transactionData ", transactionData);
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
  //    //console.log("transactionData ", transaction);
  //     if (!transaction || !transaction?.transaction_hash) {
  //       continue;
  //     }
  //     const transactionData = await useWaitForTransaction({
  //       hash: transaction?.transaction_hash,
  //       watch: false,
  //       // onReceived: () => {
  //       //  //console.log("trans received");
  //       // },
  //       // onPending: () => {
  //       //   // setCurrentTransactionStatus(true);
  //       //   toast.dismiss(transaction?.toastId);
  //       //  //console.log("trans pending");
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
  //       //  //console.log("treans rejected", result);
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
  //       //  //console.log("trans onAcceptedOnL1");
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
  //       //  //console.log("trans onAcceptedOnL2 - ", result);
  //       // },
  //     });
  //     ////console.log("transactionData received ", transactionData);
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
  //   ////console.log("trans activeTransactions useEffect called");
  //   if (!activeTransactions || !transactions) {
  //     return;
  //   }
  //   if (activeTransactions?.length != transactions?.length) {
  //    //console.log("setActiveTransactions called");
  //     dispatch(setActiveTransactions(transactions));
  //   }
  // }, [transactions]);

  return loading && pathname=="/v1/market" ?
    (
      <>
        <Box background={`
            radial-gradient(circle 1800px at top left, rgba(115, 49, 234, 0.10), transparent) top left,
            radial-gradient(circle 1200px at bottom right, rgba(115, 49, 234, 0.10), transparent) bottom right,
            black
          `} position={'fixed'} zIndex={3} >
          <Navbar validRTokens={validRTokens} />
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
        {render && (process.env.NEXT_PUBLIC_NODE_ENV == "mainnet "?whitelisted:true) ? (
          <>
            <Box background={`
            radial-gradient(circle 1800px at top left, rgba(115, 49, 234, 0.10), transparent) top left,
            radial-gradient(circle 1200px at bottom right, rgba(115, 49, 234, 0.10), transparent) bottom right,
            black
          `} position={'fixed'} zIndex={3} >
              <Navbar validRTokens={validRTokens} />
            </Box>
            <Box position={'fixed'} zIndex={0.5} onClick={()=>{
              posthog.capture('Feedback Modal Clicked', {
                Clicked: true,
              })
            }}>
              <FeedbackModal />
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
            <Footer />
          </>
        ) : (
          <>
            <Box background={`
            radial-gradient(circle 1800px at top left, rgba(115, 49, 234, 0.10), transparent) top left,
            radial-gradient(circle 1200px at bottom right, rgba(115, 49, 234, 0.10), transparent) bottom right,
            black
          `} position={'fixed'} zIndex={3} >
              <Navbar validRTokens={validRTokens} />
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
                {(!whitelisted &&process.env.NEXT_PUBLIC_NODE_ENV == "mainnet")

                  ? 
                  <Box>
                  <Text color="white" fontSize="25px">
                    You are successfully added to our waitlist
                  </Text> 
                  <Text color="#B1B0B5" fontSize="14px" textAlign="center" mt="1.5rem" >
                  Alternatively, Join our {` `}
                    <Link href="https://discord.gg/hashstack" target="_blank" style={{textDecoration:"underline"}}>     
                      discord community               
                    </Link>
                    {` `}to get an instant access.
                  </Text>
                    </Box>
                  : <Text color="white" fontSize="25px">
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

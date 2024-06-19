import useSwap from "@/Blockchain/hooks/Writes/useSwap";
import ArrowUp from "@/assets/icons/arrowup";
import DAILogo from "@/assets/icons/coins/dai";
import ETHLogo from "@/assets/icons/coins/eth";
import SmallEth from "@/assets/icons/coins/smallEth";
import SmallJediswapLogo from "@/assets/icons/coins/smallJediswap";
import SmallUsdt from "@/assets/icons/coins/smallUsdt";
import STRKLogo from "@/assets/icons/coins/strk";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import InfoIcon from "@/assets/icons/infoIcon";
import {
  resetModalDropdowns,
  selectModalDropDowns,
  setModalDropdown,
} from "@/store/slices/dropdownsSlice";
import {
  selectAprAndHealthFactor,
  selectEffectiveApr,
  selectFees,
  selectHealthFactor,
  selectJediSwapPoolsSupported,
  selectMySwapPoolsSupported,
  selectOraclePrices,
  selectProtocolStats,
  selectUserLoans,
} from "@/store/slices/readDataSlice";
import {
  selectActiveTransactions,
  selectInputSupplyAmount,
  selectSelectedDapp,
  selectStrkAprData,
  selectUserUnspentLoans,
  selectWalletBalance,
  selectnetSpendBalance,
  setActiveTransactions,
  setCoinSelectedSupplyModal,
  setInputSupplyAmount,
  setTransactionStartedAndModalClosed,
  setTransactionStatus,
} from "@/store/slices/userAccountSlice";
import dollarConvertor from "@/utils/functions/dollarConvertor";
import numberFormatterPercentage from "@/utils/functions/numberFormatterPercentage";
import {
  Box,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Portal,
  Skeleton,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useWaitForTransaction } from "@starknet-react/core";
import mixpanel from "mixpanel-browser";
import Image from "next/image";
import posthog from "posthog-js";
import React, { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import TransactionFees from "../../../TransactionFees.json";
import BTCLogo from "../../assets/icons/coins/btc";
import TableJediswapLogo from "../layouts/table/tableIcons/jediswapLogo";
import TableJediswapLogoDull from "../layouts/table/tableIcons/jediswapLogoDull";
import TableMySwap from "../layouts/table/tableIcons/mySwap";
import TableMySwapDull from "../layouts/table/tableIcons/mySwapDull";
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import { getJediswapCallData, getMyswapCallData } from "@/Blockchain/scripts/l3interaction";
const SwapModal = ({
  borrowIDCoinMap,
  borrowIds,
  currentId,
  currentMarketCoin,
  BorrowBalance,
  currentSwap,
  setCurrentSwap,
  borrowAPRs,
  collateralMarket,
  borrow,
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    swapLoanId,
    setSwapLoanId,
    toMarket,
    setToMarket,
    callDataSwap,
    setcallDataSwap,

    dataJediSwap_swap,
    errorJediSwap_swap,
    writeJediSwap_swap,
    writeAsyncJediSwap_swap,
    isIdleJediSwap_swap,
    statusJediSwap_swap,

    datamySwap_swap,
    errormySwap_swap,
    writemySwap_swap,
    writeAsyncmySwap_swap,
    isIdlemySwap_swap,
    statusmySwap_swap,
  } = useSwap();

  useEffect(()=>{
    const fetchData=async()=>{
      setrefereshCallData(true)
      if(currentSwap==="Jediswap"){
        if(swapLoanId && toMarket){
          const res=await getJediswapCallData(swapLoanId,toMarket);
          if(res){
            setrefereshCallData(false)
            setcallDataSwap(res)
          }
        }
      }else if(currentSwap==="MySwap"){
        if(swapLoanId && toMarket){
          const res=await getMyswapCallData(swapLoanId,toMarket);
          if(res){
            setrefereshCallData(false)
            setcallDataSwap(res)
          }
        }
      }
    }
    fetchData();
  },[swapLoanId,toMarket])

  const [currentSelectedCoin, setCurrentSelectedCoin] =
    useState("Select a market");
  const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] =
    useState(currentMarketCoin);
  const [currentBorrowId, setCurrentBorrowId] = useState(currentId);
  const [currentCollateralCoin, setcurrentCollateralCoin] =
    useState(collateralMarket);
  const [inputAmount, setinputAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [transactionStarted, setTransactionStarted] = useState(false);
  const [borrowAmount, setBorrowAmount] = useState(BorrowBalance);
  const [uniqueID, setUniqueID] = useState(0);
  const getUniqueId = () => uniqueID;

  const dispatch = useDispatch();
  const modalDropdowns = useSelector(selectModalDropDowns);
  const walletBalance = useSelector(selectWalletBalance);
  const inputAmount1 = useSelector(selectInputSupplyAmount);
  const selectedDapp = useSelector(selectSelectedDapp);

  let activeTransactions = useSelector(selectActiveTransactions);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let data: any = localStorage.getItem('transactionCheck')
      let values = data.split(",");
      let lastValue = values[values.length - 1];
      if (String(activeTransactions[activeTransactions.length - 1]?.uniqueID)===lastValue.replace(/\[|\]/g, '')) {
        if (activeTransactions[activeTransactions.length - 1]?.transaction_hash === '') {
          resetStates();
          onClose();
        }
      }
    }, 7000); // 5000 milliseconds = 5 seconds
  
    return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout when component unmounts or when activeTransactions changes
  }, [activeTransactions]);

  const coins = ["BTC", "USDT", "USDC", "ETH", "STRK"];

  useEffect(() => {}, [currentSwap]);
  const getBorrowAPR = (borrowMarket: string) => {
    switch (borrowMarket) {
      case "USDT":
        return borrowAPRs[0];
      case "USDC":
        return borrowAPRs[1];
      case "BTC":
        return borrowAPRs[2];
      case "ETH":
        return borrowAPRs[3];
      case "DAI":
        return borrowAPRs[4];

      default:
        break;
    }
  };
  const getCoin = (CoinName: string) => {
    switch (CoinName) {
      case "BTC":
        return <BTCLogo height={"16px"} width={"16px"} />;
      case "USDC":
        return <USDCLogo height={"16px"} width={"16px"} />;
      case "USDT":
        return <USDTLogo height={"16px"} width={"16px"} />;
      case "ETH":
        return <ETHLogo height={"16px"} width={"16px"} />;
      case "DAI":
        return <DAILogo height={"16px"} width={"16px"} />;
      case "STRK":
        return <STRKLogo height={"16px"} width={"16px"} />;
      default:
        break;
    }
  };
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
  // const borrowIds = [
  //     "ID - 123456",
  //     "ID - 123457",
  //     "ID - 123458",
  //     "ID - 123459",
  //     "ID - 1234510",
  // ];
  //This Function handles the modalDropDowns
  const handleDropdownClick = (dropdownName: any) => {
    // Dispatches an action called setModalDropdown with the dropdownName as the payload
    dispatch(setModalDropdown(dropdownName));
  };

  const [depositTransHash, setDepositTransHash] = useState("");
  const [isToastDisplayed, setToastDisplayed] = useState(false);
  const [toastId, setToastId] = useState<any>();
  const [refereshCallData, setrefereshCallData] = useState(true)
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState("");
  const userLoans = useSelector(selectUserUnspentLoans);
  useEffect(() => {
    const result = userLoans.find(
      (item: any) =>
        item?.loanId ==
        currentBorrowId.slice(currentBorrowId.indexOf("-") + 1).trim()
    );
    setcurrentCollateralCoin(result?.collateralMarket);
  }, [currentBorrowId]);
  // const recieptData = useWaitForTransaction({
  //   hash: depositTransHash,
  //   watch: true,
  //   onReceived: () => {
  //    //console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus("success");
  //     toast.dismiss(toastId);
  //    //console.log("trans pending");
  //     if (!isToastDisplayed) {
  //       toast.success(`You have successfully supplied `, {
  //         position: toast.POSITION.BOTTOM_RIGHT,
  //       });
  //       setToastDisplayed(true);
  //     }
  //   },
  //   onRejected(transaction) {
  //     setCurrentTransactionStatus("failed");
  //     dispatch(setTransactionStatus("failed"));
  //     toast.dismiss(toastId);
  //    //console.log("treans rejected");
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus("success");
  //    //console.log("trans onAcceptedOnL1");
  //   },
  //   onAcceptedOnL2(transaction) {
  //     setCurrentTransactionStatus("success");
  //    //console.log("trans onAcceptedOnL2 - ", transaction);
  //     if (!isToastDisplayed) {
  //       toast.success(`You have successfully supplied `, {
  //         position: toast.POSITION.BOTTOM_RIGHT,
  //       });
  //       setToastDisplayed(true);
  //     }
  //   },
  // });

  // const avgs=useSelector(selectAprAndHealthFactor)
  const avgs = useSelector(selectEffectiveApr);
  const avgsLoneHealth = useSelector(selectHealthFactor);
  const handleSwap = async () => {
    try {
      if (currentSwap == "Jediswap") {
        const swap = await writeAsyncJediSwap_swap();
        //console.log(swap);
        setDepositTransHash(swap?.transaction_hash);
        if (swap?.transaction_hash) {
          const toastid = toast.info(
            // `Please wait, your transaction is running in background`,
            `Transaction pending`,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: false,
            }
          );
          setToastId(toastid);
          if (!activeTransactions) {
            activeTransactions = []; // Initialize activeTransactions as an empty array if it's not defined
          } else if (
            Object.isFrozen(activeTransactions) ||
            Object.isSealed(activeTransactions)
          ) {
            // Check if activeTransactions is frozen or sealed
            activeTransactions = activeTransactions.slice(); // Create a shallow copy of the frozen/sealed array
          }
          const uqID = getUniqueId();
          const trans_data = {
            transaction_hash: swap?.transaction_hash.toString(),
            // message: `You have successfully swaped for Loan ID : ${swapLoanId}`,
            message: `Transaction successful`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          };
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data);
          posthog.capture("Swap Spend Borrow Status", {
            Status: "Success",
            "Market Selected": currentSelectedCoin,
            "Borrow ID": currentBorrowId,
            "Borrow Market": currentBorrowMarketCoin,
          });

          dispatch(setActiveTransactions(activeTransactions));
        }
        const uqID = getUniqueId();
        let data: any = localStorage.getItem("transactionCheck");
        data = data ? JSON.parse(data) : [];
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus("success"));
        }
      } else if (currentSwap == "MySwap") {
        const swap = await writeAsyncmySwap_swap();
        //console.log(swap);
        setDepositTransHash(swap?.transaction_hash);
        if (swap?.transaction_hash) {
          const toastid = toast.info(
            // `Please wait, your transaction is running in background`,
            `Transaction pending`,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: false,
            }
          );
          setToastId(toastid);
          if (!activeTransactions) {
            activeTransactions = []; // Initialize activeTransactions as an empty array if it's not defined
          } else if (
            Object.isFrozen(activeTransactions) ||
            Object.isSealed(activeTransactions)
          ) {
            // Check if activeTransactions is frozen or sealed
            activeTransactions = activeTransactions.slice(); // Create a shallow copy of the frozen/sealed array
          }
          const uqID = getUniqueId();
          const trans_data = {
            transaction_hash: swap?.transaction_hash.toString(),
            // message: `You have successfully swaped for Loan ID : ${swapLoanId}`,
            message: `Transaction successful`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          };
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data);
          posthog.capture("Swap Spend Borrow Status", {
            Status: "Success",
            "Market Selected": currentSelectedCoin,
            "Borrow ID": currentBorrowId,
            "Borrow Market": currentBorrowMarketCoin,
          });

          dispatch(setActiveTransactions(activeTransactions));
        }
        const uqID = getUniqueId();
        let data: any = localStorage.getItem("transactionCheck");
        data = data ? JSON.parse(data) : [];
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus("success"));
        }
      }
    } catch (err: any) {
      //console.log(err);
      const uqID = getUniqueId();
      let data: any = localStorage.getItem("transactionCheck");
      data = data ? JSON.parse(data) : [];
      if (data && data.includes(uqID)) {
        // dispatch(setTransactionStatus("failed"));
        setTransactionStarted(false);
      }
      const toastContent = (
        <div>
          Transaction declined{" "}
          <CopyToClipboard text={err}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      );
      posthog.capture("Swap Spend Borrow Status", {
        Status: "Failure",
      });
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
    }
  };

  //This function is used to find the percentage of the slider from the input given by the user
  const handleChange = (newValue: any) => {
    // Calculate the percentage of the new value relative to the wallet balance
    if (newValue > 9_000_000_000) return;
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setinputAmount(newValue);
      dispatch(setInputSupplyAmount(newValue));
    } else {
      percentage = Math.round(percentage * 100) / 100;
      setSliderValue(percentage);
      setinputAmount(newValue);
      dispatch(setInputSupplyAmount(newValue));
    }
  };
  useEffect(() => {
    const result = userLoans?.find(
      (item: any) =>
        item?.loanId == currentId?.slice(currentId.indexOf("-") + 1)?.trim()
    );
    setBorrowAmount(result?.loanAmountParsed);
    ////console.log(borrowAmount)
    // Rest of your code using the 'result' variable
  }, [currentId]);
  useEffect(() => {
    setSwapLoanId(
      currentBorrowId?.slice(currentBorrowId?.indexOf("-") + 1)?.trim()
    );
    setCurrentSelectedCoin("Select a market");
  }, [currentBorrowId]);
  ////console.log(onOpen)
  useEffect(() => {
    setToMarket(currentSelectedCoin);
  }, [currentSelectedCoin]);
  const mySwapPoolPairs = useSelector(selectMySwapPoolsSupported);
  const poolsPairs = useSelector(selectJediSwapPoolsSupported);
  const [myswapPools, setmyswapPools] = useState([]);
  const [jediswapPools, setjediswapPools] = useState([]);
  const fees = useSelector(selectFees);
  const oraclePrices = useSelector(selectOraclePrices);
  const strkData = useSelector(selectStrkAprData);
  const netSpendBalance = useSelector(selectnetSpendBalance);
  const reduxProtocolStats = useSelector(selectProtocolStats);
  const [netStrkBorrow, setnetStrkBorrow] = useState(0);

  useEffect(() => {
    if (strkData != null) {
      let netallocation = 0;
      for (let token in strkData) {
        if (strkData.hasOwnProperty(token)) {
          const array = strkData[token];
          const lastObject = array[array.length - 1];
          netallocation += 0.3 * lastObject.allocation;
        }
      }
      setnetStrkBorrow(netallocation);
    } else {
      setnetStrkBorrow(0);
    }
  }, [strkData]);

  const getBoostedAprSupply = (coin: any) => {
    if (strkData == null) {
      return 0;
    } else {
      if (strkData?.[coin]) {
        if (oraclePrices == null) {
          return 0;
        } else {
          let value = strkData?.[coin]
            ? (365 *
                100 *
                strkData?.[coin][strkData[coin]?.length - 1]?.allocation *
                0.7 *
                oraclePrices?.find((curr: any) => curr.name === "STRK")
                  ?.price) /
              strkData?.[coin][strkData[coin].length - 1]?.supply_usd
            : 0;
          return value;
        }
      } else {
        return 0;
      }
    }
  };

  const getBoostedApr = (coin: any) => {
    if (strkData == null) {
      return 0;
    } else {
      if (strkData?.[coin]) {
        if (oraclePrices == null) {
          return 0;
        } else {
          if (netStrkBorrow != 0) {
            if (netSpendBalance) {
              let value =
                (365 *
                  100 *
                  netStrkBorrow *
                  oraclePrices?.find((curr: any) => curr.name === "STRK")
                    ?.price) /
                netSpendBalance;
              return value;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        }
      } else {
        return 0;
      }
    }
  };

  useEffect(() => {
    function findSideForMember(array: any, token: any) {
      if (!array) return;
      const data: any = [];
      for (const obj of array) {
        const keyvalue = obj.keyvalue;
        const [tokenA, tokenB] = keyvalue.split("/");

        if (tokenA === token) {
          data.push(tokenB);
        } else if (tokenB === token) {
          data.push(tokenA);
        }
      }
      setmyswapPools(data);
      // Token not found in any "keyvalue" pairs
    }
    findSideForMember(mySwapPoolPairs, currentBorrowMarketCoin);
  }, [currentBorrowMarketCoin]);

  useEffect(() => {
    function findSideForMember(array: any, token: any) {
      const data: any = [];
      for (const obj of array) {
        const keyvalue = obj.keyvalue;
        const [tokenA, tokenB] = keyvalue.split("/");

        if (tokenA === token) {
          data.push(tokenB);
        } else if (tokenB === token) {
          data.push(tokenA);
        }
      }
      setjediswapPools(data);
      // Token not found in any "keyvalue" pairs
    }
    findSideForMember(poolsPairs, currentBorrowMarketCoin);
  }, [currentBorrowMarketCoin]);

  // const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const resetStates = () => {
    setSliderValue(0);
    setinputAmount(0);
    setrefereshCallData(true);
    setCurrentBorrowMarketCoin(currentMarketCoin);
    setCurrentSelectedCoin("Select a market");
    setCurrentBorrowId(currentId);
    setToastDisplayed(false);
    setTransactionStarted(false);
    dispatch(resetModalDropdowns());
    const result = userLoans?.find(
      (item: { loanId: any }): any =>
        item?.loanId == currentId?.slice(currentId?.indexOf("-") + 1).trim()
    );
    setBorrowAmount(result?.loanAmountParsed);
    dispatch(setTransactionStatus(""));
    setCurrentTransactionStatus("");
    setDepositTransHash("");
  };

  useEffect(() => {
    setCurrentBorrowId(currentId);
    setCurrentBorrowMarketCoin(currentMarketCoin);
  }, [currentId]);

  const handleBorrowMarketCoinChange = (id: string) => {
    ////console.log("got id", id);
    for (let i = 0; i < borrowIDCoinMap?.length; i++) {
      if (borrowIDCoinMap?.[i]?.id === id) {
        setCurrentBorrowMarketCoin(borrowIDCoinMap?.[i]?.name?.slice(1));
        return;
      }
    }
  };

  const handleBorrowMarketIDChange = (coin: string) => {
    ////console.log("got coin", coin);
    for (let i = 0; i < borrowIDCoinMap.length; i++) {
      if (borrowIDCoinMap?.[i]?.name === coin) {
        setCurrentBorrowId(borrowIDCoinMap?.[i]?.id);
        return;
      }
    }
  };

  return (
    <div>
      <Box display="flex" gap="14" mt="1rem">
        <Box
          cursor="pointer"
          onClick={() => {
            if (selectedDapp == "") {
            } else {
              posthog.capture("Swap Modal Selected", {
                Clicked: true,
                "Dapp Selected": currentSwap,
              });
              const uqID = Math.random();
              setUniqueID(uqID);
              let data: any = localStorage.getItem("transactionCheck");
              data = data ? JSON.parse(data) : [];
              if (data && !data.includes(uqID)) {
                data.push(uqID);
                localStorage.setItem("transactionCheck", JSON.stringify(data));
              }
              onOpen();
            }
          }}
        >
          <Box onClick={() => setCurrentSwap("MySwap")}>
            {selectedDapp != "" ? <TableMySwap /> : <TableMySwapDull />}
          </Box>
        </Box>
        <Box
          cursor="pointer"
          onClick={() => {
            if (selectedDapp == "") {
            } else {
              posthog.capture("Swap Modal Selected", {
                Clicked: true,
                "Dapp Selected": currentSwap,
              });
              const uqID = Math.random();
              setUniqueID(uqID);
              let data: any = localStorage.getItem("transactionCheck");
              data = data ? JSON.parse(data) : [];
              if (data && !data.includes(uqID)) {
                data.push(uqID);
                localStorage.setItem("transactionCheck", JSON.stringify(data));
              }
              onOpen();
            }
          }}
        >
          <Box onClick={() => setCurrentSwap("Jediswap")}>
            {selectedDapp != "" ? (
              <Box>
                <TableJediswapLogo />
              </Box>
            ) : (
              <TableJediswapLogoDull />
            )}
          </Box>
        </Box>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          const uqID = getUniqueId();
          let data: any = localStorage.getItem("transactionCheck");
          data = data ? JSON.parse(data) : [];
          ////console.log(uqID, "data here", data);
          if (data && data.includes(uqID)) {
            data = data.filter((val: any) => val != uqID);
            localStorage.setItem("transactionCheck", JSON.stringify(data));
          }
          onClose();
          if (transactionStarted) {
            dispatch(setTransactionStartedAndModalClosed(true));
          }
          resetStates();
        }}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />
        <ModalContent
          background="var(--Base_surface, #02010F)"
          color="white"
          borderRadius="md"
          maxW="464px"
          zIndex={1}
          mt="8rem"
          className="modal-content"
        >
          <ModalHeader
            mt="1rem"
            fontSize="14px"
            fontWeight="600"
            fontStyle="normal"
            lineHeight="20px"
          >
            Swap
          </ModalHeader>
          <ModalCloseButton mt="1rem" mr="1rem" />
          <ModalBody>
            <Card
              mb="0.5rem"
              p="1rem"
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
            >
              <Text color="#676D9A" display="flex" alignItems="center">
                <Text mr="0.3rem" fontSize="12px">
                  Select Market
                </Text>
                <Tooltip
                  hasArrow
                  placement="right"
                  boxShadow="dark-lg"
                  label="The token selected to swap on the protocol."
                  bg="#02010F"
                  fontSize={"13px"}
                  fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
                  color="#F0F0F5"
                  border="1px solid"
                  borderColor="#23233D"
                  arrowShadowColor="#2B2F35"
                  maxW="252px"
                >
                  <Box>
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Text>
              <Box
                display="flex"
                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                justifyContent="space-between"
                py="2"
                pl="3"
                pr="3"
                mb="1rem"
                mt="0.2rem"
                borderRadius="md"
                className="navbar"
                cursor="pointer"
                onClick={() => {
                  if (transactionStarted) {
                    return;
                  } else {
                    handleDropdownClick("swapModalSupplyMarketDropDown");
                  }
                }}
              >
                <Box display="flex" gap="1">
                  {currentSelectedCoin != "Select a market" ? (
                    <Box p="1">{getCoin(currentSelectedCoin)}</Box>
                  ) : (
                    ""
                  )}

                  <Text color="white">
                    {currentSelectedCoin == "BTC" ||
                    currentSelectedCoin == "ETH"
                      ? "w" + currentSelectedCoin
                      : currentSelectedCoin}
                  </Text>
                </Box>

                <Box pt="1" className="navbar-button">
                  {activeModal == "swapModalSupplyMarketDropDown" ? (
                    <ArrowUp />
                  ) : (
                    <DropdownUp />
                  )}
                </Box>
                {modalDropdowns.swapModalSupplyMarketDropDown && (
                  <Box
                    w="full"
                    left="0"
                    bg="#03060B"
                    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    py="2"
                    className="dropdown-container"
                    boxShadow="dark-lg"
                  >
                    {coins?.map((coin: string, index: number) => {
                      const matchingPair = myswapPools?.find(
                        (pair: any) => pair === coin
                      );
                      const matchingPairJedi = jediswapPools?.find(
                        (pair: any) => pair === coin
                      );
                      if (
                        coin === currentBorrowMarketCoin ||
                        (process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" &&
                          currentSwap == "MySwap" &&
                          !matchingPair)
                      ) {
                        return null;
                      }
                      if (
                        coin == currentBorrowMarketCoin ||
                        (process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" &&
                          currentSwap == "Jediswap" &&
                          !matchingPairJedi)
                      ) {
                        return null;
                      }
                      return (
                        <Box
                          key={index}
                          as="button"
                          w="full"
                          display="flex"
                          alignItems="center"
                          gap="1"
                          pr="2"
                          onClick={() => {
                            setCurrentSelectedCoin(coin);
                            setToMarket(coin);
                            dispatch(setCoinSelectedSupplyModal(coin));
                          }}
                        >
                          {coin === currentSelectedCoin && (
                            <Box
                              w="3px"
                              h="28px"
                              bg="#4D59E8"
                              borderRightRadius="md"
                            ></Box>
                          )}
                          <Box
                            w="full"
                            display="flex"
                            py="5px"
                            px={`${coin === currentSelectedCoin ? "1" : "5"}`}
                            gap="1"
                            bg={`${
                              coin === currentSelectedCoin
                                ? "#4D59E8"
                                : "inherit"
                            }`}
                            borderRadius="md"
                          >
                            <Box p="1">{getCoin(coin)}</Box>
                            <Text color="white">
                              {coin == "BTC" || coin == "ETH"
                                ? "w" + coin
                                : coin}
                            </Text>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
              <Text color="#676D9A" display="flex" alignItems="center">
                <Text mr="0.3rem" fontSize="12px">
                  Borrow ID
                </Text>
                <Tooltip
                  hasArrow
                  placement="right"
                  boxShadow="dark-lg"
                  label="A unique ID number assigned to a specific borrow within the protocol."
                  bg="#02010F"
                  fontSize={"13px"}
                  fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
                  color="#F0F0F5"
                  border="1px solid"
                  borderColor="#23233D"
                  arrowShadowColor="#2B2F35"
                  maxW="222px"
                >
                  <Box>
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Text>
              <Box
                display="flex"
                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                justifyContent="space-between"
                py="2"
                pl="3"
                pr="3"
                mt="0.2rem"
                borderRadius="md"
                color="white"
                className="navbar"
                onClick={() => {
                  if (transactionStarted) {
                    return;
                  } else {
                    handleDropdownClick("swapModalBorrowIDDropDown");
                  }
                }}
                as="button"
              >
                <Box display="flex" gap="1">
                  {currentBorrowId}
                </Box>
                <Text pt="1" className="navbar-button">
                  {activeModal == "swapModalBorrowIDDropDown" ? (
                    <ArrowUp />
                  ) : (
                    <DropdownUp />
                  )}
                </Text>
                {modalDropdowns.swapModalBorrowIDDropDown && (
                  <Box
                    w="full"
                    left="0"
                    bg="#03060B"
                    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    py="2"
                    className="dropdown-container"
                    boxShadow="dark-lg"
                    height={`${borrowIds.length >= 5 ? "198px" : "none"}`}
                    overflowY="scroll"
                  >
                    {borrowIds.map((coin: string, index: number) => {
                      return (
                        <Box
                          key={index}
                          as="button"
                          w="full"
                          display="flex"
                          alignItems="center"
                          gap="1"
                          px="2"
                          onClick={() => {
                            setCurrentBorrowId("ID - " + coin);
                            handleBorrowMarketCoinChange(coin);
                            setSwapLoanId(coin);
                            const borrowIdString = String(coin);
                            const result = userLoans.find(
                              (item: { loanId: string }): any =>
                                item?.loanId ==
                                borrowIdString
                                  .slice(borrowIdString.indexOf("-") + 1)
                                  .trim()
                            );
                            ////console.log(result)
                            setBorrowAmount(result?.loanAmountParsed);
                          }}
                        >
                          {coin === currentBorrowId && (
                            <Box
                              w="3px"
                              h="28px"
                              bg="#4D59E8"
                              borderRightRadius="md"
                            ></Box>
                          )}
                          <Box
                            w="full"
                            display="flex"
                            py="5px"
                            px={`${
                              "ID - " + coin === currentBorrowId ? "2" : "5"
                            }`}
                            gap="1"
                            bg={`${
                              "ID - " + coin === currentBorrowId
                                ? "#4D59E8"
                                : "inherit"
                            }`}
                            borderRadius="md"
                          >
                            {/* <Box p="1">{getCoin(coin)}</Box> */}
                            <Text>ID - {coin}</Text>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
              <Text
                color="#676D9A"
                display="flex"
                alignItems="center"
                mt="1rem"
              >
                <Text mr="0.3rem" fontSize="12px">
                  Borrow Market
                </Text>
                <Tooltip
                  hasArrow
                  placement="right"
                  boxShadow="dark-lg"
                  label="The unit of tokens you have borrowed from the protocol."
                  bg="#02010F"
                  fontSize={"13px"}
                  fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
                  color="#F0F0F5"
                  border="1px solid"
                  borderColor="#23233D"
                  arrowShadowColor="#2B2F35"
                  maxW="222px"
                >
                  <Box>
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Text>
              <Box
                display="flex"
                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                justifyContent="space-between"
                py="2"
                pl="3"
                pr="3"
                mt="0.2rem"
                borderRadius="md"
                className="navbar"
              >
                <Box display="flex" gap="1">
                  <Box p="1">{getCoin(currentBorrowMarketCoin)}</Box>
                  <Text color="white">{currentBorrowMarketCoin}</Text>
                </Box>
              </Box>

              <Text
                color="#E6EDF3"
                display="flex"
                justifyContent="flex-end"
                mt="0.4rem"
                fontSize="12px"
                fontWeight="500"
                fontStyle="normal"
                fontFamily="Inter"
              >
                Borrow Balance: {borrowAmount}
                <Text color="#6E7781" ml="0.2rem">
                  {` ${currentBorrowMarketCoin}`}
                </Text>
              </Text>
            </Card>

            <Box
              borderRadius="6px"
              p="1rem"
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              mt="1.5rem"
            >
              <Box display="flex" justifyContent="space-between" mb="0.3rem">
                <Box display="flex">
                  <Text
                    color="#676D9A"
                    fontSize="12px"
                    fontWeight="400"
                    fontStyle="normal"
                  >
                    Dapp:
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="Application where the loan was spent."
                    bg="#02010F"
                    fontSize={"13px"}
                    fontWeight={"400"}
                    borderRadius={"lg"}
                    padding={"2"}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="222px"
                  >
                    <Box ml="0.1rem" mt="0.2rem">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box display="flex" gap="2px">
                  <Box mt="2px">
                    {/* <SmallJediswapLogo /> */}
                    <Image
                      src={`/${currentSwap}.svg`}
                      alt="liquidity split coin1"
                      width="12"
                      height="12"
                    />
                  </Box>
                  <Text
                    color="#676D9A"
                    fontSize="12px"
                    fontWeight="400"
                    fontStyle="normal"
                  >
                    {currentSwap}
                  </Text>
                </Box>
              </Box>
              {/* <Box display="flex" justifyContent="space-between" mb="0.3rem">
                <Box display="flex">
                  <Box display="flex" gap="3px">
                    <Text
                      color="#676D9A"
                      fontSize="12px"
                      fontWeight="400"
                      fontStyle="normal"
                    >
                      est
                    </Text>
                    <Box mt="2px">
                      <SmallEth />
                    </Box>
                    <Box
                      color="#676D9A"
                      fontSize="12px"
                      fontWeight="400"
                      fontStyle="normal"
                    >
                      ETH
                    </Box>
                  </Box>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="all the assets to the market"
                    bg="#24292F"
                    fontSize={"smaller"}
                    fontWeight={"thin"}
                    borderRadius={"lg"}
                    padding={"2"}
                  >
                    <Box ml="0.2rem" mt="0.2rem">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  0.1%
                </Text>
              </Box> */}
              {/* <Box display="flex" justifyContent="space-between" mb="0.3rem">
                <Box display="flex">
                  <Text
                    color="#676D9A"
                    fontSize="12px"
                    fontWeight="400"
                    fontStyle="normal"
                  >
                    Liquidity split:{" "}
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="all the assets to the market"
                    bg="#24292F"
                    fontSize={"smaller"}
                    fontWeight={"thin"}
                    borderRadius={"lg"}
                    padding={"2"}
                  >
                    <Box ml="0.2rem" mt="0.2rem">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  display="flex"
                  gap="2"
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  <Box display="flex" gap="2px">
                    <Box mt="2px">
                      <SmallEth />
                    </Box>
                    <Text>1.23</Text>
                  </Box>
                  <Box display="flex" gap="2px">
                    <Box mt="2px">
                      <SmallUsdt />
                    </Box>
                    <Text>1.23</Text>
                  </Box>
                </Box>
              </Box> */}
              <Box display="flex" justifyContent="space-between" mb="0.3rem">
                <Box display="flex">
                  <Text
                    color="#676D9A"
                    fontSize="12px"
                    fontWeight="400"
                    fontStyle="normal"
                  >
                    Fees:
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="Fees charged by Hashstack protocol. Additional third-party DApp fees may apply as appropriate."
                    bg="#02010F"
                    fontSize={"13px"}
                    fontWeight={"400"}
                    borderRadius={"lg"}
                    padding={"2"}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="222px"
                  >
                    <Box ml="0.2rem" mt="0.2rem">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  {fees.l3interaction}%
                </Text>
              </Box>
              {/* <Box display="flex" justifyContent="space-between" mb="0.3rem">
                <Box display="flex">
                  <Text
                    color="#676D9A"
                    fontSize="12px"
                    fontWeight="400"
                    fontStyle="normal"
                  >
                    Gas estimate:
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="Estimation of resources & costs for blockchain transactions."
                    bg="#010409"
                    fontSize={"13px"}
                    fontWeight={"thin"}
                    borderRadius={"lg"}
                    padding={"2"}
                    border="1px solid"
                    borderColor="#2B2F35"
                    arrowShadowColor="#2B2F35"
                    maxW="222px"
                  >
                    <Box ml="0.2rem" mt="0.2rem">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  $ 0.91
                </Text>
              </Box> */}
              <Box display="flex" justifyContent="space-between" mb="0.3rem">
                <Box display="flex">
                  <Text
                    color="#676D9A"
                    fontSize="12px"
                    fontWeight="400"
                    fontStyle="normal"
                  >
                    Borrow APR:{" "}
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="The annual interest rate charged on borrowed funds from the protocol."
                    bg="#02010F"
                    fontSize={"13px"}
                    fontWeight={"400"}
                    borderRadius={"lg"}
                    padding={"2"}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="222px"
                  >
                    <Box ml="0.2rem" mt="0.2rem">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  {!borrowAPRs ||
                  borrowAPRs.length === 0 ||
                  !getBorrowAPR(currentBorrowMarketCoin) ? (
                    <Box pt="2px">
                      <Skeleton
                        width="2.3rem"
                        height=".85rem"
                        startColor="#2B2F35"
                        endColor="#101216"
                        borderRadius="6px"
                      />
                    </Box>
                  ) : (
                    "-" + getBorrowAPR(currentBorrowMarketCoin) + "%"
                  )}
                  {/* 5.56% */}
                </Text>
              </Box>
              <Box display="flex" justifyContent="space-between" mb="0.3rem">
                <Box display="flex">
                  <Text
                    color="#676D9A"
                    fontSize="12px"
                    fontWeight="400"
                    fontStyle="normal"
                  >
                    STRK APR:{" "}
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="The annual percentage rate in which STRK is rewarded."
                    bg="#02010F"
                    fontSize={"13px"}
                    fontWeight={"400"}
                    borderRadius={"lg"}
                    padding={"2"}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="222px"
                  >
                    <Box ml="0.2rem" mt="0.2rem">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  {!borrowAPRs ||
                  borrowAPRs.length === 0 ||
                  !getBorrowAPR(currentBorrowMarketCoin) ? (
                    <Box pt="2px">
                      <Skeleton
                        width="2.3rem"
                        height=".85rem"
                        startColor="#2B2F35"
                        endColor="#101216"
                        borderRadius="6px"
                      />
                    </Box>
                  ) : (
                    numberFormatterPercentage(
                      getBoostedApr(currentBorrowMarketCoin) +
                        getBoostedAprSupply(currentCollateralCoin?.slice(1))
                    ) + "%"
                  )}
                  {/* 5.56% */}
                </Text>
              </Box>
              <Box display="flex" justifyContent="space-between" mb="0.3rem">
                <Box display="flex">
                  <Text
                    color="#676D9A"
                    fontSize="12px"
                    fontWeight="400"
                    fontStyle="normal"
                  >
                    Effective APR:{" "}
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right-end"
                    boxShadow="dark-lg"
                    label="If positive, This is the yield earned by your loan at present. If negative, This is the interest you are paying."
                    bg="#02010F"
                    fontSize={"13px"}
                    fontWeight={"400"}
                    borderRadius={"lg"}
                    padding={"2"}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="272px"
                  >
                    <Box ml="0.2rem" mt="0.2rem">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                {currentSelectedCoin == "Select a market" ? (
                  <Text
                    color={
                      Number(
                        avgs?.find(
                          (item: any) =>
                            item?.loanId ==
                            currentBorrowId
                              .slice(currentBorrowId?.indexOf("-") + 1)
                              ?.trim()
                        )?.avg
                      ) +
                        getBoostedAprSupply(currentCollateralCoin?.slice(1)) <
                      0
                        ? "rgb(255 94 94)"
                        : "#00D395"
                    }
                    fontSize="12px"
                    fontWeight="400"
                    fontStyle="normal"
                  >
                    {avgs?.find(
                      (item: any) =>
                        item?.loanId ==
                        currentBorrowId
                          .slice(currentBorrowId?.indexOf("-") + 1)
                          ?.trim()
                    )?.avg
                      ? numberFormatterPercentage(
                          Number(
                            avgs?.find(
                              (item: any) =>
                                item?.loanId ==
                                currentBorrowId
                                  .slice(currentBorrowId?.indexOf("-") + 1)
                                  ?.trim()
                            )?.avg
                          ) +
                            getBoostedAprSupply(currentCollateralCoin?.slice(1))
                        )
                      : "3.2"}
                    %
                  </Text>
                ) : (
                  <Text
                    color={
                      Number(
                        avgs?.find(
                          (item: any) =>
                            item?.loanId ==
                            currentBorrowId
                              .slice(currentBorrowId?.indexOf("-") + 1)
                              ?.trim()
                        )?.avg
                      ) +
                        getBoostedAprSupply(currentCollateralCoin.slice(1)) +
                        ((dollarConvertor(
                          borrow?.loanAmountParsed,
                          borrow?.loanMarket.slice(1),
                          oraclePrices
                        ) *
                          reduxProtocolStats.find(
                            (val: any) =>
                              val?.token == borrow?.loanMarket.slice(1)
                          )?.exchangeRateDTokenToUnderlying *
                          getBoostedApr(currentBorrowMarketCoin)) /
                          dollarConvertor(
                            borrow?.collateralAmountParsed,
                            borrow?.collateralMarket.slice(1),
                            oraclePrices
                          )) *
                          reduxProtocolStats.find(
                            (val: any) =>
                              val?.token == borrow?.collateralMarket.slice(1)
                          )?.exchangeRateRtokenToUnderlying <
                      0
                        ? "rgb(255 94 94)"
                        : "#00D395"
                    }
                    fontSize="12px"
                    fontWeight="400"
                    fontStyle="normal"
                  >
                    {avgs?.find(
                      (item: any) =>
                        item?.loanId ==
                        currentBorrowId
                          .slice(currentBorrowId?.indexOf("-") + 1)
                          ?.trim()
                    )?.avg
                      ? numberFormatterPercentage(
                          Number(
                            avgs?.find(
                              (item: any) =>
                                item?.loanId ==
                                currentBorrowId
                                  .slice(currentBorrowId?.indexOf("-") + 1)
                                  ?.trim()
                            )?.avg
                          ) +
                            getBoostedAprSupply(
                              currentCollateralCoin.slice(1)
                            ) +
                            ((dollarConvertor(
                              borrow?.loanAmountParsed,
                              borrow?.loanMarket.slice(1),
                              oraclePrices
                            ) *
                              reduxProtocolStats.find(
                                (val: any) =>
                                  val?.token == borrow?.loanMarket.slice(1)
                              )?.exchangeRateDTokenToUnderlying *
                              getBoostedApr(currentBorrowMarketCoin)) /
                              dollarConvertor(
                                borrow?.collateralAmountParsed,
                                borrow?.collateralMarket.slice(1),
                                oraclePrices
                              )) *
                              reduxProtocolStats.find(
                                (val: any) =>
                                  val?.token ==
                                  borrow?.collateralMarket.slice(1)
                              )?.exchangeRateRtokenToUnderlying
                        )
                      : "3.2"}
                    %
                  </Text>
                )}
              </Box>
              {/* <Box display="flex" justifyContent="space-between">
                <Box display="flex">
                  <Text
                    color="#676D9A"
                    fontSize="12px"
                    fontWeight="400"
                    fontStyle="normal"
                  >
                    Health factor:{" "}
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right-end"
                    boxShadow="dark-lg"
                    label="Loan risk metric comparing collateral value to borrowed amount to check potential liquidation."
                    bg="#02010F"
                    fontSize={"13px"}
                    fontWeight={"400"}
                    borderRadius={"lg"}
                    padding={"2"}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="222px"
                  >
                    <Box ml="0.2rem" mt="0.2rem">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  {avgsLoneHealth?.find(
                    (item: any) =>
                      item?.loanId ==
                      currentBorrowId
                        .slice(currentBorrowId?.indexOf("-") + 1)
                        ?.trim()
                  )?.loanHealth
                    ? avgsLoneHealth?.find(
                        (item: any) =>
                          item?.loanId ==
                          currentBorrowId
                            .slice(currentBorrowId?.indexOf("-") + 1)
                            ?.trim()
                      )?.loanHealth
                    : "2.5"}
                  %
                </Text>
              </Box> */}
            </Box>
            {currentSelectedCoin != "Select a market" &&
            currentBorrowMarketCoin != currentSelectedCoin ? (
              <Box
                onClick={() => {
                  if(!refereshCallData){
                    setTransactionStarted(true);
                    if (transactionStarted == false) {
                      posthog.capture("Swap Modal Button Clicked Spend Borrow", {
                        Clicked: true,
                      });
                      dispatch(setTransactionStartedAndModalClosed(false));
                        handleSwap();
                    }
                  }
                }}
              >
                {<AnimatedButton
                  // bgColor="red"
                  // p={0}
                  color="#676D9A"
                  size="sm"
                  width="100%"
                  mt="1.5rem"
                  mb="1.5rem"
                  background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  labelSuccessArray={[
                    "Processing",
                    "Updating loan records",
                    <SuccessButton
                      key={"successButton"}
                      successText={"Swap successful."}
                    />,
                  ]}
                  labelErrorArray={[
                    <ErrorButton
                      errorText="Transaction failed"
                      key={"error1"}
                    />,
                    <ErrorButton errorText="Copy error!" key={"error2"} />,
                  ]}
                  _disabled={{ bgColor: "white", color: "black" }}
                  isDisabled={transactionStarted == true}
                  currentTransactionStatus={currentTransactionStatus}
                  setCurrentTransactionStatus={setCurrentTransactionStatus}
                >
                  {refereshCallData &&<Spinner/>}
                  {!refereshCallData && `Spend Borrow`}
                </AnimatedButton>}
              </Box>
            ) : (
              <Button
                color="#6E7681"
                size="sm"
                width="100%"
                mt="1.5rem"
                mb="1.5rem"
                background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                _hover={{
                  bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))",
                }}
              >
                Spend Borrow
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default SwapModal;

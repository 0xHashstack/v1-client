import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Tooltip,
  Slider,
  SliderMark,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  NumberInput,
  NumberInputField,
  Box,
  Text,
  Card,
  ModalHeader,
  Skeleton,
} from "@chakra-ui/react";

/* Coins logo import  */
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";

import DropdownUp from "../../assets/icons/dropdownUpIcon";
import InfoIcon from "../../assets/icons/infoIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  selectWalletBalance,
  setInputBorrowModalCollateralAmount,
  setInputBorrowModalBorrowAmount,
  setToastTransactionStarted,
  setTransactionStatus,
  selectAssetWalletBalance,
  selectActiveTransactions,
  setActiveTransactions,
  setTransactionStartedAndModalClosed,
} from "@/store/slices/userAccountSlice";

import {
  selectProtocolStats,
  selectOraclePrices,
} from "@/store/slices/readDataSlice";
import {
  setModalDropdown,
  selectModalDropDowns,
  resetModalDropdowns,
} from "@/store/slices/dropdownsSlice";
import { memo, useEffect, useRef, useState } from "react";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import SmallErrorIcon from "@/assets/icons/smallErrorIcon";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import ArrowUp from "@/assets/icons/arrowup";
import useLoanRequest from "@/Blockchain/hooks/Writes/useLoanRequest";
import WarningIcon from "@/assets/icons/coins/warningIcon";
import BlueInfoIcon from "@/assets/icons/blueinfoicon";
import SliderPointerWhite from "@/assets/icons/sliderPointerWhite";
import SliderPointer from "@/assets/icons/sliderPointer";
import { useWaitForTransaction } from "@starknet-react/core";
import { BNtoNum } from "@/Blockchain/utils/utils";
import { uint256 } from "starknet";
import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
import { toast } from "react-toastify";
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "@/Blockchain/utils/addressServices";
import CopyToClipboard from "react-copy-to-clipboard";
import { NativeToken, RToken } from "@/Blockchain/interfaces/interfaces";
import { getProtocolStats } from "@/Blockchain/scripts/protocolStats";
import mixpanel from "mixpanel-browser";
import {
  getLoanHealth_NativeCollateral,
  getLoanHealth_RTokenCollateral,
} from "@/Blockchain/scripts/LoanHealth";
import { getUSDValue } from "@/Blockchain/scripts/l3interaction";
import numberFormatter from "@/utils/functions/numberFormatter";
const BorrowModal = ({
  buttonText,
  coin,
  borrowAPRs,
  currentBorrowAPR,
  supplyAPRs,
  currentSupplyAPR,
  validRTokens,
  ...restProps
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [sliderValue2, setsliderValue2] = useState<number>(0);
  const dispatch = useDispatch();
  const [inputCollateralAmount, setinputCollateralAmount] = useState(0);
  const [inputBorrowAmount, setinputBorrowAmount] = useState(0);
  const [currentParsedInputBorrowAmount, setCurrentParsedInputBorrowAmount] =
    useState(0);

  const modalDropdowns = useSelector(selectModalDropDowns);
  // const walletBalances = useSelector(selectAssetWalletBalance);
  const [walletBalance, setwalletBalance] = useState(0);

  interface assetB {
    USDT: any;
    USDC: any;
    BTC: any;
    ETH: any;
    DAI: any;
  }
  const walletBalances: assetB | any = {
    USDT: useBalanceOf(tokenAddressMap["USDT"] || ""),
    USDC: useBalanceOf(tokenAddressMap["USDC"] || ""),
    BTC: useBalanceOf(tokenAddressMap["BTC"] || ""),
    ETH: useBalanceOf(tokenAddressMap["ETH"] || ""),
    DAI: useBalanceOf(tokenAddressMap["DAI"] || ""),
  };
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });

  useEffect(() => {
    setwalletBalance(
      walletBalances[coin?.name]?.statusBalanceOf === "success"
        ? Number(
            BNtoNum(
              uint256.uint256ToBN(
                walletBalances[coin.name]?.dataBalanceOf?.balance
              ),
              tokenDecimalsMap[coin.name]
            )
          )
        : 24
    );
    // console.log("supply modal status wallet balance",walletBalances[coin.name]?.statusBalanceOf)
  }, [coin, walletBalances[coin?.name]?.statusBalanceOf]);
  const {
    market,
    setMarket,
    amount,
    setAmount,

    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount,

    collateralMarket,
    setCollateralMarket,
    collateralAmount,
    setCollateralAmount,
    transLoanRequestHash,
    setIsLoanRequestHash,

    dataLoanRequestrToken,
    errorLoanRequestrToken,
    resetLoanRequestrToken,
    writeLoanRequestrToken,
    writeAsyncLoanRequestrToken,
    isErrorLoanRequestrToken,
    isIdleLoanRequestrToken,
    isLoadingLoanRequestrToken,
    statusLoanRequestrToken,

    dataLoanRequest,
    errorLoanRequest,
    resetLoanRequest,
    writeLoanRequest,
    writeAsyncLoanRequest,
    isErrorLoanRequest,
    isIdleLoanRequest,
    isLoadingLoanRequest,
    statusLoanRequest,
  } = useLoanRequest();

  useEffect(() => {
    setMarket(coin ? coin.name : "BTC");
    setRToken(coin ? coin.name : "rBTC");
    setCollateralMarket(coin ? coin.name : "BTC");
  }, [coin]);

  const [borrowTransHash, setBorrowTransHash] = useState("");
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState("");

  const [isToastDisplayed, setToastDisplayed] = useState(false);
  const [showToast, setShowToast] = useState("true");
  const [toastId, setToastId] = useState<any>();
  const [effectiveApr, setEffectiveApr] = useState(null);
  // const recieptData = useWaitForTransaction({
  //   hash: borrowTransHash,
  //   watch: true,
  //   onReceived: () => {
  //     console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus("success");
  //     toast.dismiss(toastId);
  //     console.log("trans pending");
  //     if (isToastDisplayed == false) {
  //       toast.success(
  //         `You have successfully borrowed ${inputBorrowAmount} d${currentBorrowCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
  //       setToastDisplayed(true);
  //     }
  //   },
  //   onRejected(transaction: any) {
  //     setCurrentTransactionStatus("failed");
  //     // dispatch(setTransactionStatus("failed"));
  //     // toast.dismiss(toastId);
  //     console.log("treans rejected");
  //     dispatch(setTransactionStatus("failed"));
  //     console.log("handle borrow", transaction?.status);
  //     const toastContent = (
  //       <div>
  //         Transaction failed{" "}
  //         <CopyToClipboard text={transaction?.status}>
  //           <Text as="u">copy error!</Text>
  //         </CopyToClipboard>
  //       </div>
  //     );
  //     toast.error(toastContent, {
  //       position: toast.POSITION.BOTTOM_RIGHT,
  //       autoClose: false,
  //     });
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus("success");

  //     console.log("trans onAcceptedOnL1");
  //   },
  //   onAcceptedOnL2(transaction) {
  //     setCurrentTransactionStatus("success");
  //     // if (isToastDisplayed == false) {
  //     //   toast.success(
  //     //     `You have successfully borrowed ${inputBorrowAmount} d${currentBorrowCoin} `,
  //     //     {
  //     //       position: toast.POSITION.BOTTOM_RIGHT,
  //     //     }
  //     //   );
  //     //   setToastDisplayed(true);
  //     // }
  //     console.log("trans onAcceptedOnL2 - ", transaction);
  //   },
  // });
  let activeTransactions = useSelector(selectActiveTransactions);
  const coinAlign = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const [currentBorrowCoin, setCurrentBorrowCoin] = useState(
    coin ? coin.name : "BTC"
  );
  const [currentCollateralCoin, setCurrentCollateralCoin] = useState(
    coin ? coin.name : "BTC"
  );
  const [protocolStats, setProtocolStats] = useState<any>([]);
  const protocolStatsRedux = useSelector(selectProtocolStats);
  const [currentAvailableReserves, setCurrentAvailableReserves] = useState(
    protocolStats?.find((stat: any) => stat?.token == currentBorrowCoin)
      ?.availableReserves
  );
  const fetchProtocolStats = async () => {
    // const stats = await getProtocolStats();
    const stats = protocolStatsRedux;
    if (stats)
      setProtocolStats([
        stats?.[0],
        stats?.[2],
        stats?.[3],
        stats?.[1],
        stats?.[4],
      ]);
  };
  useEffect(() => {
    try {
      fetchProtocolStats();
      console.log("protocolStats", protocolStats);
    } catch (err: any) {
      console.log("borrow modal : error fetching protocolStats");
    }
  }, [protocolStatsRedux]);
  useEffect(() => {
    console.log("currentAvailableReserve", currentAvailableReserves);
  }, [currentAvailableReserves]);
  const oraclePrices = useSelector(selectOraclePrices);
  const marketInfo = useSelector(selectProtocolStats);
  const [healthFactor, setHealthFactor] = useState<number>();
  useEffect(() => {
    try {
      const fetchHealthFactor = async () => {
        if (tokenTypeSelected == "Native") {
          if (
            amount > 0 &&
            market &&
            collateralAmount > 0 &&
            collateralMarket
          ) {
            const data = await getLoanHealth_NativeCollateral(
              amount,
              market,
              collateralAmount,
              collateralMarket,
              oraclePrices
            );
            setHealthFactor(data);
          }
        } else if (tokenTypeSelected == "rToken") {
          if (amount > 0 && market && rTokenAmount > 0 && rToken) {
            const data = await getLoanHealth_RTokenCollateral(
              amount,
              market,
              rTokenAmount,
              rToken,
              oraclePrices,
              marketInfo
            );
            setHealthFactor(data);
          }
        }
      };
      fetchHealthFactor();
    } catch (err) {
      console.log(err);
    }
  }, [
    amount,
    collateralAmount,
    collateralMarket,
    market,
    rToken,
    rTokenAmount,
  ]);

  const [inputBorrowAmountUSD, setInputBorrowAmountUSD] = useState<any>(0);
  const availableReserves = protocolStats?.find(
    (stat: any) => stat?.token === currentBorrowCoin
  )?.availableReserves;
  const [inputCollateralAmountUSD, setInputCollateralAmountUSD] =
    useState<any>(0);
  useEffect(() => {
    fetchParsedUSDValueBorrow();
  }, [inputBorrowAmount, currentBorrowCoin]);

  // useEffect(() => {
  //   fetchParsedUSDValueCollateral();
  // }, [collateralAmount, currentCollateralCoin]);

  // const fetchParsedUSDValueBorrow = async () => {
  //   try {
  //     const parsedBorrowAmount = await getUSDValue(
  //       currentBorrowCoin,
  //       inputBorrowAmount
  //     );
  //     console.log("got parsed usdt borrow", parsedBorrowAmount);
  //     setInputBorrowAmountUSD(parsedBorrowAmount);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const fetchParsedUSDValueCollateral = async () => {
  //   try {
  //     const parsedCollateralAmount = await getUSDValue(
  //       currentCollateralCoin,
  //       collateralAmount
  //     );
  //     console.log("got parsed usdt collateral", parsedCollateralAmount);
  //     setInputCollateralAmountUSD(parsedCollateralAmount);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    fetchParsedUSDValueCollateral();
  }, [collateralAmount, currentCollateralCoin]);

  // useEffect(() => {
  //   console.log("borrow got oracle", oraclePrices);
  // }, [oraclePrices]);

  const fetchParsedUSDValueBorrow = async () => {
    try {
      if (!oraclePrices || oraclePrices?.length === 0) {
        console.log("got parsed zero borrow");
        setInputBorrowAmountUSD(0);
        return;
      }

      const parsedBorrowAmount =
        oraclePrices.find((curr: any) => curr.name === currentBorrowCoin)
          ?.price * inputBorrowAmount;
      // const parsedBorrowAmount = await getUSDValue(
      //   currentBorrowCoin,
      //   inputBorrowAmount
      // );
      console.log("got parsed usdt borrow", parsedBorrowAmount);
      setInputBorrowAmountUSD(parsedBorrowAmount);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchParsedUSDValueCollateral = async () => {
    try {
      if (!oraclePrices || oraclePrices?.length === 0) {
        setInputCollateralAmountUSD(0);
        console.log("got parsed zero collateral");

        return;
      }

      const parsedBorrowAmount =
        oraclePrices.find((curr: any) => curr.name === currentCollateralCoin)
          ?.price * collateralAmount;
      // const parsedBorrowAmount = await getUSDValue(
      //   currentBorrowCoin,
      //   inputBorrowAmount
      // );
      console.log(
        "got parsed usdt collateral",
        parsedBorrowAmount,
        " max should be",
        5 * parsedBorrowAmount
      );
      setInputCollateralAmountUSD(parsedBorrowAmount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCurrentAvailableReserves(
      protocolStats[coinAlign?.indexOf(currentBorrowCoin)]?.availableReserves
    );
    console.log(coinAlign?.indexOf(currentBorrowCoin));
  }, [protocolStats, currentBorrowCoin]);

  const handleBorrow = async () => {
    try {
      // console.log("borrowing", amount, market, rToken, rTokenAmount);
      if (currentCollateralCoin[0] === "r") {
        const borrow = await writeAsyncLoanRequestrToken();
        if (borrow?.transaction_hash) {
          // setShowToast("true");
          // console.log();
          // if (showToast == "true") {
          console.log("toast here");
          const toastid = toast.info(
            // `Please wait your transaction is running in background : ${inputBorrowAmount} d${currentBorrowCoin} `,
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
          const trans_data = {
            transaction_hash: borrow?.transaction_hash.toString(),
            message: `Successfully borrowed : ${inputBorrowAmount} d${currentBorrowCoin}`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
          };
          mixpanel.track("Borrow Market Status", {
            Status: "Success",
            "Borrow Amount": inputBorrowAmount,
            "Borrow Token": currentBorrowCoin,
          });
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data);

          dispatch(setActiveTransactions(activeTransactions));
          // }
        }
        setIsLoanRequestHash(borrow?.transaction_hash);
        setBorrowTransHash(borrow?.transaction_hash);
        dispatch(setTransactionStatus("success"));
      } else {
        const borrow = await writeAsyncLoanRequest();
        if (borrow?.transaction_hash) {
          // setShowToast("true");
          if (showToast == "true") {
            console.log("toast here");
            const toastid = toast.info(
              // `Please wait your transaction is running in background : ${inputBorrowAmount} d${currentBorrowCoin} `,
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
            const trans_data = {
              transaction_hash: borrow?.transaction_hash.toString(),
              message: `Successfully borrowed : ${inputBorrowAmount} d${currentBorrowCoin}`,
              toastId: toastid,
              setCurrentTransactionStatus: setCurrentTransactionStatus,
            };
            // addTransaction({ hash: deposit?.transaction_hash });
            activeTransactions?.push(trans_data);

            dispatch(setActiveTransactions(activeTransactions));
          }
        }
        mixpanel.track("Borrow Market Status", {
          Status: "Success",
          "Collateral Amount": inputCollateralAmount,
          "Collateral Market": currentCollateralCoin,
          "Borrow Amount": inputBorrowAmount,
          "Borrow Token": currentBorrowCoin,
        });
        setIsLoanRequestHash(borrow?.transaction_hash);
        dispatch(setTransactionStatus("success"));
        setBorrowTransHash(borrow?.transaction_hash);
      }
    } catch (err: any) {
      dispatch(setTransactionStatus("failed"));
      console.log("handle borrow", err);
      mixpanel.track("Borrow Market Status", {
        Status: "Failure",
      });
      const toastContent = (
        <div>
          Transaction failed{" "}
          <CopyToClipboard text={err}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      );
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
    }
  };

  const getBalance = (coin: string) => {
    const amount = validRTokens.find(({ rToken, rTokenAmount }: any) => {
      if (rToken == coin) return rTokenAmount;
    });
    return amount ? amount.rTokenAmount : 0;
  };

  const fetchEffectiveApr = async () => {
    return (
      inputBorrowAmountUSD * borrowAPRs[currentBorrowAPR] -
      (inputCollateralAmountUSD *
        protocolStats?.find(
          (stat: any) => stat?.token === currentCollateralCoin
        )?.supplyRate) /
        inputBorrowAmountUSD
    );
  };

  // const {  market,
  //   setMarket,
  //   amount,
  //   setAmount,
  //   rToken,
  //   setRToken, } = useLoanRequest();

  // const {  market,
  //   setMarket,
  //   amount,
  //   setAmount,
  //   rToken,
  //   setRToken, } = useLoanRequest();

  // console.log("loadingg", isLoadingLoanRequest);

  const [buttonId, setButtonId] = useState(0);
  const [transactionStarted, setTransactionStarted] = useState(false);

  const getCoin = (CoinName: string) => {
    switch (CoinName) {
      case "BTC":
        return <BTCLogo height={"16px"} width={"16px"} />;
        break;
      case "rBTC":
        return <BTCLogo height={"16px"} width={"16px"} />;
        break;
      case "USDC":
        return <USDCLogo height={"16px"} width={"16px"} />;
        break;
      case "rUSDC":
        return <USDCLogo height={"16px"} width={"16px"} />;
        break;
      case "USDT":
        return <USDTLogo height={"16px"} width={"16px"} />;
        break;
      case "rUSDT":
        return <USDTLogo height={"16px"} width={"16px"} />;
        break;
      case "ETH":
        return <ETHLogo height={"16px"} width={"16px"} />;
        break;
      case "rETH":
        return <ETHLogo height={"16px"} width={"16px"} />;
        break;
      case "DAI":
        return <DAILogo height={"16px"} width={"16px"} />;
        break;
      case "rDAI":
        return <DAILogo height={"16px"} width={"16px"} />;
        break;
      default:
        break;
    }
  };

  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setModalDropdown(dropdownName));
  };

  const handleChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return;
    // newValue = Math.round((newValue * 1000_000) / 1000_000);
    // const =parseFloat(newValue)
    // console.log(typeof a,"new val")
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setRTokenAmount(newValue);
      setCollateralAmount(newValue);
      dispatch(setInputBorrowModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage);
        setRTokenAmount(newValue);
        setCollateralAmount(newValue);
        dispatch(setInputBorrowModalCollateralAmount(newValue));
      }
      // dispatch((newValue));
    }
  };

  const handleBorrowChange = (newValue: any) => {
    var percentage = (newValue * 100) / currentAvailableReserves;
    percentage = Math.max(0, percentage);
    // console.log(percentage,"percent")
    if (percentage > 100) {
      setsliderValue2(100);
      setAmount(newValue);
      setinputBorrowAmount(newValue);
      dispatch(setInputBorrowModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setsliderValue2(percentage);
        setAmount(newValue);
        setinputBorrowAmount(newValue);
        dispatch(setInputBorrowModalCollateralAmount(newValue));
      }
      // dispatch((newValue));
    }
  };

  const moreOptions = ["Liquidations", "Dummy1", "Dummy2", "Dummy3"];
  const coins: NativeToken[] = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
  const resetStates = () => {
    setCurrentCollateralCoin(coin?.name ? coin?.name : "BTC");
    setRToken(coin?.name ? coin?.name : "BTC");
    setCurrentBorrowCoin(coin?.name ? coin?.name : "BTC");
    setMarket(coin?.name ? coin?.name : "BTC");
    setAmount(0);
    setRTokenAmount(0);
    setSliderValue(0);
    setsliderValue2(0);
    setToastDisplayed(false);
    setTransactionStarted(false);
    setHealthFactor(undefined);
    dispatch(resetModalDropdowns());
    dispatch(setTransactionStatus(""));
    setCurrentTransactionStatus("");
    setTokenTypeSelected("Native");
    setBorrowTransHash("");
    setInputCollateralAmountUSD(0);
    setInputBorrowAmountUSD(0);
    // setDepositTransHash("")
  };
  useEffect(() => {
    setRTokenAmount(0);
    setSliderValue(0);
    setCollateralAmount(0);
  }, [currentCollateralCoin]);
  useEffect(() => {
    setAmount(0);
    setsliderValue2(0);
  }, [currentBorrowCoin]);
  // console.log(currentCollateralCoin,"collateral coin")
  // useEffect(() => {
  //   setCollateralMarket("DAI");
  //   setCollateralAmount("4000");
  // }, []);
  const [tokenTypeSelected, setTokenTypeSelected] = useState("Native");
  // console.log(amount < 5 * inputCollateralAmountUSD, typeof collateralAmount, collateralAmount, "amount")
  console.log(inputBorrowAmountUSD, inputCollateralAmountUSD, "coins");
  const rTokens: RToken[] = ["rBTC", "rUSDT", "rETH"];
  return (
    <Box>
      <Button {...restProps} onClick={onOpen}>
        {buttonText}
      </Button>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetStates();
          if (transactionStarted) {
            dispatch(setTransactionStartedAndModalClosed(true));
            dispatch(setToastTransactionStarted(""));
          }
        }}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />
        <ModalContent mt="8rem" bg={"#010409"} maxW="464px">
          <ModalHeader
            mt="1rem"
            fontSize="14px"
            fontWeight="600"
            fontStyle="normal"
            lineHeight="20px"
            color="white"
          >
            Borrow
          </ModalHeader>
          <ModalCloseButton color="white" mt="1rem" mr="1rem" />
          {/* <ModalHeader>Borrow</ModalHeader> */}
          <ModalBody overflowY="auto" color={"#E6EDF3"}>
            {/* <ModalCloseButton mt="1rem" mr="1rem" color="white" /> */}
            {/* <button onClick={onClose}>Cancel</button> */}

            <Box
              display="flex"
              flexDirection="column"
              backgroundColor="#101216"
              border="1px"
              borderColor="#2B2F35"
              p="1rem"
              mt="-1.5"
              borderRadius="md"
              gap="3"
            >
              <Box display="flex" flexDirection="column" gap="1">
                <Box display="flex">
                  <Text fontSize="xs" color="#8B949E">
                    Collateral Market
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
                    <Box p="1">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  display="flex"
                  border="1px"
                  borderColor="#2B2F35"
                  justifyContent="space-between"
                  py="2"
                  pl="3"
                  pr="3"
                  cursor="pointer"
                  borderRadius="md"
                  className="navbar"
                  onClick={() => {
                    if (transactionStarted) {
                      return;
                    } else {
                      handleDropdownClick(
                        "borrowModalCollateralMarketDropdown"
                      );
                    }
                  }}
                  as="button"
                >
                  <Box display="flex" gap="1">
                    <Box p="1">{getCoin(currentCollateralCoin)}</Box>
                    <Text>{currentCollateralCoin}</Text>
                  </Box>
                  <Box pt="1" className="navbar-button">
                    {activeModal == "borrowModalCollateralMarketDropdown" ? (
                      <ArrowUp />
                    ) : (
                      <DropdownUp />
                    )}
                  </Box>
                  {modalDropdowns.borrowModalCollateralMarketDropdown && (
                    <Box
                      w="full"
                      left="0"
                      bg="#03060B"
                      py="2"
                      className="dropdown-container"
                      boxShadow="dark-lg"
                    >
                      {validRTokens &&
                        validRTokens.length > 0 &&
                        validRTokens.map(
                          (
                            { rToken: coin, rTokenAmount: amount }: any,
                            index: number
                          ) => {
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
                                  setCurrentCollateralCoin(coin);
                                  setRToken(coin);
                                  setTokenTypeSelected("rToken");
                                  setwalletBalance(amount);
                                  // dispatch(setCoinSelectedSupplyModal(coin))
                                }}
                              >
                                {coin === currentCollateralCoin && (
                                  <Box
                                    w="3px"
                                    h="28px"
                                    bg="#0C6AD9"
                                    borderRightRadius="md"
                                  ></Box>
                                )}
                                <Box
                                  w="full"
                                  display="flex"
                                  py="5px"
                                  pl={`${
                                    coin === currentCollateralCoin ? "1" : "5"
                                  }`}
                                  pr="6px"
                                  gap="1"
                                  justifyContent="space-between"
                                  bg={`${
                                    coin === currentCollateralCoin
                                      ? "#0C6AD9"
                                      : "inherit"
                                  }`}
                                  borderRadius="md"
                                >
                                  <Box display="flex">
                                    <Box p="1">{getCoin(coin)}</Box>
                                    <Text color="white">{coin}</Text>
                                  </Box>
                                  <Box
                                    fontSize="9px"
                                    color="white"
                                    mt="6px"
                                    fontWeight="thin"
                                  >
                                    rToken Balance:{" "}
                                    {validRTokens && validRTokens.length > 0
                                      ? numberFormatter(amount)
                                      : "loading..."}
                                  </Box>
                                </Box>
                              </Box>
                            );
                          }
                        )}
                      <hr
                        style={{
                          height: "1px",
                          borderWidth: "0",
                          backgroundColor: "#2B2F35",
                          width: "96%",
                          marginTop: "7px",
                          // marginRight: "5px",
                          marginLeft: "5px",
                        }}
                      />
                      {coins.map((coin: NativeToken, index: number) => {
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
                              setCurrentCollateralCoin(coin);
                              setCollateralMarket(coin);
                              setTokenTypeSelected("Native");
                              // setRToken(coin);
                              setwalletBalance(
                                walletBalances[coin]?.statusBalanceOf ===
                                  "success"
                                  ? Number(
                                      BNtoNum(
                                        uint256.uint256ToBN(
                                          walletBalances[coin]?.dataBalanceOf
                                            ?.balance
                                        ),
                                        tokenDecimalsMap[coin]
                                      )
                                    )
                                  : 0
                              );
                            }}
                          >
                            {coin === currentCollateralCoin && (
                              <Box
                                w="3px"
                                h="28px"
                                bg="#0C6AD9"
                                borderRightRadius="md"
                              ></Box>
                            )}
                            <Box
                              w="full"
                              display="flex"
                              py="5px"
                              pl={`${
                                coin === currentCollateralCoin ? "1" : "5"
                              }`}
                              pr="6px"
                              gap="1"
                              bg={`${
                                coin === currentCollateralCoin
                                  ? "#0C6AD9"
                                  : "inherit"
                              }`}
                              borderRadius="md"
                              justifyContent="space-between"
                            >
                              <Box display="flex">
                                <Box p="1">{getCoin(coin)}</Box>
                                <Text color="white">{coin}</Text>
                              </Box>
                              <Box
                                fontSize="9px"
                                color="white"
                                mt="6px"
                                fontWeight="thin"
                              >
                                Wallet Balance:{" "}
                                {numberFormatter(
                                  Number(
                                    BNtoNum(
                                      uint256.uint256ToBN(
                                        walletBalances[coin]?.dataBalanceOf
                                          ?.balance
                                      ),
                                      tokenDecimalsMap[coin]
                                    )
                                  )
                                )}
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap="1">
                <Box display="flex">
                  <Text fontSize="xs" color="#8B949E">
                    Collateral Amount
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
                    <Box p="1">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  width="100%"
                  color={`${
                    rTokenAmount > walletBalance
                      ? "#CF222E"
                      : rTokenAmount < 0
                      ? "#CF222E"
                      : rTokenAmount == 0
                      ? "white"
                      : "#1A7F37"
                  }`}
                  border={`${
                    rTokenAmount > walletBalance
                      ? "1px solid #CF222E"
                      : rTokenAmount < 0
                      ? "1px solid #CF222E"
                      : rTokenAmount > 0 && rTokenAmount <= walletBalance
                      ? "1px solid #1A7F37"
                      : "1px solid #2B2F35 "
                  }`}
                  borderRadius="6px"
                  display="flex"
                  justifyContent="space-between"
                >
                  <NumberInput
                    border="0px"
                    min={0}
                    keepWithinRange={true}
                    onChange={handleChange}
                    value={rTokenAmount ? rTokenAmount : ""}
                    // outline="none"
                    // precision={1}
                    step={parseFloat(`${rTokenAmount <= 99999 ? 0.1 : 0}`)}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: "pointer" }}
                  >
                    <NumberInputField
                      placeholder={`Minimum 0.01536 ${currentCollateralCoin}`}
                      border="0px"
                      _disabled={{ color: "#1A7F37" }}
                      _placeholder={{
                        color: "#393D4F",
                        fontSize: ".89rem",
                        fontWeight: "600",
                        outline: "0",
                      }}
                      _focus={{
                        outline: "0",
                        boxShadow: "none",
                      }}
                    />
                  </NumberInput>
                  <Button
                    variant="ghost"
                    color="#0969DA"
                    _hover={{ bg: "#101216" }}
                    onClick={() => {
                      // setRTokenAmount(walletBalance);
                      // setAmount(walletBalance);
                      setCollateralAmount(walletBalance);
                      setRTokenAmount(walletBalance);
                      setSliderValue(100);
                      dispatch(
                        setInputBorrowModalCollateralAmount(walletBalance)
                      );
                    }}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: "pointer" }}
                  >
                    MAX
                  </Button>
                </Box>
                {rTokenAmount > walletBalance || rTokenAmount < 0 ? (
                  <Text
                    display="flex"
                    justifyContent="space-between"
                    color="#E6EDF3"
                    mt="0.2rem"
                    fontSize="12px"
                    fontWeight="500"
                    fontStyle="normal"
                    fontFamily="Inter"
                  >
                    <Text color="#CF222E" display="flex">
                      <Text mt="0.2rem">
                        <SmallErrorIcon />{" "}
                      </Text>
                      <Text ml="0.3rem">
                        {rTokenAmount > walletBalance
                          ? "Amount exceeds balance"
                          : "Invalid"}
                      </Text>
                    </Text>
                    <Text
                      color="#E6EDF3"
                      display="flex"
                      justifyContent="flex-end"
                    >
                      Wallet Balance:{" "}
                      {walletBalance.toFixed(5).replace(/\.?0+$/, "").length > 5
                        ? numberFormatter(walletBalance)
                        : numberFormatter(walletBalance)}
                      <Text color="#6E7781" ml="0.2rem">
                        {` ${currentCollateralCoin}`}
                      </Text>
                    </Text>
                  </Text>
                ) : (
                  <Text
                    color="#E6EDF3"
                    display="flex"
                    justifyContent="flex-end"
                    mt="0.2rem"
                    fontSize="12px"
                    fontWeight="500"
                    fontStyle="normal"
                    fontFamily="Inter"
                  >
                    {currentCollateralCoin && currentCollateralCoin[0] == "r"
                      ? "rToken Balance: " + getBalance(currentCollateralCoin)
                      : "Wallet Balance: " +
                        (walletBalance.toFixed(5).replace(/\.?0+$/, "").length >
                        5
                          ? numberFormatter(walletBalance)
                          : numberFormatter(walletBalance))}
                    {/* Wallet Balance:{" "}
                    {walletBalance.toFixed(5).replace(/\.?0+$/, "").length > 5
                      ? Math.floor(walletBalance)
                      : walletBalance} */}
                    <Text color="#6E7781" ml="0.2rem">
                      {` ${currentCollateralCoin}`}
                    </Text>
                  </Text>
                )}
                <Box pt={5} pb={2} mt="0.8rem">
                  <Slider
                    aria-label="slider-ex-6"
                    defaultValue={sliderValue}
                    value={sliderValue}
                    onChange={(val) => {
                      setSliderValue(val);
                      var ans = (val * walletBalance) / 100;
                      ans = Math.round(ans * 100) / 100;
                      dispatch(setInputBorrowModalCollateralAmount(ans));
                      // setRTokenAmount(ans);
                      // setAmount(ans);
                      setCollateralAmount(ans);
                      setRTokenAmount(ans);
                    }}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: "pointer" }}
                    focusThumbOnChange={false}
                  >
                    <SliderMark
                      value={0}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue >= 0 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={25}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue >= 25 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={50}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue >= 50 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={75}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue >= 75 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={100}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue == 100 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={sliderValue}
                      textAlign="center"
                      // bg='blue.500'
                      color="white"
                      mt="-8"
                      ml={sliderValue !== 100 ? "-5" : "-6"}
                      w="12"
                      fontSize="12px"
                      fontWeight="400"
                      lineHeight="20px"
                      letterSpacing="0.25px"
                    >
                      {sliderValue}%
                    </SliderMark>
                    <SliderTrack bg="#343333">
                      <SliderFilledTrack
                        bg="white"
                        w={`${sliderValue}`}
                        _disabled={{ bg: "white" }}
                      />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>
                {/* {currentCollateralCoin != "rBTC" &&
                  currentCollateralCoin != "rUSDT" && (
                    <Box display="flex" gap="2">
                      <Checkbox
                        size="md"
                        colorScheme="customBlue"
                        defaultChecked
                        mb="auto"
                        mt="0.5rem"
                        borderColor="#2B2F35"
                        isDisabled={transactionStarted == true}
                        _disabled={{
                          cursor: "pointer",
                          iconColor: "blue.400",
                          bg: "blue",
                        }}
                      />
                      <Text
                        fontSize="12px"
                        fontWeight="400"
                        color="#6E7681"
                        mt="0.3rem"
                        lineHeight="20px"
                      >
                        Ticking would stake the received rTokens. unchecking
                        woudn&apos;t stake rTokens
                      </Text>
                    </Box>
                  )} */}
              </Box>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              backgroundColor="#101216"
              border="1px"
              borderColor="#2B2F35"
              p="1rem"
              my="4"
              borderRadius="md"
              gap="3"
            >
              <Box display="flex" flexDirection="column" gap="1">
                <Box display="flex">
                  <Text fontSize="xs" color="#8B949E">
                    Borrow Market
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
                    <Box p="1">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  display="flex"
                  border="1px"
                  borderColor="#2B2F35"
                  justifyContent="space-between"
                  py="2"
                  pl="2"
                  pr="3"
                  borderRadius="md"
                  className="navbar"
                  cursor="pointer"
                  onClick={() => {
                    if (transactionStarted) {
                      return;
                    } else {
                      handleDropdownClick("borrowModalBorrowMarketDropdown");
                    }
                  }}
                  as="button"
                >
                  <Box display="flex" gap="1">
                    <Box p="1">{getCoin(currentBorrowCoin)}</Box>
                    <Text>{currentBorrowCoin}</Text>
                  </Box>
                  <Box pt="1" className="navbar-button">
                    {activeModal == "borrowModalBorrowMarketDropdown" ? (
                      <ArrowUp />
                    ) : (
                      <DropdownUp />
                    )}
                  </Box>
                  {modalDropdowns.borrowModalBorrowMarketDropdown && (
                    <Box
                      w="full"
                      left="0"
                      bg="#03060B"
                      py="2"
                      className="dropdown-container"
                      boxShadow="dark-lg"
                    >
                      {coins.map((coin: string, index: number) => {
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
                              setCurrentBorrowCoin(coin);
                              setCurrentAvailableReserves(
                                protocolStats?.[index]?.availableReserves
                              );
                              // setMarket(coin);
                              setMarket(coin);
                            }}
                          >
                            {coin === currentBorrowCoin && (
                              <Box
                                w="3px"
                                h="28px"
                                bg="#0C6AD9"
                                borderRightRadius="md"
                              ></Box>
                            )}
                            <Box
                              w="full"
                              display="flex"
                              py="5px"
                              pl={`${coin === currentBorrowCoin ? "1" : "5"}`}
                              pr="6px"
                              gap="1"
                              bg={`${
                                coin === currentBorrowCoin
                                  ? "#0C6AD9"
                                  : "inherit"
                              }`}
                              borderRadius="md"
                              justifyContent="space-between"
                            >
                              <Box display="flex">
                                <Box p="1">{getCoin(coin)}</Box>
                                <Text color="white">{coin}</Text>
                              </Box>
                              <Box
                                fontSize="9px"
                                color="white"
                                mt="6px"
                                fontWeight="thin"
                                display="flex"
                              >
                                Available reserves:{" "}
                                {numberFormatter(
                                  protocolStats?.[index]?.availableReserves
                                ) || (
                                  <Skeleton
                                    width="3rem"
                                    height="1rem"
                                    startColor="#2B2F35"
                                    endColor="#101216"
                                    borderRadius="6px"
                                    ml={2}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap="1">
                <Box display="flex">
                  <Text fontSize="xs" color="#8B949E">
                    Borrow Amount
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
                    <Box p="1">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  width="100%"
                  color="white"
                  border={`${
                    inputCollateralAmountUSD &&
                    inputBorrowAmountUSD > 5 * inputCollateralAmountUSD
                      ? "1px solid #CF222E"
                      : inputBorrowAmountUSD < 0
                      ? "1px solid #CF222E"
                      : isNaN(amount)
                      ? "1px solid #CF222E"
                      : amount > 0
                      ? "1px solid #1A7F37"
                      : "1px solid #2B2F35 "
                  }`}
                  borderRadius="6px"
                  display="flex"
                  justifyContent="space-between"
                >
                  <NumberInput
                    border="0px"
                    min={0}
                    keepWithinRange={true}
                    onChange={handleBorrowChange}
                    value={amount ? amount : ""}
                    step={parseFloat(`${amount <= 99999 ? 0.1 : 0}`)}
                    isDisabled={
                      transactionStarted == true || protocolStats.length === 0
                    }
                    _disabled={{ cursor: "pointer" }}
                  >
                    <NumberInputField
                      placeholder={`Minimum 0.01536 ${currentBorrowCoin}`}
                      color={`${
                        inputCollateralAmountUSD &&
                        inputBorrowAmountUSD > 5 * inputCollateralAmountUSD
                          ? "#CF222E"
                          : isNaN(amount)
                          ? "#CF222E"
                          : inputBorrowAmountUSD < 0
                          ? "#CF222E"
                          : inputBorrowAmountUSD == 0
                          ? "white"
                          : "#1A7F37"
                      }`}
                      border="0px"
                      _placeholder={{
                        color: "#393D4F",
                        fontSize: ".89rem",
                        fontWeight: "600",
                        outline: "0",
                      }}
                      _disabled={{ color: "#1A7F37" }}
                      _focus={{
                        outline: "0",
                        boxShadow: "none",
                      }}
                    />
                  </NumberInput>
                  <Button
                    variant="ghost"
                    color="#0969DA"
                    _hover={{ bg: "#101216" }}
                    onClick={() => {
                      if (inputCollateralAmountUSD) {
                        setAmount(5 * inputCollateralAmountUSD);
                        setinputBorrowAmount(5 * inputCollateralAmountUSD);
                        setsliderValue2(100);
                      } else {
                        setAmount(currentAvailableReserves);
                        setinputBorrowAmount(currentAvailableReserves);
                        setsliderValue2(100);
                      }
                      // dispatch(
                      //   setInputBorrowModalBorrowAmount(
                      //     5*inputCollateralAmountUSD
                      //   )
                      // );
                    }}
                    isDisabled={
                      transactionStarted == true || protocolStats.length === 0
                    }
                    _disabled={{ cursor: "pointer" }}
                  >
                    MAX
                  </Button>
                </Box>
                {amount > currentAvailableReserves ||
                (amount > 0 &&
                  inputCollateralAmountUSD &&
                  inputBorrowAmountUSD > 5 * inputCollateralAmountUSD) ? (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    color="#E6EDF3"
                    mt="0.2rem"
                    fontSize="12px"
                    fontWeight="500"
                    fontStyle="normal"
                    fontFamily="Inter"
                  >
                    <Text color="#CF222E" display="flex">
                      <Text mt="0.2rem">
                        <SmallErrorIcon />{" "}
                      </Text>
                      <Text ml="0.3rem">
                        {amount > currentAvailableReserves
                          ? "Amount exceeds balance"
                          : inputBorrowAmountUSD > 5 * inputCollateralAmountUSD
                          ? "Not Permissible CDR"
                          : ""}
                      </Text>
                    </Text>
                    <Box
                      color="#E6EDF3"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      Available reserves:{" "}
                      {availableReserves ? (
                        numberFormatter(availableReserves)
                      ) : (
                        <Skeleton
                          width="4rem"
                          height=".85rem"
                          startColor="#2B2F35"
                          endColor="#101216"
                          borderRadius="4px"
                          m={1}
                        />
                      )}
                      <Text color="#6E7781" ml="0.2rem">
                        {` ${currentBorrowCoin}`}
                      </Text>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    color="#E6EDF3"
                    display="flex"
                    justifyContent="flex-end"
                    mt="0.2rem"
                    fontSize="12px"
                    fontWeight="500"
                    fontStyle="normal"
                    fontFamily="Inter"
                  >
                    Available reserves:{" "}
                    {availableReserves ? (
                      numberFormatter(availableReserves)
                    ) : (
                      <Skeleton
                        width="4rem"
                        height=".85rem"
                        startColor="#2B2F35"
                        endColor="#101216"
                        borderRadius="4px"
                        m={1}
                      />
                    )}
                    <Text color="#6E7781" ml="0.2rem">
                      {` ${currentBorrowCoin}`}
                    </Text>
                  </Box>
                )}
                <Box pt={5} pb={2} mt="0.9rem">
                  <Slider
                    aria-label="slider-ex-6"
                    defaultValue={sliderValue2}
                    value={sliderValue2}
                    onChange={(val) => {
                      setsliderValue2(val);
                      var ans = (val / 100) * currentAvailableReserves;
                      ans = Math.round(ans * 100) / 100;
                      dispatch(setInputBorrowModalBorrowAmount(ans));
                      setAmount(ans);
                      setinputBorrowAmount(ans);
                    }}
                    isDisabled={
                      transactionStarted == true || protocolStats.length === 0
                    }
                    _disabled={{ cursor: "pointer" }}
                    focusThumbOnChange={false}
                  >
                    <SliderMark
                      value={0}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue2 >= 0 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={25}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue2 >= 25 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={50}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue2 >= 50 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={75}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue2 >= 75 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={100}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue2 == 100 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={sliderValue2}
                      textAlign="center"
                      // bg='blue.500'
                      color="white"
                      mt="-8"
                      ml={sliderValue2 !== 100 ? "-5" : "-6"}
                      w="12"
                      fontSize="12px"
                      fontWeight="400"
                      lineHeight="20px"
                      letterSpacing="0.25px"
                    >
                      {sliderValue2}%
                    </SliderMark>
                    <SliderTrack bg="#343333">
                      <SliderFilledTrack
                        bg="white"
                        w={`${sliderValue2}`}
                        _disabled={{ bg: "white" }}
                      />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>
              </Box>
            </Box>

            <Card bg="#101216" mt="1.5rem" p="1rem" border="1px solid #2B2F35">
              <Text
                color="#8B949E"
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
                mb="0.4rem"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    color="#6A737D"
                  >
                    Gas estimate:
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
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Text
                  font-style="normal"
                  font-weight="400"
                  font-size="14px"
                  color="#6A737D"
                >
                  $ 0.91
                </Text>
              </Text>
              <Text
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
                mb="0.4rem"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    lineHeight="16px"
                    color="#6A737D"
                  >
                    Borrow apr:
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
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Text
                  font-style="normal"
                  font-weight="400"
                  font-size="14px"
                  color="#6A737D"
                >
                  {!borrowAPRs || !borrowAPRs[currentBorrowAPR] ? (
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
                    borrowAPRs[currentBorrowAPR]
                  )}
                  {/* 5.56% */}
                </Text>
              </Text>
              {collateralAmount > 0 && inputBorrowAmount > 0 && (
                <Text
                  display="flex"
                  justifyContent="space-between"
                  fontSize="12px"
                  mb="0.4rem"
                >
                  <Text
                    display="flex"
                    alignItems="center"
                    key={"effective apr"}
                  >
                    <Text
                      mr="0.2rem"
                      font-style="normal"
                      font-weight="400"
                      font-size="14px"
                      lineHeight="16px"
                      color="#6A737D"
                    >
                      Effective apr:
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
                      <Box>
                        <InfoIcon />
                      </Box>
                    </Tooltip>
                  </Text>
                  <Text
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    color="#6A737D"
                  >
                    {
                      // protocolStats.length === 0 ||
                      inputBorrowAmount === 0 ||
                      collateralAmount === 0 ||
                      !borrowAPRs[currentBorrowAPR] ? (
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
                        <Text>
                          {/* 5.56% */}
                          {/* loan_usd_value * loan_apr - collateral_usd_value * collateral_apr) / loan_usd_value */}
                          {}
                          {/* {
                          protocolStats?.find(
                            (stat: any) => stat?.token === currentCollateralCoin
                          )?.supplyRate
                        } */}
                          {Number(
                            inputBorrowAmountUSD *
                              borrowAPRs[currentBorrowAPR] -
                              (inputCollateralAmountUSD *
                                protocolStats?.find(
                                  (stat: any) =>
                                    stat?.token === currentCollateralCoin
                                )?.supplyRate) /
                                inputBorrowAmountUSD
                          ).toFixed(2)}
                        </Text>
                      )
                    }
                  </Text>
                </Text>
              )}
              {healthFactor ? (
                <Text
                  color="#8B949E"
                  display="flex"
                  justifyContent="space-between"
                  fontSize="12px"
                >
                  <Text display="flex" alignItems="center">
                    <Text
                      mr="0.2rem"
                      font-style="normal"
                      font-weight="400"
                      font-size="14px"
                      color="#6A737D"
                    >
                      Health Factor:
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
                      <Box>
                        <InfoIcon />
                      </Box>
                    </Tooltip>
                  </Text>
                  <Text
                    font-style="normal"
                    font-weight="900"
                    font-size="12px"
                    color="#6A737D"
                  >
                    {healthFactor?.toFixed(2)}
                  </Text>
                </Text>
              ) : (
                ""
              )}
            </Card>

            {currentCollateralCoin && currentCollateralCoin[0] !== "r" && (
              <Box
                // display="flex"
                // justifyContent="left"
                w="100%"
                // pb="4"
                height="64px"
                display="flex"
                alignItems="center"
                mt="2rem"
                mb="1rem"
              >
                <Box
                  display="flex"
                  bg="#0C425C"
                  color="white"
                  fontSize="12px"
                  p="4"
                  border="1px solid rgba(84, 174, 255, 0.4)"
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="18px"
                  borderRadius="6px"
                  // textAlign="center"
                >
                  <Box pr="3" mt="0.5" cursor="pointer">
                    <BlueInfoIcon />
                  </Box>
                  You have selected native token as collateral which will be
                  converted to rtokens 1rBTC = XXBTC
                  {/* <Box
                                py="1"
                                pl="4"
                                cursor="pointer"
                                // onClick={handleClick}
                              >
                                <TableClose />
                              </Box> */}
                </Box>
              </Box>
            )}

            {(tokenTypeSelected == "rToken" ? rTokenAmount > 0 : true) &&
            (tokenTypeSelected == "Native" ? collateralAmount > 0 : true) &&
            amount > 0 ? (
              // (currentCollateralCoin[0]=="r" ? rTokenAmount<=walletBalance :true) &&
              // (validRTokens.length>0 ? rTokenAmount <= walletBalance:true) &&
              // inputBorrowAmountUSD <= 5 * inputCollateralAmountUSD ? (
              buttonId == 1 ? (
                <SuccessButton successText="Borrow successful." />
              ) : buttonId == 2 ? (
                <ErrorButton errorText="Copy error!" />
              ) : (
                <Box
                  onClick={() => {
                    setTransactionStarted(true);
                    if (transactionStarted == false) {
                      dispatch(setTransactionStartedAndModalClosed(false));
                      mixpanel.track("Borrow Market Button Clicked", {
                        "Borrow Clicked": true,
                      });
                      handleBorrow();
                    }
                  }}
                >
                  <AnimatedButton
                    bgColor="#101216"
                    // bgColor="red"
                    // p={0}
                    color="#8B949E"
                    size="sm"
                    width="100%"
                    // mt="1.5rem"
                    mb="1.5rem"
                    border="1px solid #8B949E"
                    labelSuccessArray={[
                      "Collateral received",
                      "Processing the borrow request.",
                      // <ErrorButton errorText="Transaction failed" />,
                      // <ErrorButton errorText="Copy error!" />,
                      <SuccessButton
                        key={"successButton"}
                        successText={"Borrow successful."}
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
                    Borrow
                  </AnimatedButton>
                </Box>
              )
            ) : (
              <Button
                bg="#101216"
                color="#6E7681"
                size="sm"
                width="100%"
                // mt="1.5rem"
                mb="1.5rem"
                border="1px solid #2B2F35"
                _hover={{ bg: "#101216" }}
              >
                Borrow
              </Button>
            )}
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default memo(BorrowModal);

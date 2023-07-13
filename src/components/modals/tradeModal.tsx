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
  Heading,
  RadioGroup,
  Stack,
  Radio,
  Skeleton,
  ModalHeader,
} from "@chakra-ui/react";

/* Coins logo import  */
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import SliderPointer from "@/assets/icons/sliderPointer";
import SliderPointerWhite from "@/assets/icons/sliderPointerWhite";
import DropdownUp from "../../assets/icons/dropdownUpIcon";
import InfoIcon from "../../assets/icons/infoIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  selectWalletBalance,
  setInputTradeModalCollateralAmount,
  setInputTradeModalBorrowAmount,
  selectAssetWalletBalance,
  setTransactionStatus,
  selectActiveTransactions,
  setActiveTransactions,
  setTransactionStartedAndModalClosed,
  // setTransactionStarted,
  // selectTransactionStarted,
} from "@/store/slices/userAccountSlice";
import {
  selectProtocolStats,
  selectOraclePrices,
} from "@/store/slices/readDataSlice";
import {
  selectNavDropdowns,
  setNavDropdown,
  setModalDropdown,
  selectModalDropDowns,
  resetModalDropdowns,
} from "@/store/slices/dropdownsSlice";
import TransactionFees from "../../../TransactionFees.json";

import { useEffect, useState } from "react";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import MySwapDisabled from "@/assets/icons/dapps/mySwapDisabled";
import EthToUsdc from "@/assets/icons/pools/ethToUsdc";
import EthToUsdt from "@/assets/icons/pools/ethToUsdt";
import UsdcToUsdt from "@/assets/icons/pools/usdcToUsdt";
import SmallEth from "@/assets/icons/coins/smallEth";
import SmallUsdt from "@/assets/icons/coins/smallUsdt";
import DaiToEth from "@/assets/icons/pools/daiToEth";
import BtcToEth from "@/assets/icons/pools/btcToEth";
import BtcToUsdt from "@/assets/icons/pools/btcToUsdt";
import SmallErrorIcon from "@/assets/icons/smallErrorIcon";
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import ArrowUp from "@/assets/icons/arrowup";
import { BNtoNum } from "@/Blockchain/utils/utils";
import { uint256 } from "starknet";
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "@/Blockchain/utils/addressServices";
import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
import useBorrowAndSpend from "@/Blockchain/hooks/Writes/useBorrowAndSpend";
import { useWaitForTransaction } from "@starknet-react/core";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { getProtocolStats } from "@/Blockchain/scripts/protocolStats";
import BtcToUsdc from "@/assets/icons/pools/btcToUsdc";
import BtcToDai from "@/assets/icons/pools/btcToDai";
import UsdtToDai from "@/assets/icons/pools/usdtToDai";
import UsdcToDai from "@/assets/icons/pools/usdcToDai";
import MySwap from "@/assets/icons/dapps/mySwap";
import { NativeToken, RToken } from "@/Blockchain/interfaces/interfaces";
import mixpanel from "mixpanel-browser";
import {
  getLoanHealth_NativeCollateral,
  getLoanHealth_RTokenCollateral,
} from "@/Blockchain/scripts/LoanHealth";
import Image from "next/image";
import {
  getJediEstimateLiquiditySplit,
  getJediEstimatedLpAmountOut,
  getUSDValue,
} from "@/Blockchain/scripts/l3interaction";
const TradeModal = ({
  buttonText,
  coin,
  borrowAPRs,
  currentBorrowAPR,
  validRTokens,
  ...restProps
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //   console.log("isopen", isOpen, "onopen", onOpen, "onClose", onClose);

  const {
    loanMarket,
    setLoanMarket,
    loanAmount,
    setLoanAmount,
    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount, // done
    collateralMarket,
    setCollateralMarket,
    collateralAmount,
    setCollateralAmount, // done

    l3App,
    setL3App,
    method,
    setMethod,
    toMarketSwap,
    setToMarketSwap,

    toMarketLiqA,
    setToMarketLiqA,
    toMarketLiqB,
    setToMarketLiqB,

    dataBorrowAndSpend,
    errorBorrowAndSpend,
    resetBorrowAndSpend,
    writeAsyncBorrowAndSpend,
    isErrorBorrowAndSpend,
    isIdleBorrowAndSpend,
    isLoadingBorrowAndSpend,
    isSuccessBorrowAndSpend,
    statusBorrowAndSpend,

    dataBorrowAndSpendRToken,
    errorBorrowAndSpendRToken,
    resetBorrowAndSpendRToken,
    writeAsyncBorrowAndSpendRToken,
    isErrorBorrowAndSpendRToken,
    isIdleBorrowAndSpendRToken,
    isLoadingBorrowAndSpendRToken,
    isSuccessBorrowAndSpendRToken,
    statusBorrowAndSpendRToken,
  } = useBorrowAndSpend();

  const rTokens: RToken[] = ["rBTC", "rUSDT", "rETH"];
  // const transactionStarted = useSelector(selectTransactionStarted);

  const [sliderValue, setSliderValue] = useState(0);
  const [sliderValue2, setsliderValue2] = useState(0);
  const dispatch = useDispatch();
  const [inputAmount, setinputAmount] = useState(0);
  const [inputCollateralAmount, setinputCollateralAmount] = useState(0);
  const [inputBorrowAmount, setinputBorrowAmount] = useState<any>(0);
  const modalDropdowns = useSelector(selectModalDropDowns);
  const [transactionStarted, setTransactionStarted] = useState(false);

  let activeTransactions = useSelector(selectActiveTransactions);

  // const walletBalances=useSelector(selectAssetWalletBalance);
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
    rUSDT: useBalanceOf(tokenAddressMap["rUSDT"] || ""),
    rUSDC: useBalanceOf(tokenAddressMap["rUSDC"] || ""),
    rBTC: useBalanceOf(tokenAddressMap["rBTC"] || ""),
    rETH: useBalanceOf(tokenAddressMap["rETH"] || ""),
    rDAI: useBalanceOf(tokenAddressMap["rDAI"] || ""),
  };
  const [walletBalance, setwalletBalance] = useState<any>(
    walletBalances[coin?.name]?.statusBalanceOf === "success"
      ? Number(
          BNtoNum(
            uint256.uint256ToBN(
              walletBalances[coin?.name]?.dataBalanceOf?.balance
            ),
            tokenDecimalsMap[coin?.name]
          )
        )
      : 0
  );
  useEffect(() => {
    setwalletBalance(
      walletBalances[coin?.name]?.statusBalanceOf === "success"
        ? Number(
            BNtoNum(
              uint256.uint256ToBN(
                walletBalances[coin?.name]?.dataBalanceOf?.balance
              ),
              tokenDecimalsMap[coin?.name]
            )
          )
        : 0
    );
    // console.log("supply modal status wallet balance",walletBalances[coin?.name]?.statusBalanceOf)
  }, [walletBalances[coin?.name]?.statusBalanceOf, coin]);
  const dapps = [
    { name: "Jediswap", status: "enable" },
    { name: "mySwap", status: "enable" },
  ];

  const pools = [
    "ETH/USDT",
    "USDC/USDT",
    "ETH/USDC",
    "DAI/ETH",
    "BTC/ETH",
    "BTC/USDT",
    "BTC/USDC",
    "BTC/DAI",
    "USDT/DAI",
    "USDC/DAI",
  ];
  const [currentDapp, setCurrentDapp] = useState("Select a dapp");
  const [currentPool, setCurrentPool] = useState("Select a pool");
  const [currentPoolCoin, setCurrentPoolCoin] = useState("Select a pool");

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
      case "Jediswap":
        return <JediswapLogo />;
        break;
      case "mySwap":
        return <MySwap />;
        break;
      case "ETH/USDT":
        return <EthToUsdt />;
        break;
      case "USDC/USDT":
        return <UsdcToUsdt />;
        break;
      case "ETH/USDC":
        return <EthToUsdc />;
        break;
      case "DAI/ETH":
        return <DaiToEth />;
        break;
      case "BTC/ETH":
        return <BtcToEth />;
        break;
      case "BTC/USDT":
        return <BtcToUsdt />;
      case "BTC/USDC":
        return <BtcToUsdc />;
      case "BTC/DAI":
        return <BtcToDai />;
      case "USDT/DAI":
        return <UsdtToDai />;
      case "USDC/DAI":
        return <UsdcToDai />;
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
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setinputCollateralAmount(newValue);
      setCollateralAmount(newValue);
      setRTokenAmount(newValue);
      dispatch(setInputTradeModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage);
        setinputCollateralAmount(newValue);
        setCollateralAmount(newValue);
        setRTokenAmount(newValue);
        dispatch(setInputTradeModalCollateralAmount(newValue));
      }
      // dispatch((newValue));
    }
  };
  const handleBorrowChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setsliderValue2(100);
      setinputBorrowAmount(newValue);
      setLoanAmount(newValue);
      // dispatch(setInputTradeModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setsliderValue2(percentage);
        setinputBorrowAmount(newValue);
        setLoanAmount(newValue);
      }
      // dispatch(setInputTradeModalCollateralAmount(newValue));
      // dispatch((newValue));
    }
  };
  const coins: NativeToken[] = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });
  const [currentCollateralCoin, setCurrentCollateralCoin] = useState(
    coin ? coin?.name : "BTC"
  );

  // const coinAlign = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const [currentBorrowCoin, setCurrentBorrowCoin] = useState(
    coin ? coin?.name : "BTC"
  );
  const [protocolStats, setProtocolStats] = useState<any>([]);
  const stats = useSelector(selectProtocolStats);
  const fetchProtocolStats = async () => {
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
  }, [stats]);
  const [currentAvailableReserves, setCurrentAvailableReserves] = useState(
    protocolStats?.find((stat: any) => stat?.token == currentBorrowCoin)
      ?.availableReserves
  );
  useEffect(() => {
    console.log("currentAvailableReserve", currentAvailableReserves);
  }, [currentAvailableReserves]);

  useEffect(() => {
    setCurrentAvailableReserves(
      protocolStats[coins.indexOf(currentBorrowCoin)]?.availableReserves
    );
    console.log(coins.indexOf(currentBorrowCoin));
  }, [protocolStats, currentBorrowCoin]);

  const [radioValue, setRadioValue] = useState("1");

  useEffect(() => {
    if (radioValue === "1") {
      setMethod("ADD_LIQUIDITY");
    } else if (radioValue === "2") {
      setMethod("SWAP");
    }
    console.log("radio value", radioValue, method);
  }, [radioValue]);
  const [tokenTypeSelected, setTokenTypeSelected] = useState("Native");

  const resetStates = () => {
    setSliderValue(0);
    setsliderValue2(0);
    setinputCollateralAmount(0);
    setCollateralAmount(0);
    setRTokenAmount(0);
    setinputBorrowAmount(0);
    setLoanAmount(0);
    setCurrentDapp("Select a dapp");
    setCurrentPool("Select a pool");
    setCurrentCollateralCoin(coin?.name);
    setCollateralMarket(coin?.name);
    setCurrentBorrowCoin(coin?.name);
    setLoanMarket(coin?.name);
    setCurrentPoolCoin("Select a pool");
    setRadioValue("1");
    setHealthFactor(undefined);
    setTokenTypeSelected("Native");
    // setTransactionStarted(false);
    dispatch(resetModalDropdowns());
    setwalletBalance(
      walletBalances[coin?.name]?.statusBalanceOf === "success"
        ? Number(
            BNtoNum(
              uint256.uint256ToBN(
                walletBalances[coin?.name]?.dataBalanceOf?.balance
              ),
              tokenDecimalsMap[coin?.name]
            )
          )
        : 0
    );
    // if (transactionStarted) dispatch(setTransactionStarted(""));
    setTransactionStarted(false);
    dispatch(resetModalDropdowns());
    dispatch(setTransactionStatus(""));
    setCurrentTransactionStatus("");
    setDepositTransHash("");
  };
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );

  useEffect(() => {
    setinputBorrowAmount(0);
    setLoanAmount(0);
    // setLoanAmount(0);
    setsliderValue2(0);
    // setHealthFactor(undefined)
  }, [currentBorrowCoin]);

  useEffect(() => {
    setinputCollateralAmount(0);
    setCollateralAmount(0);
    setRTokenAmount(0);
    setSliderValue(0);
    // setHealthFactor(undefined)
  }, [currentCollateralCoin]);

  const [depositTransHash, setDepositTransHash] = useState("");

  const [currentTransactionStatus, setCurrentTransactionStatus] = useState("");

  const [isToastDisplayed, setToastDisplayed] = useState(false);
  const [toastId, setToastId] = useState<any>();
  // const recieptData = useWaitForTransaction({
  //   hash: depositTransHash,
  //   watch: true,
  //   onReceived: () => {
  //     console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus("success");
  //     toast.dismiss(toastId);
  //     console.log("trans pending");
  //     if (!isToastDisplayed) {
  //       toast.success(`You have successfully spend the loan `, {
  //         position: toast.POSITION.BOTTOM_RIGHT,
  //       });
  //       setToastDisplayed(true);
  //     }
  //   },
  //   onRejected(transaction) {
  //     setCurrentTransactionStatus("failed");
  //     dispatch(setTransactionStatus("failed"));
  //     toast.dismiss(toastId);
  //     console.log("treans rejected");
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus("success");
  //     console.log("trans onAcceptedOnL1");
  //   },
  //   onAcceptedOnL2(transaction) {
  //     setCurrentTransactionStatus("success");
  //     console.log("trans onAcceptedOnL2 - ", transaction);
  //     if (!isToastDisplayed) {
  //       toast.success(`You have successfully supplied spend the loan `, {
  //         position: toast.POSITION.BOTTOM_RIGHT,
  //       });
  //       setToastDisplayed(true);
  //     }
  //   },
  // });
  const oraclePrices = useSelector(selectOraclePrices);
  const marketInfo = useSelector(selectProtocolStats);
  const [healthFactor, setHealthFactor] = useState<number>();
  useEffect(() => {
    try {
      const fetchHealthFactor = async () => {
        if (tokenTypeSelected == "Native") {
          if (
            inputBorrowAmount > 0 &&
            inputCollateralAmount > 0 &&
            currentBorrowCoin &&
            currentCollateralCoin
          ) {
            const data = await getLoanHealth_NativeCollateral(
              inputBorrowAmount,
              currentBorrowCoin,
              inputCollateralAmount,
              currentCollateralCoin,
              oraclePrices
            );
            setHealthFactor(data);
          }
        } else if (tokenTypeSelected == "rToken") {
          if (
            inputBorrowAmount > 0 &&
            rTokenAmount > 0 &&
            currentBorrowCoin &&
            currentCollateralCoin
          ) {
            // console.log("trade",inputBorrowAmount,rTokenAmount,currentBorrowCoin,currentCollateralCoin,marketInfo)
            const data = await getLoanHealth_RTokenCollateral(
              inputBorrowAmount,
              currentBorrowCoin,
              rTokenAmount,
              currentCollateralCoin,
              oraclePrices,
              marketInfo
            );
            // console.log(data,"data in trade")
            setHealthFactor(data);
          }
        }
      };
      fetchHealthFactor();
    } catch (err) {
      console.log(err);
    }
  }, [
    inputBorrowAmount,
    inputCollateralAmount,
    currentBorrowCoin,
    currentCollateralCoin,
    rTokenAmount,
  ]);

  const handleBorrowAndSpend = async () => {
    try {
      if (collateralMarket) {
        const borrowAndSpend = await writeAsyncBorrowAndSpend();
        setDepositTransHash(borrowAndSpend?.transaction_hash);
        if (borrowAndSpend?.transaction_hash) {
          console.log("toast here");
          const toastid = toast.info(
            // `Please wait your transaction is running in background`,
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
            transaction_hash: borrowAndSpend?.transaction_hash.toString(),
            // message: `You have successfully traded`,
            message: `Transaction successful`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
          };
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data);
          mixpanel.track("Trade Modal Market Status", {
            Status: "Failure",
            BorrowToken: currentBorrowCoin,
            BorrowAmount: inputBorrowAmount,
            CollateralToken: currentCollateralCoin,
            CollateralAmount: inputCollateralAmount,
            "Pool Selected": currentPool,
            "Dapp Selected": currentDapp,
          });

          dispatch(setActiveTransactions(activeTransactions));
        }
        console.log("borrowAndSpend Success");
        dispatch(setTransactionStatus("success"));
      } else if (rToken) {
        const borrowAndSpendR = await writeAsyncBorrowAndSpendRToken();
        setDepositTransHash(borrowAndSpendR?.transaction_hash);
        if (borrowAndSpendR?.transaction_hash) {
          console.log("toast here");
          const toastid = toast.info(
            // `Please wait your transaction is running in background`,
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
            transaction_hash: borrowAndSpendR?.transaction_hash.toString(),
            // message: `You have successfully traded`,
            message: `Transaction successful`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
          };
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data);
          mixpanel.track("Trade Modal Market Status", {
            Status: "Failure",
            BorrowToken: currentBorrowCoin,
            BorrowAmount: inputBorrowAmount,
            CollateralToken: currentCollateralCoin,
            CollateralAmount: inputCollateralAmount,
            "Pool Selected": currentPool,
            "Dapp Selected": currentDapp,
          });

          dispatch(setActiveTransactions(activeTransactions));
        }
        console.log("borrowAndSpend R Success");
        dispatch(setTransactionStatus("success"));
      }
    } catch (err: any) {
      console.log(err);
      dispatch(setTransactionStatus("failed"));
      const toastContent = (
        <div>
          Transaction failed{" "}
          <CopyToClipboard text={err}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      );
      mixpanel.track("Trade Modal Market Status", {
        Status: "Failure",
      });
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
    }
  };

  const [inputBorrowAmountUSD, setInputBorrowAmountUSD] = useState<any>(0);
  const availableReserves = protocolStats?.find(
    (stat: any) => stat?.token === currentBorrowCoin
  )?.availableReserves;
  const [inputCollateralAmountUSD, setInputCollateralAmountUSD] =
    useState<any>(0);
  useEffect(() => {
    fetchParsedUSDValueBorrow();
  }, [inputBorrowAmount, currentBorrowCoin]);

  useEffect(() => {
    fetchParsedUSDValueCollateral();
  }, [collateralAmount, currentCollateralCoin, rToken, rTokenAmount]);

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
      console.log(
        "effective apr values : ",
        "loan_usd_value",
        parsedBorrowAmount,
        "loan_apr",
        protocolStats?.find((stat: any) => stat?.token === currentBorrowCoin)
          ?.borrowRate,
        "collateral_usd_value",
        inputCollateralAmountUSD,
        "collateral_apr",
        protocolStats?.find(
          (stat: any) => stat?.token === currentCollateralCoin
        )?.supplyRate,
        "loan_usd_value",
        parsedBorrowAmount
      );
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

      if (tokenTypeSelected === "Native") {
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
      } else if (tokenTypeSelected === "rToken") {
        console.log(
          "rToken parsing",
          rToken,
          rTokenAmount,
          oraclePrices.find((curr: any) => curr.name === rToken.slice(1))
            ?.price,
          protocolStats.find((curr: any) => curr.token === rToken.slice(1))
            ?.exchangeRateRtokenToUnderlying
        );

        const parsedBorrowAmount =
          oraclePrices.find((curr: any) => curr.name === rToken.slice(1))
            ?.price *
          rTokenAmount *
          protocolStats.find((curr: any) => curr.token === rToken.slice(1))
            ?.exchangeRateRtokenToUnderlying;
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
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [currentLPTokenAmount, setCurrentLPTokenAmount] = useState<
    Number | undefined | null
  >();
  const [currentSplit, setCurrentSplit] = useState<
    Number[] | undefined | null
  >();

  useEffect(() => {
    console.log(
      "toMarketSplitConsole",
      currentBorrowCoin,
      inputBorrowAmount,
      toMarketLiqA,
      toMarketLiqB
      // borrow
    );
    setCurrentSplit(null);
    fetchLiquiditySplit();
  }, [inputBorrowAmount, currentBorrowCoin, toMarketLiqA, toMarketLiqB]);

  useEffect(() => {
    setCurrentLPTokenAmount(null);
    fetchLPAmount();
  }, [inputBorrowAmount, currentBorrowCoin, toMarketLiqA, toMarketLiqB]);

  const fetchLiquiditySplit = async () => {
    if (
      currentDapp === "Select a dapp" ||
      !toMarketLiqA ||
      !toMarketLiqB ||
      !currentBorrowCoin ||
      currentPool === "Select a pool"
    )
      return;

    const split = await getJediEstimateLiquiditySplit(
      currentBorrowCoin,
      (
        Math.floor(Number(inputBorrowAmount)) *
        Math.pow(10, tokenDecimalsMap[currentBorrowCoin])
      )?.toString(),
      toMarketLiqA,
      toMarketLiqB
      // "USDT",
      // 99,
      // "ETH",
      // "USDT"
    );
    console.log("getJediEstimateLiquiditySplit - toMarketSplit", split);
    setCurrentSplit(split);
  };

  const fetchLPAmount = async () => {
    if (
      currentDapp === "Select a dapp" ||
      !toMarketLiqA ||
      !toMarketLiqB ||
      !currentBorrowCoin ||
      !inputBorrowAmount ||
      currentPool === "Select a pool"
    )
      return;
    const lp_tokon = await getJediEstimatedLpAmountOut(
      currentBorrowCoin,
      (
        Math.floor(Number(inputBorrowAmount)) *
        Math.pow(10, tokenDecimalsMap[currentBorrowCoin])
      )?.toString(),
      toMarketLiqA,
      toMarketLiqB
      // "USDT",
      // "99",
      // "ETH",
      // "USDT"
    );
    console.log("toMarketSplitLP", lp_tokon);
    setCurrentLPTokenAmount(lp_tokon);
  };

  // useEffect(() => {
  //   const fetchEstrTokens = async () => {
  //     const data = await getrTokensMinted(
  //       collateralBalance.substring(spaceIndex + 1),
  //       inputCollateralAmount
  //     );
  //     console.log(data, "data in your borrow for est");
  //     // console.log(data, "data in your borrow");
  //     setEstrTokensMinted(data);
  //   };
  //   fetchEstrTokens();
  // }, [collateralBalance, inputCollateralAmount]);

  return (
    <Box>
      <Text
        key="borrow-details"
        as="span"
        position="relative"
        color="#0969DA"
        fontSize="14px"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="400"
        cursor="pointer"
        _hover={{
          "::before": {
            content: '""',
            position: "absolute",
            left: 0,
            bottom: "-0px",
            width: "100%",
            height: "1px",
            backgroundColor: "#0969DA",
          },
        }}
        onClick={onOpen}
      >
        Trade
      </Text>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal
        isOpen={isOpen}
        onClose={() => {
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
        <ModalContent mt="8rem" bg={"#010409"} maxW="884px">
          <ModalHeader
            // pt="1rem"
            // mt="1rem"
            fontSize="15px"
            fontWeight="600"
            fontStyle="normal"
            lineHeight="20px"
            color="white"
            my="auto"
            pos="relative"
          >
            {/* <Text color="black">
              Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
            </Text> */}
            <Text pos="absolute" top="8" left="8">
              Trade
            </Text>
          </ModalHeader>
          <ModalCloseButton color="white" mt="1.1rem" mr="1rem" />
          {/* <ModalCloseButton mt="1rem" mr="1rem" color="white" /> */}
          {/* <ModalHeader>Borrow</ModalHeader> */}
          <ModalBody color={"#E6EDF3"}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              fontSize={"sm"}
              mb={"2"}
            >
              {/* <Heading fontSize="md" fontWeight="medium" mt="0.9rem">
                Trade
              </Heading>
              <ModalCloseButton mt="1rem" mr="1rem" color="white" /> */}
            </Box>
            <Box
              display="flex"
              justifyContent="space-around"
              gap="5"
              //   alignItems="center"
            >
              <Box w="48%">
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
                            "tradeModalCollateralMarketDropdown"
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
                        {activeModal == "tradeModalCollateralMarketDropdown" ? (
                          <ArrowUp />
                        ) : (
                          <DropdownUp />
                        )}
                      </Box>
                      {/* {modalDropdowns.tradeModalCollateralMarketDropdown && (
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
                                  setCurrentCollateralCoin(coin);
                                  setwalletBalance(
                                    walletBalances[coin]?.statusBalanceOf ===
                                      "success"
                                      ? Number(
                                          BNtoNum(
                                            uint256.uint256ToBN(
                                              walletBalances[coin]
                                                ?.dataBalanceOf?.balance
                                            ),
                                            tokenDecimalsMap[coin?.name]
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
                                  px={`${
                                    coin === currentCollateralCoin ? "1" : "5"
                                  }`}
                                  gap="1"
                                  bg={`${
                                    coin === currentCollateralCoin
                                      ? "#0C6AD9"
                                      : "inherit"
                                  }`}
                                  borderRadius="md"
                                >
                                  <Box p="1">{getCoin(coin)}</Box>
                                  <Text>{coin}</Text>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      )} */}
                      {modalDropdowns.tradeModalCollateralMarketDropdown && (
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
                                      setCollateralMarket(coin);
                                      setTokenTypeSelected("rToken");
                                      setRToken(coin);
                                      setwalletBalance(
                                        walletBalances[coin]
                                          ?.statusBalanceOf === "success"
                                          ? Number(
                                              BNtoNum(
                                                uint256.uint256ToBN(
                                                  walletBalances[coin]
                                                    ?.dataBalanceOf?.balance
                                                ),
                                                tokenDecimalsMap[coin]
                                              )
                                            )
                                          : 0
                                      );
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
                                        coin === currentCollateralCoin
                                          ? "1"
                                          : "5"
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
                                          ? amount.toFixed(2)
                                          : " -"}
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
                          {coins?.map((coin: NativeToken, index: number) => {
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
                                  setRToken("rBTC");
                                  setTokenTypeSelected("Native");
                                  setwalletBalance(
                                    walletBalances[coin]?.statusBalanceOf ===
                                      "success"
                                      ? Number(
                                          BNtoNum(
                                            uint256.uint256ToBN(
                                              walletBalances[coin]
                                                ?.dataBalanceOf?.balance
                                            ),
                                            tokenDecimalsMap[coin]
                                          )
                                        ).toFixed(2)
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
                                    {Number(
                                      BNtoNum(
                                        uint256.uint256ToBN(
                                          walletBalances[coin]?.dataBalanceOf
                                            ?.balance
                                        ),
                                        tokenDecimalsMap[coin]
                                      )
                                    ).toFixed(2)}
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
                      color="white"
                      border={`${
                        inputCollateralAmount > walletBalance
                          ? "1px solid #CF222E"
                          : inputCollateralAmount < 0
                          ? "1px solid #CF222E"
                          : isNaN(inputCollateralAmount)
                          ? "1px solid #CF222E"
                          : inputCollateralAmount > 0 &&
                            inputCollateralAmount <= walletBalance
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
                        value={
                          inputCollateralAmount ? inputCollateralAmount : ""
                        }
                        step={parseFloat(
                          `${inputCollateralAmount <= 99999 ? 0.1 : 0}`
                        )}
                        isDisabled={transactionStarted == true}
                        _disabled={{ cursor: "pointer" }}
                      >
                        <NumberInputField
                          placeholder={`Minimum 0.01536 ${currentCollateralCoin}`}
                          color={`${
                            inputCollateralAmount > walletBalance
                              ? "#CF222E"
                              : isNaN(inputCollateralAmount)
                              ? "#CF222E"
                              : inputCollateralAmount < 0
                              ? "#CF222E"
                              : inputCollateralAmount == 0
                              ? "white"
                              : "#1A7F37"
                          }`}
                          _disabled={{ color: "#1A7F37" }}
                          border="0px"
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
                          setinputCollateralAmount(walletBalance);
                          setCollateralAmount(walletBalance);
                          setRTokenAmount(walletBalance);
                          setSliderValue(100);
                          dispatch(
                            setInputTradeModalCollateralAmount(walletBalance)
                          );
                        }}
                        isDisabled={transactionStarted == true}
                        _disabled={{ cursor: "pointer" }}
                      >
                        MAX
                      </Button>
                    </Box>
                    {inputCollateralAmount > walletBalance ||
                    inputCollateralAmount < 0 ||
                    isNaN(inputCollateralAmount) ? (
                      <Text
                        display="flex"
                        justifyContent="space-between"
                        color="#E6EDF3"
                        mt="0.4rem"
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
                            {inputAmount > walletBalance
                              ? "Amount exceeds balance"
                              : "Invalid Input"}
                          </Text>
                        </Text>
                        <Text
                          color="#E6EDF3"
                          display="flex"
                          justifyContent="flex-end"
                        >
                          Wallet Balance: {walletBalance}
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
                        mt="0.4rem"
                        fontSize="12px"
                        fontWeight="500"
                        fontStyle="normal"
                        fontFamily="Inter"
                      >
                        Wallet Balance: {walletBalance}
                        <Text color="#6E7781" ml="0.2rem">
                          {` ${currentCollateralCoin}`}
                        </Text>
                      </Text>
                    )}
                    <Box pt={5} pb={2} mt="0.4rem">
                      <Slider
                        aria-label="slider-ex-6"
                        defaultValue={sliderValue}
                        value={sliderValue}
                        onChange={(val) => {
                          setSliderValue(val);
                          var ans = (val / 100) * walletBalance;
                          ans = Math.round(ans * 100) / 100;
                          dispatch(setInputTradeModalCollateralAmount(ans));
                          setinputCollateralAmount(ans);
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
                          handleDropdownClick("tradeModalBorrowMarketDropdown");
                        }
                      }}
                      as="button"
                    >
                      <Box display="flex" gap="1">
                        <Box p="1">{getCoin(currentBorrowCoin)}</Box>
                        <Text>{currentBorrowCoin}</Text>
                      </Box>
                      <Box pt="1" className="navbar-button">
                        {activeModal == "tradeModalBorrowMarketDropdown" ? (
                          <ArrowUp />
                        ) : (
                          <DropdownUp />
                        )}
                      </Box>
                      {/* {modalDropdowns.tradeModalBorrowMarketDropdown && (
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
                                  px={`${
                                    coin === currentBorrowCoin ? "1" : "5"
                                  }`}
                                  gap="1"
                                  bg={`${
                                    coin === currentBorrowCoin
                                      ? "#0C6AD9"
                                      : "inherit"
                                  }`}
                                  borderRadius="md"
                                >
                                  <Box p="1">{getCoin(coin)}</Box>
                                  <Text>{coin}</Text>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      )} */}
                      {modalDropdowns.tradeModalBorrowMarketDropdown && (
                        <Box
                          w="full"
                          left="0"
                          bg="#03060B"
                          py="2"
                          className="dropdown-container"
                          boxShadow="dark-lg"
                        >
                          {coins?.map((coin: NativeToken, index: number) => {
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
                                  setLoanMarket(coin);
                                  // setMarket(coin);
                                  // setMarket(coin);
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
                                  pl={`${
                                    coin === currentBorrowCoin ? "1" : "5"
                                  }`}
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
                                    {protocolStats?.[index]
                                      ?.availableReserves || (
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
                          : isNaN(inputBorrowAmount)
                          ? "1px solid #CF222E"
                          : inputBorrowAmount > 0
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
                        value={inputBorrowAmount ? inputBorrowAmount : ""}
                        step={parseFloat(
                          `${inputBorrowAmount <= 99999 ? 0.1 : 0}`
                        )}
                        isDisabled={
                          transactionStarted == true ||
                          protocolStats.length === 0
                        }
                        _disabled={{ cursor: "pointer" }}
                      >
                        <NumberInputField
                          placeholder={`Minimum 0.01536 ${currentBorrowCoin}`}
                          color={`${
                            inputCollateralAmountUSD &&
                            inputBorrowAmountUSD > 5 * inputCollateralAmountUSD
                              ? "#CF222E"
                              : isNaN(inputBorrowAmount)
                              ? "#CF222E"
                              : inputBorrowAmount < 0
                              ? "#CF222E"
                              : inputBorrowAmount == 0
                              ? "white"
                              : "#1A7F37"
                          }`}
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
                          if (inputCollateralAmountUSD) {
                            setinputBorrowAmount(
                              (5 * inputCollateralAmountUSD) /
                                oraclePrices.find(
                                  (curr: any) => curr.name === currentBorrowCoin
                                )?.price
                            );
                            setLoanAmount(
                              (5 * inputCollateralAmountUSD) /
                                oraclePrices.find(
                                  (curr: any) => curr.name === currentBorrowCoin
                                )?.price
                            );
                            setsliderValue2(100);
                          } else {
                            setinputBorrowAmount(currentAvailableReserves);
                            setLoanAmount(currentAvailableReserves);
                            setsliderValue2(100);
                          }
                          dispatch(
                            setInputTradeModalBorrowAmount(
                              currentAvailableReserves
                            )
                          );
                        }}
                        isDisabled={
                          transactionStarted == true ||
                          protocolStats.length === 0
                        }
                        _disabled={{ cursor: "pointer" }}
                      >
                        MAX
                      </Button>
                    </Box>
                    {inputBorrowAmount > currentAvailableReserves ||
                    (inputBorrowAmount > 0 &&
                      inputCollateralAmountUSD &&
                      inputBorrowAmountUSD > 5 * inputCollateralAmountUSD) ||
                    isNaN(inputBorrowAmount) ? (
                      <Text
                        display="flex"
                        justifyContent="space-between"
                        color="#E6EDF3"
                        mt="0.4rem"
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
                            {inputBorrowAmount > currentAvailableReserves
                              ? "Amount exceeds balance"
                              : inputBorrowAmountUSD >
                                5 * inputCollateralAmountUSD
                              ? "Not Permissible CDR"
                              : "Invalid Input"}
                          </Text>
                        </Text>
                        <Text
                          color="#E6EDF3"
                          display="flex"
                          justifyContent="flex-end"
                        >
                          Available Reserves:{" "}
                          {currentAvailableReserves.toFixed(2)}
                          <Text color="#6E7781" ml="0.2rem">
                            {` ${currentBorrowCoin}`}
                          </Text>
                        </Text>
                      </Text>
                    ) : (
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
                        Available reserves:{" "}
                        {protocolStats?.find(
                          (stat: any) => stat?.token == currentBorrowCoin
                        )?.availableReserves || (
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
                      </Text>
                    )}
                    <Box pt={5} pb={2} mt="0.8rem">
                      <Slider
                        aria-label="slider-ex-6"
                        defaultValue={sliderValue2}
                        value={sliderValue2}
                        onChange={(val) => {
                          setsliderValue2(val);
                          var ans = (val / 100) * currentAvailableReserves;
                          ans = Math.round(ans * 100) / 100;
                          dispatch(setInputTradeModalBorrowAmount(ans));
                          setinputBorrowAmount(ans);
                          setLoanAmount(ans);
                        }}
                        isDisabled={
                          transactionStarted == true ||
                          protocolStats.length === 0
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
              </Box>

              <Box w="48%">
                <Box display="flex" flexDir="column" p="3" gap="1">
                  <Box>
                    <RadioGroup onChange={setRadioValue} value={radioValue}>
                      <Stack spacing={4} direction="row">
                        <Radio
                          value="1"
                          bg="#2B2F35"
                          border="none"
                          colorScheme="customBlue"
                          _focus={{ boxShadow: "none", outline: "0" }}
                          // onClick={() => {
                          //   setMethod("ADD_LIQUIDITY");
                          // }}
                        >
                          Liquidity provisioning
                        </Radio>
                        <Radio
                          fontSize="sm"
                          value="2"
                          bg="#2B2F35"
                          border="none"
                          colorScheme="customBlue"
                          _focus={{ boxShadow: "none", outline: "0" }}
                          // onClick={() => {
                          //   setMethod("SWAP");
                          // }}
                        >
                          Trade
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  backgroundColor="#101216"
                  border="1px"
                  borderColor="#2B2F35"
                  p="3"
                  // my="4"
                  borderRadius="md"
                  gap="3"
                >
                  <Box display="flex" flexDirection="column" gap="1">
                    <Box display="flex">
                      <Text fontSize="xs" color="#8B949E">
                        Select Dapp
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
                      borderRadius="md"
                      className="navbar"
                      onClick={() => {
                        if (transactionStarted) {
                          return;
                        } else {
                          handleDropdownClick("yourBorrowDappDropdown");
                        }
                      }}
                      as="button"
                    >
                      <Box display="flex" gap="1">
                        {currentDapp != "Select a dapp" ? (
                          <Box p="1">{getCoin(currentDapp)}</Box>
                        ) : (
                          ""
                        )}
                        <Text>{currentDapp}</Text>
                      </Box>
                      <Box pt="1" className="navbar-button">
                        {activeModal == "yourBorrowDappDropdown" ? (
                          <ArrowUp />
                        ) : (
                          <DropdownUp />
                        )}
                      </Box>
                      {modalDropdowns.yourBorrowDappDropdown && (
                        <Box
                          w="full"
                          left="0"
                          bg="#03060B"
                          py="2"
                          className="dropdown-container"
                          boxShadow="dark-lg"
                        >
                          {dapps.map((dapp, index) => {
                            return (
                              <Button
                                // as="button"
                                key={index}
                                w="full"
                                m="0"
                                pl="0"
                                display="flex"
                                alignItems="center"
                                gap="1"
                                pr="2"
                                bg="inherit"
                                onClick={() => {
                                  setCurrentDapp(dapp.name);
                                  if (dapp.name === "Jediswap") {
                                    setL3App("JEDI_SWAP");
                                  } else if (dapp.name === "mySwap") {
                                    setL3App("MY_SWAP");
                                  }
                                }}
                                fontSize="sm"
                                _hover={{ background: "inherit" }}
                                _disabled={{ cursor: "pointer" }}
                                isDisabled={dapp.status === "disable"}
                              >
                                {dapp.name === currentDapp && (
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
                                  px={`${
                                    dapp.name === currentDapp ? "1" : "5"
                                  }`}
                                  gap="1"
                                  bg={`${
                                    dapp.name === currentDapp
                                      ? "#0C6AD9"
                                      : "inherit"
                                  }`}
                                  borderRadius="md"
                                >
                                  <Box p="1">{getCoin(dapp.name)}</Box>
                                  <Text pt="1">{dapp.name}</Text>
                                </Box>
                                {dapp.status === "disable" && (
                                  <Text
                                    pt="1"
                                    pr="3"
                                    fontSize=".6rem"
                                    fontWeight="thin"
                                  >
                                    paused
                                  </Text>
                                )}
                              </Button>
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" gap="1">
                    <Box display="flex">
                      <Text fontSize="xs" color="#8B949E">
                        Select Pool
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
                      borderRadius="md"
                      className="navbar"
                      onClick={() => {
                        if (transactionStarted) {
                          return;
                        } else {
                          handleDropdownClick("yourBorrowPoolDropdown");
                        }
                      }}
                      as="button"
                    >
                      <Box display="flex" gap="1">
                        {getCoin(
                          radioValue === "1" ? currentPool : currentPoolCoin
                        ) ? (
                          <Box p="1">
                            {getCoin(
                              radioValue === "1" ? currentPool : currentPoolCoin
                            )}
                          </Box>
                        ) : (
                          ""
                        )}
                        <Text>
                          {radioValue === "1" ? currentPool : currentPoolCoin}
                        </Text>
                      </Box>
                      <Box pt="1" className="navbar-button">
                        {activeModal == "yourBorrowPoolDropdown" ? (
                          <ArrowUp />
                        ) : (
                          <DropdownUp />
                        )}
                      </Box>
                      {modalDropdowns.yourBorrowPoolDropdown &&
                      radioValue === "1" ? (
                        <Box
                          w="full"
                          left="0"
                          bg="#03060B"
                          py="2"
                          className="dropdown-container"
                          boxShadow="dark-lg"
                          height="198px"
                          overflow="scroll"
                        >
                          {pools.map((pool, index) => {
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
                                  setCurrentPool(pool);
                                  //set type for pools as native token[]
                                  //@ts-ignore
                                  setToMarketLiqA(pool.split("/")[0]);
                                  //@ts-ignore
                                  setToMarketLiqB(pool.split("/")[1]);
                                }}
                              >
                                {pool === currentPool && (
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
                                  px={`${pool === currentPool ? "1" : "5"}`}
                                  gap="1"
                                  bg={`${
                                    pool === currentPool ? "#0C6AD9" : "inherit"
                                  }`}
                                  borderRadius="md"
                                >
                                  <Box p="1">{getCoin(pool)}</Box>
                                  <Text>{pool}</Text>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      ) : modalDropdowns.yourBorrowPoolDropdown &&
                        radioValue === "2" ? (
                        <Box
                          w="full"
                          left="0"
                          bg="#03060B"
                          py="2"
                          className="dropdown-container"
                          boxShadow="dark-lg"
                        >
                          {coins?.map((coin: NativeToken, index: number) => {
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
                                  setCurrentPoolCoin(coin);
                                  setToMarketSwap(coin);
                                }}
                              >
                                {coin === currentPoolCoin && (
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
                                  px={`${coin === currentPoolCoin ? "1" : "5"}`}
                                  gap="1"
                                  bg={`${
                                    coin === currentPoolCoin
                                      ? "#0C6AD9"
                                      : "inherit"
                                  }`}
                                  borderRadius="md"
                                >
                                  <Box p="1">{getCoin(coin)}</Box>
                                  <Text>{coin}</Text>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      ) : (
                        <Box display="none"></Box>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box
                  p="4"
                  borderRadius="md"
                  border="1px"
                  borderColor="#2B2F35"
                  bg="#101216"
                  my="4"
                >
                  {radioValue == "1" && currentPool !== "Select a pool" && (
                    <Box display="flex" justifyContent="space-between" mb="1">
                      <Box display="flex">
                        <Text color="#6E7681" fontSize="xs">
                          est LP tokens recieved:{" "}
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
                      <Text
                        color="#6A737D"
                        fontSize="12px"
                        fontWeight="400"
                        fontStyle="normal"
                      >
                        {currentLPTokenAmount == undefined ||
                        currentLPTokenAmount === null ? (
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
                          "" + currentLPTokenAmount
                        )}
                        {/* $ 10.91 */}
                      </Text>
                    </Box>
                  )}
                  {radioValue == "1" && currentPool !== "Select a pool" && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      mb="0.3rem"
                    >
                      <Box display="flex">
                        <Text
                          color="#6A737D"
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
                        color="#6A737D"
                        fontSize="12px"
                        fontWeight="400"
                        fontStyle="normal"
                      >
                        <Box display="flex" gap="2px">
                          <Box mt="2px">
                            {/* <SmallEth /> */}
                            <Image
                              src={`/${toMarketLiqA}.svg`}
                              alt="liquidity split coin1"
                              width="12"
                              height="12"
                            />
                          </Box>
                          <Text>
                            {currentSplit?.[0]?.toString() || (
                              <Skeleton
                                width="2.3rem"
                                height=".85rem"
                                startColor="#2B2F35"
                                endColor="#101216"
                                borderRadius="6px"
                              />
                            )}
                          </Text>
                        </Box>
                        <Box display="flex" gap="2px">
                          <Box mt="2px">
                            {/* <SmallUsdt /> */}
                            <Image
                              src={`/${toMarketLiqB}.svg`}
                              alt="liquidity split coin1"
                              width="12"
                              height="12"
                            />
                          </Box>
                          <Text>
                            {currentSplit?.[1].toString() || (
                              <Skeleton
                                width="2.3rem"
                                height=".85rem"
                                startColor="#2B2F35"
                                endColor="#101216"
                                borderRadius="6px"
                              />
                            )}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {radioValue == "2" && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      mb="0.3rem"
                    >
                      <Box display="flex">
                        <Box display="flex" gap="2px">
                          <Text
                            color="#6A737D"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            est
                          </Text>
                          <Box mt="2px">
                            <SmallEth />
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
                        color="#6A737D"
                        fontSize="12px"
                        fontWeight="400"
                        fontStyle="normal"
                      >
                        $10.91
                      </Text>
                    </Box>
                  )}
                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#6E7681" fontSize="xs">
                        Fees:{" "}
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
                    <Text color="#6E7681" fontSize="xs">
                      {TransactionFees.spend}%
                    </Text>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#6E7681" fontSize="xs">
                        Gas estimate:{" "}
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
                        <Box padding="0.25rem">
                          <InfoIcon />
                        </Box>
                      </Tooltip>
                    </Box>
                    <Text color="#6E7681" fontSize="xs">
                      $0.91
                    </Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#6E7681" fontSize="xs">
                        Borrow apr:{" "}
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
                    <Text color="#6E7681" fontSize="xs">
                      {!borrowAPRs ||
                      borrowAPRs.length === 0 ||
                      !borrowAPRs[currentBorrowAPR] ? (
                        <Box pt="1px">
                          <Skeleton
                            width="2.3rem"
                            height=".85rem"
                            startColor="#2B2F35"
                            endColor="#101216"
                            borderRadius="6px"
                          />
                        </Box>
                      ) : (
                        borrowAPRs[currentBorrowAPR] + "%"
                      )}
                      {/* 5.56% */}
                    </Text>
                  </Box>
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
                        {tokenTypeSelected === "Native" ? (
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
                                (inputBorrowAmountUSD *
                                  protocolStats?.find(
                                    (stat: any) =>
                                      stat?.token === currentBorrowCoin
                                  )?.borrowRate -
                                  inputCollateralAmountUSD *
                                    protocolStats?.find(
                                      (stat: any) =>
                                        stat?.token === currentCollateralCoin
                                    )?.supplyRate) /
                                  inputBorrowAmountUSD
                              ).toFixed(2)}
                            </Text>
                          )
                        ) : // protocolStats.length === 0 ||
                        rTokenAmount === 0 ||
                          inputBorrowAmount === 0 ||
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
                            {(inputBorrowAmountUSD *
                              protocolStats?.find(
                                (stat: any) => stat?.token === currentBorrowCoin
                              )?.borrowRate -
                              inputCollateralAmountUSD *
                                protocolStats?.find(
                                  (stat: any) => stat?.token === rToken.slice(1)
                                )?.supplyRate) /
                              inputBorrowAmountUSD}
                            {/* {
                            protocolStats?.find(
                              (stat: any) => stat?.token === currentCollateralCoin
                            )?.supplyRate
                          } */}
                          </Text>
                        )}
                      </Text>
                    </Text>
                  )}
                  {healthFactor ? (
                    <Box display="flex" justifyContent="space-between">
                      <Box display="flex">
                        <Text color="#6E7681" fontSize="xs">
                          Health factor:{" "}
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
                          <Box padding="0.25rem">
                            <InfoIcon />
                          </Box>
                        </Tooltip>
                      </Box>
                      <Text color="#6E7681" fontSize="xs">
                        {healthFactor?.toFixed(2)}
                      </Text>
                    </Box>
                  ) : (
                    ""
                  )}
                </Box>
                {(tokenTypeSelected == "rToken" ? rTokenAmount > 0 : true) &&
                (tokenTypeSelected == "Native" ? collateralAmount > 0 : true) &&
                inputBorrowAmount > 0 &&
                inputBorrowAmountUSD <= 5 * inputCollateralAmountUSD &&
                currentDapp != "Select a dapp" &&
                (currentPool != "Select a pool" ||
                  currentPoolCoin != "Select a pool") ? (
                  <Box
                    onClick={() => {
                      setTransactionStarted(true);
                      // console.log(
                      //   "trade clicked",
                      //   "rToken",
                      //   rToken,
                      //   "rTokenAmount",
                      //   rTokenAmount,
                      //   "collateralMarket",
                      //   collateralMarket,
                      //   "collateralAmount",
                      //   collateralAmount,
                      //   "loanMarket",
                      //   loanMarket,
                      //   "loanAmount",
                      //   loanAmount,
                      //   "method",
                      //   method,
                      //   "l3App",
                      //   l3App,
                      //   "toMarketSwap",
                      //   toMarketSwap,
                      //   "toMarketLiqA",
                      //   toMarketLiqA,
                      //   "toMarketLiqB",
                      //   toMarketLiqB
                      // );

                      if (transactionStarted == false) {
                        mixpanel.track("Trade Button Clicked Market page", {
                          Clicked: true,
                        });
                        dispatch(setTransactionStartedAndModalClosed(false));
                        handleBorrowAndSpend();
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
                      mt="1.5rem"
                      mb="1.5rem"
                      border="1px solid #8B949E"
                      labelSuccessArray={[
                        "Performing Checks",
                        "Processing",
                        "Collateral received",
                        "Processing the borrow request.",
                        "Checking the reserves for sufficient liquidity",
                        "Reserves are sufficient",
                        "Borrow successful.",
                        <SuccessButton
                          key={"successButton"}
                          successText={"Borrow successful"}
                        />,
                      ]}
                      labelErrorArray={[
                        "Performing Checks",
                        "Processing",
                        <ErrorButton
                          errorText="Transaction failed"
                          key={"error1"}
                        />,
                        <ErrorButton errorText="Copy error!" key={"error2"} />,
                      ]}
                      currentTransactionStatus={currentTransactionStatus}
                      setCurrentTransactionStatus={setCurrentTransactionStatus}
                    >
                      Borrow
                    </AnimatedButton>
                  </Box>
                ) : (
                  <Button
                    bg="#101216"
                    color="#6E7681"
                    size="sm"
                    width="100%"
                    mt="1.5rem"
                    mb="1.5rem"
                    border="1px solid #2B2F35"
                    _hover={{ bg: "#101216" }}
                  >
                    Borrow
                  </Button>
                )}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TradeModal;

{
  /* 
<Box className="p-4 bg-[#101216] rounded-md border border-[#2B2F35] my-6">
  <Box className="flex justify-between">
    <Box className="flex">
      <Text
        className="text-xs text-[#8B949E]"
        font-style="normal"
        font-weight="400"
        font-size="12px"
        lineHeight="16px"
        color="#6A737D"
      >
        Gas estimate:{" "}
      </Text>
      <Tooltip
        hasArrow
        placement="bottom-start"
        boxShadow="dark-lg"
        label="all the assets to the market"
        bg="#24292F"
        fontSize={"smaller"}
        fontWeight={"thin"}
        borderRadius={"lg"}
        padding={"2"}
      >
        <Box className="p-1">
          <InfoIcon />
        </Box>
      </Tooltip>
    </Box>
    <Text className="text-xs text-[#6E7681] font-bold">
      $ 10.91
    </Text>
  </Box>
  <Box className="flex justify-between">
    <Box className="flex">
      <Text
        className="text-xs text-[#8B949E]"
        font-style="normal"
        font-weight="400"
        font-size="12px"
        lineHeight="16px"
        color="#6A737D"
      >
        Borrow apr:{" "}
      </Text>
      <Tooltip
        hasArrow
        placement="bottom-start"
        boxShadow="dark-lg"
        label="all the assets to the market"
        bg="#24292F"
        fontSize={"smaller"}
        fontWeight={"thin"}
        borderRadius={"lg"}
        padding={"2"}
      >
        <Box className="p-1">
          <InfoIcon />
        </Box>
      </Tooltip>
    </Box>
    <Text className="text-xs text-[#6E7681] font-bold">5.56%</Text>
  </Box>
  <Box className="flex justify-between">
    <Box className="flex">
      <Text
        className="text-xs text-[#8B949E]"
        font-style="normal"
        font-weight="400"
        font-size="12px"
        lineHeight="16px"
        color="#6A737D"
      >
        Effective apr:{" "}
      </Text>
      <Tooltip
        hasArrow
        placement="bottom-start"
        boxShadow="dark-lg"
        label="all the assets to the market"
        bg="#24292F"
        fontSize={"smaller"}
        fontWeight={"thin"}
        borderRadius={"lg"}
        padding={"2"}
      >
        <Box className="p-1">
          <InfoIcon />
        </Box>
      </Tooltip>
    </Box>
    <Text className="text-xs text-[#6E7681] font-bold">5.56%</Text>
  </Box>
  <Box className="flex justify-between">
    <Box className="flex">
      <Text
        className="text-xs text-[#8B949E]"
        font-style="normal"
        font-weight="400"
        font-size="12px"
        lineHeight="16px"
        color="#6A737D"
      >
        Health factor:{" "}
      </Text>
      <Tooltip
        hasArrow
        placement="bottom-start"
        boxShadow="dark-lg"
        label="all the assets to the market"
        bg="#24292F"
        fontSize={"smaller"}
        fontWeight={"thin"}
        borderRadius={"lg"}
        padding={"2"}
      >
        <Box className="p-1">
          <InfoIcon />
        </Box>
      </Tooltip>
    </Box>
    <Text className="text-xs text-[#6E7681] font-bold">5.56%</Text>
  </Box>
</Box> */
}

{
}

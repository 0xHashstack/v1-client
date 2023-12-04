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
import { getMinimumDepositAmount,getMaximumDepositAmount, getMaximumDynamicLoanAmount } from "@/Blockchain/scripts/Rewards";

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
  selectMinimumDepositAmounts,
  selectMaximumDepositAmounts,
  selectMinimumLoanAmounts,
  selectMaximumLoanAmounts,
  selectFees,
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
import { BNtoNum, parseAmount } from "@/Blockchain/utils/utils";
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
import { getMaximumLoanAmount, getMinimumLoanAmount } from "@/Blockchain/scripts/Rewards";
import BugIcon from "@/assets/icons/bugIcon";
import RedinfoIcon from "@/assets/icons/redinfoicon";
import dollarConvertor from "@/utils/functions/dollarConvertor";
const BorrowModal = ({
  buttonText,
  coin,
  borrowAPRs,
  currentBorrowAPR,
  setCurrentBorrowAPR,
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
    USDT: useBalanceOf(tokenAddressMap["USDT"]),
    USDC: useBalanceOf(tokenAddressMap["USDC"]),
    BTC: useBalanceOf(tokenAddressMap["BTC"]),
    ETH: useBalanceOf(tokenAddressMap["ETH"]),
    DAI: useBalanceOf(tokenAddressMap["DAI"]),
  };
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });


  useEffect(() => {
    ////console.log(
    //   "coin here - ",
    //   coin,
    //   walletBalances[coin?.name]?.statusBalanceOf
    // );
    setwalletBalance(
      walletBalances[coin?.name]?.statusBalanceOf === "success"
        ? parseAmount(
            uint256.uint256ToBN(
              walletBalances[coin?.name]?.dataBalanceOf?.balance
            ),
            tokenDecimalsMap[coin?.name]
          )
        : 0
    );
    ////console.log("supply modal status wallet balance",walletBalances[coin?.name]?.statusBalanceOf)
  }, [walletBalances[coin?.name]?.statusBalanceOf]);
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
    setMarket(coin ? coin?.name : "BTC");
    setRToken(coin ? coin?.name : "rBTC");
    setCollateralMarket(coin ? coin?.name : "BTC");
  }, [coin]);

  const coinIndex: any = [
    { token: "USDT", idx: 0 },
    { token: "USDC", idx: 1 },
    { token: "BTC", idx: 2 },
    { token: "ETH", idx: 3 },
    { token: "DAI", idx: 4 },
  ];

  const [borrowTransHash, setBorrowTransHash] = useState("");
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState("");

  const [isToastDisplayed, setToastDisplayed] = useState(false);
  const [showToast, setShowToast] = useState("true");
  const [toastId, setToastId] = useState<any>();
  const [minimumLoanAmount, setMinimumLoanAmount] = useState<any>(0)
  const [maximumLoanAmount, setMaximumLoanAmount] = useState<any>(0)
  // const recieptData = useWaitForTransaction({
  //   hash: borrowTransHash,
  //   watch: true,
  //   onReceived: () => {
  //    //console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus("success");
  //     toast.dismiss(toastId);
  //    //console.log("trans pending");
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
  //    //console.log("treans rejected");
  //     dispatch(setTransactionStatus("failed"));
  //    //console.log("handle borrow", transaction?.status);
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

  //    //console.log("trans onAcceptedOnL1");
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
  //    //console.log("trans onAcceptedOnL2 - ", transaction);
  //   },
  // });
  let activeTransactions = useSelector(selectActiveTransactions);
  const coinAlign = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const [currentBorrowCoin, setCurrentBorrowCoin] = useState(
    coin ? coin?.name : "BTC"
  );
  const [currentCollateralCoin, setCurrentCollateralCoin] = useState(
    coin ? coin?.name : "BTC"
  );
  const [minimumDepositAmount, setMinimumDepositAmount] = useState<any>(0)
  const [maximumDepositAmount, setmaximumDepositAmount] = useState<any>(0)
  const minAmounts=useSelector(selectMinimumDepositAmounts);
  const maxAmounts=useSelector(selectMaximumDepositAmounts);
  useEffect(()=>{
    setMinimumDepositAmount(minAmounts["r"+currentCollateralCoin])
    setmaximumDepositAmount(maxAmounts["r"+currentCollateralCoin])
  },[currentCollateralCoin,minAmounts,maxAmounts])
  // useEffect(()=>{
  //   const fetchMinDeposit=async()=>{
  //     const data=await getMinimumDepositAmount("r"+currentCollateralCoin)
  //    //console.log("minimum value",data)
  //     setMinimumDepositAmount(data);
  //   }
  //   const fetchMaxDeposit=async()=>{
  //     const data=await getMaximumDepositAmount("r"+currentCollateralCoin);
  //     setmaximumDepositAmount(data);
  //   }
  //   fetchMaxDeposit();

  //   fetchMinDeposit();

  //     // setMinimumDepositAmount(2);

  // },[currentCollateralCoin])
  const [protocolStats, setProtocolStats] = useState<any>([]);
  const protocolStatsRedux = useSelector(selectProtocolStats);
  const [currentAvailableReserves, setCurrentAvailableReserves] = useState(
    protocolStats?.find((stat: any) => stat?.token == currentBorrowCoin)
      ?.availableReserves * 0.895
  );
  const fetchProtocolStats = async () => {
    // const stats = await getProtocolStats();
    const stats = protocolStatsRedux;
    ////console.log("stats in your borrow", stats);

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
      ////console.log("protocolStats", protocolStats);
    } catch (err: any) {
     //console.log("borrow modal : error fetching protocolStats");
    }
  }, [protocolStatsRedux]);
  // useEffect(() => {
  //  //console.log("currentAvailableReserve", currentAvailableReserves);
  // }, [currentAvailableReserves]);
  const oraclePrices = useSelector(selectOraclePrices);
  const marketInfo = useSelector(selectProtocolStats);
  const [uniqueID, setUniqueID] = useState(0);
  const getUniqueId = () => uniqueID;
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
     //console.log(err);
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

  useEffect(() => {
    fetchParsedUSDValueCollateral();
  }, [collateralAmount, currentCollateralCoin, rToken, rTokenAmount]);

  const fees=useSelector(selectFees);

  const fetchParsedUSDValueBorrow = async () => {
    try {
      if (!oraclePrices || oraclePrices?.length === 0) {
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
      ////console.log("got parsed usdt borrow", parsedBorrowAmount);
      setInputBorrowAmountUSD(parsedBorrowAmount);
      ////console.log(
      //   "effective apr values : ",
      //   "loan_usd_value",
      //   parsedBorrowAmount,
      //   "loan_apr",
      //   protocolStats?.find((stat: any) => stat?.token === currentBorrowCoin)
      //     ?.borrowRate,
      //   "collateral_usd_value",
      //   inputCollateralAmountUSD,
      //   "collateral_apr",
      //   protocolStats?.find(
      //     (stat: any) => stat?.token === currentCollateralCoin
      //   )?.supplyRate,
      //   "loan_usd_value",
      //   parsedBorrowAmount
      // );
    } catch (error) {
     //console.log(error);
    }
  };

  const fetchParsedUSDValueCollateral = async () => {
    try {
      if (!oraclePrices || oraclePrices?.length === 0) {
        setInputCollateralAmountUSD(0);
        ////console.log("got parsed zero collateral");

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
        ////console.log(
        //   "got parsed usdt collateral",
        //   parsedBorrowAmount,
        //   " max should be",
        //   5 * parsedBorrowAmount
        // );
        setInputCollateralAmountUSD(parsedBorrowAmount);
      } else if (tokenTypeSelected === "rToken") {
      

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
        ////console.log(
        //   "got parsed usdt collateral",
        //   parsedBorrowAmount,
        //   " max should be",
        //   5 * parsedBorrowAmount
        // );
        setInputCollateralAmountUSD(parsedBorrowAmount);
      }
    } catch (error) {
     //console.log(error);
    }
  };

  useEffect(() => {
    setCurrentAvailableReserves(
      protocolStats[coinAlign?.indexOf(currentBorrowCoin)]?.availableReserves *
        0.895
    );
    ////console.log(coinAlign?.indexOf(currentBorrowCoin));
  }, [protocolStats, currentBorrowCoin]);

  const handleBorrow = async () => {
    try {
      ////console.log("borrowing", amount, market, rToken, rTokenAmount);
      if (currentCollateralCoin[0] === "r") {
        const borrow = await writeAsyncLoanRequestrToken();
        if (borrow?.transaction_hash) {
          // setShowToast("true");
          ////console.log();
          // if (showToast == "true") {
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
          const uqID = getUniqueId();
          const trans_data = {
            transaction_hash: borrow?.transaction_hash.toString(),
            message: `Successfully borrowed : ${inputBorrowAmount} d${currentBorrowCoin}`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
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
        const uqID = getUniqueId();
        let data: any = localStorage.getItem("transactionCheck");
        data = data ? JSON.parse(data) : [];
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus("success"));
        }
      } else {
        const borrow = await writeAsyncLoanRequest();
        if (borrow?.transaction_hash) {
          // setShowToast("true");
          if (showToast == "true") {
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
            const uqID = getUniqueId();
            const trans_data = {
              transaction_hash: borrow?.transaction_hash.toString(),
              message: `Successfully borrowed : ${inputBorrowAmount} d${currentBorrowCoin}`,
              toastId: toastid,
              setCurrentTransactionStatus: setCurrentTransactionStatus,
              uniqueID: uqID,
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
        const uqID = getUniqueId();
        let data: any = localStorage.getItem("transactionCheck");
        data = data ? JSON.parse(data) : [];
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus("success"));
        }
        setBorrowTransHash(borrow?.transaction_hash);
      }
    } catch (err: any) {
      const uqID = getUniqueId();
      let data: any = localStorage.getItem("transactionCheck");
      data = data ? JSON.parse(data) : [];
      if (data && data.includes(uqID)) {
        // dispatch(setTransactionStatus("failed"));
        setTransactionStarted(false);
      }
     //console.log("handle borrow", err);
      mixpanel.track("Borrow Market Status", {
        Status: "Failure",
      });
      const toastContent = (
        <div>
          Transaction declined{" "}
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
    return amount ? numberFormatter(amount.rTokenAmount) : 0;
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

  ////console.log("loadingg", isLoadingLoanRequest);

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
    ////console.log(typeof a,"new val")
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
    if (newValue > 9_000_000_000) return;
    ////console.log(inputCollateralAmountUSD, "amount");
    if (inputCollateralAmountUSD > 0) {
      var percentage =
        (newValue * 100) /
        ((4.9999 * inputCollateralAmountUSD) /
          oraclePrices.find((curr: any) => curr.name === currentBorrowCoin)
            ?.price);
    } else {
      var percentage = (newValue * 100) / currentAvailableReserves;
    }
    percentage = Math.max(0, percentage);
    ////console.log(percentage,"percent")
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
  const minLoanAmounts=useSelector(selectMinimumLoanAmounts);
  const maxLoanAmounts=useSelector(selectMaximumLoanAmounts);
  useEffect(()=>{
    const fecthLoanAmount=async()=>{
      const dynamicdata=await getMaximumDynamicLoanAmount(amount,currentBorrowCoin,currentCollateralCoin[0]=="r" ? currentCollateralCoin.slice(1):currentCollateralCoin );
      if(dynamicdata!=undefined){
        const data=maxLoanAmounts["d"+currentBorrowCoin];
        if(currentBorrowCoin==currentCollateralCoin){
          setMaximumLoanAmount(maxLoanAmounts["d"+currentBorrowCoin])
        }else if(currentCollateralCoin[0]=="r" && currentCollateralCoin.slice(1)==currentBorrowCoin){
          setMaximumLoanAmount(maxLoanAmounts["d"+currentBorrowCoin])
        }
        else{
          setMaximumLoanAmount(Math.min(dynamicdata,data));
        }
      }
    }
    fecthLoanAmount();
    setMinimumLoanAmount(minLoanAmounts["d"+currentBorrowCoin])
  },[currentBorrowCoin,maxLoanAmounts,minLoanAmounts,currentCollateralCoin])
  // useEffect(()=>{
  //   const fetchMinLoanAmount=async()=>{
  //     const data=await getMinimumLoanAmount("d"+currentBorrowCoin);
  //     setMinimumLoanAmount(data);
  //   }
  //   const fetchMaxLoanAmount=async()=>{
  //     const data=await getMaximumLoanAmount("d"+currentBorrowCoin);
  //     setMaximumLoanAmount(data);
  //   }
  //   fetchMaxLoanAmount();
  //   fetchMinLoanAmount();
  // },[currentBorrowCoin])
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
  const resetStates = () => {
    setCurrentCollateralCoin(coin?.name ? coin?.name : "BTC");
    setRToken(coin?.name ? coin?.name : "rBTC");
    setCollateralMarket(coin?.name ? coin.name : "BTC");
    setCurrentBorrowCoin(coin?.name ? coin?.name : "BTC");
    setMarket(coin?.name ? coin?.name : "BTC");
    setAmount(0);
    setRTokenAmount(0);
    setSliderValue(0);
    setsliderValue2(0);
    setToastDisplayed(false);
    setTransactionStarted(false);
    setHealthFactor(undefined);
    setCollateralAmount(0);
    dispatch(resetModalDropdowns());
    dispatch(setTransactionStatus(""));
    setCurrentTransactionStatus("");
    setTokenTypeSelected("Native");
    setBorrowTransHash("");
    setInputCollateralAmountUSD(0);
    setInputBorrowAmountUSD(0);
    setinputBorrowAmount(0);
    setwalletBalance(
      walletBalances[coin?.name]?.statusBalanceOf === "success"
        ? parseAmount(
            uint256.uint256ToBN(
              walletBalances[coin?.name]?.dataBalanceOf?.balance
            ),
            tokenDecimalsMap[coin?.name]
          )
        : 0
    );
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
    setinputBorrowAmount(0);
  }, [currentBorrowCoin]);
  ////console.log(currentCollateralCoin,"collateral coin")
  // useEffect(() => {
  //   setCollateralMarket("DAI");
  //   setCollateralAmount("4000");
  // }, []);
  const [tokenTypeSelected, setTokenTypeSelected] = useState("Native");
  ////console.log(amount < 5 * inputCollateralAmountUSD, typeof collateralAmount, collateralAmount, "amount")
  ////console.log(inputBorrowAmountUSD, inputCollateralAmountUSD, "coins");
  const rTokens: RToken[] = ["rBTC", "rUSDT", "rETH"];
  return (
    <Box>
      <Button
        {...restProps}
        onClick={() => {
          const uqID = Math.random();
          setUniqueID(uqID);
          let data: any = localStorage.getItem("transactionCheck");
          data = data ? JSON.parse(data) : [];
          if (data && !data.includes(uqID)) {
            data.push(uqID);
            localStorage.setItem("transactionCheck", JSON.stringify(data));
          }
          onOpen();
        }}
      >
        {buttonText !== "Click here to borrow" ? (
          buttonText === "Borrow from metrics" ? (
            <Button w="70px" h="32px" fontSize="14px" p="12px" mx="auto">
              Borrow
            </Button>
          ) : (
            buttonText
          )
        ) : (
          <Text fontSize="sm">Click here to borrow</Text>
        )}
      </Button>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

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
        <ModalContent mt="8rem" bg={"#02010F"} maxW="464px">
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
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              p="1rem"
              mt="-1.5"
              borderRadius="md"
              gap="3"
            >
              <Box display="flex" flexDirection="column" gap="1">
                <Box display="flex">
                  <Text fontSize="xs" color="#676D9A">
                    Collateral Market
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="Token held as security for borrowed funds."
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
                    // mt="28px"
                  >
                    <Box p="1">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  display="flex"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
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
                    <Text>{(currentCollateralCoin=="BTC"|| currentCollateralCoin=="ETH")? "w"+currentCollateralCoin:currentCollateralCoin}</Text>
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
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
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
                                  // setCurrentBorrowAPR(
                                  //   coinIndex.find(
                                  //     (curr: any) =>
                                  //       curr?.token === coin.slice(1)
                                  //   )?.idx
                                  // );
                                  // dispatch(setCoinSelectedSupplyModal(coin))
                                }}
                              >
                                {coin === currentCollateralCoin && (
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
                                  pl={`${
                                    coin === currentCollateralCoin ? "1" : "5"
                                  }`}
                                  pr="6px"
                                  gap="1"
                                  justifyContent="space-between"
                                  bg={`${
                                    coin === currentCollateralCoin
                                      ? "#4D59E8"
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
                                    {validRTokens && validRTokens.length > 0 ? (
                                      numberFormatter(amount)
                                    ) : (
                                      <Skeleton
                                        width="3rem"
                                        height="1rem"
                                        startColor="#1E212F"
                                        endColor="#03060B"
                                        borderRadius="6px"
                                        ml={2}
                                      />
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            );
                          }
                        )}
                      {validRTokens && validRTokens.length > 0 && (
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
                      )}
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
                              setTokenTypeSelected("Native");
                              // setCurrentBorrowAPR(
                              //   coinIndex.find(
                              //     (curr: any) => curr?.token === coin
                              //   )?.idx
                              // );
                              // setRToken(coin);
                              setwalletBalance(
                                walletBalances[coin]?.statusBalanceOf ===
                                  "success"
                                  ? parseAmount(
                                      uint256.uint256ToBN(
                                        walletBalances[coin]?.dataBalanceOf
                                          ?.balance
                                      ),
                                      tokenDecimalsMap[coin]
                                    )
                                  : 0
                              );
                            }}
                          >
                            {coin === currentCollateralCoin && (
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
                              pl={`${
                                coin === currentCollateralCoin ? "1" : "5"
                              }`}
                              pr="6px"
                              gap="1"
                              bg={`${
                                coin === currentCollateralCoin
                                  ? "#4D59E8"
                                  : "inherit"
                              }`}
                              borderRadius="md"
                              justifyContent="space-between"
                            >
                              <Box display="flex">
                                <Box p="1">{getCoin(coin)}</Box>
                                <Text color="white">{(coin=="BTC" || coin=="ETH")? "w"+coin:coin}</Text>
                              </Box>
                              <Box
                                fontSize="9px"
                                color="white"
                                mt="6px"
                                fontWeight="thin"
                              >
                                Wallet Balance:{" "}
                                {walletBalances[coin]?.dataBalanceOf
                                  ?.balance ? (
                                  numberFormatter(
                                    parseAmount(
                                      uint256.uint256ToBN(
                                        walletBalances[coin]?.dataBalanceOf
                                          ?.balance
                                      ),
                                      tokenDecimalsMap[coin]
                                    )
                                  )
                                ) : (
                                  <Skeleton
                                    width="3rem"
                                    height="1rem"
                                    startColor="#1E212F"
                                    endColor="#03060B"
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
                  <Text fontSize="xs" color="#676D9A">
                    Collateral Amount
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="The amount of tokens used as security for borrowed funds."
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
                      :(process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&rTokenAmount>0 && (rTokenAmount<minimumDepositAmount||rTokenAmount>
                        maximumDepositAmount))
                      ? "#CF222E"

                      : rTokenAmount == 0
                      ? "white"
                      : "#00D395"
                  }`}
                  border={`${
                    rTokenAmount > walletBalance
                      ? "1px solid #CF222E"
                      : rTokenAmount < 0
                      ? "1px solid #CF222E"
                      :process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&rTokenAmount>0 && (rTokenAmount<minimumDepositAmount||rTokenAmount>
                        maximumDepositAmount)
                      ? "1px solid #CF222E"
                      // DO MAX CHECK 1209
                      : rTokenAmount > 0 && rTokenAmount <= walletBalance
                      ? "1px solid #00D395"
                      : "1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
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
                     placeholder={process.env.NEXT_PUBLIC_NODE_ENV=="testnet"? `0.01536 ${currentCollateralCoin}`:`min ${minimumDepositAmount==null ?0:minimumDepositAmount } ${currentCollateralCoin}`}
                      border="0px"
                      _disabled={{ color: "#00D395" }}
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
                    color={`${
                      rTokenAmount > walletBalance
                        ? "#CF222E"
                        : rTokenAmount < 0
                        ? "#CF222E"
                        :process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&rTokenAmount>0 && (rTokenAmount<minimumDepositAmount||rTokenAmount>maximumDepositAmount)
                        ? "#CF222E"

                        : rTokenAmount == 0
                        ? "#4D59E8"
                        : "#00D395"
                    }`}
                    _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
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
                {rTokenAmount > walletBalance || rTokenAmount < 0 || (rTokenAmount>0 && process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&(rTokenAmount<minimumDepositAmount||rTokenAmount>maximumDepositAmount))? (
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
                          :process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&rTokenAmount <minimumDepositAmount 
                          ? `less than min amount`
                          :process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&rTokenAmount>maximumDepositAmount
                          ?'more than max amount'
                          : "Invalid"}
                      </Text>
                    </Text>
                    <Text
                      color="#C7CBF6"
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
                    color="#C7CBF6"
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
                      if (val == 100) {
                        setCollateralAmount(walletBalance);
                        setRTokenAmount(walletBalance);
                      } else {
                        var ans = (val * walletBalance) / 100;
                        if(ans<10){
                          dispatch(setInputBorrowModalCollateralAmount(ans));
                          // setRTokenAmount(ans);
                          // setAmount(ans);
                          setCollateralAmount(parseFloat(ans.toFixed(7)));
                          setRTokenAmount(parseFloat(ans.toFixed(7)));
                        }else{
                          ans = Math.round(ans * 100) / 100;
                          dispatch(setInputBorrowModalCollateralAmount(ans));
                          // setRTokenAmount(ans);
                          // setAmount(ans);
                          setCollateralAmount(ans);
                          setRTokenAmount(ans);
                        }

                      }
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
                    <SliderTrack bg="#3E415C">
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
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              p="1rem"
              my="4"
              borderRadius="md"
              gap="3"
            >
              <Box display="flex" flexDirection="column" gap="1">
                <Box display="flex">
                  <Text fontSize="xs" color="#676D9A">
                    Borrow Market
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="The token borrowed from the protocol."
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
                    // mt="12px"
                  >
                    <Box p="1">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  display="flex"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
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
                    <Text>{(currentBorrowCoin=="BTC"|| currentBorrowCoin=="ETH" ?"w"+currentBorrowCoin:currentBorrowCoin)}</Text>
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
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      py="2"
                      className="dropdown-container"
                      boxShadow="dark-lg"
                    >
                      {coins?.map((coin: string, index: number) => {
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
                                protocolStats?.[index]?.availableReserves *
                                  0.895
                              );
                              // setMarket(coin);
                              setMarket(coin);
                              setCurrentBorrowAPR(
                                coinIndex.find(
                                  (curr: any) => curr?.token === coin
                                )?.idx
                              );
                            }}
                          >
                            {coin === currentBorrowCoin && (
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
                              pl={`${coin === currentBorrowCoin ? "1" : "5"}`}
                              pr="6px"
                              gap="1"
                              bg={`${
                                coin === currentBorrowCoin
                                  ? "#4D59E8"
                                  : "inherit"
                              }`}
                              borderRadius="md"
                              justifyContent="space-between"
                            >
                              <Box display="flex">
                                <Box p="1">{getCoin(coin)}</Box>
                                <Text color="white">{(coin=="BTC" || coin=="ETH")? "w"+coin:coin}</Text>
                              </Box>
                              <Box
                                fontSize="9px"
                                color="white"
                                mt="6px"
                                fontWeight="thin"
                                display="flex"
                              >
                                Available reserves:{" "}
                                {(protocolStats?.[index]?.availableReserves &&
                                  numberFormatter(
                                    protocolStats?.[index]?.availableReserves *
                                      0.895
                                  )) || (
                                  <Skeleton
                                    width="3rem"
                                    height="1rem"
                                    startColor="#1E212F"
                                    endColor="#03060B"
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
                  <Text fontSize="xs" color="#676D9A">
                    Borrow Amount
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="The quantity of tokens you want to borrow from the protocol."
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
                    inputBorrowAmountUSD > 4.9999 * inputCollateralAmountUSD
                      ? "1px solid #CF222E"
                      : inputBorrowAmountUSD < 0 ||
                        inputBorrowAmount > currentAvailableReserves
                      ? "1px solid #CF222E"
                      :process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&inputBorrowAmount>0 && inputBorrowAmount<minimumLoanAmount
                      ?"1px solid #CF222E"
                      : process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&inputBorrowAmount>maximumLoanAmount 
                      ?"1px solid #CF222E"
                      : isNaN(amount)
                      ? "1px solid #CF222E"
 
                      : amount > 0
                      ? "1px solid #00D395"
                      : "1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) "
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
                                          placeholder={process.env.NEXT_PUBLIC_NODE_ENV=="testnet"? `0.01536 ${currentBorrowCoin}`:`min ${minimumLoanAmount==null ?0:minimumLoanAmount} ${currentBorrowCoin}`}

                      color={`${
                        inputCollateralAmountUSD &&
                        inputBorrowAmountUSD > 4.9999 * inputCollateralAmountUSD
                          ? "#CF222E"
                          : isNaN(amount)
                          ? "#CF222E":
                          process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&& inputBorrowAmount>0 && inputBorrowAmount<minimumLoanAmount
                          ?"#CF222E"
                          : process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&inputBorrowAmount>maximumLoanAmount
                          ? "#CF222E"
                          : inputBorrowAmount < 0 ||
                            inputBorrowAmount > currentAvailableReserves
                          ? "#CF222E"
                          :amount>0
                          ?"#00D395"

                          : inputBorrowAmountUSD == 0
                          ? "white"
                          : "#00D395"
                      }`}
                      border="0px"
                      _placeholder={{
                        color: "#393D4F",
                        fontSize: ".89rem",
                        fontWeight: "600",
                        outline: "0",
                      }}
                      _disabled={{ color: "#00D395" }}
                      _focus={{
                        outline: "0",
                        boxShadow: "none",
                      }}
                    />
                  </NumberInput>
                  <Button
                    variant="ghost"
                    color={`${
                      inputCollateralAmountUSD &&
                      inputBorrowAmountUSD > 4.9999 * inputCollateralAmountUSD
                        ? "#CF222E"
                        : isNaN(amount)
                        ? "#CF222E":
                        process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&inputBorrowAmount>0 && inputBorrowAmount<minimumLoanAmount
                      ?"#CF222E"
                      :process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&inputBorrowAmount>maximumLoanAmount ?
                      "#CF222E"
                        : inputBorrowAmount < 0 ||
                          inputBorrowAmount > currentAvailableReserves
                        ? "#CF222E"
                        : inputBorrowAmountUSD == 0
                        ? "#4D59E8"
                        : "#00D395"
                    }`}
                    _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
                    onClick={() => {
                      if (inputCollateralAmountUSD > 0) {
                        if (
                          (4.9999 * inputCollateralAmountUSD) /
                            oraclePrices.find(
                              (curr: any) => curr.name === currentBorrowCoin
                            )?.price >
                          currentAvailableReserves
                        ) {
                          setAmount(currentAvailableReserves);
                          setsliderValue2(100);
                          setinputBorrowAmount(currentAvailableReserves);
                        } else {
                          setAmount(
                            (4.9999 * inputCollateralAmountUSD) /
                              oraclePrices.find(
                                (curr: any) => curr.name === currentBorrowCoin
                              )?.price
                          );
                          setinputBorrowAmount(
                            (4.9999 * inputCollateralAmountUSD) /
                              oraclePrices.find(
                                (curr: any) => curr.name === currentBorrowCoin
                              )?.price
                          );
                          setsliderValue2(100);
                        }
                      } else {
                        setAmount(currentAvailableReserves);
                        setinputBorrowAmount(currentAvailableReserves);
                        setsliderValue2(100);
                      }
                      // 1BTC == 30,000USD
                      // 10USD == 5*10*1/30,000
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
                (process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&inputBorrowAmount>0 && (inputBorrowAmount<minimumLoanAmount||
                inputBorrowAmount>maximumLoanAmount) )||
                (amount > 0 &&
                  inputCollateralAmountUSD &&
                  inputBorrowAmountUSD > 4.9999 * inputCollateralAmountUSD) ? (
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
                          :process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&inputBorrowAmount<minimumLoanAmount ?
                          "Less than min Amount"
                          :process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"&&inputBorrowAmount>maximumLoanAmount?
                          "More than max Amount"
                          : inputBorrowAmountUSD >
                            4.9999 * inputCollateralAmountUSD
                          ? "Debt higher than permitted"
                          : ""}
                      </Text>
                    </Text>
                    <Box
                      color="#C7CBF6"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      Available reserves:{" "}
                      {availableReserves==null ? (
                         <Skeleton
                         width="4rem"
                         height=".85rem"
                         startColor="#2B2F35"
                         endColor="#101216"
                         borderRadius="4px"
                         m={1}
                       />
                      ) : (
                        numberFormatter(currentAvailableReserves)
                       
                      )}
                      <Text color="#6E7781" ml="0.2rem">
                        {` ${currentBorrowCoin}`}
                      </Text>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    color="#C7CBF6"
                    display="flex"
                    justifyContent="flex-end"
                    mt="0.2rem"
                    fontSize="12px"
                    fontWeight="500"
                    fontStyle="normal"
                    fontFamily="Inter"
                  >
                    Available reserves:{" "}
                    {availableReserves==null ? (
                       <Skeleton
                       width="4rem"
                       height=".85rem"
                       startColor="#2B2F35"
                       endColor="#101216"
                       borderRadius="4px"
                       m={1}
                     />
                    ) : (
                      numberFormatter(currentAvailableReserves)
                     
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
                      if (inputCollateralAmountUSD > 0) {
                        var ans =
                          (val / 100) *
                          ((4.9999 * inputCollateralAmountUSD) /
                            oraclePrices.find(
                              (curr: any) => curr.name === currentBorrowCoin
                            )?.price);
                      } else {
                        var ans = (val / 100) * currentAvailableReserves;
                      }
                      if (val == 100) {
                        if (inputCollateralAmountUSD > 0) {
                          setAmount(
                            (4.9999 * inputCollateralAmountUSD) /
                              oraclePrices.find(
                                (curr: any) => curr.name === currentBorrowCoin
                              )?.price
                          );
                          setinputBorrowAmount(
                            (4.9999 * inputCollateralAmountUSD) /
                              oraclePrices.find(
                                (curr: any) => curr.name === currentBorrowCoin
                              )?.price
                          );
                        } else {
                          setAmount(currentAvailableReserves);
                          setinputBorrowAmount(currentAvailableReserves);
                        }
                      } else {
                        if(ans<10){
                          dispatch(setInputBorrowModalBorrowAmount(ans));
                          setAmount(parseFloat(ans.toFixed(7)));
                          setinputBorrowAmount(parseFloat(ans.toFixed(7)));
                        }else{
                          ans = Math.round(ans * 100) / 100;
                          dispatch(setInputBorrowModalBorrowAmount(ans));
                          setAmount(ans);
                          setinputBorrowAmount(ans);
                        }
                      }
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
                    <SliderTrack bg="#3E415C">
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

            <Card               background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))" mt="1.5rem" p="1rem" >
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
                    color="#676D9A"
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
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Text
                  font-style="normal"
                  font-weight="400"
                  font-size="14px"
                  color="#676D9A"
                >
                  {fees?.borrow}%
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
                    color="#676D9A"
                  >
                    Borrow apr:
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
                    maxW="256px"
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
                  font-family="Avenir"
                  color="#676D9A"
                >
                  {!borrowAPRs || borrowAPRs[currentBorrowAPR]==null ? (
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
                    `${borrowAPRs[currentBorrowAPR]}%`
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
                      color="#676D9A"
                    >
                      Effective apr:
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="right"
                      boxShadow="dark-lg"
                      label="Annualized interest rate including fees and charges, reflecting total borrowing cost."
                      bg="#02010F"
                      fontSize={"13px"}
                      fontWeight={"400"}
                      borderRadius={"lg"}
                      padding={"2"}
                      color="#F0F0F5"
                      border="1px solid"
                      borderColor="#23233D"
                      arrowShadowColor="#2B2F35"
                      maxW="300px"
                      mt="12px"
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
                    color="#676D9A"
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
                                (stat: any) => stat?.token === currentBorrowCoin
                              )?.borrowRate -
                              inputCollateralAmountUSD *
                                protocolStats?.find(
                                  (stat: any) =>
                                    stat?.token === currentCollateralCoin
                                )?.supplyRate) /
                              inputBorrowAmountUSD
                          ).toFixed(2)}%
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
                        {(
                          (inputBorrowAmountUSD *
                            protocolStats?.find(
                              (stat: any) => stat?.token === currentBorrowCoin
                            )?.borrowRate -
                            inputCollateralAmountUSD *
                              protocolStats?.find(
                                (stat: any) => stat?.token === rToken.slice(1)
                              )?.supplyRate) /
                          inputBorrowAmountUSD
                        ).toFixed(2)}%
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
                      color="#676D9A"
                    >
                      Health Factor:
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="right"
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
                      maxW="300px"
                      mt="12px"
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
                    color="#676D9A"
                  >
                    {healthFactor?.toFixed(2)}
                  </Text>
                </Text>
              ) : (
                ""
              )}
            </Card>

            {currentCollateralCoin &&
              currentCollateralCoin[0] !== "r" &&
              protocolStatsRedux && (
                <Box
                  // display="flex"
                  // justifyContent="left"
                  w="100%"
                  // pb="4"
                  height="64px"
                  display="flex"
                  alignItems="center"
                  mt="2rem"
                  // mb="1rem"
                >
                  <Box
                    display="flex"
                    bg={dollarConvertor(maximumLoanAmount,currentBorrowCoin,oraclePrices)<100 ?"#480C10":"#222766"} 
                    color="#F0F0F5"
                    fontSize="12px"
                    p="4"
                    border={dollarConvertor(maximumLoanAmount,currentBorrowCoin,oraclePrices)<100 ?"1px solid #9B1A23":"1px solid #3841AA"}
                    fontStyle="normal"
                    fontWeight="400"
                    lineHeight="18px"
                    borderRadius="6px"
                    // textAlign="center"
                  >
                    <Box pr="3" mt="0.5" cursor="pointer">
                      {dollarConvertor(maximumLoanAmount,currentBorrowCoin,oraclePrices)<100 ?<RedinfoIcon/>:<BlueInfoIcon />}
                    </Box>
                    {dollarConvertor(maximumLoanAmount,currentBorrowCoin,oraclePrices)<100 ?
                  `The current collateral and borrowing market combination isn't allowed at this moment.`:  
                    `You have selected a native token as collateral which will be
                    converted to rtokens 1r${currentCollateralCoin} =
                    ${(protocolStatsRedux.find(
                      (val: any) => val?.token == currentCollateralCoin.split(1)
                    )?.exchangeRateRtokenToUnderlying
                      ? numberFormatter(
                          protocolStatsRedux.find(
                            (val: any) =>
                              val?.token == currentCollateralCoin.split(1)
                          )?.exchangeRateRtokenToUnderlying
                        )
                      : "") + currentCollateralCoin?.split(1)}`
                  }
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
            amount > 0 &&
           (process.env.NEXT_PUBLIC_NODE_ENV=="mainnet"?( inputBorrowAmount>=minimumLoanAmount &&
            inputBorrowAmount<=maximumLoanAmount ):true)&&
            rTokenAmount <= walletBalance &&
            // rTokenAmount<
            (rTokenAmount>0 && (process.env.NEXT_PUBLIC_NODE_ENV=="mainnet" &&tokenTypeSelected == "Native" ?(rTokenAmount>=minimumDepositAmount && rTokenAmount<=maximumDepositAmount):true)) &&
            // do max 1209
            inputBorrowAmount <= currentAvailableReserves &&
            inputBorrowAmountUSD <= 4.9999 * inputCollateralAmountUSD ? (
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
 border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
 background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                    // bgColor="red"
                    // p={0}
                    color="#8B949E"
                    size="sm"
                    width="100%"
                    mt="1.5rem"
                    mb="1.5rem"
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
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                color="#6E7681"
                size="sm"
                width="100%"
                mt="1.5rem"
                mb="1.5rem"
                _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
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

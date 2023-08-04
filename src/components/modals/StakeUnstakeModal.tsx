import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Tooltip,
  Box,
  Text,
  Card,
  NumberInput,
  NumberInputField,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  TabList,
  Tab,
  TabPanel,
  Tabs,
  TabPanels,
  Checkbox,
  useToast,
  Skeleton,
} from "@chakra-ui/react";

import hoverStake from "../../assets/images/hoverStakeIcon.svg";

/* Coins logo import  */
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import DropdownUp from "../../assets/icons/dropdownUpIcon";
import InfoIcon from "../../assets/icons/infoIcon";
import { useDispatch, useSelector } from "react-redux";

import {
  setModalDropdown,
  selectModalDropDowns,
  resetModalDropdowns,
} from "@/store/slices/dropdownsSlice";
import { useEffect, useState } from "react";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import EthToUsdt from "@/assets/icons/pools/ethToUsdt";
import MySwapDisabled from "@/assets/icons/dapps/mySwapDisabled";
import UsdcToUsdt from "@/assets/icons/pools/usdcToUsdt";
import EthToUsdc from "@/assets/icons/pools/ethToUsdc";
import DaiToEth from "@/assets/icons/pools/daiToEth";
import BtcToEth from "@/assets/icons/pools/btcToEth";
import BtcToUsdt from "@/assets/icons/pools/btcToUsdt";
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import useStakeRequest from "@/Blockchain/hooks/Writes/useStakerequest";
import useWithdrawStake from "@/Blockchain/hooks/Writes/useWithdrawStake";
import {
  selectActiveTransactions,
  selectTransactionCheck,
  selectWalletBalance,
  setActiveTransactions,
  setTransactionStartedAndModalClosed,
  setTransactionStatus,
} from "@/store/slices/userAccountSlice";
import {
  selectProtocolStats,
  selectStakingShares,
  selectUserDeposits,
} from "@/store/slices/readDataSlice";
import SmallErrorIcon from "@/assets/icons/smallErrorIcon";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import WarningIcon from "@/assets/icons/coins/warningIcon";
import ArrowUp from "@/assets/icons/arrowup";
import SliderPointer from "@/assets/icons/sliderPointer";
import SliderPointerWhite from "@/assets/icons/sliderPointerWhite";
import { useAccount, useWaitForTransaction } from "@starknet-react/core";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
import { NativeToken, RToken } from "@/Blockchain/interfaces/interfaces";
import { useRouter } from "next/router";
import Image from "next/image";
import { BNtoNum, parseAmount } from "@/Blockchain/utils/utils";
import TransactionFees from "../../../TransactionFees.json";
import mixpanel from "mixpanel-browser";
import {
  getEstrTokens,
  getUserStakingShares,
} from "@/Blockchain/scripts/Rewards";
import numberFormatter from "@/utils/functions/numberFormatter";
import { uint256 } from "starknet";
import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { tokenDecimalsMap } from "@/Blockchain/utils/addressServices";
import useDeposit from "@/Blockchain/hooks/Writes/useDeposit";
// import userTokensMinted from "@/Blockchain/scripts/Rewards";
// import { getEstrTokens } from "@/Blockchain/scripts/Rewards";

const StakeUnstakeModal = ({
  buttonText,
  coin,
  nav,
  stakeHover,
  setStakeHover,
  validRTokens,
  ...restProps
}: any) => {
  // console.log(validRTokens, "tokens stake modal");
  // console.log("coin - ", coin);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [sliderValue, setSliderValue] = useState(0);
  const modalDropdowns = useSelector(selectModalDropDowns);
  const [sliderValue2, setSliderValue2] = useState(0);
  const [inputStakeAmount, setInputStakeAmount] = useState<number>(0);
  const [inputUnstakeAmount, setInputUnstakeAmount] = useState(0);
  const [isSupplyTap, setIsSupplyTap] = useState(false);
  const [transactionStarted, setTransactionStarted] = useState(false);
  const { address } = useAccount();
  const [unstakeTransactionStarted, setUnstakeTransactionStarted] =
    useState(false);
  // const [stakingShares, setStakingShares] = useState<any>({
  //   rBTC: null,
  //   rETH: null,
  //   rUSDT: null,
  //   rUSDC: null,
  //   rDAI: null,
  // });
  let protocolStats = useSelector(selectProtocolStats);
  let activeTransactions = useSelector(selectActiveTransactions);
  let stakingShares = useSelector(selectStakingShares);
  // console.log(stakingShares,"staking shares")

  const [uniqueID, setUniqueID] = useState(0);
  const getUniqueId = () => uniqueID;

  const {
    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount,
    dataStakeRequest,
    errorStakeRequest,
    resetStakeRequest,
    writeStakeRequest,
    writeAsyncStakeRequest,
    isErrorStakeRequest,
    isIdleStakeRequest,
    isLoadingStakeRequest,
    isSuccessStakeRequest,
    statusStakeRequest,
  } = useStakeRequest();

  // const {
  //   rToken1,
  //   setRToken1,
  //   rTokenAmount1,
  //   setRTokenAmount1,
  //   dataStakeRequest1,
  //   errorStakeRequest1,
  //   resetStakeRequest1,
  //   writeStakeRequest1,
  //   writeAsyncStakeRequest1,
  //   isErrorStakeRequest1,
  //   isIdleStakeRequest1,
  //   isLoadingStakeRequest1,
  //   isSuccessStakeRequest1,
  //   statusStakeRequest1,
  // }=userTokensMinted();
  const {
    depositAmount,
    setDepositAmount,
    asset,
    setAsset,
    dataDeposit,
    errorDeposit,
    resetDeposit,
    // depositTransHash,
    // setDepositTransHash,
    writeAsyncDeposit,
    writeAsyncDepositStake,

    isErrorDeposit,
    isIdleDeposit,
    isLoadingDeposit,
    isSuccessDeposit,
    statusDeposit,
  } = useDeposit();
  const {
    unstakeRToken,
    setUnstakeRToken,
    rTokenToWithdraw,
    setRTokenToWithdraw,
    dataWithdrawStake,
    errorWithdrawStake,
    resetWithdrawStake,
    writeWithdrawStake,
    writeAsyncWithdrawStake,
    isErrorWithdrawStake,
    isIdleWithdrawStake,
    isLoadingWithdrawStake,
    isSuccessWithdrawStake,
    statusWithdrawStake,
  } = useWithdrawStake();

  const getCoin = (CoinName: string) => {
    switch (CoinName) {
      case "BTC":
        return <BTCLogo height={"16px"} width={"16px"} />;
        break;
      case "USDC":
        return <USDCLogo height={"16px"} width={"16px"} />;
        break;
      case "USDT":
        return <USDTLogo height={"16px"} width={"16px"} />;
        break;
      case "ETH":
        return <ETHLogo height={"16px"} width={"16px"} />;
        break;
      case "DAI":
        return <DAILogo height={"16px"} width={"16px"} />;
        break;
      case "rBTC":
        return <BTCLogo height={"16px"} width={"16px"} />;
        break;
      case "rUSDC":
        return <USDCLogo height={"16px"} width={"16px"} />;
        break;
      case "rUSDT":
        return <USDTLogo height={"16px"} width={"16px"} />;
        break;
      case "rETH":
        return <ETHLogo height={"16px"} width={"16px"} />;
        break;
      case "rDAI":
        return <DAILogo height={"16px"} width={"16px"} />;
        break;
      case "Jediswap":
        return <JediswapLogo />;
        break;
      case "mySwap":
        return <MySwapDisabled />;
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
        break;
      default:
        break;
    }
  };
  // console.log(validRTokens, "valid");
  const getBalance = (coin: string) => {
    const amount = validRTokens?.find(({ rToken, rTokenAmount }: any) => {
      if (rToken == coin) return rTokenAmount;
    });
    return amount ? amount.rTokenAmount : 0;
  };
  // console.log(getBalance,"bal")
  const [depositTransHash, setDepositTransHash] = useState("");
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState("");

  const [toastId, setToastId] = useState<any>();
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });

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
  //     if (isToastDisplayed == false) {
  //       toast.success(
  //         `You have successfully staked ${inputStakeAmount} ${currentSelectedStakeCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
  //       setToastDisplayed(true);
  //     }
  //   },
  //   onRejected(transaction) {
  //     toast.dismiss(toastId);
  //     setCurrentTransactionStatus("failed");
  //     dispatch(setTransactionStatus("failed"));
  //     console.log("treans rejected");
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus("success");
  //     console.log("trans onAcceptedOnL1");
  //   },
  //   onAcceptedOnL2(transaction) {
  //     setCurrentTransactionStatus("success");
  //     console.log("trans onAcceptedOnL2 - ", transaction);
  //     if (isToastDisplayed == false) {
  //       toast.success(
  //         `You have successfully staked ${inputStakeAmount} ${currentSelectedStakeCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
  //       setToastDisplayed(true);
  //     }
  //   },
  // });
  useEffect(() => {
    if (coin) {
      setAsset(coin ? coin?.name : "BTC");
    }
  }, [coin]);

  // useEffect(() => {
  //   try {
  //     const getStakingShares = async () => {
  //       if (!address) return;
  //       const promises = [
  //         getUserStakingShares(address, "rBTC"),
  //         getUserStakingShares(address, "rETH"),
  //         getUserStakingShares(address, "rUSDT"),
  //         getUserStakingShares(address, "rUSDC"),
  //         getUserStakingShares(address, "rDAI"),
  //       ];
  //       Promise.allSettled([...promises]).then((val) => {
  //         const data = {
  //           rBTC: val?.[0]?.status == "fulfilled" ? val?.[0]?.value : null,
  //           rETH: val?.[1]?.status == "fulfilled" ? val?.[1]?.value : null,
  //           rUSDT: val?.[2]?.status == "fulfilled" ? val?.[2]?.value : null,
  //           rUSDC: val?.[3]?.status == "fulfilled" ? val?.[3]?.value : null,
  //           rDAI: val?.[4]?.status == "fulfilled" ? val?.[4]?.value : null,
  //         };
  //         console.log("shares ", val, data);
  //         setStakingShares(data);
  //       });
  //       const data = await getUserStakingShares(address, "rUSDT");
  //       if (data != null) {
  //         setStakingShares(data);
  //       }
  //     };
  //     getStakingShares();
  //   } catch (err) {
  //     console.log("getStakingShares error ", err);
  //   }
  // }, [address]);

  const handleStakeTransaction = async () => {
    try {
      // console.log("staking", rToken, rTokenAmount);
      mixpanel.track("Action Selected", {
        Actions: "Stake",
      });
      const stake = await writeAsyncStakeRequest();
      setDepositTransHash(stake?.transaction_hash);
      if (stake?.transaction_hash) {
        console.log("toast here");
        const toastid = toast.info(
          // `Please wait your transaction is running in background :  ${inputStakeAmount} ${currentSelectedStakeCoin} `,
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
          transaction_hash: stake?.transaction_hash.toString(),
          message: `Successfully staked : ${inputStakeAmount} ${currentSelectedStakeCoin}`,
          // message: `Transaction successful`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
          uniqueID: uqID,
        };
        // addTransaction({ hash: deposit?.transaction_hash });
        activeTransactions?.push(trans_data);
        mixpanel.track("Stake Modal Market Page Status", {
          Status: "Success",
          Token: currentSelectedStakeCoin,
          TokenAmount: inputStakeAmount,
        });

        dispatch(setActiveTransactions(activeTransactions));
      }
      // if (recieptData?.data?.status == "ACCEPTED_ON_L2") {
      // }
      const uqID = getUniqueId();
      let data: any = localStorage.getItem("transactionCheck");
      data = data ? JSON.parse(data) : [];
      if (data && data.includes(uqID)) {
        dispatch(setTransactionStatus("success"));
      }
      // console.log(
      //   "Staking Modal-stake transaction check",
      //   recieptData?.data?.status == "ACCEPTED_ON_L2"
      // );
    } catch (err: any) {
      const uqID = getUniqueId();
      let data: any = localStorage.getItem("transactionCheck");
      data = data ? JSON.parse(data) : [];
      if (data && data.includes(uqID)) {
        // dispatch(setTransactionStatus("failed"));
        setTransactionStarted(false);
      }
      console.log(uqID, "transaction check stake transaction failed : ", err);
      const toastContent = (
        <div>
          Transaction declined{" "}
          <CopyToClipboard text={err}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      );
      mixpanel.track("Stake Modal Market Page Status", {
        Status: "Failure",
      });
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
    }
  };
  const hanldeStakeAndSupplyTransaction = async () => {
    try {
      mixpanel.track("Action Selected", {
        Action: "Deposit and Stake",
      });
      const depositStake = await writeAsyncDepositStake();
      if (depositStake?.transaction_hash) {
        console.log("trans transaction hash created");
        console.log("toast here");
        const toastid = toast.info(
          // `Please wait your transaction is running in background : supply and staking - ${inputAmount} ${currentSelectedCoin} `,
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
          transaction_hash: depositStake?.transaction_hash.toString(),
          message: `Successfully staked ${inputStakeAmount} ${currentSelectedStakeCoin}`,
          // message: `Transaction successful`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
          uniqueID: uqID,
        };
        // addTransaction({ hash: deposit?.transaction_hash });
        activeTransactions?.push(trans_data);

        dispatch(setActiveTransactions(activeTransactions));
      }
      mixpanel.track("Supply Market Status", {
        Status: "Success Deposit and Stake",
        Token: currentSelectedStakeCoin,
        TokenAmount: inputStakeAmount,
      });
      setDepositTransHash(depositStake?.transaction_hash);
      const uqID = getUniqueId();
      let data: any = localStorage.getItem("transactionCheck");
      data = data ? JSON.parse(data) : [];
      if (data && data.includes(uqID)) {
        dispatch(setTransactionStatus("success"));
      }
      // console.log("Status transaction", deposit);
      console.log(isSuccessDeposit, "success ?");
    } catch (err: any) {
      mixpanel.track("Stake Market Status", {
        Status: "Failure",
      });
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
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
      console.log("stake and supply", err);
    }
  };

  // const hanldest=async()=>{
  //   try{
  //     const data=await writeAsyncStakeRequest1();
  //     console.log(data,"data in est rtokens");
  //   }catch(err){
  //     console.log(err,"err in stakunstake");

  //   }
  // }
  // useEffect(()=>{
  //   hanldest();
  // },[])
  // console.log(rTokenAmount,"rtoken amount")
  const hanldeUnstakeTransaction = async () => {
    try {
      const unstake = await writeAsyncWithdrawStake();
      setDepositTransHash(unstake?.transaction_hash);
      if (unstake?.transaction_hash) {
        console.log("toast here");
        const toastid = toast.info(
          // `Please wait your transaction is running in background : ${inputStakeAmount} ${currentSelectedStakeCoin} `,
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
          transaction_hash: unstake?.transaction_hash.toString(),
          message: `Successfully unstaked : ${rTokenToWithdraw} ${currentSelectedUnstakeCoin}`,
          // message: `Transaction successful`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
          uniqueID: uqID,
        };
        // addTransaction({ hash: deposit?.transaction_hash });
        activeTransactions?.push(trans_data);
        mixpanel.track("Unstake Modal Market Page Status", {
          Status: "Success",
          Token: currentSelectedUnstakeCoin,
          TokenAmount: rTokenAmount,
        });

        dispatch(setActiveTransactions(activeTransactions));
      }
      const uqID = getUniqueId();
      let data: any = localStorage.getItem("transactionCheck");
      data = data ? JSON.parse(data) : [];
      if (data && data.includes(uqID)) {
        dispatch(setTransactionStatus("success"));
      }
      console.log(unstake);
    } catch (err: any) {
      const uqID = getUniqueId();
      let data: any = localStorage.getItem("transactionCheck");
      data = data ? JSON.parse(data) : [];
      if (data && data.includes(uqID)) {
        // dispatch(setTransactionStatus("failed"));
        setUnstakeTransactionStarted(false);
      }
      console.log("Unstake transaction failed : ", err);
      const toastContent = (
        <div>
          Transaction declined{" "}
          <CopyToClipboard text={err}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      );
      mixpanel.track("Unstake Modal Market Page Status", {
        Status: "Failure",
      });
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
    }
  };

  const handleChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return;
    if (rtokenWalletBalance != 0) {
      var balance = Number(getBalance(currentSelectedStakeCoin));
      var percentage = (newValue * 100) / balance;
    } else {
      var percentage = (newValue * 100) / walletBalance;
    }
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setRTokenAmount(newValue);
      setInputStakeAmount(newValue);
      setDepositAmount(newValue);
      // dispatch(setInputSupplyAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage);
        setRTokenAmount(newValue);
        setInputStakeAmount(newValue);
        setDepositAmount(newValue);
      }
      // console.log(typeof rTokenAmount)
      // dispatch(setInputSupplyAmount(newValue));
    }
  };
  const handleUnstakeChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return;

    var percentage = (newValue * 100) / unstakeWalletBalance;
    if (percentage == 100) {
      setSliderValue2(100);
      setInputUnstakeAmount(unstakeWalletBalance);
      setRTokenToWithdraw(unstakeWalletBalance);
    } else {
      percentage = Math.max(0, percentage);
      if (unstakeWalletBalance == 0) {
        setSliderValue2(0);
        setInputUnstakeAmount(0);
        setRTokenToWithdraw(0);
      }
      if (percentage > 100) {
        setSliderValue2(100);
        setRTokenToWithdraw(newValue);
        // dispatch(setInputSupplyAmount(newValue));
      } else {
        percentage = Math.round(percentage);
        if (isNaN(percentage)) {
        } else {
          setSliderValue2(percentage);
          setRTokenToWithdraw(newValue);
        }
        // dispatch(setInputSupplyAmount(newValue));
      }
    }
  };
  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setModalDropdown(dropdownName));
  };
  const coins = [
    { BTC: "rBTC" },
    { USDT: "rUSDT" },
    { USDC: "rUSDC" },
    { ETH: "rETH" },
    { DAI: "rDAI" },
  ];
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
  const assetBalance: assetB | any = {
    USDT: useBalanceOf(tokenAddressMap["USDT"]),
    USDC: useBalanceOf(tokenAddressMap["USDC"]),
    BTC: useBalanceOf(tokenAddressMap["BTC"]),
    ETH: useBalanceOf(tokenAddressMap["ETH"]),
    DAI: useBalanceOf(tokenAddressMap["DAI"]),
  };

  const coinsSupplied: any = {
    rBTC: true,
    rUSDT: true,
    rUSDC: true,
    rETH: true,
    rDAI: true,
  };

  const isValid = (coin: string) => {
    if (validRTokens && validRTokens.length > 0) {
      return validRTokens.find(({ rToken }: any) => rToken === coin);
    }
    return false;
  };

  const rcoins: RToken[] = ["rBTC", "rUSDT", "rUSDC", "rETH", "rDAI"];
  const coinObj: any = coins?.find((obj) => coin?.name in obj);
  const rcoinValue = coinObj ? coinObj[coin.name] : "rUSDT";
  const [isSupplied, setIsSupplied] = useState(false);
  const [currentSelectedSupplyCoin, setCurrentSelectedSupplyCoin] =
    useState("BTC");
  const [currentSelectedStakeCoin, setCurrentSelectedStakeCoin] = useState(
    !nav ? rcoinValue : "rUSDT"
  );
  const [currentSelectedUnstakeCoin, setcurrentSelectedUnstakeCoin] = useState(
    !nav ? rcoinValue : "rUSDT"
  );
  const userDeposit = useSelector(selectUserDeposits);
  // console.log(coin,"coin stake")
  const [walletBalance, setWalletBalance] = useState(
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
    setWalletBalance(
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
  }, [walletBalances[coin?.name]?.statusBalanceOf, coin]);
  const [rtokenWalletBalance, setrTokenWalletBalance] = useState(
    userDeposit?.find((item: any) => item.rToken == currentSelectedStakeCoin)
      ?.rTokenFreeParsed
  );
  // console.log(rtokenWalletBalance,"rtoken wallet ")
  const [unstakeWalletBalance, setUnstakeWalletBalance] = useState<number>(
    stakingShares[
      currentSelectedUnstakeCoin[0] == "r"
        ? currentSelectedUnstakeCoin
        : "r" + currentSelectedUnstakeCoin
    ] != null
      ? stakingShares[
          currentSelectedUnstakeCoin[0] == "r"
            ? currentSelectedUnstakeCoin
            : "r" + currentSelectedUnstakeCoin
        ]
      : 0
  );
  useEffect(() => {
    setrTokenWalletBalance(
      userDeposit?.find((item: any) => item.rToken == currentSelectedStakeCoin)
        ?.rTokenFreeParsed
    );
    setRToken(currentSelectedStakeCoin);
  }, [currentSelectedStakeCoin, userDeposit]);
  // useEffect(() => {
  //   console.log("stake userDeposit", userDeposit);
  // }, [userDeposit]);
  useEffect(() => {
    setUnstakeWalletBalance(
      stakingShares[
        currentSelectedUnstakeCoin[0] == "r"
          ? currentSelectedUnstakeCoin
          : "r" + currentSelectedUnstakeCoin
      ] != null
        ? stakingShares[
            currentSelectedUnstakeCoin[0] == "r"
              ? currentSelectedUnstakeCoin
              : "r" + currentSelectedUnstakeCoin
          ]
        : 0
    );
  }, [currentSelectedUnstakeCoin, userDeposit]);
  const [buttonId, setButtonId] = useState(0);
  const [isToastDisplayed, setToastDisplayed] = useState(false);
  const resetStates = () => {
    setSliderValue(0);
    setSliderValue2(0);
    setRTokenAmount(0);
    setRTokenToWithdraw(0);
    setEstrTokens(0);
    setToastDisplayed(false);
    setCurrentSelectedStakeCoin(coin ? rcoinValue : "rBTC");
    setAsset(coin ? rcoinValue.slice(1) : "BTC");
    setRToken(coin ? rcoinValue : "rBTC");
    setcurrentSelectedUnstakeCoin(coin ? rcoinValue : "rBTC");
    setUnstakeRToken(coin ? rcoinValue : "rBTC");
    setTransactionStarted(false);
    setUnstakeTransactionStarted(false);
    setUnstakeWalletBalance(
      stakingShares[
        currentSelectedUnstakeCoin[0] == "r"
          ? currentSelectedUnstakeCoin
          : "r" + currentSelectedUnstakeCoin
      ] != null
        ? stakingShares[
            currentSelectedUnstakeCoin[0] == "r"
              ? currentSelectedUnstakeCoin
              : "r" + currentSelectedUnstakeCoin
          ]
        : 0
    );
    setWalletBalance(
      walletBalances[coin?.name]?.statusBalanceOf === "success"
        ? parseAmount(
            uint256.uint256ToBN(
              walletBalances[coin?.name]?.dataBalanceOf?.balance
            ),
            tokenDecimalsMap[coin?.name]
          )
        : 0
    );
    dispatch(resetModalDropdowns());
    dispatch(setTransactionStatus(""));
    setCurrentTransactionStatus("");
    setDepositTransHash("");
  };
  // console.log("testing isopen: ", isOpen);
  // console.log("testing custom isopen: ", isOpenCustom);

  // useEffect(() => {
  //   setIsOpenCustom(false);
  // }, []);
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
  // console.log(activeModal);

  useEffect(() => {});
  // useEffect(()=>{
  //   const fetchrTokens=async()=>{
  //     const data=await getEstrTokens("rUSDT",30.0);
  //   }
  //   fetchrTokens();
  // },[])

  useEffect(() => {
    setRTokenAmount(0);
    setSliderValue(0);
  }, [currentSelectedStakeCoin]);

  useEffect(() => {
    setRTokenToWithdraw(0);
    setSliderValue2(0);
  }, [currentSelectedUnstakeCoin]);

  useEffect(() => {
    setRToken(coin ? rcoinValue : "rBTC");
    setUnstakeRToken(coin ? rcoinValue : "rBTC");
  }, [coin]);

  const router = useRouter();
  const { pathname } = router;
  const [estrTokens, setEstrTokens] = useState<any>(0);

  // useEffect(() => {
  //   console.log("protocolStats", protocolStats);
  // }, [protocolStats]);
  useEffect(() => {
    const fetchestrTokens = async () => {
      // console.log(
      //   "getEstrTokens ",
      //   currentSelectedUnstakeCoin,
      //   rTokenToWithdraw
      // );
      const data = await getEstrTokens(
        currentSelectedUnstakeCoin,
        rTokenToWithdraw
      );
      // console.log("getEstrTokens ", data);
      setEstrTokens(data);
      // console.log(data, "estr token");
    };
    fetchestrTokens();
  }, [rTokenToWithdraw]);
  // useEffect(() => {
  //   setRToken(
  //     currentSelectedStakeCoin[0] != "r"
  //       ? (("r" + currentSelectedStakeCoin) as RToken)
  //       : currentSelectedStakeCoin
  //   );
  // }, [currentSelectedStakeCoin]);
  // useEffect(() => {
  //   console.log("transactionCheck uniqueID", uniqueID);
  // }, [uniqueID]);
  return (
    <Box>
      {nav ? (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={"8px"}
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
          color={router.pathname != "/waitlist" && stakeHover ? "gray" : ""}
        >
          {router.pathname != "/waitlist" && stakeHover ? (
            <Image
              src={hoverStake}
              alt="Picture of the author"
              width="16"
              height="16"
              style={{ cursor: "pointer" }}
            />
          ) : (
            <Image
              src="/stake.svg"
              alt="Picture of the author"
              width="16"
              height="16"
              style={{ cursor: "pointer" }}
            />
          )}
          <Box fontSize="14px">
            <Box position="relative" display="inline-block">
              <Text>Stake</Text>
            </Box>
          </Box>
        </Box>
      ) : (
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
          Details
        </Text>
      )}

      <Modal
        isOpen={isOpen}
        // isOpen={isSupplyTap ? isOpenCustom : isOpen}
        // onOverlayClick={() => setIsOpenCustom(false)}
        onClose={() => {
          const uqID = getUniqueId();
          let data: any = localStorage.getItem("transactionCheck");
          data = data ? JSON.parse(data) : [];
          // console.log(uqID, "data here", data);
          if (data && data.includes(uqID)) {
            data = data.filter((val: any) => val != uqID);
            localStorage.setItem("transactionCheck", JSON.stringify(data));
          }
          onClose();
          if (transactionStarted || unstakeTransactionStarted) {
            dispatch(setTransactionStartedAndModalClosed(true));
          }
          if (setStakeHover) setStakeHover(false);
          resetStates();
        }}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay mt="3.8rem" bg="rgba(244, 242, 255, 0.5);" />
        <ModalContent mt="8rem" bg={"#010409"} maxW="464px">
          {/* <ModalHeader>Borrow</ModalHeader> */}
          <ModalCloseButton
            // onClick={() => setIsOpenCustom(false)}
            mt="1rem"
            mr="1rem"
            color="white"
          />
          <ModalBody color={"#E6EDF3"} pt={6} px={7}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              fontSize={"sm"}
              // my={"2"}
            >
              <Box w="full">
                <Tabs variant="unstyled">
                  <TabList borderRadius="md">
                    <Tab
                      py="1"
                      px="3"
                      color="#6E7681"
                      fontSize="sm"
                      border="1px"
                      borderColor="#2B2F35"
                      borderLeftRadius="md"
                      fontWeight="normal"
                      _selected={{
                        color: "white",
                        bg: "#0969DA",
                        border: "none",
                      }}
                      isDisabled={unstakeTransactionStarted == true}
                      onClick={() => {
                        resetStates();
                      }}
                    >
                      Stake
                    </Tab>
                    <Tab
                      py="1"
                      px="3"
                      color="#6E7681"
                      fontSize="sm"
                      border="1px"
                      borderColor="#2B2F35"
                      borderRightRadius="md"
                      fontWeight="normal"
                      _selected={{
                        color: "white",
                        bg: "#0969DA",
                        border: "none",
                      }}
                      isDisabled={transactionStarted == true}
                      onClick={() => {
                        resetStates();
                      }}
                    >
                      Unstake
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p="0" m="0">
                      <Card
                        bg="#101216"
                        mb="0.5rem"
                        p="1rem"
                        border="1px solid #2B2F35"
                        mt="1.5rem"
                      >
                        {/* {!isValid(currentSelectedStakeCoin) && (
                          // <Box
                          //   // display="flex"
                          //   // justifyContent="left"
                          //   w="100%"
                          //   pb="4"
                          // >
                          //   <Box
                          //     display="flex"
                          //     bg="#FFF8C5"
                          //     color="black"
                          //     fontSize="xs"
                          //     p="4"
                          //     fontStyle="normal"
                          //     fontWeight="500"
                          //     borderRadius="6px"
                          //     // textAlign="center"
                          //   >
                          //     <Box pr="3" my="auto" cursor="pointer">
                          //       <WarningIcon />
                          //     </Box>
                          //     Selected market is not supplied. to stake in the
                          //     below selected market supply the asset below
                          //     {/* <Box
                          //       py="1"
                          //       pl="4"
                          //       cursor="pointer"
                          //       // onClick={handleClick}
                          //     >
                          //       <TableClose />
                          //     </Box> */}

                        <Text
                          color="#8B949E"
                          display="flex"
                          alignItems="center"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            {`${
                              !isValid(currentSelectedStakeCoin)
                                ? "Select"
                                : "Supply"
                            }`}{" "}
                            Market
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="The token selected to stake on the protocol."
                            bg="#010409"
                            fontSize={"13px"}
                            fontWeight={"thin"}
                            borderRadius={"lg"}
                            padding={"2"}
                            border="1px solid"
                            borderColor="#2B2F35"
                            arrowShadowColor="#2B2F35"
                            maxW="272px"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Text>
                        <Box
                          display="flex"
                          border="1px"
                          borderColor="#2B2F35"
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
                              handleDropdownClick("stakeMarketDropDown");
                            }
                          }}
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">{getCoin(currentSelectedStakeCoin)}</Box>
                            <Text color="white" mt="0.1rem">
                              {currentSelectedStakeCoin}
                            </Text>
                          </Box>
                          <Box pt="1" className="navbar-button">
                            {activeModal == "stakeMarketDropDown" ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>
                          {modalDropdowns.stakeMarketDropDown && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                            >
                              {rcoins?.map((_coin: RToken, index: number) => {
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
                                      setCurrentSelectedStakeCoin(_coin);
                                      setRToken(_coin);
                                      setAsset(_coin?.slice(1) as NativeToken);
                                      setWalletBalance(
                                        walletBalances[_coin?.slice(1)]
                                          ?.statusBalanceOf === "success"
                                          ? parseAmount(
                                              uint256.uint256ToBN(
                                                walletBalances[_coin?.slice(1)]
                                                  ?.dataBalanceOf?.balance
                                              ),
                                              tokenDecimalsMap[_coin?.slice(1)]
                                            )
                                          : 0
                                      );
                                      // dispatch(setCoinSelectedSupplyModal(coin))
                                    }}
                                  >
                                    {_coin === currentSelectedStakeCoin && (
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
                                        _coin === currentSelectedStakeCoin
                                          ? "1"
                                          : "5"
                                      }`}
                                      pr="6px"
                                      gap="1"
                                      justifyContent="space-between"
                                      bg={`${
                                        _coin === currentSelectedStakeCoin
                                          ? "#0C6AD9"
                                          : "inherit"
                                      }`}
                                      borderRadius="md"
                                    >
                                      <Box display="flex">
                                        <Box p="1">{getCoin(_coin)}</Box>
                                        <Text color="white">{_coin}</Text>
                                      </Box>
                                      <Box
                                        fontSize="9px"
                                        color="white"
                                        mt="6px"
                                        fontWeight="thin"
                                        display="flex"
                                      >
                                        rToken Balance:{" "}
                                        {userDeposit &&
                                        userDeposit.length > 0 &&
                                        userDeposit?.find(
                                          (item: any) => item.rToken == _coin
                                        )?.rTokenFreeParsed != null ? (
                                          numberFormatter(
                                            userDeposit?.find(
                                              (item: any) =>
                                                item.rToken == _coin
                                            )?.rTokenFreeParsed
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
                        <Text
                          color="#8B949E"
                          display="flex"
                          alignItems="center"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            Amount
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="The unit of tokens you will stake on the protocol."
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
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Text>
                        <Box
                          width="100%"
                          color="white"
                          border={`${
                            (rtokenWalletBalance != 0 &&
                              rTokenAmount >
                                Number(getBalance(currentSelectedStakeCoin))) ||
                            (rtokenWalletBalance == 0 &&
                              rTokenAmount > walletBalance)
                              ? "1px solid #CF222E"
                              : rTokenAmount < 0
                              ? "1px solid #CF222E"
                              : rTokenAmount > 0 &&
                                (rTokenAmount <=
                                  Number(
                                    getBalance(currentSelectedStakeCoin)
                                  ) ||
                                  rTokenAmount <= walletBalance)
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
                            outline="none"
                            step={parseFloat(
                              `${rTokenAmount <= 99999 ? 0.1 : 0}`
                            )}
                            isDisabled={transactionStarted == true}
                            _disabled={{ cursor: "pointer" }}
                          >
                            <NumberInputField
                              placeholder={`0.01536 ${currentSelectedStakeCoin}`}
                              color={`${
                                (rtokenWalletBalance != 0 &&
                                  rTokenAmount >
                                    Number(
                                      getBalance(currentSelectedStakeCoin)
                                    )) ||
                                (rtokenWalletBalance == 0 &&
                                  rTokenAmount > walletBalance)
                                  ? "#CF222E"
                                  : rTokenAmount < 0
                                  ? "#CF222E"
                                  : rTokenAmount == 0
                                  ? "white"
                                  : "#1A7F37"
                              }`}
                              _disabled={{ color: "#1A7F37" }}
                              border="0px"
                              _placeholder={{
                                color: "#393D4F",
                                fontSize: ".89rem",
                                fontWeight: "600",
                                outline: "none",
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
                              (rtokenWalletBalance != 0 &&
                                rTokenAmount >
                                  Number(
                                    getBalance(currentSelectedStakeCoin)
                                  )) ||
                              (rtokenWalletBalance == 0 &&
                                rTokenAmount > walletBalance)
                                ? "#CF222E"
                                : rTokenAmount < 0
                                ? "#CF222E"
                                : rTokenAmount == 0
                                ? "#0969DA"
                                : "#1A7F37"
                            }`}
                            _hover={{ bg: "#101216" }}
                            onClick={() => {
                              if (rtokenWalletBalance != 0) {
                                setRTokenAmount(rtokenWalletBalance);
                                setInputStakeAmount(rtokenWalletBalance);
                                setDepositAmount(rtokenWalletBalance);
                                setSliderValue(100);
                              } else {
                                setRTokenAmount(walletBalance);
                                setInputStakeAmount(walletBalance);
                                setDepositAmount(walletBalance);
                                setSliderValue(100);
                              }
                            }}
                            isDisabled={transactionStarted == true}
                            _disabled={{ cursor: "pointer" }}
                          >
                            MAX
                          </Button>
                        </Box>
                        {(rtokenWalletBalance != 0 &&
                          rTokenAmount >
                            Number(getBalance(currentSelectedStakeCoin))) ||
                        (rtokenWalletBalance == 0 &&
                          rTokenAmount > walletBalance) ||
                        rTokenAmount < 0 ? (
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
                                {rTokenAmount > rtokenWalletBalance ||
                                (rtokenWalletBalance == 0 &&
                                  rTokenAmount > walletBalance)
                                  ? "Amount exceeds balance"
                                  : "Invalid Input"}{" "}
                              </Text>
                            </Text>
                            <Text
                              color="#E6EDF3"
                              display="flex"
                              justifyContent="flex-end"
                            >
                              {rtokenWalletBalance == 0
                                ? "Wallet Balance: "
                                : `rToken Balance: `}
                              {rtokenWalletBalance == 0 ? (
                                numberFormatter(walletBalance)
                              ) : rtokenWalletBalance !== undefined ? (
                                numberFormatter(rtokenWalletBalance)
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
                              <Text color="#6E7781" ml="0.2rem">
                                {` ${currentSelectedStakeCoin}`}
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
                            {rtokenWalletBalance == 0
                              ? "Wallet Balance: "
                              : `rToken Balance: `}
                            {rtokenWalletBalance == 0 ? (
                              numberFormatter(walletBalance)
                            ) : rtokenWalletBalance !== undefined ? (
                              numberFormatter(rtokenWalletBalance)
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
                            {/* {walletBalance} */}
                            <Text color="#6E7781" ml="0.2rem">
                              {rtokenWalletBalance == 0
                                ? currentSelectedStakeCoin.slice(1)
                                : currentSelectedStakeCoin}
                            </Text>
                          </Text>
                        )}
                        <Box pt={5} pb={2} mt="1rem">
                          <Slider
                            aria-label="slider-ex-6"
                            defaultValue={sliderValue}
                            value={sliderValue}
                            onChange={(val) => {
                              setSliderValue(val);
                              if (rtokenWalletBalance == 0) {
                                var ans = (val / 100) * walletBalance;
                              } else {
                                var ans = (val / 100) * rtokenWalletBalance;
                              }
                              if (val == 100) {
                                if (rtokenWalletBalance == 0) {
                                  setRTokenAmount(walletBalance);
                                  setInputStakeAmount(walletBalance);
                                  setDepositAmount(walletBalance);
                                } else {
                                  setRTokenAmount(rtokenWalletBalance);
                                  setInputStakeAmount(rtokenWalletBalance);
                                  setDepositAmount(rtokenWalletBalance);
                                }
                              } else {
                                ans = Math.round(ans * 100) / 100;
                                // dispatch(setInputSupplyAmount(ans))
                                setRTokenAmount(ans);
                                setInputStakeAmount(ans);
                                setDepositAmount(ans);
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
                      </Card>
                      {/* {!isValid(currentSelectedStakeCoin) && (
                        // <Checkbox
                        //   color="#0969DA"
                        //   w="100%"
                        //   defaultChecked
                        //   // mt="0.7rem"
                        //   w="420px"
                        //   size="md"
                        //   iconSize="1rem"
                        //   _focus={{ boxShadow: "none" }}
                        //   borderColor="#2B2F35"
                        // >
                        //   <Text
                        //     fontSize="12px"
                        //     color="#6E7681"
                        //     fontStyle="normal"
                        //     fontWeight="400"
                        //     lineHeight="20px"
                        //   >
                        //     Ticking would stake the received rTokens unchecking
                        //     wouldn&apos;t stake rTokens
                        //   </Text>
                        // </Checkbox>
                        <Box display="flex" gap="2">
                          <Checkbox
                            size="md"
                            colorScheme="customBlue"
                            defaultChecked
                            mb="auto"
                            mt="1.2rem"
                          />
                          <Text
                            fontSize="12px"
                            fontWeight="400"
                            color="#6E7681"
                            mt="1rem"
                          >
                            Ticking would stake the received rTokens. unchecking
                            woudn&apos;t stake rTokens
                          </Text>
                        </Box>
                      )} */}
                      <Card
                        bg="#101216"
                        mt="1rem"
                        p="1rem"
                        border="1px solid #2B2F35"
                      >
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
                              font-size="12px"
                              color="#6A737D"
                            >
                              Staking rewards:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Rewards earned in staking activities within the protocol."
                              bg="#010409"
                              fontSize={"13px"}
                              fontWeight={"thin"}
                              borderRadius={"lg"}
                              padding={"2"}
                              border="1px solid"
                              borderColor="#2B2F35"
                              arrowShadowColor="#2B2F35"
                              maxW="282px"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#6E7681">
                            {protocolStats?.find(
                              (stat: any) =>
                                stat.token ==
                                (currentSelectedStakeCoin[0] == "r"
                                  ? currentSelectedStakeCoin.slice(1)
                                  : currentSelectedStakeCoin)
                            )?.stakingRate
                              ? protocolStats?.find(
                                  (stat: any) =>
                                    stat.token ==
                                    (currentSelectedStakeCoin[0] == "r"
                                      ? currentSelectedStakeCoin.slice(1)
                                      : currentSelectedStakeCoin)
                                )?.stakingRate
                              : "1.2"}
                            %
                            {/* {protocolStats?.[0]?.stakingRate ? (
                              protocolStats?.[0]?.stakingRate
                            ) : (
                              <Skeleton
                                width="6rem"
                                height="1.4rem"
                                startColor="#101216"
                                endColor="#2B2F35"
                                borderRadius="6px"
                              />
                            )} */}
                          </Text>
                        </Text>
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
                              font-size="12px"
                              color="#6A737D"
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
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#6E7681">$ 0.91</Text>
                        </Text>
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
                              font-size="12px"
                              color="#6A737D"
                            >
                              Fees:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Cost incurred during transactions."
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
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#6E7681">{TransactionFees.stake}%</Text>
                        </Text>
                      </Card>

                      {/* <Text
                        display="flex"
                        flexDirection="column"
                        padding="0px"
                        fontSize="12px"
                        fontWeight="400"
                        fontStyle="normal"
                        color=" #6A737D"
                        mt="1rem"
                        lineHeight="18px"
                      >
                        <Text>
                          To stake you need to supply any asset to receive
                          rTokens.
                        </Text>
                        <Text display="flex">
                          click here To{" "}
                          <SupplyModal
                            variant="link"
                            fontSize="12px"
                            display="inline"
                            color="#0969DA"
                            cursor="pointer"
                            ml="0.4rem"
                            lineHeight="18px"
                            buttonText="Add Supply"
                            backGroundOverLay="rgba(244, 242, 255, 0)"
                            coin={coin}
                          />
                        </Text>
                      </Text> */}
                      {isValid(currentSelectedStakeCoin) &&
                      userDeposit?.find(
                        (item: any) => item.rToken == currentSelectedStakeCoin
                      )?.rTokenFreeParsed ? (
                        rTokenAmount > 0 &&
                        rTokenAmount <= rtokenWalletBalance ? (
                          buttonId == 1 ? (
                            <SuccessButton successText="Stake success" />
                          ) : buttonId == 2 ? (
                            <ErrorButton errorText="Copy error!" />
                          ) : (
                            <Box
                              onClick={() => {
                                setTransactionStarted(true);
                                if (transactionStarted == false) {
                                  mixpanel.track(
                                    "Stake Button Clicked Market page",
                                    {
                                      "Stake Clicked": true,
                                    }
                                  );
                                  dispatch(
                                    setTransactionStartedAndModalClosed(false)
                                  );
                                  handleStakeTransaction();
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
                                  "Processing",
                                  "Checking for sufficient rtoken balance.",
                                  "Transferring rTokens to the supply vault",
                                  "Updating the supply records.",
                                  // <ErrorButton errorText="Transaction failed" />,
                                  // <ErrorButton errorText="Copy error!" />,
                                  <SuccessButton
                                    key={"successButton"}
                                    successText={"Stake successful."}
                                  />,
                                ]}
                                _disabled={{ bgColor: "white", color: "black" }}
                                isDisabled={transactionStarted == true}
                                labelErrorArray={[
                                  <ErrorButton
                                    errorText="Transaction failed"
                                    key={"error1"}
                                  />,
                                  <ErrorButton
                                    errorText="Copy error!"
                                    key={"error2"}
                                  />,
                                ]}
                                currentTransactionStatus={
                                  currentTransactionStatus
                                }
                                setCurrentTransactionStatus={
                                  setCurrentTransactionStatus
                                }
                              >
                                Stake
                              </AnimatedButton>
                            </Box>
                          )
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
                            {`${
                              !isValid(currentSelectedStakeCoin) &&
                              userDeposit?.find(
                                (item: any) =>
                                  item.rToken == currentSelectedStakeCoin
                              )?.rTokenFreeParsed != 0
                                ? "Stake and Supply"
                                : "Stake"
                            }`}
                          </Button>
                        )
                      ) : rTokenAmount > 0 && rTokenAmount <= walletBalance ? (
                        buttonId == 1 ? (
                          <SuccessButton successText="Stake success" />
                        ) : buttonId == 2 ? (
                          <ErrorButton errorText="Copy error!" />
                        ) : (
                          <Box
                            onClick={() => {
                              setTransactionStarted(true);
                              if (transactionStarted == false) {
                                mixpanel.track(
                                  "Stake Button Clicked Market page",
                                  {
                                    "Stake Clicked": true,
                                  }
                                );
                                dispatch(
                                  setTransactionStartedAndModalClosed(false)
                                );
                                hanldeStakeAndSupplyTransaction();
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
                                "Processing",
                                "Checking for sufficient rtoken balance.",
                                "Transferring rTokens to the supply vault",
                                "Updating the supply records.",
                                // <ErrorButton errorText="Transaction failed" />,
                                // <ErrorButton errorText="Copy error!" />,
                                <SuccessButton
                                  key={"successButton"}
                                  successText={"Stake successful."}
                                />,
                              ]}
                              _disabled={{ bgColor: "white", color: "black" }}
                              isDisabled={transactionStarted == true}
                              labelErrorArray={[
                                <ErrorButton
                                  errorText="Transaction failed"
                                  key={"error1"}
                                />,
                                <ErrorButton
                                  errorText="Copy error!"
                                  key={"error2"}
                                />,
                              ]}
                              currentTransactionStatus={
                                currentTransactionStatus
                              }
                              setCurrentTransactionStatus={
                                setCurrentTransactionStatus
                              }
                            >
                              Stake and Supply
                            </AnimatedButton>
                          </Box>
                        )
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
                          {`${
                            isValid(currentSelectedStakeCoin) &&
                            userDeposit?.find(
                              (item: any) =>
                                item.rToken == currentSelectedStakeCoin
                            )?.rTokenFreeParsed > 0
                              ? "Stake"
                              : "Stake and Supply"
                          }`}
                        </Button>
                      )}
                    </TabPanel>
                    <TabPanel p="0" m="0">
                      <Card
                        bg="#101216"
                        mb="0.5rem"
                        p="1rem"
                        border="1px solid #2B2F35"
                        mt="1.5rem"
                      >
                        <Text
                          color="#8B949E"
                          display="flex"
                          alignItems="center"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            Select Market
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="The token selected to unstake on the protocol."
                            bg="#010409"
                            fontSize={"13px"}
                            fontWeight={"thin"}
                            borderRadius={"lg"}
                            padding={"2"}
                            border="1px solid"
                            borderColor="#2B2F35"
                            arrowShadowColor="#2B2F35"
                            maxW="272px"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Text>
                        <Box
                          display="flex"
                          border="1px"
                          borderColor="#2B2F35"
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
                            if (unstakeTransactionStarted == true) {
                              return;
                            } else {
                              handleDropdownClick("unstakeMarketDropDown");
                            }
                          }}
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">
                              {getCoin(currentSelectedUnstakeCoin)}
                            </Box>
                            <Text color="white" mt="0.1rem">
                              {currentSelectedUnstakeCoin}
                            </Text>
                          </Box>
                          <Box pt="1" className="navbar-button">
                            {activeModal == "unstakeMarketDropDown" ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>
                          {modalDropdowns.unstakeMarketDropDown && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                            >
                              {rcoins?.map((_coin: RToken, index: number) => {
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
                                      setcurrentSelectedUnstakeCoin(_coin);
                                      setUnstakeRToken(_coin);
                                      // setRToken(_coin);
                                      // dispatch(setCoinSelectedSupplyModal(coin))
                                    }}
                                  >
                                    {_coin === currentSelectedUnstakeCoin && (
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
                                        _coin === currentSelectedUnstakeCoin
                                          ? "1"
                                          : "5"
                                      }`}
                                      pr="6px"
                                      gap="1"
                                      justifyContent="space-between"
                                      bg={`${
                                        _coin === currentSelectedUnstakeCoin
                                          ? "#0C6AD9"
                                          : "inherit"
                                      }`}
                                      borderRadius="md"
                                    >
                                      <Box display="flex">
                                        <Box p="1">{getCoin(_coin)}</Box>
                                        <Text color="white">{_coin}</Text>
                                      </Box>
                                      <Box
                                        fontSize="9px"
                                        color="white"
                                        mt="6px"
                                        fontWeight="thin"
                                        display="flex"
                                      >
                                        Staking shares:{" "}
                                        {stakingShares != null &&
                                        stakingShares[_coin] != null &&
                                        stakingShares[_coin] != undefined &&
                                        !isNaN(stakingShares[_coin]) ? (
                                          numberFormatter(stakingShares[_coin])
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
                        <Text
                          color="#8B949E"
                          display="flex"
                          alignItems="center"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            Amount
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="The unit of tokens to unstake from the protocol."
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
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Text>
                        <Box
                          width="100%"
                          color="white"
                          border={`${
                            rTokenToWithdraw > unstakeWalletBalance
                              ? "1px solid #CF222E"
                              : rTokenToWithdraw < 0
                              ? "1px solid #CF222E"
                              : rTokenToWithdraw > 0 &&
                                rTokenToWithdraw <= unstakeWalletBalance
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
                            onChange={handleUnstakeChange}
                            value={rTokenToWithdraw ? rTokenToWithdraw : ""}
                            outline="none"
                            step={parseFloat(
                              `${rTokenToWithdraw <= 99999 ? 0.1 : 0}`
                            )}
                            isDisabled={
                              !isValid(currentSelectedUnstakeCoin) ||
                              unstakeTransactionStarted == true
                            }
                            _disabled={{ cursor: "pointer" }}
                          >
                            <NumberInputField
                              placeholder={`0.01536 ${currentSelectedUnstakeCoin}`}
                              color={`${
                                !isValid(currentSelectedUnstakeCoin)
                                  ? "#1A7F37"
                                  : rTokenToWithdraw > unstakeWalletBalance
                                  ? "#CF222E"
                                  : rTokenToWithdraw < 0
                                  ? "#CF222E"
                                  : rTokenToWithdraw == 0
                                  ? "white"
                                  : "#1A7F37"
                              }`}
                              _disabled={{ cursor: "pointer" }}
                              border="0px"
                              _placeholder={{
                                color: "#393D4F",
                                fontSize: ".89rem",
                                fontWeight: "600",
                                outline: "none",
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
                                rTokenToWithdraw > unstakeWalletBalance
                                ? "#CF222E"
                                : rTokenToWithdraw < 0
                                ? "#CF222E"
                                : rTokenToWithdraw == 0
                                ? "#0969DA"
                                : "#1A7F37"
                            }`}
                            _hover={{ bg: "#101216" }}
                            onClick={() => {
                              // if (!coinsSupplied[currentSelectedUnstakeCoin]) {
                              //   return;
                              // }
                              setRTokenToWithdraw(unstakeWalletBalance);
                              setSliderValue2(100);
                            }}
                            isDisabled={unstakeTransactionStarted == true}
                            _disabled={{ cursor: "pointer" }}
                          >
                            MAX
                          </Button>
                        </Box>
                        {(rTokenToWithdraw > unstakeWalletBalance ||
                          rTokenToWithdraw < 0) &&
                        coinsSupplied[currentSelectedUnstakeCoin] ? (
                          <Text
                            display="flex"
                            justifyContent="space-between"
                            color="#E6EDF3"
                            mt="0.4rem"
                            fontSize="12px"
                            fontWeight="500"
                            fontStyle="normal"
                            fontFamily="Inter"
                            whiteSpace="nowrap"
                          >
                            <Text color="#CF222E" display="flex">
                              <Text mt="0.2rem">
                                <SmallErrorIcon />{" "}
                              </Text>
                              <Text ml="0.3rem">
                                {rTokenToWithdraw > unstakeWalletBalance
                                  ? "Amount exceeds balance"
                                  : "Invalid Input"}{" "}
                              </Text>
                            </Text>
                            <Text
                              color="#E6EDF3"
                              display="flex"
                              justifyContent="flex-end"
                            >
                              Staking Shares:{" "}
                              {stakingShares &&
                              stakingShares[
                                currentSelectedUnstakeCoin[0] == "r"
                                  ? currentSelectedUnstakeCoin
                                  : "r" + currentSelectedUnstakeCoin
                              ] != null ? (
                                numberFormatter(
                                  stakingShares[
                                    currentSelectedUnstakeCoin[0] == "r"
                                      ? currentSelectedUnstakeCoin
                                      : "r" + currentSelectedUnstakeCoin
                                  ]
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
                              <Text color="#6E7781" ml="0.2rem">
                                shares
                                {/* {` ${currentSelectedUnstakeCoin}`} */}
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
                            Staking Shares:{" "}
                            {stakingShares &&
                            stakingShares[
                              currentSelectedUnstakeCoin[0] == "r"
                                ? currentSelectedUnstakeCoin
                                : "r" + currentSelectedUnstakeCoin
                            ] != null ? (
                              numberFormatter(
                                stakingShares[
                                  currentSelectedUnstakeCoin[0] == "r"
                                    ? currentSelectedUnstakeCoin
                                    : "r" + currentSelectedUnstakeCoin
                                ]
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
                            <Text color="#6E7781" ml="0.4rem">
                              {"shares"}
                              {/* {` ${currentSelectedUnstakeCoin}`} */}
                            </Text>
                          </Text>
                        )}
                        <Box pt={5} pb={2} mt="1rem">
                          <Slider
                            aria-label="slider-ex-6"
                            defaultValue={sliderValue2}
                            value={sliderValue2}
                            onChange={(val) => {
                              // if (!isValid(currentSelectedUnstakeCoin)) {
                              //   return;
                              // }
                              setSliderValue2(val);
                              if (val == 100) {
                                setRTokenToWithdraw(unstakeWalletBalance);
                              } else {
                                var ans = (val / 100) * unstakeWalletBalance;
                                ans = Math.round(ans * 100) / 100;
                                // dispatch(setInputSupplyAmount(ans))
                                setRTokenToWithdraw(ans);
                              }
                            }}
                            isDisabled={unstakeTransactionStarted == true}
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
                      </Card>

                      <Card
                        bg="#101216"
                        mt="1rem"
                        p="1rem"
                        border="1px solid #2B2F35"
                      >
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
                              font-size="12px"
                              color="#6A737D"
                            >
                              est. rTokens:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Estimation of token amount you may receive after the transaction."
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
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          {unstakeWalletBalance ? (
                            <Text color="#6E7681">{estrTokens}</Text>
                          ) : (
                            <Text color="#6E7681">0</Text>
                          )}
                        </Text>
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
                              font-size="12px"
                              color="#6A737D"
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
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#6E7681">$ 0.91</Text>
                        </Text>
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
                              font-size="12px"
                              color="#6A737D"
                            >
                              Fees:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Cost incurred during transactions."
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
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#6E7681">
                            {TransactionFees.unstake}%
                          </Text>
                        </Text>
                      </Card>
                      {rTokenToWithdraw > 0 &&
                      rTokenToWithdraw <= unstakeWalletBalance ? (
                        <Box
                          onClick={() => {
                            setUnstakeTransactionStarted(true);
                            if (unstakeTransactionStarted == false) {
                              mixpanel.track(
                                "Unstake Button Clicked Market page",
                                {
                                  "Unstake Clicked": true,
                                }
                              );
                              dispatch(
                                setTransactionStartedAndModalClosed(false)
                              );
                              hanldeUnstakeTransaction();
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
                              "Processing",
                              "Unstake amount matches staked rToken balance",
                              "Unstaking the rTokens.",
                              "Transferring to the user account",
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={"successButton"}
                                successText={"Unstake successful."}
                              />,
                            ]}
                            labelErrorArray={[
                              <ErrorButton
                                errorText="Transaction failed"
                                key={"error1"}
                              />,
                              <ErrorButton
                                errorText="Copy error!"
                                key={"error2"}
                              />,
                            ]}
                            currentTransactionStatus={currentTransactionStatus}
                            setCurrentTransactionStatus={
                              setCurrentTransactionStatus
                            }
                            _disabled={{ bgColor: "white", color: "black" }}
                            isDisabled={unstakeTransactionStarted == true}
                          >
                            Unstake
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
                          Unstake
                        </Button>
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StakeUnstakeModal;

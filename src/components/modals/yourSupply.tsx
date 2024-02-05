import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Tooltip,
  Checkbox,
  Box,
  Text,
  Card,
  NumberInput,
  NumberInputField,
  Slider,
  SliderMark,
  SliderThumb,
  SliderTrack,
  SliderFilledTrack,
  TabList,
  Tab,
  TabPanel,
  Tabs,
  TabPanels,
  RadioGroup,
  Radio,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import TransactionFees from "../../../TransactionFees.json";
/* Coins logo import  */
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import DropdownUp from "../../assets/icons/dropdownUpIcon";
import InfoIcon from "../../assets/icons/infoIcon";
import SliderWithInput from "../uiElements/sliders/sliderWithInput";
import SliderPointer from "@/assets/icons/sliderPointer";
import SliderPointerWhite from "@/assets/icons/sliderPointerWhite";
import { useDispatch, useSelector } from "react-redux";

import {
  selectNavDropdowns,
  setNavDropdown,
  setModalDropdown,
  selectModalDropDowns,
  resetModalDropdowns,
} from "@/store/slices/dropdownsSlice";
import { useEffect, useState } from "react";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import EthToUsdt from "@/assets/icons/pools/ethToUsdt";
import SmallEth from "@/assets/icons/coins/smallEth";
import SmallUsdt from "@/assets/icons/coins/smallUsdt";
import MySwap from "@/assets/icons/dapps/mySwap";
import MySwapDisabled from "@/assets/icons/dapps/mySwapDisabled";
import UsdcToUsdt from "@/assets/icons/pools/usdcToUsdt";
import EthToUsdc from "@/assets/icons/pools/ethToUsdc";
import DaiToEth from "@/assets/icons/pools/daiToEth";
import BtcToEth from "@/assets/icons/pools/btcToEth";
import BtcToUsdt from "@/assets/icons/pools/btcToUsdt";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import {
  selectInputSupplyAmount,
  selectCoinSelectedSupplyModal,
  setCoinSelectedSupplyModal,
  selectWalletBalance,
  setTransactionStatus,
  selectAssetWalletBalance,
  selectActiveTransactions,
  setActiveTransactions,
  setTransactionStartedAndModalClosed,
} from "@/store/slices/userAccountSlice";
import SmallErrorIcon from "@/assets/icons/smallErrorIcon";
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import ArrowUp from "@/assets/icons/arrowup";
import useWithdrawDeposit from "@/Blockchain/hooks/Writes/useWithdrawDeposit";
import { useWaitForTransaction } from "@starknet-react/core";
import { BNtoNum, parseAmount } from "@/Blockchain/utils/utils";
import { uint256 } from "starknet";
import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
import useDeposit from "@/Blockchain/hooks/Writes/useDeposit";
import { toast } from "react-toastify";
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "@/Blockchain/utils/addressServices";
import CopyToClipboard from "react-copy-to-clipboard";
import mixpanel from "mixpanel-browser";
import { getSupplyunlocked } from "@/Blockchain/scripts/Rewards";
import { selectFees, selectMaximumDepositAmounts, selectMinimumDepositAmounts, selectUserDeposits } from "@/store/slices/readDataSlice";
import BlueInfoIcon from "@/assets/icons/blueinfoicon";
import numberFormatter from "@/utils/functions/numberFormatter";
import posthog from "posthog-js";
const YourSupplyModal = ({
  currentSelectedSupplyCoin,
  setCurrentSelectedSupplyCoin,
  currentSelectedWithdrawlCoin,
  setcurrentSelectedWithdrawlCoin,
  currentActionMarket,
  coins,
  protocolStats,
}: any) => {
  ////console.log(coins,"coins in supply modal")
  ////console.log(currentSelectedSupplyCoin,"coin in your suppply");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [sliderValue, setSliderValue] = useState(0);
  const modalDropdowns = useSelector(selectModalDropDowns);
  const [inputAmount, setinputAmount] = useState(0);
  const [inputSupplyAmount, setinputSupplyAmount] = useState(0);
  // const [inputWithdrawlAmount, setinputWithdrawlAmount] = useState(0);
  const [sliderValue2, setSliderValue2] = useState(0);
  const [transactionStarted, setTransactionStarted] = useState(false);

  let activeTransactions = useSelector(selectActiveTransactions);
  const [uniqueID, setUniqueID] = useState(0);
  const getUniqueId = () => uniqueID;

  // const [coins, setCoins] = useState([])
  // const walletBalances = useSelector(selectAssetWalletBalance);
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
    rBTC: useBalanceOf(tokenAddressMap["rBTC"]),
    rUSDT: useBalanceOf(tokenAddressMap["rUSDT"]),
    rUSDC: useBalanceOf(tokenAddressMap["rUSDC"]),
    rETH: useBalanceOf(tokenAddressMap["rETH"]),
    rDAI: useBalanceOf(tokenAddressMap["rDAI"]),
  };
  const userDeposit = useSelector(selectUserDeposits);
  ////console.log(userDeposit,"user deposit your supply")
  const [walletBalance, setwalletBalance] = useState(
    walletBalances[currentSelectedSupplyCoin]?.statusBalanceOf === "success"
      ? parseAmount(
        String(uint256.uint256ToBN(
          walletBalances[currentSelectedSupplyCoin]?.dataBalanceOf?.balance
        )),
        tokenDecimalsMap[currentSelectedSupplyCoin]
      )
      : 0
  );
  ////console.log(currentSelectedWithdrawlCoin)
  const [withdrawWalletBalance, setWithdrawWalletBalance] = useState<any>(
    userDeposit?.find(
      (item: any) => item?.rToken == currentSelectedWithdrawlCoin
    )?.rTokenFreeParsed
  );

  useEffect(() => {
    setwalletBalance(
      walletBalances[currentSelectedSupplyCoin]?.statusBalanceOf === "success"
        ? parseAmount(
          String(uint256.uint256ToBN(
            walletBalances[currentSelectedSupplyCoin]?.dataBalanceOf?.balance
          )),
          tokenDecimalsMap[currentSelectedSupplyCoin]
        )
        : 0
    );
    ////console.log("supply modal status wallet balance",walletBalances[currentSelectedSupplyCoin]?.statusBalanceOf)
  }, [
    walletBalances[currentSelectedSupplyCoin]?.statusBalanceOf,
    currentSelectedSupplyCoin,
  ]);
  useEffect(() => {
    setWithdrawWalletBalance(
      userDeposit?.find(
        (item: any) => item?.rToken == currentSelectedWithdrawlCoin
      )?.rTokenFreeParsed
    );
    ////console.log("supply modal status wallet balance",walletBalances[currentSelectedWithdrawlCoin]?.statusBalanceOf)
  }, [currentSelectedWithdrawlCoin]);

  const [ischecked, setIsChecked] = useState(true);
  const [withdrawTransactionStarted, setWithdrawTransactionStarted] =
    useState(false);
  const {
    depositAmount,
    setDepositAmount,
    asset: supplyAsset,
    setAsset: setSupplyAsset,

    dataDepositStake,
    errorDepositStake,
    resetDepositStake,
    writeAsyncDepositStake,
    isErrorDepositStake,
    isIdleDepositStake,
    isSuccessDepositStake,
    statusDepositStake,

    dataDeposit,
    errorDeposit,
    resetDeposit,
    // depositTransHash,
    // setDepositTransHash,
    writeAsyncDeposit,
    isErrorDeposit,
    isIdleDeposit,
    isSuccessDeposit,
    statusDeposit,
  } = useDeposit();
  const {
    asset, // this should be native token
    setAsset,
    rTokenShares: inputWithdrawlAmount,
    setRTokenShares: setinputWithdrawlAmount,

    dataWithdrawDeposit,
    errorWithdrawDeposit,
    resetWithdrawDeposit,
    writeWithdrawDeposit,
    writeAsyncWithdrawDeposit,
    isErrorWithdrawDeposit,
    isIdleWithdrawDeposit,
    isSuccessWithdrawDeposit,
    statusWithdrawDeposit,
  } = useWithdrawDeposit();
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
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });
  const handleChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return;
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setinputSupplyAmount(newValue);
      setDepositAmount(newValue);
      setinputSupplyAmount(newValue);
      // dispatch(setInputSupplyAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage);
        setinputSupplyAmount(newValue);
        setDepositAmount(newValue);
        setinputSupplyAmount(newValue);
      }
      // dispatch(setInputSupplyAmount(newValue));
    }
  };
  const handleWithdrawlChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return;

    var percentage = (newValue * 100) / withdrawWalletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue2(100);
      setinputWithdrawlAmount(newValue);
      // dispatch(setInputSupplyAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue2(percentage);
        setinputWithdrawlAmount(newValue);
      }
      // dispatch(setInputSupplyAmount(newValue));
    }
  };
  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setModalDropdown(dropdownName));
  };

  const [estSupply, setEstSupply] = useState<any>();
  useEffect(() => {
    const fetchSupplyUnlocked = async () => {
      try {
        if (currentSelectedWithdrawlCoin && inputWithdrawlAmount > 0) {
          const data = await getSupplyunlocked(
            currentSelectedWithdrawlCoin,
            inputWithdrawlAmount
          );
          ////console.log(data, "data in your supply");
          setEstSupply(data);
        }
      } catch (err) {
       //console.log(err, "err in you supply");
      }
    };
    fetchSupplyUnlocked();
  }, [currentSelectedWithdrawlCoin, inputWithdrawlAmount]);
  // const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  // const walletBalance = useSelector(selectWalletBalance);
  // const [currentSelectedSupplyCoin, setCurrentSelectedSupplyCoin] =
  //   useState("BTC");
  // const [currentSelectedWithdrawlCoin, setcurrentSelectedWithdrawlCoin] =
  //   useState("BTC");
  const resetStates = () => {
    setSliderValue(0);
    setSliderValue2(0);
    setinputSupplyAmount(0);
    setDepositAmount(0);
    setinputWithdrawlAmount(0);
    setCurrentSelectedSupplyCoin("BTC");
    setSupplyAsset("BTC");
    setcurrentSelectedWithdrawlCoin("BTC");
    setAsset("BTC");
    setIsChecked(true);
    setTransactionStarted(false);
    setWithdrawTransactionStarted(false);
    dispatch(resetModalDropdowns());
    const uqID = getUniqueId();
    dispatch(setTransactionStatus(""));
    setToastDisplayed(false);
    setDepositTransHash("");
    setEstSupply(undefined);
    setCurrentTransactionStatus("");
  };
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );

  const fees = useSelector(selectFees);

  useEffect(() => {
    setinputSupplyAmount(0);
    setDepositAmount(0);
    setSliderValue(0);
  }, [currentSelectedSupplyCoin]);

  useEffect(() => {
    setAsset(
      currentSelectedWithdrawlCoin[0] == "r"
        ? currentSelectedWithdrawlCoin.slice(1)
        : currentSelectedWithdrawlCoin
    );
  }, [currentSelectedWithdrawlCoin]);

  useEffect(() => {
    setinputWithdrawlAmount(0);
    setSliderValue2(0);
  }, [currentSelectedWithdrawlCoin]);

  const [depositTransHash, setDepositTransHash] = useState("");
  const [isToastDisplayed, setToastDisplayed] = useState(false);
  const [actionSelected, setActionSelected] = useState("Supply");
  const [toastId, setToastId] = useState<any>();
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState("");
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
  //       toast.success(
  //         `You have successfully supplied ${inputSupplyAmount} ${currentSelectedSupplyCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
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
  //       toast.success(
  //         `You have successfully supplied ${inputSupplyAmount} ${currentSelectedSupplyCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
  //       setToastDisplayed(true);
  //     }
  //   },
  // });

  const handleWithdrawSupply = async () => {
    try {
      const withdraw = await writeAsyncWithdrawDeposit();
      if (withdraw?.transaction_hash) {
        setDepositTransHash(withdraw?.transaction_hash);
        const toastid = toast.info(
          // `Please wait your withdraw transaction is running in background : ${inputWithdrawlAmount}r${asset}`,
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
          transaction_hash: withdraw?.transaction_hash.toString(),
          message: `Successfully withdrawn ${asset}`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
          uniqueID: uqID,
        };
        // addTransaction({ hash: deposit?.transaction_hash });
        activeTransactions?.push(trans_data);
        dispatch(setActiveTransactions(activeTransactions));
      }
      posthog.capture("Withdraw Supply Status", {
        Status: "Success",
        "Token Selected": asset,
        "Token Amount": inputWithdrawlAmount,
      });

      // if (recieptData?.data?.status == "ACCEPTED_ON_L2") {
      // }
      const uqID = getUniqueId();
      let data: any = localStorage.getItem("transactionCheck");
      data = data ? JSON.parse(data) : [];
      if (data && data.includes(uqID)) {
        dispatch(setTransactionStatus("success"));
      }

     //console.log(withdraw);
    } catch (err: any) {
     //console.log("withraw", err);
      posthog.capture("Withdraw Supply Status", {
        Status: "Failure",
      });
      const uqID = getUniqueId();
      let data: any = localStorage.getItem("transactionCheck");
      data = data ? JSON.parse(data) : [];
      if (data && data.includes(uqID)) {
        // dispatch(setTransactionStatus("failed"));
        setWithdrawTransactionStarted(false);
      }
     //console.log(uqID, "your supply catch", data);
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

  const handleAddSupply = async () => {
    try {
      if (ischecked) {
        posthog.capture("Add Supply and Stake selected", {
          Clicked: true,
        });
        const addSupplyAndStake = await writeAsyncDepositStake();
       //console.log(addSupplyAndStake);
        setDepositTransHash(addSupplyAndStake?.transaction_hash);
        if (addSupplyAndStake?.transaction_hash) {

          const toastid = toast.info(
            // `Please wait your transaction is running in background for supply and stake : ${depositAmount} ${supplyAsset} `,
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
            transaction_hash: addSupplyAndStake?.transaction_hash.toString(),
            message: `Successfully supplied and staked ${depositAmount} ${supplyAsset}`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          };
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data);
          posthog.capture("Add Supply and Stake Your Supply Status", {
            Status: "Success",
            "Token Selected": supplyAsset,
            "Token Amount": depositAmount,
          });

          dispatch(setActiveTransactions(activeTransactions));
        }
        const uqID = getUniqueId();
        let data: any = localStorage.getItem("transactionCheck");
        data = data ? JSON.parse(data) : [];
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus("success"));
        }
      } else {
        const addSupply = await writeAsyncDeposit();
        // setDepositTransHash(addSupply?.transaction_hash);
        if (addSupply?.transaction_hash) {

          const toastid = toast.info(
            // `Please wait your transaction is running in background for adding supply : ${depositAmount} ${supplyAsset} `,
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
            transaction_hash: addSupply?.transaction_hash.toString(),
            message: `Successfully added supply : ${depositAmount} ${supplyAsset}`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          };
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data);
          posthog.capture("Add Supply Your Supply Status", {
            Status: "Success",
            "Token Selected": supplyAsset,
            "Token Amount": depositAmount,
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
    } catch (err) {
     //console.log("Unable to add supply ", err);
      const uqID = getUniqueId();
      let data: any = localStorage.getItem("transactionCheck");
     //console.log("data check", data);
      data = data ? JSON.parse(data) : [];
      if (data && data.includes(uqID)) {
       //console.log(uqID, "your supply catch", data);
        // dispatch(setTransactionStatus("failed"));
        setTransactionStarted(false);
      }
      posthog.capture("Add Supply Your Supply Status", {
        Status: "Failure",
      });
      const toastContent = (
        <div>
          Transaction Declined{" "}
          <CopyToClipboard text={err as string}>
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
  useEffect(() => {
    if (currentSelectedSupplyCoin) {
      setSupplyAsset(currentSelectedSupplyCoin);
    }
  }, [currentSelectedSupplyCoin]);
  const [minimumDepositAmount, setMinimumDepositAmount] = useState<any>(0)
  const [maximumDepositAmount, setmaximumDepositAmount] = useState<any>(0)
  const minAmounts = useSelector(selectMinimumDepositAmounts);
  const maxAmounts = useSelector(selectMaximumDepositAmounts);
  useEffect(() => {
    setMinimumDepositAmount(minAmounts["r" + currentSelectedSupplyCoin])
    setmaximumDepositAmount(maxAmounts["r" + currentSelectedSupplyCoin])
  }, [currentSelectedSupplyCoin,minAmounts,maxAmounts])
  
  const getBorrowAPR = (borrowMarket: string) => {
    switch (borrowMarket) {
      case "USDT":
        return protocolStats[0]?.supplyRate;
        break;
      case "USDC":
        return protocolStats[1]?.supplyRate;
        break;
      case "BTC":
        return protocolStats[2]?.supplyRate;
        break;
      case "ETH":
        return protocolStats[3]?.supplyRate;
        break;
      case "DAI":
        return protocolStats[4]?.supplyRate;
        break;

      default:
        break;
    }
  };

  return (
    <Box>
      <Button
        key="suppy"
        height={"2rem"}
        fontSize={"12px"}
        padding="6px 12px"
        border="1px solid #BDBFC1;"
        bgColor="#101216"
        _hover={{ bg: "white", color: "black" }}
        borderRadius={"6px"}
        color="#BDBFC1"
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
        Actions
      </Button>

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
          if (transactionStarted || withdrawTransactionStarted) {
            dispatch(setTransactionStartedAndModalClosed(true));
          }
          resetStates();
        }}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay mt="3.8rem" bg="rgba(244, 242, 255, 0.5);" />
        <ModalContent mt="8rem" background="var(--Base_surface, #02010F)" maxW="464px">
          {/* <ModalHeader>Borrow</ModalHeader> */}
          <ModalCloseButton mt="1rem" mr="1rem" color="white" />
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
                      color="#676D9A"
                      fontSize="sm"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      borderLeftRadius="md"
                      fontWeight="normal"
                      _selected={{
                        color: "white",
                        bg: "#4D59E8",
                        border: "none",
                      }}
                      isDisabled={withdrawTransactionStarted == true}
                    >
                      Add supply
                    </Tab>
                    <Tab
                      py="1"
                      px="3"
                      color="#676D9A"
                      fontSize="sm"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      borderRightRadius="md"
                      fontWeight="normal"
                      _selected={{
                        color: "white",
                        bg: "#4D59E8",
                        border: "none",
                      }}
                      isDisabled={transactionStarted == true}
                    >
                      Withdraw supply
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p="0" m="0">
                      <Card
                        mb="0.5rem"
                        p="1rem"
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        mt="1.5rem"
                      >
                        <Text
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            Market
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="The tokens selected to supply on the protocol."
                            bg="#02010F"
                            fontSize={"13px"}
                            fontWeight={"400"}
                            borderRadius={"lg"}
                            padding={"2"}
                            border="1px solid"
                            borderColor="#23233D"

                            arrowShadowColor="#2B2F35"
                            maxW="272px"
                          // mt="15px"
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
                          mt="0.3rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          onClick={() => {
                            if (transactionStarted) {
                              return;
                            } else {
                              handleDropdownClick(
                                "yourSupplyAddsupplyDropdown"
                              );
                            }
                          }}
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">
                              {getCoin(currentSelectedSupplyCoin)}
                            </Box>
                            <Text color="white" mt="0.15rem">
                              {(currentSelectedSupplyCoin == "BTC" || currentSelectedSupplyCoin == 'ETH') ? "w" + currentSelectedSupplyCoin : currentSelectedSupplyCoin}
                            </Text>
                          </Box>
                          <Box pt="1" className="navbar-button">
                            {activeModal == "yourSupplyAddsupplyDropdown" ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>
                          {modalDropdowns.yourSupplyAddsupplyDropdown && (
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
                                      setCurrentSelectedSupplyCoin(
                                        coin.substring(1)
                                      );
                                      setSupplyAsset(coin);
                                      // dispatch(setCoinSelectedSupplyModal(coin))
                                    }}
                                  >
                                    {coin.substring(1) ===
                                      currentSelectedSupplyCoin && (
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
                                      pl={`${coin.substring(1) ===
                                          currentSelectedSupplyCoin
                                          ? "1"
                                          : "5"
                                        }`}
                                      pr="6px"
                                      gap="1"
                                      bg={`${coin.substring(1) ===
                                          currentSelectedSupplyCoin
                                          ? "#4D59E8"
                                          : "inherit"
                                        }`}
                                      borderRadius="md"
                                      justifyContent="space-between"
                                    >
                                      <Box display="flex">
                                        <Box p="1">
                                          {getCoin(coin.substring(1))}
                                        </Box>
                                        <Text color="white" mt="0.5">
                                          {(coin.substring(1) == "BTC" || coin.substring(1) == 'ETH') ? "w" + coin.substring(1) : coin.substring(1)}
                                        </Text>
                                      </Box>
                                      <Box
                                        fontSize="9px"
                                        color="white"
                                        mt="6px"
                                        fontWeight="thin"
                                      >
                                        Wallet Balance:{" "}
                                        {walletBalances[coin.substring(1)]
                                          ?.dataBalanceOf?.balance
                                          ? numberFormatter(
                                            parseAmount(
                                                String(uint256.uint256ToBN(
                                                  walletBalances[
                                                    coin.substring(1)
                                                  ]?.dataBalanceOf?.balance
                                                )),
                                                tokenDecimalsMap[
                                                coin.substring(1)
                                                ]
                                              )
                                          )
                                          : "-"}
                                      </Box>
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
                            label="The unit of tokens being supplied."
                            bg="#02010F"
                            fontSize={"13px"}
                            fontWeight={"400"}
                            borderRadius={"lg"}
                            padding={"2"}
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
                          width="100%"
                          color="white"
                          border={`${inputSupplyAmount > walletBalance
                              ? "1px solid #CF222E"
                              : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && inputSupplyAmount>0 && inputSupplyAmount>maximumDepositAmount ?
                              "1px solid #CF222E"
                              : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && inputSupplyAmount>0 && inputSupplyAmount<minimumDepositAmount ?
                              "1px solid #CF222E"
                              : inputSupplyAmount < 0
                                ? "1px solid #CF222E"
                                : inputSupplyAmount > 0 &&
                                  inputSupplyAmount <= walletBalance
                                  ? "1px solid #00D395"
                                  : "1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            }`}
                          borderRadius="6px"
                          display="flex"
                          justifyContent="space-between"
                          mt="0.2rem"
                        >
                          <NumberInput
                            border="0px"
                            min={0}
                            keepWithinRange={true}
                            onChange={handleChange}
                            value={inputSupplyAmount ? inputSupplyAmount : ""}
                            outline="none"
                            step={parseFloat(
                              `${inputSupplyAmount <= 99999 ? 0.1 : 0}`
                            )}
                            isDisabled={transactionStarted == true}
                            _disabled={{ cursor: "pointer" }}
                          >
                            <NumberInputField
                              placeholder={process.env.NEXT_PUBLIC_NODE_ENV == "testnet" ? `0.01536 ${currentSelectedSupplyCoin}` : `min ${minimumDepositAmount == null ? 0 : minimumDepositAmount} ${currentSelectedSupplyCoin}`}
                              color={`${inputSupplyAmount > walletBalance
                                  ? "#CF222E"
                                  : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && inputSupplyAmount>maximumDepositAmount ?
                                  "#CF222E"
                                  : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && inputSupplyAmount>0 && inputSupplyAmount<minimumDepositAmount ?
                                  "#CF222E"
                                  : inputSupplyAmount < 0
                                    ? "#CF222E"
                                    : inputSupplyAmount == 0
                                      ? "white"
                                      : "#00D395"
                                }`}
                              border="0px"
                              _disabled={{ color: "#00D395" }}
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
                            color={`${inputSupplyAmount > walletBalance
                                ? "#CF222E"
                                : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && inputSupplyAmount>0 && inputSupplyAmount>maximumDepositAmount ?
                                "#CF222E"
                                : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && inputSupplyAmount>0 && inputSupplyAmount<minimumDepositAmount ?
                                "#CF222E"
                                : inputSupplyAmount < 0
                                  ? "#CF222E"
                                  : inputSupplyAmount == 0
                                    ? "#4D59E8"
                                    : "#00D395"
                              }`}
                            _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
                            onClick={() => {
                              setinputSupplyAmount(walletBalance);
                              setDepositAmount(walletBalance);
                              setinputSupplyAmount(walletBalance);
                              setSliderValue(100);
                            }}
                            isDisabled={transactionStarted == true}
                            _disabled={{ cursor: "pointer" }}
                          >
                            MAX
                          </Button>
                        </Box>
                        {inputSupplyAmount > walletBalance ||(process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && inputSupplyAmount > maximumDepositAmount) ||
                          (process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && inputSupplyAmount>0 && inputSupplyAmount < minimumDepositAmount)|| inputSupplyAmount < 0 ? (
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
                                {inputSupplyAmount > walletBalance
                                  ? "Amount exceeds amount"
                                  : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && inputSupplyAmount > maximumDepositAmount
                            ? "More than max amount"
                            : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && inputSupplyAmount < minimumDepositAmount
                              ? "Less than min amount" 
                                  : "Invalid Input"}
                              </Text>
                            </Text>
                            <Text
                              color="#C7CBF6"
                              display="flex"
                              justifyContent="flex-end"
                            >
                              Wallet Balance: {numberFormatter(walletBalance)}
                              <Text color="#676D9A" ml="0.2rem">
                                {` ${currentSelectedSupplyCoin}`}
                              </Text>
                            </Text>
                          </Text>
                        ) : (
                          <Text
                            color="#C7CBF6"
                            display="flex"
                            justifyContent="flex-end"
                            mt="0.4rem"
                            fontSize="12px"
                            fontWeight="500"
                            fontStyle="normal"
                            fontFamily="Inter"
                          >
                            Wallet Balance: {numberFormatter(walletBalance)}
                            <Text color="#676D9A" ml="0.2rem">
                              {` ${currentSelectedSupplyCoin}`}
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
                              var ans = (val / 100) * walletBalance;
                              if (val == 100) {
                                setinputSupplyAmount(walletBalance);
                                setDepositAmount(walletBalance);
                              } else {
                                if (ans < 10) {
                                  setinputSupplyAmount(parseFloat(ans.toFixed(7)));
                                  setDepositAmount(parseFloat(ans.toFixed(7)));
                                } else {
                                  ans = Math.round(ans * 100) / 100;
                                  // dispatch(setInputSupplyAmount(ans))
                                  setinputSupplyAmount(ans);
                                  setDepositAmount(ans);
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
                      </Card>
                      <Box display="flex" gap="2">
                        <Checkbox
                          size="md"
                          colorScheme="customPurple"
                          defaultChecked
                          mb="auto"
                          mt="1rem"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"

                          isDisabled={transactionStarted == true}
                          _disabled={{
                            cursor: "pointer",
                            iconColor: "blue.400",
                            bg: "blue",
                          }}
                          onChange={() => {
                            setIsChecked(!ischecked);
                          }}
                        />
                        <Text
                          fontSize="14px"
                          fontWeight="400"
                          color="#B1B0B5"
                          mt="1rem"
                          width="100%"
                          lineHeight="20px"
                        >
                          I would like to stake the rTokens.
                        </Text>
                      </Box>

                      <Card
                        mt="1rem"
                        p="1rem"
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        mb="1rem"
                      >
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
                              font-size="12px"
                              lineHeight="16px"
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
                              border="1px solid"
                              borderColor="#23233D"

                              arrowShadowColor="#2B2F35"
                              maxW="272px"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#676D9A">{fees.supply}%</Text>
                        </Text>
                        {/* <Text
                          color="#676D9A"
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
                              color="#676D9A"
                            >
                              Gas estimate:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Estimation of resources & costs for blockchain transactions."
                                bg="#02010F"
                              fontSize={"13px"}
                                         fontWeight={"400"}
                              borderRadius={"lg"}
                            padding={"2"}
    border="1px solid"
                    borderColor="#23233D"

                              arrowShadowColor="#2B2F35"
                              maxW="272px"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#676D9A">$ 0.91</Text>
                        </Text> */}
                        <Text
                          color="#676D9A"
                          display="flex"
                          justifyContent="space-between"
                          fontSize="12px"
                          mb={ischecked ? "0.4rem" : "0rem"}
                        >
                          <Text display="flex" alignItems="center">
                            <Text
                              mr="0.2rem"
                              font-style="normal"
                              font-weight="400"
                              font-size="12px"
                              color="#676D9A"
                            >
                              Supply apr:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Annual interest rate earned on supplied tokens."
                              bg="#02010F"
                              fontSize={"13px"}
                              fontWeight={"400"}
                              borderRadius={"lg"}
                              padding={"2"}
                              border="1px solid"
                              borderColor="#23233D"

                              arrowShadowColor="#2B2F35"
                              maxW="272px"
                            // mb="16px"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#676D9A">
                            {!protocolStats ||
                              protocolStats.length === 0 ||
                              !getBorrowAPR(currentSelectedSupplyCoin) ? (
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
                              getBorrowAPR(currentSelectedSupplyCoin) + "%"
                            )}

                            {/* 7.75% */}
                          </Text>
                        </Text>
                        {ischecked && <Text
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
                              color="#676D9A"
                            >
                              Staking rewards:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Rewards earned in staking activities within the protocol."
                              bg="#02010F"
                              fontSize={"13px"}
                              fontWeight={"400"}
                              borderRadius={"lg"}
                              padding={"2"}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                              arrowShadowColor="#2B2F35"
                              maxW="282px"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#676D9A">
                            +{protocolStats?.find(
                              (stat: any) =>
                                stat?.token ==
                                (currentSelectedSupplyCoin[0] == "r"
                                  ? currentSelectedSupplyCoin.slice(1)
                                  : currentSelectedSupplyCoin)
                            )?.stakingRate
                              ? ((protocolStats?.find(
                                (stat: any) =>
                                  stat?.token ==
                                  (currentSelectedSupplyCoin[0] == "r"
                                    ? currentSelectedSupplyCoin.slice(1)
                                    : currentSelectedSupplyCoin)
                              )?.stakingRate)-getBorrowAPR(currentSelectedSupplyCoin)).toFixed(2)
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
                        </Text>}
                        {ischecked && <Text
                  display="flex"
                  justifyContent="space-between"
                  fontSize="12px"
                  mt="0.5rem"
                  // mb="0.4rem"
                >
                  <Text display="flex" alignItems="center">
                    <Text
                      mr="0.2rem"
                      font-style="normal"
                      font-weight="400"
                      font-size="12px"
                      lineHeight="16px"
                      color="#676D9A"
                    >
                      Note: Staked assets cannot be used as collateral
                    </Text>
                  </Text>

                </Text>}
                      </Card>
                      {currentActionMarket.slice(1) !==
                        currentSelectedSupplyCoin && (
                          <Box
                            // display="flex"
                            // justifyContent="left"
                            w="100%"
                            // pb="2rem"
                            // height="64px"
                            display="flex"
                            alignItems="center"
                            mt="1rem"
                            mb="1rem"
                          >
                            <Box
                              display="flex"
                              bg="#222766"
                              color="#F0F0F5"
                              fontSize="12px"
                              p="4"
                              border="1px solid #3841AA"
                              fontStyle="normal"
                              fontWeight="400"
                              lineHeight="18px"
                              borderRadius="6px"
                            // textAlign="center"
                            >
                              <Box pr="3" mt="0.5" cursor="pointer">
                                <BlueInfoIcon />
                              </Box>
                              You have changed your market from{" "}
                              {currentActionMarket.slice(1) == "BTC" || currentActionMarket.slice(1) == "ETH" ? "w" + currentActionMarket.slice(1) : currentActionMarket.slice(1)} to{" "}
                              {currentSelectedSupplyCoin == "BTC" || currentSelectedSupplyCoin == "ETH" ? "w" + currentSelectedSupplyCoin : currentSelectedSupplyCoin}. your supplied{" "}
                              {currentSelectedSupplyCoin == "BTC" || currentSelectedSupplyCoin == "ETH" ? "w" + currentSelectedSupplyCoin : currentSelectedSupplyCoin} will be added in{" "}
                              {currentSelectedSupplyCoin == "BTC" || currentSelectedSupplyCoin == "ETH" ? "w" + currentSelectedSupplyCoin : currentSelectedSupplyCoin} market.
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
                      {inputSupplyAmount > 0 &&((inputSupplyAmount > 0 && inputSupplyAmount >= minimumDepositAmount) || process.env.NEXT_PUBLIC_NODE_ENV == "testnet") && (process.env.NEXT_PUBLIC_NODE_ENV == "testnet" || inputSupplyAmount <= maximumDepositAmount)&&
                        inputSupplyAmount <= walletBalance ? (
                        <Box
                          onClick={() => {
                            setTransactionStarted(true);
                            posthog.capture(
                              "Add Supply Button Clicked Your Supply",
                              {
                                Clicked: true,
                              }
                            );
                            if (transactionStarted == false) {
                              dispatch(
                                setTransactionStartedAndModalClosed(false)
                              );
                              handleAddSupply();
                            }
                          }}
                        >
                          <AnimatedButton
                            // bgColor="red"
                            // p={0}
                            color="#676D9A"
                            size="sm"
                            width="100%"
                            // mt="1.5rem"
                            mb="1.5rem"
                            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            labelSuccessArray={[
                              "Deposit Amount approved",
                              "Successfully transfered to Hashstack's supply vault.",
                              "Determining the rToken amount to mint.",
                              "rTokens have been minted successfully.",
                              "Transaction complete.",
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={"successButton"}
                                successText={"Supply success"}
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
                            isDisabled={transactionStarted == true}
                          >
                            Supply
                          </AnimatedButton>
                        </Box>
                      ) : (
                        <Button
                          color="#676D9A"
                          size="sm"
                          width="100%"
                          // mt="1.5rem"
                          mb="1.5rem"
                          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
                        >
                          Supply
                        </Button>
                      )}
                    </TabPanel>
                    <TabPanel p="0" m="0">
                      <Card
                        mb="0.5rem"
                        p="1rem"
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        mt="1.5rem"
                      >
                        <Text
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                        >
                          <Text mr="0.3rem" fontSize="12px">
                            Supply market
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="The tokens selected to supply on the protocol."
                            bg="#02010F"
                            fontSize={"13px"}
                            fontWeight={"400"}
                            borderRadius={"lg"}
                            padding={"2"}
                            border="1px solid"
                            borderColor="#23233D"

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
                          mt="0.3rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          onClick={() => {
                            if (withdrawTransactionStarted) {
                              return;
                            } else {
                              handleDropdownClick(
                                "yourSupplyWithdrawlDropdown"
                              );
                            }
                          }}
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">
                              {getCoin(currentSelectedWithdrawlCoin)}
                            </Box>
                            <Text color="white" mt="0.15rem">
                              {currentSelectedWithdrawlCoin}
                            </Text>
                          </Box>
                          <Box pt="1" className="navbar-button">
                            {activeModal == "yourSupplyWithdrawlDropdown" ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>
                          {modalDropdowns.yourSupplyWithdrawlDropdown && (
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
                                      setcurrentSelectedWithdrawlCoin(coin);
                                      setAsset(
                                        coin[0] == "r" ? coin.slice(1) : coin
                                      );
                                      // dispatch(setCoinSelectedSupplyModal(coin))
                                    }}
                                  >
                                    {coin === currentSelectedWithdrawlCoin && (
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
                                      pl={`${coin === currentSelectedWithdrawlCoin
                                          ? "1"
                                          : "5"
                                        }`}
                                      pr="6px"
                                      gap="1"
                                      bg={`${coin === currentSelectedWithdrawlCoin
                                          ? "#4D59E8"
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
                                        Available:{" "}
                                        {
                                          userDeposit?.find(
                                            (item: any) => item?.rToken == coin
                                          )?.rTokenFreeParsed
                                        }
                                      </Box>
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
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Withdraw amount
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="Unit of tokens to be withdrawn."
                            bg="#02010F"
                            fontSize={"13px"}
                            fontWeight={"400"}
                            borderRadius={"lg"}
                            padding={"2"}
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
                          width="100%"
                          color="white"
                          border={`${inputWithdrawlAmount > withdrawWalletBalance
                              ? "1px solid #CF222E"
                              : inputWithdrawlAmount < 0
                                ? "1px solid #CF222E"
                                : inputWithdrawlAmount < 0
                                  ? "1px solid #CF222E"
                                  : inputWithdrawlAmount > 0 &&
                                    inputWithdrawlAmount <= withdrawWalletBalance
                                    ? "1px solid #00D395"
                                    : "1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            }`}
                          borderRadius="6px"
                          display="flex"
                          justifyContent="space-between"
                          mt="0.3rem"
                        >
                          <NumberInput
                            border="0px"
                            min={0}
                            keepWithinRange={true}
                            onChange={handleWithdrawlChange}
                            value={
                              inputWithdrawlAmount ? inputWithdrawlAmount : ""
                            }
                            outline="none"
                            step={parseFloat(
                              `${inputWithdrawlAmount <= 99999 ? 0.1 : 0}`
                            )}
                            isDisabled={withdrawTransactionStarted == true}
                            _disabled={{ cursor: "pointer" }}
                          >
                            <NumberInputField
                              placeholder={`0.01536 ${currentSelectedWithdrawlCoin}`}
                              color={`${inputWithdrawlAmount > withdrawWalletBalance
                                  ? "#CF222E"
                                  : inputWithdrawlAmount < 0
                                    ? "#CF222E"
                                    : inputWithdrawlAmount == 0
                                      ? "white"
                                      : "#00D395"
                                }`}
                              _disabled={{ color: "#00D395" }}
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
                            color={`${inputWithdrawlAmount > withdrawWalletBalance
                                ? "#CF222E"
                                : inputWithdrawlAmount < 0
                                  ? "#CF222E"
                                  : inputWithdrawlAmount == 0
                                    ? "#4D59E8"
                                    : "#00D395"
                              }`}
                            _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
                            onClick={() => {
                              setinputWithdrawlAmount(withdrawWalletBalance);
                              setSliderValue2(100);
                            }}
                            isDisabled={withdrawTransactionStarted == true}
                            _disabled={{ cursor: "pointer" }}
                          >
                            MAX
                          </Button>
                        </Box>
                        {inputWithdrawlAmount > withdrawWalletBalance ||
                          inputWithdrawlAmount < 0 ? (
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
                                {inputWithdrawlAmount > withdrawWalletBalance
                                  ? "Amount exceeds ballance"
                                  : "Invalid Input"}
                              </Text>
                            </Text>
                            <Text
                              color="#C7CBF6"
                              display="flex"
                              justifyContent="flex-end"
                            >
                              Available:{" "}
                              {numberFormatter(withdrawWalletBalance)}
                              <Text color="#676D9A" ml="0.2rem">
                                {` ${currentSelectedWithdrawlCoin}`}
                              </Text>
                            </Text>
                          </Text>
                        ) : (
                          <Text
                            color="#C7CBF6"
                            display="flex"
                            justifyContent="flex-end"
                            mt="0.4rem"
                            fontSize="12px"
                            fontWeight="500"
                            fontStyle="normal"
                            fontFamily="Inter"
                          >
                            Available:{" "}
                            {numberFormatter(withdrawWalletBalance)}
                            <Text color="#676D9A" ml="0.2rem">
                              {` ${currentSelectedWithdrawlCoin}`}
                            </Text>
                          </Text>
                        )}
                        <Box pt={5} pb={2} mt="1rem">
                          <Slider
                            aria-label="slider-ex-6"
                            defaultValue={sliderValue2}
                            value={sliderValue2}
                            onChange={(val) => {
                              setSliderValue2(val);
                              if (val == 100) {
                                setinputWithdrawlAmount(withdrawWalletBalance);
                              } else {
                                var ans = (val / 100) * withdrawWalletBalance;
                                if (ans < 10) {
                                  setinputWithdrawlAmount(parseFloat(ans.toFixed(7)));
                                } else {
                                  ans = Math.round(ans * 100) / 100;
                                  // dispatch(setInputSupplyAmount(ans))
                                  setinputWithdrawlAmount(ans);
                                }
                              }
                            }}
                            focusThumbOnChange={false}
                            isDisabled={withdrawTransactionStarted == true}
                            _disabled={{ cursor: "pointer" }}
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
                      </Card>

                      <Card
                        mt="1.5rem"
                        p="1rem"
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        mb="0.5rem"
                      >
                        <Text
                          color="#676D9A"
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
                              color="#676D9A"
                            >
                              est. supply unlocked:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Estimated amount available for withdrawal from the deposited tokens."
                              bg="#02010F"
                              fontSize={"13px"}
                              fontWeight={"400"}
                              borderRadius={"lg"}
                              padding={"2"}
                              border="1px solid"
                              borderColor="#23233D"

                              arrowShadowColor="#2B2F35"
                              maxW="247px"
                            // mt="15px"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          {!estSupply ? (
                            <Skeleton
                              width="3rem"
                              height="1rem"
                              startColor="#2B2F35"
                              endColor="#101216"
                              borderRadius="6px"
                              ml={2}
                            />
                          ) : (
                            <Text color="#676D9A"> {estSupply}</Text>
                          )}
                        </Text>
                        {/* <Text
                          color="#676D9A"
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
                              color="#676D9A"
                            >
                              Earned APR:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              bg="#101216"
                              padding="16px"
                              border="1px solid #2B2F35"
                              borderRadius="6px"
                              label={
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  justifyContent="space-between"
                                  width="226px"
                                  gap="6px"
                                >
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    fontSize="12px"
                                    fontStyle="normal"
                                    fontWeight="500"
                                  >
                                    <Box display="flex">
                                      <ETHLogo height={"16px"} width={"16px"} />
                                      rETH =
                                    </Box>
                                    <Text>x</Text>
                                  </Box>
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    fontSize="12px"
                                    fontStyle="normal"
                                    fontWeight="500"
                                  >
                                    <Box display="flex">
                                      1
                                      <ETHLogo height={"16px"} width={"16px"} />
                                      rETH =
                                    </Box>
                                    <Box display="flex">
                                      y
                                      <ETHLogo height={"16px"} width={"16px"} />
                                    </Box>
                                  </Box>
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    fontSize="12px"
                                    fontStyle="normal"
                                    fontWeight="500"
                                  >
                                    <Box display="flex">1X =</Box>
                                    <Box display="flex">
                                      z USD{" "}
                                      <USDTLogo
                                        height={"16px"}
                                        width={"16px"}
                                      />
                                    </Box>
                                  </Box>
                                  <Box
                                    fontSize="12px"
                                    fontStyle="normal"
                                    fontWeight="500"
                                    width="142px"
                                    mt="4px"
                                  >
                                    est. collateral value in usd = x * y * z =
                                    us $ a.
                                  </Box>
                                  <Box></Box>
                                </Box>
                              }
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#676D9A">1.240 rETH</Text>
                        </Text> */}
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
                              font-size="12px"
                              lineHeight="16px"
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
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"

                              arrowShadowColor="#2B2F35"
                              maxW="222px"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#676D9A">
                            {fees.withdrawSupply}%
                          </Text>
                        </Text>
                        {/* <Text
                          color="#676D9A"
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
                              color="#676D9A"
                            >
                              Gas Estimate:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Estimation of resources & costs for blockchain transactions."
                                bg="#02010F"
                              fontSize={"13px"}
                                         fontWeight={"400"}
                              borderRadius={"lg"}
                            padding={"2"}
    border="1px solid"
                    borderColor="#23233D"

                              arrowShadowColor="#2B2F35"
                              maxW="292px"
                              // mb="15px"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#676D9A">$ 0.91</Text>
                        </Text> */}
                      </Card>
                      {inputWithdrawlAmount > 0 &&
                        inputWithdrawlAmount <= withdrawWalletBalance ? (
                        <Box
                          onClick={() => {
                            setWithdrawTransactionStarted(true);
                            if (withdrawTransactionStarted == false) {
                              posthog.capture(
                                "Withdraw Button Clicked your supply",
                                {
                                  Clicked: true,
                                }
                              );
                              dispatch(
                                setTransactionStartedAndModalClosed(false)
                              );
                              handleWithdrawSupply();
                            }
                          }}
                        >
                          <AnimatedButton
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
                              "Checking if sufficient rTokens are available",
                              <Text key={0} display="flex">
                                Fetching the exchange between{" "}
                                <Text ml="0.4rem" mr="0.1rem">
                                  {getCoin(currentSelectedWithdrawlCoin)}
                                </Text>{" "}
                                {currentSelectedWithdrawlCoin} &
                                <Text key={1} ml="0.3rem" mr="0.1rem">
                                  {getCoin(currentSelectedWithdrawlCoin)}
                                </Text>
                                {currentSelectedWithdrawlCoin.slice(1)}
                              </Text>,
                              <Text key={2} display="flex">
                                Burning {inputWithdrawlAmount}
                                <Text ml="0.5rem" mr="0.1rem">
                                  {getCoin(currentSelectedWithdrawlCoin)}
                                </Text>{" "}
                                {currentSelectedWithdrawlCoin}
                              </Text>,
                              "Processing Withdrawal",
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={"successButton"}
                                successText={"Withdrawal Succesful"}
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
                            _disabled={{ bgColor: "white", color: "black" }}
                            isDisabled={withdrawTransactionStarted == true}
                            currentTransactionStatus={currentTransactionStatus}
                            setCurrentTransactionStatus={
                              setCurrentTransactionStatus
                            }
                          // _disabled={{ bgColor: "white", color: "black" }}
                          // isDisabled={withdrawTransactionStarted == true}
                          >
                            Withdraw
                          </AnimatedButton>
                        </Box>
                      ) : (
                        <Button
                          color="#676D9A"
                          size="sm"
                          width="100%"
                          mt="1.5rem"
                          mb="1.5rem"
                          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
                        >
                          Withdraw
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

export default YourSupplyModal;

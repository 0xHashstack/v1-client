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
import { BNtoNum } from "@/Blockchain/utils/utils";
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
import { selectUserDeposits } from "@/store/slices/readDataSlice";
import BlueInfoIcon from "@/assets/icons/blueinfoicon";
import numberFormatter from "@/utils/functions/numberFormatter";
const YourSupplyModal = ({
  currentSelectedSupplyCoin,
  setCurrentSelectedSupplyCoin,
  currentSelectedWithdrawlCoin,
  setcurrentSelectedWithdrawlCoin,
  currentActionMarket,
  coins,
  protocolStats,
}: any) => {
  // console.log(coins,"coins in supply modal")
  // console.log(currentSelectedSupplyCoin,"coin in your suppply");
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
    USDT: useBalanceOf(tokenAddressMap["USDT"] || ""),
    USDC: useBalanceOf(tokenAddressMap["USDC"] || ""),
    BTC: useBalanceOf(tokenAddressMap["BTC"] || ""),
    ETH: useBalanceOf(tokenAddressMap["ETH"] || ""),
    DAI: useBalanceOf(tokenAddressMap["DAI"] || ""),
    rBTC: useBalanceOf(tokenAddressMap["rBTC"] || ""),
    rUSDT: useBalanceOf(tokenAddressMap["rUSDT"] || ""),
    rUSDC: useBalanceOf(tokenAddressMap["rUSDC"] || ""),
    rETH: useBalanceOf(tokenAddressMap["rETH"] || ""),
    rDAI: useBalanceOf(tokenAddressMap["rDAI"] || ""),
  };
  const userDeposit = useSelector(selectUserDeposits);
  // console.log(userDeposit,"user deposit your supply")
  const [walletBalance, setwalletBalance] = useState(
    walletBalances[currentSelectedSupplyCoin]?.statusBalanceOf === "success"
      ? Number(
          BNtoNum(
            uint256.uint256ToBN(
              walletBalances[currentSelectedSupplyCoin]?.dataBalanceOf?.balance
            ),
            tokenDecimalsMap[currentSelectedSupplyCoin]
          )
        )
      : 0
  );
  // console.log(currentSelectedWithdrawlCoin)
  const [withdrawWalletBalance, setWithdrawWalletBalance] = useState<any>(
    userDeposit?.find(
      (item: any) => item.rToken == currentSelectedWithdrawlCoin
    )?.rTokenFreeParsed
  );

  useEffect(() => {
    setwalletBalance(
      walletBalances[currentSelectedSupplyCoin]?.statusBalanceOf === "success"
        ? Number(
            BNtoNum(
              uint256.uint256ToBN(
                walletBalances[currentSelectedSupplyCoin]?.dataBalanceOf
                  ?.balance
              ),
              tokenDecimalsMap[currentSelectedSupplyCoin]
            )
          )
        : 0
    );
    // console.log("supply modal status wallet balance",walletBalances[currentSelectedSupplyCoin]?.statusBalanceOf)
  }, [
    walletBalances[currentSelectedSupplyCoin]?.statusBalanceOf,
    currentSelectedSupplyCoin,
  ]);
  useEffect(() => {
    setWithdrawWalletBalance(
      userDeposit?.find(
        (item: any) => item.rToken == currentSelectedWithdrawlCoin
      )?.rTokenFreeParsed
    );
    // console.log("supply modal status wallet balance",walletBalances[currentSelectedWithdrawlCoin]?.statusBalanceOf)
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
    isLoadingDepositStake,
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
    isLoadingDeposit,
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
    isLoadingWithdrawDeposit,
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
    var percentage = (newValue * 100) / walletBalance;
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
          console.log(data, "data in your supply");
          setEstSupply(data);
        }
      } catch (err) {
        console.log(err, "err in you supply");
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
    dispatch(setTransactionStatus(""));
    setToastDisplayed(false);
    setDepositTransHash("");
    setEstSupply(undefined);
    setCurrentTransactionStatus("");
  };
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );

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
  //     console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus("success");
  //     toast.dismiss(toastId);
  //     console.log("trans pending");
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
      setDepositTransHash(withdraw?.transaction_hash);
      if (withdraw?.transaction_hash) {
        console.log("toast here");
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
        const trans_data = {
          transaction_hash: withdraw?.transaction_hash.toString(),
          message: `Successfully withdrawn :  : ${inputWithdrawlAmount}r${asset}`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
        };
        // addTransaction({ hash: deposit?.transaction_hash });
        activeTransactions?.push(trans_data);
        mixpanel.track("Withdraw Supply Status", {
          Status: "Success",
          "Token Selected": asset,
          "Token Amount": inputWithdrawlAmount,
        });

        dispatch(setActiveTransactions(activeTransactions));
      }
      // if (recieptData?.data?.status == "ACCEPTED_ON_L2") {
      // }
      dispatch(setTransactionStatus("success"));
      console.log(withdraw);
    } catch (err: any) {
      console.log("withraw", err);
      dispatch(setTransactionStatus("failed"));
      mixpanel.track("Withdraw Supply Status", {
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

  const handleAddSupply = async () => {
    try {
      if (ischecked) {
        mixpanel.track("Add Supply and Stake selected", {
          Clicked: true,
        });
        const addSupplyAndStake = await writeAsyncDepositStake();
        console.log(addSupplyAndStake);
        setDepositTransHash(addSupplyAndStake?.transaction_hash);
        if (addSupplyAndStake?.transaction_hash) {
          console.log("trans transaction hash created");
          console.log("toast here");
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
          const trans_data = {
            transaction_hash: addSupplyAndStake?.transaction_hash.toString(),
            message: `Successfully supplied and staked ${depositAmount} ${supplyAsset}`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
          };
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data);
          mixpanel.track("Add Supply and Stake Your Supply Status", {
            Status: "Success",
            "Token Selected": supplyAsset,
            "Token Amount": depositAmount,
          });

          dispatch(setActiveTransactions(activeTransactions));
        }
        dispatch(setTransactionStatus("success"));
        console.log("addSupply", addSupplyAndStake);
      } else {
        const addSupply = await writeAsyncDeposit();
        // setDepositTransHash(addSupply?.transaction_hash);
        if (addSupply?.transaction_hash) {
          console.log("trans transaction hash created");
          console.log("toast here");
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
          const trans_data = {
            transaction_hash: addSupply?.transaction_hash.toString(),
            message: `Successfully added supply : ${depositAmount} ${supplyAsset}`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
          };
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data);
          mixpanel.track("Add Supply Your Supply Status", {
            Status: "Success",
            "Token Selected": supplyAsset,
            "Token Amount": depositAmount,
          });

          dispatch(setActiveTransactions(activeTransactions));
        }
        dispatch(setTransactionStatus("success"));
        console.log("addSupply", addSupply);
      }
    } catch (err) {
      console.log("Unable to add supply ", err);
      dispatch(setTransactionStatus("failed"));
      mixpanel.track("Add Supply Your Supply Status", {
        Status: "Failure",
      });
      const toastContent = (
        <div>
          Transaction failed{" "}
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
        onClick={onOpen}
      >
        Actions
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
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
        <ModalContent mt="8rem" bg={"#010409"} maxW="464px">
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
                      isDisabled={withdrawTransactionStarted == true}
                    >
                      Add supply
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
                    >
                      Withdraw supply
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
                            Market
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
                              {currentSelectedSupplyCoin}
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
                                        bg="#0C6AD9"
                                        borderRightRadius="md"
                                      ></Box>
                                    )}
                                    <Box
                                      w="full"
                                      display="flex"
                                      py="5px"
                                      pl={`${
                                        coin.substring(1) ===
                                        currentSelectedSupplyCoin
                                          ? "1"
                                          : "5"
                                      }`}
                                      pr="6px"
                                      gap="1"
                                      bg={`${
                                        coin.substring(1) ===
                                        currentSelectedSupplyCoin
                                          ? "#0C6AD9"
                                          : "inherit"
                                      }`}
                                      borderRadius="md"
                                      justifyContent="space-between"
                                    >
                                      <Box display="flex">
                                        <Box p="1">
                                          {getCoin(coin.substring(1))}
                                        </Box>
                                        <Text color="white">
                                          {coin.substring(1)}
                                        </Text>
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
                                                walletBalances[
                                                  coin.substring(1)
                                                ]?.dataBalanceOf?.balance
                                              ),
                                              tokenDecimalsMap[
                                                coin.substring(1)
                                              ]
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
                        <Box
                          width="100%"
                          color="white"
                          border={`${
                            inputSupplyAmount > walletBalance
                              ? "1px solid #CF222E"
                              : inputSupplyAmount < 0
                              ? "1px solid #CF222E"
                              : inputSupplyAmount > 0 &&
                                inputSupplyAmount <= walletBalance
                              ? "1px solid #1A7F37"
                              : "1px solid #2B2F35 "
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
                              placeholder={`Minimum 0.01536 ${currentSelectedSupplyCoin}`}
                              color={`${
                                inputSupplyAmount > walletBalance
                                  ? "#CF222E"
                                  : inputSupplyAmount < 0
                                  ? "#CF222E"
                                  : inputSupplyAmount == 0
                                  ? "white"
                                  : "#1A7F37"
                              }`}
                              border="0px"
                              _disabled={{ color: "#1A7F37" }}
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
                            color="#0969DA"
                            _hover={{ bg: "#101216" }}
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
                        {inputSupplyAmount > walletBalance ||
                        inputSupplyAmount < 0 ? (
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
                                  : "Invalid Input"}
                              </Text>
                            </Text>
                            <Text
                              color="#E6EDF3"
                              display="flex"
                              justifyContent="flex-end"
                            >
                              Wallet Balance: {numberFormatter(walletBalance)}
                              <Text color="#6E7781" ml="0.2rem">
                                {` ${currentSelectedSupplyCoin}`}
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
                            Wallet Balance: {numberFormatter(walletBalance)}
                            <Text color="#6E7781" ml="0.2rem">
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
                                ans = Math.round(ans * 100) / 100;
                                // dispatch(setInputSupplyAmount(ans))
                                setinputSupplyAmount(ans);
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
                      <Box display="flex" gap="2">
                        <Checkbox
                          size="md"
                          colorScheme="customBlue"
                          defaultChecked
                          mb="auto"
                          mt="1.2rem"
                          borderColor="#2B2F35"
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
                          fontSize="12px"
                          fontWeight="400"
                          color="#6E7681"
                          mt="1rem"
                          lineHeight="20px"
                        >
                          Ticking would stake the received rTokens. unchecking
                          woudn&apos;t stake rTokens
                        </Text>
                      </Box>

                      <Card
                        bg="#101216"
                        mt="1rem"
                        p="1rem"
                        border="1px solid #2B2F35"
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
                              color="#6A737D"
                            >
                              Fees:
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
                          <Text color="#6E7681">{TransactionFees.stake}%</Text>
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
                              Supply apr:
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
                          <Text color="#6E7681">
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
                            You have changed your market from{" "}
                            {currentActionMarket.slice(1)} to{" "}
                            {currentSelectedSupplyCoin}. your supplied{" "}
                            {currentSelectedSupplyCoin} will be added in{" "}
                            {currentSelectedSupplyCoin} market.
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
                      {inputSupplyAmount > 0 &&
                      inputSupplyAmount <= walletBalance ? (
                        <Box
                          onClick={() => {
                            setTransactionStarted(true);
                            mixpanel.track(
                              "Add Supply Button Clicked Your Supply",
                              {
                                Clicked: true,
                              }
                            );
                            dispatch(
                              setTransactionStartedAndModalClosed(false)
                            );
                            handleAddSupply();
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
                          bg="#101216"
                          color="#6E7681"
                          size="sm"
                          width="100%"
                          // mt="1.5rem"
                          mb="1.5rem"
                          border="1px solid #2B2F35"
                          _hover={{ bg: "#101216" }}
                        >
                          Supply
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
                          <Text mr="0.3rem" fontSize="12px">
                            Supply market
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
                                        bg="#0C6AD9"
                                        borderRightRadius="md"
                                      ></Box>
                                    )}
                                    <Box
                                      w="full"
                                      display="flex"
                                      py="5px"
                                      pl={`${
                                        coin === currentSelectedWithdrawlCoin
                                          ? "1"
                                          : "5"
                                      }`}
                                      pr="6px"
                                      gap="1"
                                      bg={`${
                                        coin === currentSelectedWithdrawlCoin
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
                                        {
                                          userDeposit?.find(
                                            (item: any) => item.rToken == coin
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
                          color="#8B949E"
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
                        <Box
                          width="100%"
                          color="white"
                          border={`${
                            inputWithdrawlAmount >
                            withdrawWalletBalance?.toFixed(2)
                              ? "1px solid #CF222E"
                              : inputWithdrawlAmount < 0
                              ? "1px solid #CF222E"
                              : inputWithdrawlAmount < 0
                              ? "1px solid #CF222E"
                              : inputWithdrawlAmount > 0 &&
                                inputWithdrawlAmount <=
                                  withdrawWalletBalance?.toFixed(2)
                              ? "1px solid #1A7F37"
                              : "1px solid #2B2F35 "
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
                              placeholder={`Minimum 0.01536 ${currentSelectedWithdrawlCoin}`}
                              color={`${
                                inputWithdrawlAmount >
                                withdrawWalletBalance?.toFixed(2)
                                  ? "#CF222E"
                                  : inputWithdrawlAmount < 0
                                  ? "#CF222E"
                                  : inputWithdrawlAmount == 0
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
                            color="#0969DA"
                            _hover={{ bg: "#101216" }}
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
                        {inputWithdrawlAmount > walletBalance ||
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
                              color="#E6EDF3"
                              display="flex"
                              justifyContent="flex-end"
                            >
                              Wallet Balance: {withdrawWalletBalance}
                              <Text color="#6E7781" ml="0.2rem">
                                {` ${currentSelectedWithdrawlCoin}`}
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
                            Wallet Balance: {withdrawWalletBalance}
                            <Text color="#6E7781" ml="0.2rem">
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
                              var ans = (val / 100) * withdrawWalletBalance;
                              ans = Math.round(ans * 100) / 100;
                              // dispatch(setInputSupplyAmount(ans))
                              setinputWithdrawlAmount(ans);
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
                        mt="1.5rem"
                        p="1rem"
                        border="1px solid #2B2F35"
                        mb="0.5rem"
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
                              est. supply unlocked:
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
                            <Text color="#6E7681">$ {estSupply}</Text>
                          )}
                        </Text>
                        {/* <Text
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
                          <Text color="#6E7681">1.240 rETH</Text>
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
                              color="#6A737D"
                            >
                              Fees:
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
                          <Text color="#6E7681">
                            {TransactionFees.withdrawSupply}%
                          </Text>
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
                              Gas Estimate balance:
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
                          <Text color="#6E7681">$ 0.91</Text>
                        </Text>
                      </Card>
                      {inputWithdrawlAmount > 0 &&
                      inputWithdrawlAmount <= walletBalance ? (
                        <Box
                          onClick={() => {
                            setWithdrawTransactionStarted(true);
                            if (withdrawTransactionStarted == false) {
                              mixpanel.track(
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
                              "Processing Withdrawl",
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={"successButton"}
                                successText={"Withdrawl Success"}
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
                          bg="#101216"
                          color="#6E7681"
                          size="sm"
                          width="100%"
                          mt="1.5rem"
                          mb="1.5rem"
                          border="1px solid #2B2F35"
                          _hover={{ bg: "#101216" }}
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

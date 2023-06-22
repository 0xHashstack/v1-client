// @ts-nocheck

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
  TabList,
  Tab,
  TabPanel,
  Tabs,
  TabPanels,
  RadioGroup,
  Radio,
  NumberInput,
  Slider,
  SliderMark,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  NumberInputField,
  Stack,
  Card,
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
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import DropdownUp from "../../assets/icons/dropdownUpIcon";
import InfoIcon from "../../assets/icons/infoIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalDropdown,
  selectNavDropdowns,
  selectModalDropDowns,
  resetModalDropdowns,
} from "@/store/slices/dropdownsSlice";
import { useEffect, useState } from "react";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import EthToUsdt from "@/assets/icons/pools/ethToUsdt";
import SmallEth from "@/assets/icons/coins/smallEth";
import SmallUsdt from "@/assets/icons/coins/smallUsdt";
import MySwapDisabled from "@/assets/icons/dapps/mySwapDisabled";
import UsdcToUsdt from "@/assets/icons/pools/usdcToUsdt";
import EthToUsdc from "@/assets/icons/pools/ethToUsdc";
import DaiToEth from "@/assets/icons/pools/daiToEth";
import BtcToEth from "@/assets/icons/pools/btcToEth";
import BtcToUsdt from "@/assets/icons/pools/btcToUsdt";

import {
  selectUserLoans,
  selectWalletBalance,
  // setCurrentTransactionStatus,
  setInputYourBorrowModalRepayAmount,
  setTransactionStatus,
} from "@/store/slices/userAccountSlice";

import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import SmallErrorIcon from "@/assets/icons/smallErrorIcon";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import ArrowUp from "@/assets/icons/arrowup";
import useRepay from "@/Blockchain/hooks/Writes/useRepay";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import useAddCollateral from "@/Blockchain/hooks/Writes/useAddCollateral";
import useSwap from "../../Blockchain/hooks/Writes/useSwap";
import useLiquidity from "@/Blockchain/hooks/Writes/useLiquidity";
import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
import {
  getTokenFromName,
  tokenAddressMap,
  tokenDecimalsMap,
} from "@/Blockchain/utils/addressServices";
import { BNtoNum } from "@/Blockchain/utils/utils";
import { uint256 } from "starknet";
import { useWaitForTransaction } from "@starknet-react/core";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
import useRevertInteractWithL3 from "@/Blockchain/hooks/Writes/useRevertInteractWithL3";

import { getJediEstimatedLpAmountOut } from "../../Blockchain/scripts/l3interaction";
import { getAddress } from "ethers/lib/utils";
import { getTokenFromAddress } from "@/Blockchain/stark-constants";

const YourBorrowModal = ({
  borrowIDCoinMap,
  currentID,
  currentMarket,
  currentBorrowId1,
  setCurrentBorrowId1,
  currentBorrowMarketCoin1,
  setCurrentBorrowMarketCoin1,
  currentBorrowId2,
  setCurrentBorrowId2,
  currentBorrowMarketCoin2,
  setCurrentBorrowMarketCoin2,
  collateralBalance,
  setCollateralBalance,
  borrowIds,
  buttonText,
  BorrowBalance,
  loan,
  ...restProps
}: any) => {
  // console.log(currentBorrowId1);
  // console.log(currentID)
  // console.log(borrowIds);
  // console.log("took map", borrowIDCoinMap, currentID, currentMarket);
  // console.log();

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const dispatch = useDispatch();
  const dispatch = useDispatch();
  const [sliderValue1, setSliderValue1] = useState(0);
  const modalDropdowns = useSelector(selectModalDropDowns);
  const [inputAmount1, setinputAmount1] = useState(0);
  // const [currentBorrowId, setCurrentBorrowId] = useState(currentBorrowId1.slice(currentBorrowId1.indexOf("-") + 1).trim());
  // console.log(currentBorrowId);
  const [transactionStarted, setTransactionStarted] = useState(false);
  const [collateralTransactionStarted, setCollateralTransactionStarted] =
    useState(false);
  const [borrowAmount, setBorrowAmount] = useState(BorrowBalance);
  const userLoans = useSelector(selectUserLoans);
  useEffect(() => {
    const result = userLoans.find(
      (item: any) =>
        item?.loanId ==
        currentBorrowId1.slice(currentBorrowId1.indexOf("-") + 1).trim()
    );
    setBorrowAmount(result?.loanAmountParsed);
    // console.log(borrowAmount)
    // Rest of your code using the 'result' variable
  }, [currentBorrowId1]);
  const {
    loanId,
    setLoanId,
    collateralAsset,
    setCollateralAsset,
    collateralAmount,
    setCollateralAmount,

    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount,

    dataAddCollateral,
    errorAddCollateral,
    resetAddCollateral,
    writeAddCollateral,
    writeAsyncAddCollateral,
    isErrorAddCollateral,
    isIdleAddCollateral,
    isLoadingAddCollateral,
    isSuccessAddCollateral,
    statusAddCollateral,

    dataAddCollateralRToken,
    errorAddCollateralRToken,
    resetAddCollateralRToken,
    writeAddCollateralRToken,
    writeAsyncAddCollateralRToken,
    isErrorAddCollateralRToken,
    isIdleAddCollateralRToken,
    isLoadingAddCollateralRToken,
    isSuccessAddCollateralRToken,
    statusAddCollateralRToken,
  } = useAddCollateral();

  const {
    repayAmount,
    setRepayAmount,
    // handleApprove,
    writeAsyncRepay,
    transRepayHash,
    setTransRepayHash,
    repayTransactionReceipt,
    isLoadingRepay,
    errorRepay,
    handleRepayBorrow,

    //SelfLiquidate - Repay with 0 amount
    writeAsyncSelfLiquidate,
    isLoadingSelfLiquidate,
    errorSelfLiquidate,
    selfLiquidateTransactionReceipt,
    setIsSelfLiquidateHash,
  } = useRepay(loan);

  const {
    swapLoanId,
    setSwapLoanId,
    toMarket,
    setToMarket,

    dataJediSwap_swap,
    errorJediSwap_swap,
    writeJediSwap_swap,
    writeAsyncJediSwap_swap,
    isIdleJediSwap_swap,
    isLoadingJediSwap_swap,
    statusJediSwap_swap,

    datamySwap_swap,
    errormySwap_swap,
    writemySwap_swap,
    writeAsyncmySwap_swap,
    isIdlemySwap_swap,
    isLoadingmySwap_swap,
    statusmySwap_swap,
  } = useSwap();

  const {
    liquidityLoanId,
    setLiquidityLoanId,
    toMarketA,
    setToMarketA,

    toMarketB,
    setToMarketB,

    dataJediSwap_addLiquidity,
    errorJediSwap_addLiquidity,
    writeJediSwap_addLiquidity,
    writeAsyncJediSwap_addLiquidity,
    isIdleJediSwap_addLiquidity,
    isLoadingJediSwap_addLiquidity,
    statusJediSwap_addLiquidity,

    datamySwap_addLiquidity,
    errormySwap_addLiquidity,
    writemySwap_addLiquidity,
    writeAsyncmySwap_addLiquidity,
    isIdlemySwap_addLiquidity,
    isLoadingmySwap_addLiquidity,
    statusmySwap_addLiquidity,
  } = useLiquidity();
  const {
    revertLoanId,
    setRevertLoanId,

    dataRevertInteractWithL3,
    writeAsyncRevertInteractWithL3,
    writeRevertInteractWithL3,
    errorRevertInteractWithL3,
    isIdleRevertInteractWithL3,
    isLoadingRevertInteractWithL3,
  } = useRevertInteractWithL3();

  const handleRevertTransaction = async () => {
    try {
      setRevertLoanId(
        currentBorrowId1.slice(currentBorrowId1.indexOf("-") + 1).trim()
      );
      const revert = await writeAsyncRevertInteractWithL3();
      setCurrentTransactionStatus(revert?.transaction_hash);
      console.log(revert);
      dispatch(setTransactionStatus("success"));
    } catch (err) {
      console.log(err);
      dispatch(setTransactionStatus("failed"));
    }
  };
  // const [lpamount, setLpamount] = useState([]);
  // useEffect(() => {
  //   const getJediEstimatedLpAmount = async () => {
  //     await getJediEstimatedLpAmountOut();
  //   };
  // }, []);

  interface assetB {
    USDT: any;
    USDC: any;
    BTC: any;
    ETH: any;
    DAI: any;
  }
  const walletBalances: assetB = {
    USDT: useBalanceOf(tokenAddressMap["USDT"] || ""),
    USDC: useBalanceOf(tokenAddressMap["USDC"] || ""),
    BTC: useBalanceOf(tokenAddressMap["BTC"] || ""),
    ETH: useBalanceOf(tokenAddressMap["ETH"] || ""),
    DAI: useBalanceOf(tokenAddressMap["DAI"] || ""),
  };
  const [walletBalance, setwalletBalance] = useState(
    walletBalances[collateralAsset]?.statusBalanceOf === "success"
      ? Number(
          BNtoNum(
            uint256.uint256ToBN(
              walletBalances[collateralAsset]?.dataBalanceOf?.balance
            ),
            tokenDecimalsMap[collateralAsset]
          )
        )
      : 0
  );
  useEffect(() => {
    setwalletBalance(
      walletBalances[collateralAsset]?.statusBalanceOf === "success"
        ? Number(
            BNtoNum(
              uint256.uint256ToBN(
                walletBalances[collateralAsset]?.dataBalanceOf?.balance
              ),
              tokenDecimalsMap[collateralAsset]
            )
          )
        : 0
    );
    // console.log("supply modal status wallet balance",walletBalances[coin.name]?.statusBalanceOf)
  }, [
    walletBalances[collateralAsset]?.statusBalanceOf,
    collateralAsset,
    currentBorrowId2,
  ]);

  useEffect(() => {
    if (loan) {
      setCollateralAsset(
        loan?.collateralMarket[0] == "r"
          ? loan?.collateralMarket.slice(1)
          : loan?.collateralMarket
      );
      setRToken(loan?.collateralMarket);
    }
  }, [loan]);

  useEffect(() => {
    // setSwapLoanId(currentBorrowId1);
    setSwapLoanId(
      currentBorrowId1.slice(currentBorrowId1.indexOf("-") + 1).trim()
    );
    setLiquidityLoanId(
      currentBorrowId1.slice(currentBorrowId1.indexOf("-") + 1).trim()
    );
  }, [currentBorrowId1]);
  // console.log(userLoans);

  useEffect(() => {
    setLoanId(currentBorrowId2.slice(currentBorrowId2.indexOf("-") + 1).trim());
    // console.log(currentBorrowMarketCoin2);
    const result = userLoans.find(
      (item: any) =>
        item?.loanId ==
        currentBorrowId2.slice(currentBorrowId2.indexOf("-") + 1).trim()
    );
    setCollateralAsset(
      result?.collateralMarket[0] == "r"
        ? result?.collateralMarket.slice(1)
        : result?.collateralMarket
    );
    setRToken(result?.collateralMarket);

    console.log(rToken);
  }, [currentBorrowId2, currentBorrowMarketCoin2]);

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
      case "dBTC":
        return <BTCLogo height={"16px"} width={"16px"} />;
        break;
      case "dUSDC":
        return <USDCLogo height={"16px"} width={"16px"} />;
        break;
      case "dUSDT":
        return <USDTLogo height={"16px"} width={"16px"} />;
        break;
      case "dETH":
        return <ETHLogo height={"16px"} width={"16px"} />;
        break;
      case "dDAI":
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
  const [radioValue, setRadioValue] = useState("1");

  // const [currentBorrowMarketCoin1, setCurrentBorrowMarketCoin1] =
  //   useState(currentMarket);
  // const [currentBorrowMarketCoin2, setCurrentBorrowMarketCoin2] =
  //   useState(currentMarket);
  const [currentPoolCoin, setCurrentPoolCoin] = useState("Select a pool");
  const [currentAction, setCurrentAction] = useState("Spend Borrow");
  // const [currentBorrowId1, setCurrentBorrowId1] = useState(`ID - ${currentID}`);
  // const [currentBorrowId2, setCurrentBorrowId2] = useState(`ID - ${currentID}`);
  const [currentDapp, setCurrentDapp] = useState("Select a dapp");
  const [currentPool, setCurrentPool] = useState("Select a pool");
  // console.log(currentDapp)
  // console.log(currentPool.split('/')[0])
  const [depositTransHash, setDepositTransHash] = useState("");

  const [currentTransactionStatus, setCurrentTransactionStatus] =
    useState(false);
  const [isToastDisplayed, setToastDisplayed] = useState(false);
  const [toastId, setToastId] = useState<any>();
  const recieptData = useWaitForTransaction({
    hash: depositTransHash,
    watch: true,
    onReceived: () => {
      console.log("trans received");
    },
    onPending: () => {
      setCurrentTransactionStatus(true);
      toast.dismiss(toastId);
      console.log("trans pending");
      if (!isToastDisplayed) {
        toast.success(`You have successfully spend the loan `, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setToastDisplayed(true);
      }
    },
    onRejected(transaction) {
      toast.dismiss(toastId);
      console.log("treans rejected");
    },
    onAcceptedOnL1: () => {
      setCurrentTransactionStatus(true);
      console.log("trans onAcceptedOnL1");
    },
    onAcceptedOnL2(transaction) {
      setCurrentTransactionStatus(true);
      console.log("trans onAcceptedOnL2 - ", transaction);
      if (!isToastDisplayed) {
        toast.success(`You have successfully supplied spend the loan `, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setToastDisplayed(true);
      }
    },
  });

  const handleZeroRepay = async () => {
    try {
      if (!loan?.loanId) {
        throw new Error("loan or loanID issue");
      }
      const zeroRepay = await writeAsyncSelfLiquidate();
      setDepositTransHash(zeroRepay?.transaction_hash);
      if (zeroRepay?.transaction_hash) {
        console.log("toast here");
        const toastid = toast.info(
          `Please wait, your transaction is running in background `,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
          }
        );
        setToastId(toastid);
      }
      console.log(zeroRepay);
      dispatch(setTransactionStatus("success"));
      console.log("zero repay success");
    } catch (err: any) {
      console.log("zero repay failed - ", err);
      dispatch(setTransactionStatus("failed"));
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

  const hanldeTrade = async () => {
    try {
      // if(currentDapp)
      if (currentDapp == "Jediswap") {
        const trade = await writeAsyncJediSwap_swap();
        setDepositTransHash(trade?.transaction_hash);

        console.log(trade);
        dispatch(setTransactionStatus("success"));
      } else if (currentDapp == "mySwap") {
        const tradeMySwap = await writeAsyncmySwap_swap();
        setDepositTransHash(tradeMySwap?.transaction_hash);

        console.log(tradeMySwap);
        dispatch(setTransactionStatus("success"));
      }
    } catch (err) {
      console.log(err);
      dispatch(setTransactionStatus("failed"));
    }
  };
  const hanldeLiquidation = async () => {
    try {
      if (currentDapp == "Jediswap") {
        const liquidity = await writeAsyncJediSwap_addLiquidity();
        setDepositTransHash(liquidity?.transaction_hash);
        console.log(liquidity);
        dispatch(setTransactionStatus("success"));
      } else if (currentDapp == "mySwap") {
        const mySwapLiquidity = await writeAsyncmySwap_addLiquidity();
        console.log(mySwapLiquidity);
        setDepositTransHash(mySwapLiquidity?.transaction_hash);
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
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
    }
  };

  const handleAddCollateral = async () => {
    try {
      if (currentTokenSelected == "rToken") {
        const addCollateral = await writeAsyncAddCollateralRToken();
        if (addCollateral?.transaction_hash) {
          console.log("addCollateral", addCollateral.transaction_hash);
        }
        setDepositTransHash(addCollateral?.transaction_hash);

        console.log("add collateral - ", addCollateral);
        dispatch(setTransactionStatus("success"));
      } else {
        const addCollateral = await writeAsyncAddCollateral();
        if (addCollateral?.transaction_hash) {
          console.log("addCollateral", addCollateral.transaction_hash);
        }
        setDepositTransHash(addCollateral?.transaction_hash);

        console.log("add collateral - ", addCollateral);
        dispatch(setTransactionStatus("success"));
      }
    } catch (err: any) {
      console.log("add collateral error");
      dispatch(setTransactionStatus("failed"));
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

  // useEffect(() => {
  //   setToMarketA(currentPool.split("/")[0]);
  //   setToMarketB(currentPool.split("/")[1]);
  //   console.log("marketsAB", toMarketA, toMarketB);
  // }, [currentPool]);

  const getContainer = (action: string) => {
    switch (action) {
      case "Spend Borrow":
        return (
          <Box
            bg="#101216"
            borderRadius="6px"
            p="1rem"
            border="1px solid #2B2F35"
            mt="1.5rem"
            mb="1.5rem"
          >
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  est LP tokens recieved:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                  fontWeight={"thin"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box ml="0.1rem" mt="0.3rem">
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
                $ 10.91
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Liquidity spill:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                  fontWeight={"thin"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box ml="0.1rem" mt="0.3rem">
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
            </Box>
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Fees:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                  fontWeight={"thin"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box ml="0.1rem" mt="0.3rem">
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
                0.1%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Borrow apr:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                  fontWeight={"thin"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box ml="0.1rem" mt="0.3rem">
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
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Gas estimate:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                  fontWeight={"thin"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box ml="0.1rem" mt="0.3rem">
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
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Effective apr:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                  fontWeight={"thin"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box ml="0.1rem" mt="0.3rem">
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
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Health factor:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                  fontWeight={"thin"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box ml="0.1rem" mt="0.3rem">
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
                1.10
              </Text>
            </Box>
          </Box>
        );
        break;

      case "Repay Borrow":
        return (
          <Box
            p="1rem"
            borderRadius="md"
            border="1px"
            borderColor="#2B2F35"
            bg="#101216"
            my="6"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#8B949E"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Borrowed market:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
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
                color="#8B949E"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                1 BTC
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#8B949E"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  rTokens unlocked:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
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
                color="#8B949E"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                1.23
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#8B949E"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Est collateral value:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
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
                color="#8B949E"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#8B949E"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Fees:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
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
              <Text
                color="#8B949E"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                0.1%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#8B949E"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Gas estimate:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
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
              <Text
                color="#8B949E"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                5.56%
              </Text>
            </Box>
          </Box>
        );
        break;

      case "Zero Repay":
        return (
          <Box
            p="1rem"
            borderRadius="md"
            border="1px"
            borderColor="#2B2F35"
            bg="#101216"
            my="6"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  Dapp:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
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
              <Box display="flex" color="#8B949E" fontSize="xs" gap="2">
                <Box display="flex" gap="2px">
                  <Box>
                    <JediswapLogo />
                  </Box>
                  <Text>Jediswap</Text>
                </Box>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  Borrow amount:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
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
              <Text color="#8B949E" fontSize="xs">
                1 BTC
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  rTokens unlocked:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
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
              <Text color="#8B949E" fontSize="xs">
                1.23
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  Est collateral value:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
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
              <Text color="#8B949E" fontSize="xs">
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  Fees:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
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
              <Text color="#8B949E" fontSize="xs">
                0.1%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  Gas estimate:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
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
              <Text color="#8B949E" fontSize="xs">
                5.56%
              </Text>
            </Box>
          </Box>
        );
        break;

      case "Convert to borrow market":
        return (
          <Box
            bg="#101216"
            borderRadius="6px"
            p="1rem"
            border="1px solid #2B2F35"
            mt="1.5rem"
            mb="1.5rem"
          >
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  est conversion:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                  fontWeight={"thin"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box ml="0.1rem" mt="0.1rem">
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
            </Box>
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Fees:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                  fontWeight={"thin"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box ml="0.1rem" mt="0.1rem">
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
                0.1%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Gas estimate:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                  fontWeight={"thin"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box ml="0.1rem" mt="0.1rem">
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
                5.56%
              </Text>
            </Box>
          </Box>
        );
        break;

      default:
        break;
    }
  };

  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setModalDropdown(dropdownName));
  };
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const actions = [
    "Spend Borrow",
    "Convert to borrow market",
    "Repay Borrow",
    "Zero Repay",
  ];
  // const borrowIds = [
  //   "ID - 123456",
  //   "ID - 123457",
  //   "ID - 123458",
  //   "ID - 123459",
  //   "ID - 1234510",
  // ];

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
  // const pools = [
  //   ["ETH", "USDT"],
  //   ["USDC", "USDT"],
  //   ["ETH", "USDC"],
  //   ["DAI", "ETH"],
  //   ["BTC", "ETH"],
  //   ["BTC", "USDT"],
  //   ["BTC", "USDC"],
  //   ["BTC", "DAI"],
  //   ["USDT", "DAI"],
  //   ["USDC", "AI"],
  // ];

  // useEffect(() => {
  //   console.log("got", currentID, currentMarket);
  // }, [currentBorrowId1]);

  const [sliderValue, setSliderValue] = useState(0);
  // const dispatch = useDispatch();

  const [inputAmount, setinputAmount] = useState(0);
  const [inputCollateralAmount, setinputCollateralAmount] = useState(0);
  const [sliderValue2, setSliderValue2] = useState(0);
  const [inputRepayAmount, setinputRepayAmount] = useState(0);

  const handleChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return;
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setRepayAmount(newValue);
      dispatch(setInputYourBorrowModalRepayAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage);
        setRepayAmount(newValue);
        dispatch(setInputYourBorrowModalRepayAmount(newValue));
      }
      // dispatch((newValue));
    }
  };

  const handleCollateralChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue2(100);
      setinputCollateralAmount(newValue);
      setCollateralAmount(newValue);
      setRTokenAmount(newValue);
      // dispatch(setInputYourBorrowModalRepayAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue2(percentage);
        setinputCollateralAmount(newValue);
        setCollateralAmount(newValue);
        setRTokenAmount(newValue);
      }
      // dispatch(setInputYourBorrowModalRepayAmount(newValue));
      // dispatch((newValue));
    }
  };

  const handleBorrowMarketCoinChange1 = (id: string) => {
    // console.log("got id", id);
    for (let i = 0; i < borrowIDCoinMap.length; i++) {
      if (borrowIDCoinMap[i].id === id) {
        setCurrentBorrowMarketCoin1(borrowIDCoinMap[i].name);
        return;
      }
    }
  };

  const handleBorrowMarketCoinChange2 = (id: string) => {
    // console.log("got id", id);
    for (let i = 0; i < borrowIDCoinMap.length; i++) {
      if (borrowIDCoinMap[i].id === id) {
        setCurrentBorrowMarketCoin2(borrowIDCoinMap[i].name);
        setCollateralBalance(borrowIDCoinMap[i].collateralBalance);
        return;
      }
    }
  };
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
  // console.log(activeModal)

  // const handleBorrowMarketIDChange1 = (coin: string) => {
  //   // console.log("got coin", coin);
  //   for (let i = 0; i < borrowIDCoinMap.length; i++) {
  //     if (borrowIDCoinMap[i].name === coin) {
  //       setCurrentBorrowId1(`ID - ${borrowIDCoinMap[i].id}`);
  //       return;
  //     }
  //   }
  // };

  // const handleBorrowMarketIDChange2 = (coin: string) => {
  //   // console.log("got coin", coin);
  //   for (let i = 0; i < borrowIDCoinMap.length; i++) {
  //     if (borrowIDCoinMap[i].name === coin) {
  //       setCurrentBorrowId2(`ID - ${borrowIDCoinMap[i].id}`);
  //       return;
  //     }
  //   }
  // };

  // const walletBalance = JSON.parse(useSelector(selectWalletBalance))
  const [currentSelectedCoin, setCurrentSelectedCoin] = useState("BTC");
  const [tabValue, setTabValue] = useState(1);
  const [currentTokenSelected, setcurrentTokenSelected] = useState("rToken");
  const tokensArray = ["rToken", "Native Token"];
  const resetStates = () => {
    try {
      setRadioValue("1");
      setCurrentAction("Spend Borrow");
      setCurrentBorrowMarketCoin1("BTC");
      setCurrentBorrowMarketCoin2("BTC");
      setCurrentBorrowId1("ID - 123456");
      setCurrentBorrowId2("ID - 123456");
      setCurrentDapp("Select a dapp");
      setCurrentPool("Select a pool");
      setCurrentPoolCoin("Select a pool");
      setinputCollateralAmount(0);
      setCollateralAmount(0);
      setRTokenAmount(0);
      setSliderValue(0);
      setSliderValue2(0);
      setRepayAmount(0);
      setTabValue(1);
      setCollateralTransactionStarted(false);
      setTransactionStarted(false);
      dispatch(resetModalDropdowns());
      setcurrentTokenSelected("rToken");
      dispatch(setTransactionStatus(""));
    } catch (err) {
      console.log("yourBorrowModal reset states - ", err);
    }
    setCurrentTransactionStatus(false);
    setDepositTransHash("");
  };

  useEffect(() => {
    setinputCollateralAmount(0);
    setSliderValue2(0);
  }, [currentBorrowMarketCoin2]);

  useEffect(() => {
    setToMarket(currentPoolCoin);
    console.log(toMarket);
  }, [currentPoolCoin]);

  useEffect(() => {
    console.log(
      "marketsAB",
      toMarketA,
      toMarketB,
      currentBorrowId1.slice(5),
      tokenAddressMap[toMarketA],
      tokenAddressMap[toMarketB]
    );
    fetchLiquiditySplit(toMarketA, toMarketB);
  }, [toMarketA, toMarketB]);

  const fetchLiquiditySplit = async () => {
    // const split = await getJediEstimatedLpAmountOut(
    //   currentBorrowId1.slice(5),
    //   toMarketA,
    //   toMarketB
    // );
    console.log("toMarketSplit");
  };

  return (
    <Box>
      <Button key="suppy" onClick={onOpen} {...restProps}>
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetStates();
          onClose();
        }}
        isCentered
        scrollBehavior="inside"
        // size="sm"
      >
        <ModalOverlay mt="3.8rem" bg="rgba(244, 242, 255, 0.5);" />
        <ModalContent mt="8rem" bg={"#010409"} maxW="464px" overflow="hidden">
          <ModalHeader bg="inherit">
            <Box position="relative" pl="5px">
              <Tabs variant="unstyled">
                <TabList
                  borderRadius="md"
                  top="9.5rem"
                  position="fixed"
                  width="100%"
                  zIndex="1"
                >
                  <Box display="flex" width="300px" position="fixed">
                    <Tab
                      py="1"
                      px="3"
                      color="#6E7681"
                      fontSize="sm"
                      border="1px"
                      borderColor="#2B2F35"
                      borderLeftRadius="md"
                      fontWeight="normal"
                      opacity="100%"
                      _selected={{
                        color: "white",
                        bg: "#0969DA",
                        border: "none",
                      }}
                      isDisabled={collateralTransactionStarted == true}
                      onClick={() => {
                        setTabValue(1);
                      }}
                    >
                      Borrow Actions
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
                      opacity="100%"
                      _selected={{
                        color: "white",
                        bg: "#0969DA",
                        border: "none",
                      }}
                      isDisabled={transactionStarted == true}
                      onClick={() => {
                        setTabValue(2);
                      }}
                    >
                      Add Collateral
                    </Tab>
                  </Box>
                </TabList>
              </Tabs>
            </Box>
            <Text fontSize="18px" color="black">
              this is just to make it align and Lorem ipsum,
            </Text>
          </ModalHeader>
          {/* <ModalHeader padding="0"></ModalHeader> */}
          <ModalCloseButton color="white" mt="1rem" mr="1rem" />

          <ModalBody color={"#E6EDF3"} px={7}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              fontSize={"sm"}
              mt=".4rem"
              // my={"2"}
            >
              <Box w="full">
                {tabValue == 1 ? (
                  <Box p="0" m="0" overflowY="auto">
                    <Box
                      display="flex"
                      flexDirection="column"
                      backgroundColor="#101216"
                      border="1px"
                      borderColor="#2B2F35"
                      p="5"
                      // my="4"
                      borderRadius="md"
                      gap="3"
                    >
                      <Box display="flex" flexDirection="column" gap="1">
                        <Box display="flex">
                          <Text fontSize="xs" color="#8B949E">
                            Action
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                              handleDropdownClick(
                                "yourBorrowModalActionDropdown"
                              );
                            }
                          }}
                          as="button"
                        >
                          <Text display="flex" gap="1">
                            {currentAction}
                          </Text>
                          <Box pt="1" className="navbar-button">
                            {activeModal == "yourBorrowModalActionDropdown" ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>
                          {modalDropdowns.yourBorrowModalActionDropdown && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                            >
                              {actions.map((action, index) => {
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
                                      if (action === "Zero Repay") {
                                        setRepayAmount(0);
                                        setSliderValue(0);
                                      }
                                      setCurrentAction(action);
                                    }}
                                  >
                                    {action === currentAction && (
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
                                        action === currentAction ? "2" : "5"
                                      }`}
                                      gap="1"
                                      bg={`${
                                        action === currentAction
                                          ? "#0C6AD9"
                                          : "inherit"
                                      }`}
                                      borderRadius="md"
                                    >
                                      {/* <Box p="1">{getCoin(action)}</Box> */}
                                      <Text>{action}</Text>
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
                          <Text
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                            color="#8B949E"
                          >
                            Borrow ID
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                        {currentAction == "Convert to borrow market" ? (
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
                            as="button"
                          >
                            <Box display="flex" gap="1">
                              {currentBorrowId1}
                            </Box>
                          </Box>
                        ) : (
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
                                handleDropdownClick(
                                  "yourBorrowBorrowIDsDropdown1"
                                );
                              }
                            }}
                            as="button"
                          >
                            <Box display="flex" gap="1">
                              {currentBorrowId1}
                            </Box>
                            <Text pt="1" className="navbar-button">
                              {activeModal == "yourBorrowBorrowIDsDropdown1" ? (
                                <ArrowUp />
                              ) : (
                                <DropdownUp />
                              )}
                            </Text>
                            {modalDropdowns.yourBorrowBorrowIDsDropdown1 && (
                              <Box
                                w="full"
                                left="0"
                                bg="#03060B"
                                py="2"
                                className="dropdown-container onlyScroll"
                                boxShadow="dark-lg"
                                height={`${
                                  borrowIds.length >= 5 ? "182px" : "none"
                                }`}
                                overflowY="scroll"
                              >
                                {borrowIds.map(
                                  (coin: string, index: number) => {
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
                                          setCurrentBorrowId1("ID - " + coin);
                                          console.log(
                                            coin,
                                            "coin in borrow id"
                                          );
                                          handleBorrowMarketCoinChange1(coin);
                                          setLoanId(coin);
                                          setSwapLoanId(coin);
                                          // console.log(swapLoanId,"swap loan id")
                                          setLiquidityLoanId(coin);
                                          console.log(liquidityLoanId);
                                        }}
                                      >
                                        {"ID - " + coin ===
                                          currentBorrowId1 && (
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
                                            "ID - " + coin === currentBorrowId1
                                              ? "2"
                                              : "5"
                                          }`}
                                          gap="1"
                                          bg={`${
                                            "ID - " + coin === currentBorrowId1
                                              ? "#0C6AD9"
                                              : "inherit"
                                          }`}
                                          borderRadius="md"
                                        >
                                          {/* <Box p="1">{getCoin(coin)}</Box> */}
                                          <Text>ID - {coin}</Text>
                                        </Box>
                                      </Box>
                                    );
                                  }
                                )}
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                      <Box display="flex" flexDirection="column" gap="1">
                        <Box display="flex">
                          <Text
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                            color="#8B949E"
                          >
                            Borrow Market
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                          // onClick={() =>
                          //   handleDropdownClick(
                          //     "yourBorrowModalBorrowMarketDropdown1"
                          //   )
                          // }
                          as="button"
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">{getCoin(currentBorrowMarketCoin1)}</Box>
                            <Text mt="0.15rem">{currentBorrowMarketCoin1}</Text>
                          </Box>
                          {/* <Box pt="1" className="navbar-button">
                              <DropdownUp />
                            </Box> */}
                          {/* {modalDropdowns.yourBorrowModalBorrowMarketDropdown1 && (
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
                                        setCurrentBorrowMarketCoin1(coin);
                                        handleBorrowMarketIDChange1(coin);
                                      }}
                                    >
                                      {coin === currentBorrowMarketCoin1 && (
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
                                          coin === currentBorrowMarketCoin1
                                            ? "1"
                                            : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          coin === currentBorrowMarketCoin1
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
                        </Box>
                        {currentAction == "Convert to borrow market" ? (
                          ""
                        ) : (
                          <Text textAlign="right" fontSize="xs" mt="0.2rem">
                            Borrow Balance: {borrowAmount}
                            <Text as="span" color="#8B949E" ml="0.2rem">
                              {currentBorrowMarketCoin1}
                            </Text>
                          </Text>
                        )}
                      </Box>
                      {currentAction !== "Spend Borrow" &&
                        currentAction != "Convert to borrow market" && (
                          <Box
                            display="flex"
                            flexDirection="column"
                            gap="1"
                            mt="0"
                          >
                            <Box display="flex">
                              <Text fontSize="xs" color="#8B949E">
                                Repay Amount
                              </Text>
                              <Tooltip
                                hasArrow
                                placement="right-start"
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
                              borderRadius="6px"
                              display="flex"
                              justifyContent="space-between"
                              border={`${
                                repayAmount > walletBalance
                                  ? "1px solid #CF222E"
                                  : repayAmount < 0
                                  ? "1px solid #CF222E"
                                  : isNaN(repayAmount)
                                  ? "1px solid #CF222E"
                                  : repayAmount > 0 &&
                                    repayAmount <= walletBalance
                                  ? "1px solid #1A7F37"
                                  : "1px solid #2B2F35 "
                              }`}
                            >
                              <NumberInput
                                border="0px"
                                min={0}
                                keepWithinRange={true}
                                onChange={handleChange}
                                value={repayAmount ? repayAmount : ""}
                                isDisabled={
                                  currentAction === "Zero Repay" ||
                                  transactionStarted == true
                                }
                                step={parseFloat(
                                  `${repayAmount <= 99999 ? 0.1 : 0}`
                                )}
                                _disabled={{ cursor: "pointer" }}
                              >
                                <NumberInputField
                                  placeholder={`Minimum 0.01536 ${currentBorrowMarketCoin1}`}
                                  color={`${
                                    repayAmount > walletBalance
                                      ? "#CF222E"
                                      : isNaN(repayAmount)
                                      ? "#CF222E"
                                      : repayAmount < 0
                                      ? "#CF222E"
                                      : repayAmount == 0
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
                                  // _disabled={{ color: "#1A7F37" }}
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
                                  if (currentAction === "Zero Repay") return;
                                  setRepayAmount(walletBalance);
                                  setSliderValue(100);
                                  dispatch(
                                    setInputYourBorrowModalRepayAmount(
                                      walletBalance
                                    )
                                  );
                                }}
                                isDisabled={transactionStarted == true}
                                _disabled={{ cursor: "pointer" }}
                              >
                                MAX
                              </Button>
                            </Box>
                            {repayAmount > walletBalance ||
                            repayAmount < 0 ||
                            isNaN(repayAmount) ? (
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
                                    {repayAmount > walletBalance
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
                                    {` ${currentSelectedCoin}`}
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
                                  {` ${currentSelectedCoin}`}
                                </Text>
                              </Text>
                            )}
                            <Slider
                              mt="9"
                              mb="2"
                              aria-label="slider-ex-6"
                              defaultValue={sliderValue}
                              value={sliderValue}
                              onChange={(val) => {
                                if (currentAction === "Zero Repay") return;
                                setSliderValue(val);
                                var ans = (val / 100) * walletBalance;
                                ans = Math.round(ans * 100) / 100;
                                dispatch(
                                  setInputYourBorrowModalRepayAmount(ans)
                                );
                                setRepayAmount(ans);
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
                        )}
                    </Box>
                    {currentAction === "Spend Borrow" && (
                      <Box display="flex" flexDir="column" p="3" gap="1">
                        <Box display="flex">
                          <Text fontSize="xs" color="#8B949E">
                            Purpose
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                        <Box>
                          <RadioGroup
                            onChange={setRadioValue}
                            value={radioValue}
                          >
                            <Stack spacing={4} direction="row">
                              <Radio
                                value="1"
                                bg="#2B2F35"
                                border="none"
                                colorScheme="customBlue"
                                _focus={{ boxShadow: "none", outline: "0" }}
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
                              >
                                Trade
                              </Radio>
                            </Stack>
                          </RadioGroup>
                        </Box>
                      </Box>
                    )}
                    {currentAction === "Spend Borrow" && (
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
                              Dapp
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right-start"
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

                              <Text mt="0.15rem">{currentDapp}</Text>
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
                                      }}
                                      fontSize="sm"
                                      _hover={{ background: "inherit" }}
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
                              placement="right-start"
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
                                radioValue === "1"
                                  ? currentPool
                                  : currentPoolCoin
                              ) ? (
                                <Box p="1">
                                  {getCoin(
                                    radioValue === "1"
                                      ? currentPool
                                      : currentPoolCoin
                                  )}
                                </Box>
                              ) : (
                                ""
                              )}

                              <Text mt="0.2rem">
                                {radioValue === "1"
                                  ? currentPool
                                  : currentPoolCoin}
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
                                        setToMarketA(pool.split("/")[0]);
                                        setToMarketB(pool.split("/")[1]);
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
                                        px={`${
                                          pool === currentPool ? "1" : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          pool === currentPool
                                            ? "#0C6AD9"
                                            : "inherit"
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
                                        setCurrentPoolCoin(coin);
                                        setToMarket(coin);
                                        // console.log(toMarket);
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
                                        px={`${
                                          coin === currentPoolCoin ? "1" : "5"
                                        }`}
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
                    )}
                    {getContainer(currentAction)}
                    {currentAction == "Spend Borrow" ? (
                      currentDapp != "Select a dapp" &&
                      (currentPool != "Select a pool" ||
                        currentPoolCoin != "Select a pool") ? (
                        <Box
                          onClick={() => {
                            setTransactionStarted(true);
                            if (radioValue == 2) {
                              hanldeTrade();
                            } else {
                              hanldeLiquidation();
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
                            mb="1.5rem"
                            border="1px solid #8B949E"
                            labelSuccessArray={[
                              "Performing pre-checks",
                              "Processing the spend borrow",
                              "Updating the l3 records.",
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={"successButton"}
                                successText={"Spend borrow successful."}
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
                          >
                            Spend
                          </AnimatedButton>
                        </Box>
                      ) : (
                        <Button
                          bg="#101216"
                          color="#6E7681"
                          size="sm"
                          width="100%"
                          mb="2rem"
                          border="1px solid #2B2F35"
                          _hover={{ bg: "#101216" }}
                        >
                          Spend
                        </Button>
                      )
                    ) : (
                      ""
                    )}

                    {currentAction == "Repay Borrow" ? (
                      repayAmount > 0 && repayAmount <= walletBalance ? (
                        <Box
                          onClick={() => {
                            setTransactionStarted(true);
                            if (transactionStarted == false) {
                              handleRepayBorrow();
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
                            mb="1.5rem"
                            border="1px solid #8B949E"
                            labelSuccessArray={[
                              "Calculating the outstanding borrow amount.",
                              "transferring the repay amount to the borrow vault.",
                              "Burning the rTokens.",
                              "Covering the debt to the debt market.",
                              "Minting rTokens.",
                              "Transferring rtokens to the user account.",
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={"successButton"}
                                successText={"Repay loan success"}
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
                          >
                            Repay borrow
                          </AnimatedButton>
                        </Box>
                      ) : (
                        <Button
                          bg="#101216"
                          color="#6E7681"
                          size="sm"
                          width="100%"
                          mb="2rem"
                          border="1px solid #2B2F35"
                          _hover={{ bg: "#101216" }}
                        >
                          Repay borrow
                        </Button>
                      )
                    ) : (
                      ""
                    )}
                    {currentAction == "Convert to borrow market" ? (
                      <Box
                        onClick={() => {
                          setTransactionStarted(true);
                          if (transactionStarted == false) {
                            handleRevertTransaction();
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
                          mb="1.5rem"
                          border="1px solid #8B949E"
                          // _active={{color:"black",bg:"white"}}
                          labelSuccessArray={[
                            "Performing prechecks.",
                            "Processing self liquidation.",
                            "Borrow closed successfully.",
                            "Determine rToken balance.",
                            "Transferring rtokens to your account.",
                            // <ErrorButton errorText="Transaction failed" />,
                            // <ErrorButton errorText="Copy error!" />,
                            <SuccessButton
                              key={"successButton"}
                              successText={"Self liqudidation successfull."}
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
                          isDisabled={transactionStarted == true}
                          currentTransactionStatus={currentTransactionStatus}
                          setCurrentTransactionStatus={
                            setCurrentTransactionStatus
                          }
                        >
                          convert to borrow market
                        </AnimatedButton>
                      </Box>
                    ) : (
                      ""
                    )}
                    {currentAction == "Zero Repay" ? (
                      repayAmount == 0 ? (
                        <Box
                          onClick={() => {
                            setTransactionStarted(true);
                            if (transactionStarted == false) {
                              handleZeroRepay();
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
                            mb="1.5rem"
                            border="1px solid #8B949E"
                            // _active={{color:"black",bg:"white"}}
                            labelSuccessArray={[
                              "Performing prechecks.",
                              "Processing self liquidation.",
                              "Borrow closed successfully.",
                              "Determine rToken balance.",
                              "Transferring rtokens to your account.",
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={"successButton"}
                                successText={"Self liqudidation successfull."}
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
                            isDisabled={transactionStarted == true}
                            currentTransactionStatus={currentTransactionStatus}
                            setCurrentTransactionStatus={
                              setCurrentTransactionStatus
                            }
                          >
                            Zero repay
                          </AnimatedButton>
                        </Box>
                      ) : (
                        <Button
                          bg="#101216"
                          color="#6E7681"
                          size="sm"
                          width="100%"
                          mb="2rem"
                          border="1px solid #2B2F35"
                          _hover={{ bg: "#101216" }}
                        >
                          Zero repay
                        </Button>
                      )
                    ) : (
                      ""
                    )}
                  </Box>
                ) : (
                  <Box m="0" p="0" overflowY="auto">
                    <Box
                      display="flex"
                      flexDirection="column"
                      backgroundColor="#101216"
                      border="1px"
                      borderColor="#2B2F35"
                      p="5"
                      // my="4"
                      borderRadius="md"
                      gap="3"
                    >
                      <Box display="flex" flexDirection="column" gap="1">
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
                            Borrow ID
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                          borderRadius="md"
                          className="navbar"
                          onClick={() => {
                            if (collateralTransactionStarted) {
                              return;
                            } else {
                              handleDropdownClick(
                                "yourBorrowBorrowIDsDropdown2"
                              );
                            }
                          }}
                          as="button"
                        >
                          <Box display="flex" gap="1" pt="1">
                            {currentBorrowId2}
                          </Box>
                          <Text pt="1" className="navbar-button">
                            {activeModal == "yourBorrowBorrowIDsDropdown2" ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Text>
                          {modalDropdowns.yourBorrowBorrowIDsDropdown2 && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
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
                                    pr="2"
                                    onClick={() => {
                                      setCurrentBorrowId2("ID - " + coin);
                                      handleBorrowMarketCoinChange2(coin);
                                      setCollateralAsset(
                                        currentBorrowMarketCoin2.slice(1)
                                      );
                                      setRToken(
                                        currentBorrowMarketCoin2.slice(1)
                                      );
                                    }}
                                  >
                                    {"ID - " + coin === currentBorrowId2 && (
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
                                        "ID - " + coin === currentBorrowId2
                                          ? "2"
                                          : "5"
                                      }`}
                                      gap="1"
                                      bg={`${
                                        "ID - " + coin === currentBorrowId2
                                          ? "#0C6AD9"
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
                      </Box>
                      <Box display="flex" flexDirection="column" gap="1">
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
                            Borrow Market
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                          mt="-0.1rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          onClick={() => {
                            if (collateralTransactionStarted) {
                              return;
                            } else {
                              handleDropdownClick(
                                "yourBorrowModalBorrowMarketDropdown2"
                              );
                            }
                          }}
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">{getCoin(currentBorrowMarketCoin2)}</Box>
                            <Text color="white" mt="0.12rem">
                              {currentBorrowMarketCoin2}
                            </Text>
                          </Box>

                          {/* <Box pt="1" className="navbar-button">
                              {activeModal ==
                              "yourBorrowModalBorrowMarketDropdown2" ? (
                                <ArrowUp />
                              ) : (
                                <DropdownUp />
                              )}
                            </Box> */}
                          {/* {modalDropdowns.yourBorrowModalBorrowMarketDropdown2 && (
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
                                        setCurrentBorrowMarketCoin2(coin);
                                        // handleBorrowMarketIDChange2(coin);
                                        // dispatch(setCoinSelectedSupplyModal(coin))
                                      }}
                                    >
                                      {coin === currentBorrowMarketCoin2 && (
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
                                          coin === currentBorrowMarketCoin2
                                            ? "1"
                                            : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          coin === currentBorrowMarketCoin2
                                            ? "#0C6AD9"
                                            : "inherit"
                                        }`}
                                        borderRadius="md"
                                      >
                                        <Box p="1">{getCoin(coin)}</Box>
                                        <Text color="white">{coin}</Text>
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </Box>
                            )} */}
                        </Box>
                      </Box>
                      <Box display="flex" flexDirection="column" gap="1">
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
                            Token Type
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                          // mb="1rem"
                          // mt="0.3rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          onClick={() => {
                            if (transactionStarted) {
                              return;
                            } else {
                              handleDropdownClick("yourBorrowTokenDropdown");
                            }
                          }}
                        >
                          <Box display="flex" gap="1">
                            <Text color="white">{currentTokenSelected}</Text>
                          </Box>

                          <Box pt="1" className="navbar-button">
                            {activeModal ? <ArrowUp /> : <DropdownUp />}
                          </Box>
                          {modalDropdowns.yourBorrowTokenDropdown && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                            >
                              {tokensArray.map(
                                (coin: string, index: number) => {
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
                                        setcurrentTokenSelected(coin);
                                      }}
                                    >
                                      {coin === currentTokenSelected && (
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
                                          coin === currentTokenSelected
                                            ? "1"
                                            : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          coin === currentTokenSelected
                                            ? "#0C6AD9"
                                            : "inherit"
                                        }`}
                                        borderRadius="md"
                                      >
                                        <Text color="white">{coin}</Text>
                                      </Box>
                                    </Box>
                                  );
                                }
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Text color="#8B949E" display="flex" alignItems="center">
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontWeight="400"
                          fontStyle="normal"
                        >
                          Collateral Balance
                        </Text>
                        <Tooltip
                          hasArrow
                          placement="right"
                          boxShadow="dark-lg"
                          label="Hashstack self liquidates your collateral
                            & debt positions to repay the borrow.
                            The balance will be updated into rTokens"
                          bg="#24292F"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          pt="16px"
                          pl="16px"
                          fontSize="11px"
                          fontWeight="400"
                          fontStyle="normal"
                          lineHeight="16px"
                          color="#E6EDF3"
                          letterSpacing="-0.15px"
                          borderRadius="6px"
                          backgroundColor="#101216"
                          border="1px solid #2B2F35"
                          flex="none"
                          order="0"
                          flexGrow="0"
                          zIndex="0"
                          width="240px"
                          height="80px"
                        >
                          <Box>
                            <InfoIcon />
                          </Box>
                        </Tooltip>
                      </Text>
                      <Box
                        w="full"
                        backgroundColor="#101216"
                        py="2"
                        border="1px solid #2B2F35"
                        borderRadius="6px"
                        mt="-0.5rem"
                      >
                        <Text ml="1rem" color="white">
                          {collateralBalance}
                        </Text>
                      </Box>
                      <Text color="#8B949E" display="flex" alignItems="center">
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontWeight="400"
                          fontStyle="normal"
                        >
                          Collateral Amount
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
                          <Box>
                            <InfoIcon />
                          </Box>
                        </Tooltip>
                      </Text>
                      <Box
                        width="100%"
                        color="white"
                        border={`${
                          inputCollateralAmount > walletBalance
                            ? "1px solid #CF222E"
                            : inputCollateralAmount < 0
                            ? "1px solid #CF222E"
                            : inputCollateralAmount > 0 &&
                              inputAmount <= walletBalance
                            ? "1px solid #1A7F37"
                            : "1px solid #2B2F35 "
                        }`}
                        borderRadius="6px"
                        display="flex"
                        justifyContent="space-between"
                        mt="-0.5rem"
                      >
                        <NumberInput
                          border="0px"
                          min={0}
                          color={`${
                            inputCollateralAmount > walletBalance
                              ? "#CF222E"
                              : inputCollateralAmount < 0
                              ? "#CF222E"
                              : inputCollateralAmount == 0
                              ? "white"
                              : "#1A7F37"
                          }`}
                          keepWithinRange={true}
                          onChange={handleCollateralChange}
                          value={
                            inputCollateralAmount ? inputCollateralAmount : ""
                          }
                          outline="none"
                          step={parseFloat(
                            `${inputCollateralAmount <= 99999 ? 0.1 : 0}`
                          )}
                          isDisabled={collateralTransactionStarted == true}
                          _disabled={{ cursor: "pointer" }}
                        >
                          <NumberInputField
                            placeholder={`Minimum 0.01536 ${currentSelectedCoin}`}
                            border="0px"
                            _placeholder={{
                              color: "#393D4F",
                              fontSize: ".89rem",
                              fontWeight: "600",
                              outline: "none",
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
                            setinputCollateralAmount(walletBalance);
                            setCollateralAmount(walletBalance);
                            setRTokenAmount(walletBalance);
                            setSliderValue2(100);
                          }}
                          isDisabled={collateralTransactionStarted == true}
                          _disabled={{ cursor: "pointer" }}
                        >
                          MAX
                        </Button>
                      </Box>
                      {inputCollateralAmount > walletBalance ||
                      inputCollateralAmount < 0 ? (
                        <Text
                          display="flex"
                          justifyContent="space-between"
                          color="#E6EDF3"
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
                              {inputCollateralAmount > walletBalance
                                ? "Amount exceeds balance"
                                : "Invalid Input"}{" "}
                            </Text>
                          </Text>
                          <Text
                            color="#E6EDF3"
                            display="flex"
                            justifyContent="flex-end"
                          >
                            Wallet Balance: {walletBalance}
                            <Text color="#6E7781" ml="0.2rem">
                              {` ${collateralAsset}`}
                            </Text>
                          </Text>
                        </Text>
                      ) : (
                        <Text
                          color="#E6EDF3"
                          display="flex"
                          justifyContent="flex-end"
                          fontSize="12px"
                          fontWeight="500"
                          fontStyle="normal"
                          fontFamily="Inter"
                        >
                          Wallet Balance: {walletBalance}
                          <Text color="#6E7781" ml="0.2rem">
                            {` ${collateralAsset}`}
                          </Text>
                        </Text>
                      )}
                      <Box pt={5} pb={2} mt="1.5rem">
                        <Slider
                          aria-label="slider-ex-6"
                          defaultValue={sliderValue2}
                          value={sliderValue2}
                          onChange={(val) => {
                            setSliderValue2(val);
                            var ans = (val / 100) * walletBalance;
                            ans = Math.round(ans * 100) / 100;
                            // dispatch(setInputSupplyAmount(ans))
                            setinputCollateralAmount(ans);
                            setCollateralAmount(ans);
                            setRTokenAmount(ans);
                          }}
                          isDisabled={collateralTransactionStarted == true}
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
                    <Card
                      bg="#101216"
                      mt="2rem"
                      p="1rem"
                      border="1px solid #2B2F35"
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
                            Borrow amount:
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label=" Actual debt:               12345&#10;accured intrest:        12345"
                            bg="#24292F"
                            fontSize="12px"
                            fontWeight="500"
                            fontStyle="normal"
                            borderRadius="6px"
                            background="#101216"
                            border="1px solid #2B2F35"
                            pt="12px"
                            pl="10px"
                            gap="80px"
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            width="197px"
                            height="72px"
                            whiteSpace="pre-wrap"
                            color="#E6EDF3"
                            textAlign="center"
                            lineHeight="2"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Text>
                        <Text color="#6E7681">1 BTC</Text>
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
                            font-size="12px"
                            lineHeight="16px"
                            color="#6A737D"
                          >
                            est rTokens minted:
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="Adding <amount> as collateral will mint
                            <number> r<market_symbol> tokens.
                            These tokens will accrue supply apr
                            and remain locked till the debt is repaid"
                            bg="#24292F"
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            pt="16px"
                            pl="16px"
                            fontSize="11px"
                            fontWeight="400"
                            fontStyle="normal"
                            lineHeight="16px"
                            color="#E6EDF3"
                            letterSpacing="-0.15px"
                            borderRadius="6px"
                            backgroundColor="#101216"
                            border="1px solid #2B2F35"
                            flex="none"
                            order="0"
                            flexGrow="0"
                            zIndex="0"
                            width="225px"
                            height="96px"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Text>
                        <Text color="#6E7681">$ 10.91</Text>
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
                            Fees:
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                        <Text color="#6E7681">0.1%</Text>
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
                            Borrow apr:
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                        <Text color="#6E7681">5.56%</Text>
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
                            font-size="12px"
                            lineHeight="16px"
                            color="#6A737D"
                          >
                            Gas estimate:
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                        <Text color="#6E7681">5.56%</Text>
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
                            font-size="12px"
                            lineHeight="16px"
                            color="#6A737D"
                          >
                            Effective apr:
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                        <Text color="#6E7681">5.56%</Text>
                      </Text>
                      <Text
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
                            lineHeight="16px"
                            color="#6A737D"
                          >
                            Health factor
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-start"
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
                        <Text color="#6E7681">1.10</Text>
                      </Text>
                    </Card>
                    {inputCollateralAmount > 0 &&
                    inputCollateralAmount <= walletBalance ? (
                      <Box
                        onClick={() => {
                          setCollateralTransactionStarted(true);
                          if (collateralTransactionStarted == false) {
                            handleAddCollateral();
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
                            "Transferring collateral to supply vault.",
                            "Minting & transferring rTokens to the user account.",
                            "Locking rTokens.",
                            "Updating collateral records",
                            // <ErrorButton errorText="Transaction failed" />,
                            // <ErrorButton errorText="Copy error!" />,
                            <SuccessButton
                              key={"successButton"}
                              successText={"Add collateral successful."}
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
                        >
                          Add Collateral
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
                        Add Collateral
                      </Button>
                    )}
                  </Box>
                )}
                {/* </TabPanels> */}
                {/* </Tabs> */}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default YourBorrowModal;

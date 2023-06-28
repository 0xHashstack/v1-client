import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Card,
  Text,
  Tooltip,
  Box,
  Portal,
  Skeleton,
} from "@chakra-ui/react";
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import { useDisclosure } from "@chakra-ui/react";
import InfoIcon from "@/assets/icons/infoIcon";
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import ETHLogo from "@/assets/icons/coins/eth";
import SmallEth from "@/assets/icons/coins/smallEth";
import SmallUsdt from "@/assets/icons/coins/smallUsdt";
import DAILogo from "@/assets/icons/coins/dai";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import SmallJediswapLogo from "@/assets/icons/coins/smallJediswap";
import UsdcToUsdt from "@/assets/icons/pools/usdcToUsdt";
import EthToUsdc from "@/assets/icons/pools/ethToUsdc";
import DaiToEth from "@/assets/icons/pools/daiToEth";
import BtcToEth from "@/assets/icons/pools/btcToEth";
import BtcToUsdt from "@/assets/icons/pools/btcToUsdt";
import EthToUsdt from "@/assets/icons/pools/ethToUsdt";
import TableMySwap from "../layouts/table/tableIcons/mySwap";
import TableJediswapLogoDull from "../layouts/table/tableIcons/jediswapLogoDull";
import TableYagiLogo from "../layouts/table/tableIcons/yagiLogo";
import TableYagiLogoDull from "../layouts/table/tableIcons/yagiLogoDull";
import TableMySwapDull from "../layouts/table/tableIcons/mySwapDull";
import TableJediswapLogo from "../layouts/table/tableIcons/jediswapLogo";
import useSwap from "@/Blockchain/hooks/Writes/useSwap";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import { toast } from "react-toastify";
import {
  selectInputSupplyAmount,
  setCoinSelectedSupplyModal,
  selectWalletBalance,
  setInputSupplyAmount,
  selectSelectedDapp,
  selectUserLoans,
  setTransactionStatus,
} from "@/store/slices/userAccountSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalDropdown,
  selectModalDropDowns,
  resetModalDropdowns,
} from "@/store/slices/dropdownsSlice";
import ArrowUp from "@/assets/icons/arrowup";
import useLiquidity from "@/Blockchain/hooks/Writes/useLiquidity";
import { useWaitForTransaction } from "@starknet-react/core";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  getJediEstimateLiquiditySplit,
  getJediEstimatedLpAmountOut,
} from "@/Blockchain/scripts/l3interaction";
import BtcToUsdc from "@/assets/icons/pools/btcToUsdc";
import BtcToDai from "@/assets/icons/pools/btcToDai";
import UsdtToDai from "@/assets/icons/pools/usdtToDai";
import UsdcToDai from "@/assets/icons/pools/usdcToDai";
import Image from "next/image";
const LiquidityProvisionModal = ({
  borrowIDCoinMap,
  borrowIds,
  coins,
  currentId,
  BorrowBalance,
  currentMarketCoin,
  currentSwap,
  setCurrentSwap,
  borrowAPRs,
}: any) => {
  // console.log("liquidity found map: ", borrowIDCoinMap);
  // console.log("liquidity found borrow ids: ", borrowIds);
  // console.log("liquidity found coins: ", coins);
  // console.log("liquidity found current coin: ", currentId);
  // console.log("liquidity found current id: ", currentMarketCoin);

  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const [currentSelectedCoin, setCurrentSelectedCoin] = useState("BTC");
  const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] =
    useState(currentMarketCoin);
  const [currentBorrowId, setCurrentBorrowId] = useState(currentId);
  const [currentPool, setCurrentPool] = useState("Select a pool");
  const [inputAmount, setinputAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const selectedDapp = useSelector(selectSelectedDapp);
  const [transactionStarted, setTransactionStarted] = useState(false);

  const dispatch = useDispatch();
  const modalDropdowns = useSelector(selectModalDropDowns);
  const [walletBalance, setwalletBalance] = useState(BorrowBalance);
  const inputAmount1 = useSelector(selectInputSupplyAmount);
  const userLoans = useSelector(selectUserLoans);
  const [borrowAmount, setBorrowAmount] = useState(BorrowBalance);
  // console.log(userLoans)
  // console.log(currentId.slice(currentId.indexOf("-") + 1).trim())
  useEffect(() => {
    const result = userLoans.find(
      (item: any) =>
        item?.loanId == currentId.slice(currentId.indexOf("-") + 1).trim()
    );
    setBorrowAmount(result?.loanAmountParsed);
    // console.log(borrowAmount)
    // Rest of your code using the 'result' variable
  }, [currentId]);
  useEffect(() => {
    setLiquidityLoanId(
      currentBorrowId.slice(currentBorrowId.indexOf("-") + 1).trim()
    );
  }, [currentBorrowId]);
  useEffect(() => {
    setToMarketA(currentPool.split("/")[0]);
    setToMarketB(currentPool.split("/")[1]);
  }, [currentPool]);

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
      case "Jediswap":
        return <JediswapLogo />;
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
  // const borrowIds = [
  //   "ID - 123456",
  //   "ID - 123457",
  //   "ID - 123458",
  //   "ID - 123459",
  //   "ID - 1234510",
  // ];
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

  //This Function handles the modalDropDowns
  const handleDropdownClick = (dropdownName: any) => {
    // Dispatches an action called setModalDropdown with the dropdownName as the payload
    dispatch(setModalDropdown(dropdownName));
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

  const [depositTransHash, setDepositTransHash] = useState("");
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState("");
  const [isToastDisplayed, setToastDisplayed] = useState(false);
  const [toastId, setToastId] = useState<any>();
  const recieptData = useWaitForTransaction({
    hash: depositTransHash,
    watch: true,
    onReceived: () => {
      console.log("trans received");
      if (!isToastDisplayed) {
        toast.success(`You have successfully supplied `, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setToastDisplayed(true);
      }
    },
    onPending: () => {
      setCurrentTransactionStatus("success");
      toast.dismiss(toastId);
      console.log("trans pending");
    },
    onRejected(transaction) {
      setCurrentTransactionStatus("failed");
      dispatch(setTransactionStatus("failed"));
      toast.dismiss(toastId);
      console.log("treans rejected");
    },
    onAcceptedOnL1: () => {
      setCurrentTransactionStatus("success");
      console.log("trans onAcceptedOnL1");
    },
    onAcceptedOnL2(transaction) {
      setCurrentTransactionStatus("success");
      console.log("trans onAcceptedOnL2 - ", transaction);
      if (!isToastDisplayed) {
        toast.success(`You have successfully supplied `, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setToastDisplayed(true);
      }
    },
  });

  const handleLiquidity = async () => {
    try {
      const liquidity = await writeAsyncJediSwap_addLiquidity();
      if (liquidity?.transaction_hash) {
        console.log("toast here");
        const toastid = toast.info(
          `Please wait, your transaction is running in background`,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
          }
        );
        setToastId(toastid);
      }
      console.log(liquidity);
      setDepositTransHash(liquidity?.transaction_hash);
      dispatch(setTransactionStatus("success"));
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

  // const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const resetStates = () => {
    setCurrentBorrowId(currentId);
    setCurrentPool("Select a pool");
    setCurrentBorrowMarketCoin(currentMarketCoin);
    setTransactionStarted(false);
    dispatch(resetModalDropdowns());
    const result = userLoans.find(
      (item: { loanId: any }): any =>
        item?.loanId == currentId.slice(currentId.indexOf("-") + 1).trim()
    );
    setBorrowAmount(result?.loanAmountParsed);
    setToastDisplayed(false);
    dispatch(setTransactionStatus(""));
    setCurrentTransactionStatus("");
    setDepositTransHash("");
  };

  useEffect(() => {
    setCurrentBorrowId(currentId);
    setCurrentBorrowMarketCoin(currentMarketCoin);
  }, [currentId, currentMarketCoin]);

  const handleBorrowMarketCoinChange = (id: string) => {
    // console.log("got id", id);
    for (let i = 0; i < borrowIDCoinMap.length; i++) {
      if (borrowIDCoinMap[i].id === id) {
        setCurrentBorrowMarketCoin(borrowIDCoinMap[i].name);
        return;
      }
    }
  };
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
  const handleBorrowMarketIDChange = (coin: string) => {
    // console.log("got coin", coin);
    for (let i = 0; i < borrowIDCoinMap.length; i++) {
      if (borrowIDCoinMap[i].name === coin) {
        setCurrentBorrowId(borrowIDCoinMap[i].id);
        return;
      }
    }
  };

  // const getIndex = (borrowMarket: string) => {
  const getBorrowAPR = (borrowMarket: string) => {
    switch (borrowMarket) {
      case "USDT":
        return borrowAPRs[0];
        break;
      case "USDC":
        return borrowAPRs[1];
        break;
      case "BTC":
        return borrowAPRs[2];
        break;
      case "ETH":
        return borrowAPRs[3];
        break;
      case "DAI":
        return borrowAPRs[4];
        break;

      default:
        break;
    }
  };

  const [currentLPTokenAmount, setCurrentLPTokenAmount] = useState(null);
  const [currentSplit, setCurrentSplit] = useState(null);

  useEffect(() => {
    // if (!currentBorrowId1 || currentBorrowId1 == "") {
    //   return;
    // }
    console.log(
      "toMarketSplitConsole",
      currentBorrowId.slice(5),
      toMarketA,
      toMarketB
      // borrow
    );
    setCurrentLPTokenAmount(null);
    setCurrentSplit(null);
    fetchLiquiditySplit();
  }, [toMarketA, currentBorrowId, toMarketB]);

  const fetchLiquiditySplit = async () => {
    // if (
    //   !toMarketA &&
    //   !toMarketB &&
    //   !currentBorrowId &&
    //   !currentBorrowId.slice(5)
    // )
    //   return;
    const lp_tokon: any = await getJediEstimatedLpAmountOut(
      // currentBorrowId1.slice(5),
      // toMarketA,
      // toMarketB
      "99",
      "ETH",
      "USDT"
    );
    console.log("toMarketSplitLP", lp_tokon);
    setCurrentLPTokenAmount(lp_tokon);
    const split: any = await getJediEstimateLiquiditySplit(
      // currentBorrowId1.slice(5),
      // toMarketA,
      // toMarketB
      "99",
      "ETH",
      "USDT"
    );
    console.log("toMarketSplit", split);
    setCurrentSplit(split);
  };

  return (
    <div>
      <Box display="flex" gap="4rem" mt="1rem">
        <Box
          cursor="pointer"
          onClick={() => {
            if (selectedDapp == "") {
              // console.log("hi");
            } else {
              onOpen();
            }
          }}
        >
          <Box onClick={() => setCurrentSwap("Yagi")}>
            {selectedDapp != "" ? <TableYagiLogo /> : <TableYagiLogoDull />}
          </Box>
        </Box>
        <Box
          cursor="pointer"
          onClick={() => {
            if (selectedDapp == "") {
              // console.log("hi");
            } else {
              onOpen();
            }
          }}
        >
          <Box onClick={() => setCurrentSwap("Myswap")}>
            {selectedDapp != "" ? <TableMySwap /> : <TableMySwapDull />}
          </Box>
        </Box>
        <Box
          cursor="pointer"
          onClick={() => {
            if (selectedDapp == "") {
              // console.log("hi");
            } else {
              onOpen();
            }
          }}
        >
          <Box onClick={() => setCurrentSwap("Jediswap")}>
            {selectedDapp != "" ? (
              <TableJediswapLogo />
            ) : (
              <TableJediswapLogoDull />
            )}
          </Box>
        </Box>
      </Box>
      <Portal>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            resetStates();
          }}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />
          <ModalContent
            bg="#010409"
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
              Liquidity Provision
            </ModalHeader>
            <ModalCloseButton mt="1rem" mr="1rem" />
            <ModalBody>
              <Card
                bg="#101216"
                mb="0.5rem"
                p="1rem"
                border="1px solid #2B2F35"
              >
                <Text color="#8B949E" display="flex" alignItems="center">
                  <Text mr="0.3rem" fontSize="12px">
                    Select Liquidity Pool
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
                  mb="1rem"
                  pr="3"
                  mt="0.2rem"
                  borderRadius="md"
                  className="navbar"
                  color="white"
                  fontSize="16px"
                  onClick={() => {
                    if (transactionStarted) {
                      return;
                    } else {
                      handleDropdownClick("liquidityProvisionPoolDropDown");
                    }
                  }}
                  as="button"
                >
                  <Box display="flex" gap="1">
                    {currentPool != "Select a pool" ? (
                      <Box p="1">{getCoin(currentPool)}</Box>
                    ) : (
                      ""
                    )}

                    <Text mt="0.1rem">{currentPool}</Text>
                  </Box>
                  <Box pt="1" className="navbar-button">
                    {activeModal == "liquidityProvisionPoolDropDown" ? (
                      <ArrowUp />
                    ) : (
                      <DropdownUp />
                    )}
                  </Box>
                  {modalDropdowns.liquidityProvisionPoolDropDown && (
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
                              // console.log(pool)
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
                  )}
                </Box>
                <Text color="#8B949E" display="flex" alignItems="center">
                  <Text mr="0.3rem" fontSize="12px">
                    Borrow ID
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
                  mt="0.2rem"
                  borderRadius="md"
                  color="white"
                  className="navbar"
                  onClick={() => {
                    if (transactionStarted == true) {
                      return;
                    } else {
                      handleDropdownClick("liquidityProvisionBorrowIDDropDown");
                    }
                  }}
                  as="button"
                >
                  <Box display="flex" gap="1" ml="0.2rem">
                    {currentBorrowId}
                  </Box>
                  <Text pt="1" className="navbar-button">
                    {activeModal == "liquidityProvisionBorrowIDDropDown" ? (
                      <ArrowUp />
                    ) : (
                      <DropdownUp />
                    )}
                  </Text>
                  {modalDropdowns.liquidityProvisionBorrowIDDropDown && (
                    <Box
                      w="full"
                      left="0"
                      bg="#03060B"
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
                              // console.log(typeof coin,"coin")
                              const borrowIdString = String(coin);
                              const result = userLoans.find(
                                (item: { loanId: string }): any =>
                                  item?.loanId ==
                                  borrowIdString
                                    .slice(borrowIdString.indexOf("-") + 1)
                                    .trim()
                              );
                              // console.log(result)
                              setBorrowAmount(result?.loanAmountParsed);
                            }}
                          >
                            {coin === currentBorrowId && (
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
                                "ID - " + coin === currentBorrowId ? "2" : "5"
                              }`}
                              gap="1"
                              bg={`${
                                "ID - " + coin === currentBorrowId
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
                <Text
                  color="#8B949E"
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
                  mt="0.2rem"
                  borderRadius="md"
                  className="navbar"
                  // onClick={() =>
                  //   handleDropdownClick(
                  //     "liquidityProvisionBorrowMarketDropDown"
                  //   )
                  // }
                >
                  <Box display="flex" gap="1">
                    <Box p="1">
                      {currentBorrowMarketCoin[0] === "d"
                        ? getCoin(currentBorrowMarketCoin.slice(1))
                        : getCoin(currentBorrowMarketCoin)}
                    </Box>
                    <Text color="white">
                      {currentBorrowMarketCoin[0] !== "d"
                        ? "d" + currentBorrowMarketCoin
                        : currentBorrowMarketCoin}
                    </Text>
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
                bg="#101216"
                borderRadius="6px"
                p="1rem"
                border="1px solid #2B2F35"
                mt="1.5rem"
              >
                <Box display="flex" justifyContent="space-between" mb="0.3rem">
                  <Box display="flex">
                    <Text
                      color="#6A737D"
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
                      label="all the assets to the market"
                      bg="#24292F"
                      fontSize={"smaller"}
                      fontWeight={"thin"}
                      borderRadius={"lg"}
                      padding={"2"}
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
                      color="#6A737D"
                      fontSize="12px"
                      fontWeight="400"
                      fontStyle="normal"
                    >
                      {currentSwap}
                    </Text>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-between" mb="0.3rem">
                  <Box display="flex">
                    <Box display="flex" gap="2px">
                      <Text
                        color="#6A737D"
                        fontSize="12px"
                        fontWeight="400"
                        fontStyle="normal"
                      >
                        est LP tokens received:
                      </Text>
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
                    {currentLPTokenAmount === null ? (
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
                      "$" + currentLPTokenAmount
                    )}
                    {/* $ 10.91 */}
                  </Text>
                </Box>
                <Box display="flex" justifyContent="space-between" mb="0.3rem">
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
                      <Box m="2px">
                        {/* <SmallEth /> */}
                        <Image
                          src={`/${toMarketA}.svg`}
                          alt="liquidity split coin1"
                          width="12"
                          height="12"
                        />
                      </Box>
                      <Text>
                        {currentSplit ? (
                          (currentSplit[0] / 1e8).toFixed(2)
                        ) : (
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
                      <Box m="2px">
                        {/* <SmallUsdt /> */}
                        <Image
                          src={`/${toMarketB}.svg`}
                          alt="liquidity split coin1"
                          width="12"
                          height="12"
                        />
                      </Box>
                      <Text>
                        {currentSplit ? (
                          (currentSplit[1] / 1e8).toFixed(2)
                        ) : (
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
                <Box display="flex" justifyContent="space-between" mb="0.3rem">
                  <Box display="flex">
                    <Text
                      color="#6A737D"
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
                    0.1%
                  </Text>
                </Box>
                <Box display="flex" justifyContent="space-between" mb="0.3rem">
                  <Box display="flex">
                    <Text
                      color="#6A737D"
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
                    5.56%
                  </Text>
                </Box>
                <Box display="flex" justifyContent="space-between" mb="0.3rem">
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
                      getBorrowAPR(currentBorrowMarketCoin) + "%"
                    )}
                    {/* 5.56% */}
                  </Text>
                </Box>
                <Box display="flex" justifyContent="space-between" mb="0.3rem">
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
                    1.10
                  </Text>
                </Box>
              </Box>
              {currentPool != "Select a pool" ? (
                <Box
                  onClick={() => {
                    setTransactionStarted(true);
                    if (transactionStarted == false) {
                      handleLiquidity();
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
                      "Performing pre-checks",
                      "Processing the spend borrow",
                      "Updating the l3 records.",
                      // <ErrorButton errorText="Transaction failed" />,
                      // <ErrorButton errorText="Copy error!" />,
                      <SuccessButton
                        key={"successButton"}
                        successText={"Spend successful."}
                      />,
                    ]}
                    labelErrorArray={[
                      <ErrorButton
                        errorText="Transaction failed"
                        key={"error1"}
                      />,
                      <ErrorButton errorText="Copy error!" key={"error2"} />,
                    ]}
                    currentTransactionStatus={currentTransactionStatus}
                    setCurrentTransactionStatus={setCurrentTransactionStatus}
                  >
                    Spend Borrow
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
                  Spend Borrow
                </Button>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </div>
  );
};
export default LiquidityProvisionModal;

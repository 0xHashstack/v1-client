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
import TransactionFees from "../../../TransactionFees.json";
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
import TableMySwap from "../layouts/table/tableIcons/mySwap";
import TableMySwapDull from "../layouts/table/tableIcons/mySwapDull";
import TableJediswapLogo from "../layouts/table/tableIcons/jediswapLogo";
import TableJediswapLogoDull from "../layouts/table/tableIcons/jediswapLogoDull";
import {
  selectInputSupplyAmount,
  setCoinSelectedSupplyModal,
  selectWalletBalance,
  setInputSupplyAmount,
  selectSelectedDapp,
  setTransactionStatus,
  selectActiveTransactions,
  setActiveTransactions,
} from "@/store/slices/userAccountSlice";
import { selectAprAndHealthFactor, selectUserLoans } from "@/store/slices/readDataSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalDropdown,
  selectModalDropDowns,
  resetModalDropdowns,
} from "@/store/slices/dropdownsSlice";
import ArrowUp from "@/assets/icons/arrowup";
import useSwap from "@/Blockchain/hooks/Writes/useSwap";
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import { useWaitForTransaction } from "@starknet-react/core";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
import Image from "next/image";
import mixpanel from "mixpanel-browser";
const SwapModal = ({
  borrowIDCoinMap,
  borrowIds,
  currentId,
  currentMarketCoin,
  BorrowBalance,
  currentSwap,
  setCurrentSwap,
  borrowAPRs,
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const [currentSelectedCoin, setCurrentSelectedCoin] =
    useState("Select a market");
  const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] =
    useState(currentMarketCoin);
  const [currentBorrowId, setCurrentBorrowId] = useState(currentId);
  const [inputAmount, setinputAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [transactionStarted, setTransactionStarted] = useState(false);
  const [borrowAmount, setBorrowAmount] = useState(BorrowBalance);

  const dispatch = useDispatch();
  const modalDropdowns = useSelector(selectModalDropDowns);
  const walletBalance = useSelector(selectWalletBalance);
  const inputAmount1 = useSelector(selectInputSupplyAmount);
  const selectedDapp = useSelector(selectSelectedDapp);

  let activeTransactions = useSelector(selectActiveTransactions);

  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  useEffect(() => {}, [currentSwap]);
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
  const userLoans = useSelector(selectUserLoans);
  //This Function handles the modalDropDowns
  const handleDropdownClick = (dropdownName: any) => {
    // Dispatches an action called setModalDropdown with the dropdownName as the payload
    dispatch(setModalDropdown(dropdownName));
  };

  const [depositTransHash, setDepositTransHash] = useState("");
  const [isToastDisplayed, setToastDisplayed] = useState(false);
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
  //       toast.success(`You have successfully supplied `, {
  //         position: toast.POSITION.BOTTOM_RIGHT,
  //       });
  //       setToastDisplayed(true);
  //     }
  //   },
  // });
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });
  const avgs=useSelector(selectAprAndHealthFactor)
  const handleSwap = async () => {
    try {
      const swap = await writeAsyncJediSwap_swap();
      console.log(swap);
      setDepositTransHash(swap?.transaction_hash);
      if (swap?.transaction_hash) {
        console.log("toast here");
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
        const trans_data = {
          transaction_hash: swap?.transaction_hash.toString(),
          // message: `You have successfully swaped for Loan ID : ${swapLoanId}`,
          message: `Transaction successful`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
        };
        // addTransaction({ hash: deposit?.transaction_hash });
        activeTransactions?.push(trans_data);
        mixpanel.track("Swap Spend Borrow Status", {
          Status: "Success",
          "Market Selected": currentSelectedCoin,
          "Borrow ID": currentBorrowId,
          "Borrow Market": currentBorrowMarketCoin,
        });

        dispatch(setActiveTransactions(activeTransactions));
      }
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
      mixpanel.track("Swap Spend Borrow Status", {
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
    // console.log(borrowAmount)
    // Rest of your code using the 'result' variable
  }, [currentId]);
  useEffect(() => {
    setSwapLoanId(
      currentBorrowId?.slice(currentBorrowId?.indexOf("-") + 1)?.trim()
    );
  }, [currentBorrowId]);
  // console.log(onOpen)
  useEffect(() => {
    setToMarket(currentSelectedCoin);
  }, [currentSelectedCoin]);

  // const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const resetStates = () => {
    setSliderValue(0);
    setinputAmount(0);
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
    // console.log("got id", id);
    for (let i = 0; i < borrowIDCoinMap?.length; i++) {
      if (borrowIDCoinMap?.[i]?.id === id) {
        setCurrentBorrowMarketCoin(borrowIDCoinMap?.[i]?.name?.slice(1));
        return;
      }
    }
  };

  const handleBorrowMarketIDChange = (coin: string) => {
    // console.log("got coin", coin);
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
              mixpanel.track("Swap Modal Selected", {
                Clicked: true,
                "Dapp Selected": currentSwap,
              });
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
            } else {
              mixpanel.track("Swap Modal Selected", {
                Clicked: true,
                "Dapp Selected": currentSwap,
              });
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
            Swap
          </ModalHeader>
          <ModalCloseButton mt="1rem" mr="1rem" />
          <ModalBody>
            <Card bg="#101216" mb="0.5rem" p="1rem" border="1px solid #2B2F35">
              <Text color="#8B949E" display="flex" alignItems="center">
                <Text mr="0.3rem" fontSize="12px">
                  Select Market
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

                  <Text color="white">{currentSelectedCoin}</Text>
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
                            setCurrentSelectedCoin(coin);
                            setToMarket(coin);
                            dispatch(setCoinSelectedSupplyModal(coin));
                          }}
                        >
                          {coin === currentSelectedCoin && (
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
                            px={`${coin === currentSelectedCoin ? "1" : "5"}`}
                            gap="1"
                            bg={`${
                              coin === currentSelectedCoin
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
                  <Box display="flex" gap="3px">
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
                    <Box
                      color="#6A737D"
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
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  0.1%
                </Text>
              </Box>
              {/* <Box display="flex" justifyContent="space-between" mb="0.3rem">
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
                  {TransactionFees.spend}%
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
                  $ 0.91
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
                                            {avgs?.find(
                            (item: any) => item.loanId == currentBorrowId.slice(currentBorrowId?.indexOf("-") + 1)?.trim()
                          )?.avg
                            ? avgs?.find(
                                (item: any) => item.loanId == currentBorrowId.slice(currentBorrowId?.indexOf("-") + 1)?.trim()
                              )?.avg
                            : "3.2"}
                          %
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
                                                                {avgs?.find(
                            (item: any) => item.loanId == currentBorrowId.slice(currentBorrowId?.indexOf("-") + 1)?.trim()
                          )?.avg
                            ? avgs?.find(
                                (item: any) => item.loanId == currentBorrowId.slice(currentBorrowId?.indexOf("-") + 1)?.trim()
                              )?.loanHealth
                            : "2.5"}
                          %
                </Text>
              </Box>
            </Box>
            {currentSelectedCoin != "Select a market" ? (
              <Box
                onClick={() => {
                  setTransactionStarted(true);
                  if (transactionStarted == false) {
                    mixpanel.track("Swap Modal Button Clicked Spend Borrow", {
                      Clicked: true,
                    });
                    handleSwap();
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
                    <ErrorButton errorText="Copy error!" key={"error2"} />,
                  ]}
                  _disabled={{ bgColor: "white", color: "black" }}
                  isDisabled={transactionStarted == true}
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
    </div>
  );
};
export default SwapModal;

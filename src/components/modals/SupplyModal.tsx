import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  ModalBody,
  ModalCloseButton,
  Card,
  Text,
  Checkbox,
  Tooltip,
  Box,
  NumberInput,
  NumberInputField,
  Portal,
  SliderThumb,
} from "@chakra-ui/react";
import ArrowUp from "@/assets/icons/arrowup";
import { useDisclosure } from "@chakra-ui/react";
import InfoIcon from "@/assets/icons/infoIcon";
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import SmallErrorIcon from "@/assets/icons/smallErrorIcon";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import ErrorToast from "../uiElements/toasts/ErrorToast";
import {
  selectInputSupplyAmount,
  setCoinSelectedSupplyModal,
  selectWalletBalance,
  setInputSupplyAmount,
  selectTransactionStatus,
  setTransactionStatus,
  selectAssetWalletBalance,
  setToastTransactionStarted,
  selectTransactionStarted,
  setTransactionStarted,
  // selectCurrentTransactionStatus,
  // setCurrentTransactionStatus,
} from "@/store/slices/userAccountSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalDropdown,
  selectModalDropDowns,
  resetModalDropdowns,
  selectCurrentModalDropdown,
} from "@/store/slices/dropdownsSlice";
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import {
  useAccount,
  useBalance,
  useWaitForTransaction,
} from "@starknet-react/core";
import useDeposit from "@/Blockchain/hooks/Writes/useDeposit";
import SliderPointer from "@/assets/icons/sliderPointer";
import SliderPointerWhite from "@/assets/icons/sliderPointerWhite";
import { useToast } from "@chakra-ui/react";
import { BNtoNum } from "@/Blockchain/utils/utils";
import { uint256 } from "starknet";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import useWithdrawDeposit from "@/Blockchain/hooks/Writes/useWithdrawDeposit";
import SuccessToast from "../uiElements/toasts/SuccessToast";
import SuccessTick from "@/assets/icons/successTick";
import CancelIcon from "@/assets/icons/cancelIcon";
import CancelSuccessToast from "@/assets/icons/cancelSuccessToast";
import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "@/Blockchain/utils/addressServices";
import { NativeToken, Token } from "@/Blockchain/interfaces/interfaces";
import WarningIcon from "@/assets/icons/coins/warningIcon";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
const SupplyModal = ({
  buttonText,
  coin,
  backGroundOverLay,
  ...restProps
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const toastHandler = () => {
  //   console.log("toast called");
  // };

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
  useEffect(() => {
    setAsset(coin ? coin.name : "BTC");
  }, [coin]);

  const [currentSelectedCoin, setCurrentSelectedCoin] = useState(
    coin ? coin.name : "BTC"
  );
  // console.log("wallet balance",typeof Number(walletBalance))
  // console.log("deposit amount", typeof depositAmount);
  const [inputAmount, setinputAmount] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [buttonId, setButtonId] = useState(0);
  const [stakeCheck, setStakeCheck] = useState(true);
  const [currentTransactionStatus, setCurrentTransactionStatus] =
    useState(false);
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

  const assetBalance: assetB = {
    USDT: useBalanceOf(tokenAddressMap["USDT"] || ""),
    USDC: useBalanceOf(tokenAddressMap["USDC"] || ""),
    BTC: useBalanceOf(tokenAddressMap["BTC"] || ""),
    ETH: useBalanceOf(tokenAddressMap["ETH"] || ""),
    DAI: useBalanceOf(tokenAddressMap["DAI"] || ""),
  };
  // console.log(walletBalances,"wallet balances in supply modal")

  const transactionStarted = useSelector(selectTransactionStarted);
  // const currentTransactionStatus = useSelector(selectCurrentTransactionStatus);

  // const [transactionStarted, setTransactionStarted] = useState(false);
  // const [toastTransactionStarted, setToastTransactionStarted] = useState(false);
  // console.log(Number(
  //   BNtoNum(
  //     uint256.uint256ToBN(
  //       walletBalances["ETH"]?.dataBalanceOf?.balance
  //     ),tokenDecimalsMap["ETH"]
  //   )
  // ))

  const dispatch = useDispatch();
  const modalDropdowns = useSelector(selectModalDropDowns);
  // const walletBalances = useSelector(selectAssetWalletBalance);
  const [walletBalance, setwalletBalance] = useState(
    walletBalances[coin.name]?.statusBalanceOf === "success"
      ? Number(
          BNtoNum(
            uint256.uint256ToBN(
              walletBalances[coin.name]?.dataBalanceOf?.balance
            ),
            tokenDecimalsMap[coin.name]
          )
        )
      : 0
  );
  useEffect(() => {
    setwalletBalance(
      walletBalances[coin.name]?.statusBalanceOf === "success"
        ? Number(
            BNtoNum(
              uint256.uint256ToBN(
                walletBalances[coin.name]?.dataBalanceOf?.balance
              ),
              tokenDecimalsMap[coin.name]
            )
          )
        : 0
    );
    // console.log("supply modal status wallet balance",walletBalances[coin.name]?.statusBalanceOf)
  }, [walletBalances[coin.name]?.statusBalanceOf, coin]);
  // useEffect(()=>{

  // },[currentSelectedCoin])
  // console.log(walletBalances['BTC']);
  // const walletBalance = JSON.parse(useSelector(selectWalletBalance))
  // const [transactionFailed, setTransactionFailed] = useState(false);

  // const showToast = () => {};

  // // const recieptData = useWaitForTransaction({
  // //   hash: depositTransHash,
  // //   watch: true,
  // //   onPending: showToast,
  // // });

  // // const showToast = () => {

  // // }
  // const { address: account } = useAccount();
  const [ischecked, setIsChecked] = useState(true);
  const [depositTransHash, setDepositTransHash] = useState("");
  const [isToastDisplayed, setToastDisplayed] = useState(false);
  const recieptData = useWaitForTransaction({
    hash: depositTransHash,
    watch: true,
    onReceived: () => {
      console.log("trans received");
    },
    onPending: () => {
      setCurrentTransactionStatus(true);
      console.log("trans pending");
      if (isToastDisplayed == false) {
        toast.success(
          `You have successfully supplied ${inputAmount} ${currentSelectedCoin}`,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
        setToastDisplayed(true);
      }
    },
    onRejected(transaction) {
      console.log("treans rejected", transaction);
    },
    onAcceptedOnL1: () => {
      setCurrentTransactionStatus(true);
      console.log("trans onAcceptedOnL1");
    },
    onAcceptedOnL2(transaction) {
      setCurrentTransactionStatus(true);
      if (!isToastDisplayed) {
        toast.success(
          `You have successfully supplied ${inputAmount} ${currentSelectedCoin}`,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
        setToastDisplayed(true);
      }
      console.log("trans onAcceptedOnL2 - ", transaction);
    },
  });

  // const recieptData2 = useWaitForTransaction({
  //   hash: depositTransHash,
  //   watch: true,
  //   onReceived: () => {
  //     console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus(true);
  //     console.log("trans pending");
  //     if (isToastDisplayed==false) {
  //       toast.success(`You have successfully supplied ${inputAmount} ${currentSelectedCoin}`, {
  //         position: toast.POSITION.BOTTOM_RIGHT
  //       });
  //       setToastDisplayed(true);
  //     }
  //   },
  //   onRejected(transaction) {
  //     console.log("treans rejected");
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus(true);
  //     console.log("trans onAcceptedOnL1");
  //   },
  //   onAcceptedOnL2(transaction) {
  //     setCurrentTransactionStatus(true);
  //     if (!isToastDisplayed) {
  //       toast.success(`You have successfully supplied ${inputAmount} ${currentSelectedCoin}`, {
  //         position: toast.POSITION.BOTTOM_RIGHT
  //       });
  //       setToastDisplayed(true);
  //     }
  //     console.log("trans onAcceptedOnL2 - ", transaction);
  //   },
  // });

  const handleTransaction = async () => {
    try {
      if (ischecked) {
        const depositStake = await writeAsyncDepositStake();
        if (depositStake?.transaction_hash) {
          console.log("trans transaction hash created");
        }
        setDepositTransHash(depositStake?.transaction_hash);
        dispatch(setTransactionStatus("success"));
        // console.log("Status transaction", deposit);
        console.log(isSuccessDeposit, "success ?");
      } else {
        const deposit = await writeAsyncDeposit();
        if (deposit?.transaction_hash) {
          console.log("trans transaction hash created");
        }
        // const deposit = await writeAsyncDepositStake();
        console.log("Supply Modal - deposit ", deposit);
        setDepositTransHash(deposit?.transaction_hash);
        if (recieptData?.data?.status == "ACCEPTED_ON_L2") {
        }
        dispatch(setTransactionStatus("success"));
        // console.log("Status transaction", deposit);
        console.log(isSuccessDeposit, "success ?");
      }
    } catch (err) {
      // setTransactionFailed(true);
      dispatch(setTransactionStatus("failed"));
      const toastContent = (
        <div>
          Transaction cancelled{" "}
          <CopyToClipboard text={err}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      );
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
      console.log("supply", err);
      // toast({
      //   description: "An error occurred while handling the transaction. " + err,
      //   variant: "subtle",
      //   position: "bottom-right",
      //   status: "error",
      //   isClosable: true,
      // });
      // toast({
      //   variant: "subtle",
      //   position: "bottom-right",
      //   render: () => (
      //     <Box
      //       display="flex"
      //       flexDirection="row"
      //       justifyContent="center"
      //       alignItems="center"
      //       bg="rgba(40, 167, 69, 0.5)"
      //       height="48px"
      //       borderRadius="6px"
      //       border="1px solid rgba(74, 194, 107, 0.4)"
      //       padding="8px"
      //     >
      //       <Box>
      //         <SuccessTick />
      //       </Box>
      //       <Text>You have successfully supplied 1000USDT to check go to </Text>
      //       <Button variant="link">Your Supply</Button>
      //       <Box>
      //         <CancelSuccessToast />
      //       </Box>
      //     </Box>
      //   ),
      //   isClosable: true,
      // });
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

  // useEffect(() => {
  //   getUserLoans("0x05f2a945005c66ee80bc3873ade42f5e29901fc43de1992cd902ca1f75a1480b");
  // }, [])
  // console.log(inputAmount);

  //This Function handles the modalDropDowns
  const handleDropdownClick = (dropdownName: any) => {
    // Dispatches an action called setModalDropdown with the dropdownName as the payload
    dispatch(setModalDropdown(dropdownName));
  };
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
  // console.log(activeModal)

  //This function is used to find the percentage of the slider from the input given by the user
  const handleChange = (newValue: any) => {
    // Calculate the percentage of the new value relative to the wallet balance
    var percentage = (newValue * 100) / walletBalance;
    if (walletBalance == 0) {
      setDepositAmount(0);
      setinputAmount(0);
    }
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setDepositAmount(newValue);
      setinputAmount(newValue);
      dispatch(setInputSupplyAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage);
        setDepositAmount(newValue);
        setinputAmount(newValue);
        dispatch(setInputSupplyAmount(newValue));
      }
    }
  };

  const coins: NativeToken[] = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const resetStates = () => {
    setDepositAmount(0);
    setSliderValue(0);
    setToastDisplayed(false);
    setAsset(coin ? coin.name : "BTC");
    setCurrentSelectedCoin(coin ? coin.name : "BTC");
    setIsChecked(true);
    setwalletBalance(
      walletBalances[coin.name]?.statusBalanceOf === "success"
        ? Number(
            BNtoNum(
              uint256.uint256ToBN(
                walletBalances[coin.name]?.dataBalanceOf?.balance
              ),
              tokenDecimalsMap[coin?.name]
            )
          )
        : 0
    );

    if (transactionStarted) dispatch(setTransactionStarted(""));
    dispatch(resetModalDropdowns());
    dispatch(setTransactionStatus(""));
  };

  useEffect(() => {
    setDepositAmount(0);
    setinputAmount(0);
    setSliderValue(0);
  }, [currentSelectedCoin]);

  // const { } = useBalanceOf();
  // const { } = useTransfer();

  return (
    <div>
      <Button
        onClick={() => {
          onOpen();
          dispatch(setToastTransactionStarted(false));
        }}
        {...restProps}
      >
        {buttonText}
      </Button>
      <Portal>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            resetStates();
            if (transactionStarted) dispatch(setToastTransactionStarted(true));
            // if (setIsOpenCustom) setIsOpenCustom(false);
          }}
          size={{ width: "700px", height: "100px" }}
          isCentered
        >
          <ModalOverlay bg={backGroundOverLay} mt="3.8rem" />
          <ModalContent
            bg="#010409"
            color="white"
            borderRadius="md"
            maxW="462px"
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
              Supply
            </ModalHeader>
            <ModalCloseButton
              // onClick={() => {
              //   if (setIsOpenCustom) setIsOpenCustom(false);
              // }}
              mt="1rem"
              mr="1rem"
            />
            <ModalBody>
              <Card
                bg="#101216"
                mb="0.5rem"
                p="1rem"
                border="1px solid #2B2F35"
                mt="-1.5"
              >
                {walletBalance === 0 && (
                  <Box
                    // display="flex"
                    // justifyContent="left"
                    w="100%"
                    pb="4"
                  >
                    <Box
                      display="flex"
                      bg="#FFF8C5"
                      color="black"
                      fontSize="xs"
                      p="4"
                      fontStyle="normal"
                      fontWeight="500"
                      borderRadius="6px"
                      // textAlign="center"
                    >
                      <Box pr="3" my="auto" cursor="pointer">
                        <WarningIcon />
                      </Box>
                      Selected market does not have balance in your wallet.
                      Please add the balance in the current market or select the
                      valid market from the dropdown below
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
                <Text color="#8B949E" display="flex" alignItems="center">
                  <Text
                    mr="0.3rem"
                    fontSize="12px"
                    fontStyle="normal"
                    fontWeight="400"
                  >
                    Supply Market
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
                      handleDropdownClick("supplyModalDropdown");
                    }
                  }}
                >
                  <Box display="flex" gap="1">
                    <Box p="1">{getCoin(currentSelectedCoin)}</Box>
                    <Text color="white">{currentSelectedCoin}</Text>
                  </Box>

                  <Box pt="1" className="navbar-button">
                    {activeModal ? <ArrowUp /> : <DropdownUp />}
                  </Box>
                  {modalDropdowns.supplyModalDropdown && (
                    <Box
                      w="full"
                      left="0"
                      bg="#03060B"
                      py="2"
                      className="dropdown-container"
                      boxShadow="dark-lg"
                    >
                      {coins.map((coin: NativeToken, index: number) => {
                        return (
                          <Box
                            key={index}
                            as="button"
                            w="full"
                            // display="flex"
                            alignItems="center"
                            gap="1"
                            pr="2"
                            display={
                              Number(
                                BNtoNum(
                                  uint256.uint256ToBN(
                                    assetBalance[coin]?.dataBalanceOf?.balance
                                  ),
                                  tokenDecimalsMap[coin]
                                )
                              ) === 0
                                ? "none"
                                : "flex"
                            }
                            onClick={() => {
                              setCurrentSelectedCoin(coin);
                              setAsset(coin);
                              // console.log(coin,"coin in supply modal")
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
                              pl={`${coin === currentSelectedCoin ? "1" : "5"}`}
                              pr="6px"
                              gap="1"
                              justifyContent="space-between"
                              bg={`${
                                coin === currentSelectedCoin
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
                                Wallet Balance:{" "}
                                {Number(
                                  BNtoNum(
                                    uint256.uint256ToBN(
                                      assetBalance[coin]?.dataBalanceOf?.balance
                                    ),
                                    tokenDecimalsMap[coin]
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
                <Text color="#8B949E" display="flex" alignItems="center">
                  <Text
                    mr="0.3rem"
                    fontSize="12px"
                    fontStyle="normal"
                    fontWeight="400"
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
                    depositAmount > walletBalance
                      ? "1px solid #CF222E"
                      : depositAmount < 0
                      ? "1px solid #CF222E"
                      : isNaN(depositAmount)
                      ? "1px solid #CF222E"
                      : depositAmount > 0 && depositAmount <= walletBalance
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
                    onChange={handleChange}
                    value={
                      depositAmount
                        ? depositAmount
                        : walletBalance == 0
                        ? 0
                        : ""
                    }
                    outline="none"
                    // precision={1}
                    step={parseFloat(`${depositAmount <= 99999 ? 0.1 : 0}`)}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: "pointer" }}
                  >
                    <NumberInputField
                      placeholder={`Minimum 0.01536 ${currentSelectedCoin}`}
                      color={`${
                        depositAmount > walletBalance
                          ? "#CF222E"
                          : isNaN(depositAmount)
                          ? "#CF222E"
                          : depositAmount < 0
                          ? "#CF222E"
                          : depositAmount == 0
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
                      setDepositAmount(walletBalance);
                      setinputAmount(walletBalance);
                      setSliderValue(100);
                      dispatch(setInputSupplyAmount(walletBalance));
                    }}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: "pointer" }}
                  >
                    MAX
                  </Button>
                </Box>
                {depositAmount > walletBalance ||
                depositAmount < 0 ||
                isNaN(depositAmount) ? (
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
                    <Text color="#CF222E" display="flex" flexDirection="row">
                      <Text mt="0.2rem">
                        <SmallErrorIcon />{" "}
                      </Text>
                      <Text ml="0.3rem">
                        {depositAmount > walletBalance
                          ? "Amount exceeds balance"
                          : "Invalid Input"}
                      </Text>
                    </Text>
                    <Text
                      color="#E6EDF3"
                      display="flex"
                      justifyContent="flex-end"
                      flexDirection="row"
                    >
                      Wallet Balance:{" "}
                      {walletBalance.toFixed(5).replace(/\.?0+$/, "").length > 5
                        ? Math.floor(walletBalance)
                        : walletBalance}
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
                    Wallet Balance:{" "}
                    {walletBalance.toFixed(5).replace(/\.?0+$/, "").length > 5
                      ? Math.floor(walletBalance)
                      : walletBalance}
                    <Text color="#6E7781" ml="0.2rem">
                      {` ${currentSelectedCoin}`}
                    </Text>
                  </Text>
                )}

                <Box
                  pt={5}
                  pb={2}
                  pr="0.5"
                  mt="1rem"
                  // width={`${sliderValue > 86 ? "96%" : "100%"}`}
                  // mr="auto"
                  // transition="ease-in-out"
                  display="flex"
                >
                  <Slider
                    aria-label="slider-ex-6"
                    defaultValue={sliderValue}
                    value={sliderValue}
                    onChange={(val) => {
                      setSliderValue(val);
                      var ans = (val / 100) * walletBalance;
                      // console.log(ans);
                      // ans = Math.round(ans * 100) / 100;
                      // console.log(ans)
                      // dispatch(setInputSupplyAmount(ans));
                      setDepositAmount(ans);
                      setinputAmount(ans);
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

              <Card bg="#101216" mt="1rem" p="1rem" border="1px solid #2B2F35">
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
                  <Text
                    font-style="normal"
                    font-weight="400"
                    font-size="12px"
                    color="#6A737D"
                  >
                    5.56%
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
                      {/* <SpinnerLoader/> */}
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
                    font-size="12px"
                    color="#6A737D"
                  >
                    $ 0.50
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
                  <Text
                    font-style="normal"
                    font-weight="400"
                    font-size="12px"
                    color="#6A737D"
                  >
                    5.56%
                  </Text>
                </Text>
              </Card>
              {depositAmount > 0 && depositAmount <= walletBalance ? (
                buttonId == 1 ? (
                  <SuccessButton successText="Supply success" />
                ) : buttonId == 2 ? (
                  <ErrorButton errorText="Copy error!" />
                ) : (
                  <Box
                    onClick={() => {
                      dispatch(setTransactionStarted(""));
                      if (transactionStarted === false) {
                        handleTransaction();
                      }
                      // handleTransaction();
                      // dataDeposit();
                      // if(transactionStarted){
                      //   return;
                      // }
                      // console.log(isSuccessDeposit, "status deposit")
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
                      labelSuccessArray={[
                        "Deposit Amount approved",
                        "Successfully transferred to Hashstack’s supply vault.",
                        "Determining the rToken amount to mint.",
                        "rTokens have been minted successfully.",
                        "Transaction complete.",
                        // <ErrorButton errorText="Transaction failed" />,
                        // <ErrorButton errorText="Copy error!" />,
                        <SuccessButton
                          key={"successButton"}
                          successText={"Success"}
                        />,
                      ]}
                      labelErrorArray={[
                        <ErrorButton errorText="Transaction failed" key={"error1"} />,
                              <ErrorButton errorText="Copy error!" key={"error2"} />,
                      ]}
                      // transactionStarted={(depostiTransactionHash!="" || transactionFailed==true)}
                      _disabled={{ bgColor: "white", color: "black" }}
                      isDisabled={transactionStarted == true}
                      // transactionStarted={toastTransactionStarted}
                      // onClick={}
                      currentTransactionStatus={currentTransactionStatus}
                      setCurrentTransactionStatus={setCurrentTransactionStatus}
                    >
                      Supply
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
                  Supply
                </Button>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </div>
  );
};
export default SupplyModal;

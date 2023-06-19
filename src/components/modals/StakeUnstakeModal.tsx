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
} from "@chakra-ui/react";

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
  selectWalletBalance,
  setTransactionStatus,
} from "@/store/slices/userAccountSlice";
import SmallErrorIcon from "@/assets/icons/smallErrorIcon";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import WarningIcon from "@/assets/icons/coins/warningIcon";
import ArrowUp from "@/assets/icons/arrowup";
import SliderPointer from "@/assets/icons/sliderPointer";
import SliderPointerWhite from "@/assets/icons/sliderPointerWhite";
import { useWaitForTransaction } from "@starknet-react/core";
const StakeUnstakeModal = ({ buttonText, coin, ...restProps }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [sliderValue, setSliderValue] = useState(0);
  const modalDropdowns = useSelector(selectModalDropDowns);
  const [sliderValue2, setSliderValue2] = useState(0);
  const [inputStakeAmount, setInputStakeAmount] = useState(0);
  const [inputUnstakeAmount, setInputUnstakeAmount] = useState(0);
  const [isSupplyTap, setIsSupplyTap] = useState(false);
  const [transactionStarted, setTransactionStarted] = useState(false);
  const [unstakeTransactionStarted, setUnstakeTransactionStarted] =
    useState(false);

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
  const toast = useToast();
  const [depositTransHash, setDepositTransHash] = useState("");
  const [currentTransactionStatus, setCurrentTransactionStatus] =
    useState(false);
  const recieptData = useWaitForTransaction({
    hash: depositTransHash,
    watch: true,
    onReceived: () => {
      console.log("trans received");
    },
    onPending: () => {
      setCurrentTransactionStatus(true);
      console.log("trans pending");
    },
    onRejected(transaction) {
      console.log("treans rejected");
    },
    onAcceptedOnL1: () => {
      setCurrentTransactionStatus(true);
      console.log("trans onAcceptedOnL1");
    },
    onAcceptedOnL2(transaction) {
      setCurrentTransactionStatus(true);
      console.log("trans onAcceptedOnL2 - ", transaction);
    },
  });
  const handleStakeTransaction = async () => {
    try {
      // console.log("staking", rToken, rTokenAmount);
      const stake = await writeAsyncStakeRequest();
      setDepositTransHash(stake?.transaction_hash);
      if (recieptData?.data?.status == "ACCEPTED_ON_L2") {
      }
      dispatch(setTransactionStatus("success"));
      console.log(
        "Staking Modal-stake transaction check",
        recieptData?.data?.status == "ACCEPTED_ON_L2"
      );
    } catch (err) {
      dispatch(setTransactionStatus("failed"));
      console.log(err);
      toast({
        description: "An error occurred while handling the transaction. " + err,
        variant: "subtle",
        position: "bottom-right",
        status: "error",
        isClosable: true,
      });
    }
  };

  const hanldeUnstakeTransaction = async () => {
    try {
      const unstake = await writeAsyncWithdrawStake();
      setDepositTransHash(unstake?.transaction_hash);
      dispatch(setTransactionStatus("success"));
      console.log(unstake);
    } catch (err) {
      dispatch(setTransactionStatus("failed"));
      console.log(err);
      toast({
        description: "An error occurred while handling the transaction. " + err,
        variant: "subtle",
        position: "bottom-right",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setRTokenAmount(newValue);
      // dispatch(setInputSupplyAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage);
        setRTokenAmount(newValue);
      }
      // dispatch(setInputSupplyAmount(newValue));
    }
  };
  const handleUnstakeChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
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

  const coinsSupplied: any = {
    rBTC: false,
    rUSDT: true,
    rUSDC: true,
    rETH: false,
    rDAI: true,
  };

  const rcoins = ["rBTC", "rUSDT", "rUSDC", "rETH", "rDAI"];
  const walletBalance = useSelector(selectWalletBalance);
  const coinObj: any = coins.find((obj) => coin.name in obj);
  const rcoinValue = coinObj ? coinObj[coin.name] : undefined;
  const [isSupplied, setIsSupplied] = useState(false);
  const [currentSelectedSupplyCoin, setCurrentSelectedSupplyCoin] =
    useState("BTC");
  const [currentSelectedStakeCoin, setCurrentSelectedStakeCoin] =
    useState(rcoinValue);
  const [currentSelectedUnstakeCoin, setcurrentSelectedUnstakeCoin] =
    useState(rcoinValue);
  const [buttonId, setButtonId] = useState(0);
  const resetStates = () => {
    setSliderValue(0);
    setSliderValue2(0);
    setRTokenAmount(0);
    setRTokenToWithdraw(0);
    setCurrentSelectedStakeCoin(coin ? rcoinValue : "rBTC");
    setRToken("");
    setcurrentSelectedUnstakeCoin(coin ? rcoinValue : "rBTC");
    setUnstakeRToken(coin ? rcoinValue : "rBTC");
    setTransactionStarted(false);
    setUnstakeTransactionStarted(false);
    dispatch(resetModalDropdowns());
    dispatch(setTransactionStatus(""));
    setCurrentTransactionStatus(false);
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
  }, [coin, coinObj, rcoinValue]);

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
        Details
      </Text>

      <Modal
        isOpen={isOpen}
        // isOpen={isSupplyTap ? isOpenCustom : isOpen}
        // onOverlayClick={() => setIsOpenCustom(false)}
        onClose={() => {
          onClose();
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
                        {!coinsSupplied[currentSelectedStakeCoin] && (
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
                              Selected market is not supplied. to stake in the
                              below selected market supply the asset below
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
                              !coinsSupplied[currentSelectedStakeCoin]
                                ? "Select"
                                : "Supply"
                            }`}{" "}
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
                              {rcoins.map((coin: string, index: number) => {
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
                                      setCurrentSelectedStakeCoin(coin);
                                      setRToken(coin);
                                      // dispatch(setCoinSelectedSupplyModal(coin))
                                    }}
                                  >
                                    {coin === currentSelectedStakeCoin && (
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
                                        coin === currentSelectedStakeCoin
                                          ? "1"
                                          : "5"
                                      }`}
                                      gap="1"
                                      bg={`${
                                        coin === currentSelectedStakeCoin
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
                            rTokenAmount > walletBalance
                              ? "1px solid #CF222E"
                              : rTokenAmount < 0
                              ? "1px solid #CF222E"
                              : rTokenAmount > 0 &&
                                rTokenAmount <= walletBalance
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
                              placeholder={`Minimum 0.01536 ${currentSelectedSupplyCoin}`}
                              color={`${
                                rTokenAmount > walletBalance
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
                            color="#0969DA"
                            _hover={{ bg: "#101216" }}
                            onClick={() => {
                              setRTokenAmount(walletBalance);
                              setSliderValue(100);
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
                                {rTokenAmount > walletBalance
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
                            Wallet Balance: {walletBalance}
                            <Text color="#6E7781" ml="0.2rem">
                              {` ${currentSelectedStakeCoin}`}
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
                              ans = Math.round(ans * 100) / 100;
                              // dispatch(setInputSupplyAmount(ans))
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
                      </Card>
                      {!coinsSupplied[currentSelectedStakeCoin] && (
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
                      )}
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
                          <Text color="#6E7681">$ 10.91</Text>
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
                          <Text color="#6E7681">0.3%</Text>
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
                      {rTokenAmount > 0 && rTokenAmount <= walletBalance ? (
                        buttonId == 1 ? (
                          <SuccessButton successText="Stake success" />
                        ) : buttonId == 2 ? (
                          <ErrorButton errorText="Copy error!" />
                        ) : (
                          <Box
                            onClick={() => {
                              if (transactionStarted == false) {
                                handleStakeTransaction();
                              }
                              setTransactionStarted(true);
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
                              labelErrorArray={[
                                "Processing",
                                "Checking for sufficient rtoken balance.",
                                <ErrorButton errorText="Transaction failed" />,
                                <ErrorButton errorText="Copy error!" />,
                              ]}
                              currentTransactionStatus={
                                currentTransactionStatus
                              }
                              setCurrentTransactionStatus={
                                setCurrentTransactionStatus
                              }
                            >
                              {`${
                                !coinsSupplied[currentSelectedStakeCoin]
                                  ? "Stake and Supply"
                                  : "Stake"
                              }`}
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
                            !coinsSupplied[currentSelectedStakeCoin]
                              ? "Stake and Supply"
                              : "Stake"
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
                        {!coinsSupplied[currentSelectedUnstakeCoin] && (
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
                              my="auto"
                              fontStyle="normal"
                              fontWeight="500"
                              borderRadius="6px"
                              // textAlign="center"
                            >
                              <Box pr="3" my="auto" cursor="pointer">
                                <WarningIcon />
                              </Box>
                              Selected market is not staked. Firstly stake the
                              coins to unstake
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
                              {rcoins.map((coin: string, index: number) => {
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
                                      setcurrentSelectedUnstakeCoin(coin);
                                      setUnstakeRToken(coin);
                                      // dispatch(setCoinSelectedSupplyModal(coin))
                                    }}
                                  >
                                    {coin === currentSelectedUnstakeCoin && (
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
                                        coin === currentSelectedUnstakeCoin
                                          ? "1"
                                          : "5"
                                      }`}
                                      gap="1"
                                      bg={`${
                                        coin === currentSelectedUnstakeCoin
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
                            !coinsSupplied[currentSelectedUnstakeCoin]
                              ? "1px solid #2B2F35"
                              : rTokenToWithdraw > walletBalance
                              ? "1px solid #CF222E"
                              : rTokenToWithdraw < 0
                              ? "1px solid #CF222E"
                              : rTokenToWithdraw > 0 &&
                                rTokenToWithdraw <= walletBalance
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
                            value={
                              coinsSupplied[currentSelectedUnstakeCoin]
                                ? rTokenToWithdraw
                                  ? rTokenToWithdraw
                                  : ""
                                : ""
                            }
                            outline="none"
                            step={parseFloat(
                              `${rTokenToWithdraw <= 99999 ? 0.1 : 0}`
                            )}
                            isDisabled={
                              !coinsSupplied[currentSelectedUnstakeCoin] ||
                              unstakeTransactionStarted == true
                            }
                            _disabled={{ cursor: "pointer" }}
                          >
                            <NumberInputField
                              placeholder={`Minimum 0.01536 ${currentSelectedSupplyCoin}`}
                              color={`${
                                !coinsSupplied[currentSelectedUnstakeCoin]
                                  ? "#1A7F37"
                                  : rTokenToWithdraw > walletBalance
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
                            color="#0969DA"
                            _hover={{ bg: "#101216" }}
                            onClick={() => {
                              if (!coinsSupplied[currentSelectedUnstakeCoin]) {
                                return;
                              }
                              setRTokenToWithdraw(walletBalance);
                              setSliderValue2(100);
                            }}
                            isDisabled={unstakeTransactionStarted == true}
                            _disabled={{ cursor: "pointer" }}
                          >
                            MAX
                          </Button>
                        </Box>
                        {(rTokenToWithdraw > walletBalance ||
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
                          >
                            <Text color="#CF222E" display="flex">
                              <Text mt="0.2rem">
                                <SmallErrorIcon />{" "}
                              </Text>
                              <Text ml="0.3rem">
                                {rTokenToWithdraw > walletBalance
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
                                {` ${currentSelectedUnstakeCoin}`}
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
                            Staking Balance: {walletBalance}
                            <Text color="#6E7781" ml="0.2rem">
                              {` ${currentSelectedUnstakeCoin}`}
                            </Text>
                          </Text>
                        )}
                        <Box pt={5} pb={2} mt="1rem">
                          <Slider
                            aria-label="slider-ex-6"
                            defaultValue={sliderValue2}
                            value={
                              !coinsSupplied[currentSelectedUnstakeCoin]
                                ? 0
                                : sliderValue2
                            }
                            onChange={(val) => {
                              if (!coinsSupplied[currentSelectedUnstakeCoin]) {
                                return;
                              }
                              setSliderValue2(val);
                              var ans = (val / 100) * walletBalance;
                              ans = Math.round(ans * 100) / 100;
                              // dispatch(setInputSupplyAmount(ans))
                              setRTokenToWithdraw(ans);
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
                              value={
                                !coinsSupplied[currentSelectedUnstakeCoin]
                                  ? 0
                                  : sliderValue2
                              }
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
                          <Text color="#6E7681">$10.91</Text>
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
                          <Text color="#6E7681">$ 10.91</Text>
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
                          <Text color="#6E7681">0.3%</Text>
                        </Text>
                      </Card>
                      {rTokenToWithdraw > 0 &&
                      rTokenToWithdraw <= walletBalance &&
                      coinsSupplied[currentSelectedUnstakeCoin] ? (
                        <Box
                          onClick={() => {
                            if (unstakeTransactionStarted == false) {
                              hanldeUnstakeTransaction();
                            }
                            setUnstakeTransactionStarted(true);
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
                              "Processing",
                              "Unstake amount matches staked rToken balance",
                              <ErrorButton errorText="Transaction failed" />,
                              <ErrorButton errorText="Copy error!" />,
                            ]}
                            currentTransactionStatus={currentTransactionStatus}
                            setCurrentTransactionStatus={
                              setCurrentTransactionStatus
                            }
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

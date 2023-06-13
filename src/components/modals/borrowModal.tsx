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
  Card,
  ModalHeader,
  Checkbox,
} from "@chakra-ui/react";

/* Coins logo import  */
import BTCLogo from "../../assets/icons/coins/btc";
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
} from "@/store/slices/userAccountSlice";
import {
  setModalDropdown,
  selectModalDropDowns,
  resetModalDropdowns,
} from "@/store/slices/dropdownsSlice";
import { useEffect, useState } from "react";
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
const BorrowModal = ({ buttonText, coin, ...restProps }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderValue2, setsliderValue2] = useState(0);
  const dispatch = useDispatch();
  const walletBalance = useSelector(selectWalletBalance);
  const [inputCollateralAmount, setinputCollateralAmount] = useState(0);
  const [inputBorrowAmount, setinputBorrowAmount] = useState(0);
  const modalDropdowns = useSelector(selectModalDropDowns);

  const handleBorrow = async () => {
    try {
      console.log("borrowing", amount, market, rToken, rTokenAmount);
      const borrow = await writeAsyncLoanRequestrToken();
    } catch (err) {
      console.log("handle borrow", err);
    }
  };

  // const {  market,
  //   setMarket,
  //   amount,
  //   setAmount,
  //   rToken,
  //   setRToken, } = useLoanRequest();

  const {
    market,
    setMarket,
    amount,
    setAmount,
    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount,
    dataLoanRequest,
    errorLoanRequest,
    resetLoanRequest,
    writeLoanRequest,
    writeAsyncLoanRequest,
    writeAsyncLoanRequestrToken,
    isErrorLoanRequest,
    isIdleLoanRequest,
    isLoadingLoanRequest,
  } = useLoanRequest();
  useEffect(()=>{
    setMarket(coin? coin.name:"BTC");
    setRToken(coin ? coin.name:"BTC");
  },[coin])

  // console.log("loadingg", isLoadingLoanRequest);

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
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setRTokenAmount(newValue);
      dispatch(setInputBorrowModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage);
        setRTokenAmount(newValue);
        dispatch(setInputBorrowModalCollateralAmount(newValue));
      }
      // dispatch((newValue));
    }
  };
  const handleBorrowChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setsliderValue2(100);
      setAmount(newValue);
      dispatch(setInputBorrowModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setsliderValue2(percentage);
        setAmount(newValue);
        dispatch(setInputBorrowModalCollateralAmount(newValue));
      }
      // dispatch((newValue));
    }
  };

  const moreOptions = ["Liquidations", "Dummy1", "Dummy2", "Dummy3"];
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const [currentCollateralCoin, setCurrentCollateralCoin] = useState(
    coin ? coin.name : "BTC"
  );
  const [currentBorrowCoin, setCurrentBorrowCoin] = useState(
    coin ? coin.name : "BTC"
  );
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
  const resetStates = () => {
    setCurrentCollateralCoin(coin?.name ? coin?.name : "BTC");
    setRToken(coin?.name ? coin?.name : "BTC");
    setCurrentBorrowCoin(coin?.name ? coin?.name : "BTC");
    setMarket(coin?.name ? coin?.name : "BTC");
    setAmount(0);
    setRTokenAmount(0);
    setSliderValue(0);
    setsliderValue2(0);
    setTransactionStarted(false);
    dispatch(resetModalDropdowns());
  };
  useEffect(() => {
    setRTokenAmount(0);
    setSliderValue(0);
  }, [currentCollateralCoin]);
  useEffect(() => {
    setAmount(0);
    setsliderValue2(0);
  }, [currentBorrowCoin]);

  const rTokens = ["rBTC", "rUSDT", "rETH"];
  return (
    <Box>
      <Button {...restProps} onClick={onOpen}>
        {buttonText}
      </Button>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

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
        <ModalContent mt="8rem" bg={"#010409"} maxW="464px">
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
              backgroundColor="#101216"
              border="1px"
              borderColor="#2B2F35"
              p="1rem"
              mt="-1.5"
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
                        "borrowModalCollateralMarketDropdown"
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
                      bg="#03060B"
                      py="2"
                      className="dropdown-container"
                      boxShadow="dark-lg"
                    >
                      {rTokens.map((coin: string, index: number) => {
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
                              setRToken(coin);
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
                  color={`${
                    rTokenAmount > walletBalance
                      ? "#CF222E"
                      : rTokenAmount < 0
                      ? "#CF222E"
                      : rTokenAmount == 0
                      ? "white"
                      : "#1A7F37"
                  }`}
                  border={`${
                    rTokenAmount > walletBalance
                      ? "1px solid #CF222E"
                      : rTokenAmount < 0
                      ? "1px solid #CF222E"
                      : rTokenAmount > 0 && rTokenAmount <= walletBalance
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
                    // outline="none"
                    // precision={1}
                    step={parseFloat(`${rTokenAmount <= 99999 ? 0.1 : 0}`)}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: "pointer" }}
                  >
                    <NumberInputField
                      placeholder={`Minimum 0.01536 ${currentCollateralCoin}`}
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
                {rTokenAmount > walletBalance || rTokenAmount < 0 ? (
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
                    mt="0.2rem"
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
                <Box pt={5} pb={2} mt="0.8rem">
                  <Slider
                    aria-label="slider-ex-6"
                    defaultValue={sliderValue}
                    value={sliderValue}
                    onChange={(val) => {
                      setSliderValue(val);
                      var ans = (val * walletBalance)/100;
                      ans = Math.round(ans * 100) / 100;
                      dispatch(setInputBorrowModalCollateralAmount(ans));
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
                {currentCollateralCoin != "rBTC" &&
                  currentCollateralCoin != "rUSDT" && (
                    <Box
                      // display="flex"
                      // justifyContent="left"
                      w="100%"
                      pb="4"
                      height="64px"
                      display="flex"
                      alignItems="center"
                      mt="1rem"
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
                        You have selected native token as collateral which will
                        be converted to rtokens 1rBTC = XXBTC
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
                {currentCollateralCoin != "rBTC" &&
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
                  )}
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
                      handleDropdownClick("borrowModalBorrowMarketDropdown");
                    }
                  }}
                  as="button"
                >
                  <Box display="flex" gap="1">
                    <Box p="1">{getCoin(currentBorrowCoin)}</Box>
                    <Text>{currentBorrowCoin}</Text>
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
                              setMarket(coin);
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
                              px={`${coin === currentBorrowCoin ? "1" : "5"}`}
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
                    amount > walletBalance
                      ? "1px solid #CF222E"
                      : amount < 0
                      ? "1px solid #CF222E"
                      : isNaN(amount)
                      ? "1px solid #CF222E"
                      : amount > 0 && amount <= walletBalance
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
                    value={amount ? amount : ""}
                    step={parseFloat(`${amount <= 99999 ? 0.1 : 0}`)}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: "pointer" }}
                  >
                    <NumberInputField
                      placeholder={`Minimum 0.01536 ${currentBorrowCoin}`}
                      color={`${
                        amount > walletBalance
                          ? "#CF222E"
                          : isNaN(amount)
                          ? "#CF222E"
                          : amount < 0
                          ? "#CF222E"
                          : amount == 0
                          ? "white"
                          : "#1A7F37"
                      }`}
                      border="0px"
                      _placeholder={{
                        color: "#393D4F",
                        fontSize: ".89rem",
                        fontWeight: "600",
                        outline: "0",
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
                      setAmount(walletBalance);
                      setsliderValue2(100);
                      dispatch(setInputBorrowModalBorrowAmount(walletBalance));
                    }}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: "pointer" }}
                  >
                    MAX
                  </Button>
                </Box>
                {amount > walletBalance || amount < 0 ? (
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
                        {amount > walletBalance
                          ? "Amount exceeds balance"
                          : "Invalid Input"}
                      </Text>
                    </Text>
                    <Text
                      color="#E6EDF3"
                      display="flex"
                      justifyContent="flex-end"
                    >
                      Available reserves: {walletBalance}
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
                    mt="0.2rem"
                    fontSize="12px"
                    fontWeight="500"
                    fontStyle="normal"
                    fontFamily="Inter"
                  >
                    Available reserves: {walletBalance}
                    <Text color="#6E7781" ml="0.2rem">
                      {` ${currentBorrowCoin}`}
                    </Text>
                  </Text>
                )}
                <Box pt={5} pb={2} mt="0.9rem">
                  <Slider
                    aria-label="slider-ex-6"
                    defaultValue={sliderValue2}
                    value={sliderValue2}
                    onChange={(val) => {
                      setsliderValue2(val);
                      var ans = (val / 100) * walletBalance;
                      ans = Math.round(ans * 100) / 100;
                      dispatch(setInputBorrowModalBorrowAmount(ans));
                      setAmount(ans);
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

            <Card bg="#101216" mt="1.5rem" p="1rem" border="1px solid #2B2F35">
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
                <Text
                  font-style="normal"
                  font-weight="400"
                  font-size="14px"
                  color="#6A737D"
                >
                  $ 10.91
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
                    color="#6A737D"
                  >
                    Borrow apr:
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
                  5.56%
                </Text>
              </Text>
              <Text
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
                mb="0.4rem"
              >
                <Text display="flex" alignItems="center" key={"effective apr"}>
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
                  5.56%
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
                    font-size="14px"
                    color="#6A737D"
                  >
                    Health Factor:
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
                  font-weight="900"
                  font-size="12px"
                  color="#6A737D"
                >
                  5.56%
                </Text>
              </Text>
            </Card>

            {rTokenAmount > 0 &&
            amount > 0 &&
            rTokenAmount <= walletBalance &&
            amount <= walletBalance ? (
              buttonId == 1 ? (
                <SuccessButton successText="Borrow successful." />
              ) : buttonId == 2 ? (
                <ErrorButton errorText="Copy error!" />
              ) : (
                <Box
                  onClick={() => {
                    handleBorrow();
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
                      "Collateral received",
                      "Processing the borrow request.",
                      <ErrorButton errorText="Transaction failed" />,
                      <ErrorButton errorText="Copy error!" />,

                    ]}
                  >
                    Borrow
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

export default BorrowModal;

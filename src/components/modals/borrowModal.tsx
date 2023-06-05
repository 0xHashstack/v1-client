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
  SliderFilledTrack,
  NumberInput,
  NumberInputField,
  Box,
  Text,
  Heading,
  Card,
  ModalHeader,
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
const BorrowModal = ({ buttonText,coin, ...restProps }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderValue2, setsliderValue2] = useState(0);
  const dispatch = useDispatch();
  const walletBalance = useSelector(selectWalletBalance);
  const [inputCollateralAmount, setinputCollateralAmount] = useState(0);
  const [inputBorrowAmount, setinputBorrowAmount] = useState(0);
  const modalDropdowns = useSelector(selectModalDropDowns);

  // const {  market,
  //   setMarket,
  //   amount,
  //   setAmount,
  //   rToken,
  //   setRToken, } = useLoanRequest();

  const [buttonId, setButtonId] = useState(0);

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

  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setModalDropdown(dropdownName));
  };
  const handleChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setinputCollateralAmount(newValue);
      dispatch(setInputBorrowModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage);
        setinputCollateralAmount(newValue);
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
      setinputBorrowAmount(newValue);
      dispatch(setInputBorrowModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setsliderValue2(percentage);
        setinputBorrowAmount(newValue);
        dispatch(setInputBorrowModalCollateralAmount(newValue));
      }
      // dispatch((newValue));
    }
  };

  const moreOptions = ["Liquidations", "Dummy1", "Dummy2", "Dummy3"];
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const [currentCollateralCoin, setCurrentCollateralCoin] = useState(coin ? coin.name :"BTC");
  const [currentBorrowCoin, setCurrentBorrowCoin] = useState(coin ? coin.name :"BTC");
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
  const resetStates = () => {
    setCurrentCollateralCoin(coin.name);
    setCurrentBorrowCoin(coin.name);
    setinputBorrowAmount(0);
    setinputCollateralAmount(0);
    setSliderValue(0);
    setsliderValue2(0);
    dispatch(resetModalDropdowns());
  };
  useEffect(()=>{
    setinputCollateralAmount(0);
    setSliderValue(0);
},[currentCollateralCoin])
  useEffect(()=>{
    setinputBorrowAmount(0);
    setsliderValue2(0);
  },[currentBorrowCoin])

  return (
    <Box>
      <Button
        key="borrow"
        height={"2rem"}
        padding="6px 12px"
        border="1px solid #BDBFC1;"
        color="#BDBFC1;"
        fontSize={"12px"}
        bgColor="#101216"
        _hover={{ bg: "white", color: "black" }}
        borderRadius={"6px"}
        onClick={onOpen}
      >
        Borrow
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
                    placement="bottom-start"
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
                  onClick={() =>
                    handleDropdownClick("borrowModalCollateralMarketDropdown")
                  }
                  as="button"
                >
                  <Box display="flex" gap="1">
                    <Box p="1">{getCoin(currentCollateralCoin)}</Box>
                    <Text>{currentCollateralCoin}</Text>
                  </Box>
                  <Box pt="1" className="navbar-button">
                    {activeModal=="borrowModalCollateralMarketDropdown" ? <ArrowUp/> :<DropdownUp/>}
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
                    placement="bottom-start"
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
                    inputCollateralAmount > walletBalance
                      ? "#CF222E"
                      : inputCollateralAmount < 0
                      ? "#CF222E"
                      : inputCollateralAmount == 0
                      ? "white"
                      : "#1A7F37"
                  }`}
                  border={`${
                    inputCollateralAmount > walletBalance
                      ? "1px solid #CF222E"
                      : inputCollateralAmount < 0
                      ? "1px solid #CF222E"
                      : inputCollateralAmount > 0 &&
                        inputCollateralAmount <= walletBalance
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
                    value={inputCollateralAmount ? inputCollateralAmount : ""}
                    // outline="none"
                    // precision={1}
                    step={parseFloat(
                      `${inputCollateralAmount <= 99999 ? 0.1 : 0}`
                    )}
                  >
                    <NumberInputField
                      placeholder={`Minimum 0.01536 ${currentCollateralCoin}`}
                      border="0px"
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
                      setinputCollateralAmount(walletBalance);
                      setSliderValue(100);
                      dispatch(
                        setInputBorrowModalCollateralAmount(walletBalance)
                      );
                    }}
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
                        {inputCollateralAmount > walletBalance
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
                      var ans = (val / 100) * walletBalance;
                      ans = Math.round(ans * 100) / 100;
                      dispatch(setInputBorrowModalCollateralAmount(ans));
                      setinputCollateralAmount(ans);
                    }}
                    focusThumbOnChange={false}
                  >
                    <SliderMark value={sliderValue}>
                      <Box
                        position="absolute"
                        bottom="-8px"
                        left="-11px"
                        zIndex="1"
                      >
                        <SliderTooltip />
                        <Text
                          position="absolute"
                          color="black"
                          top="6px"
                          left={
                            sliderValue !== 100
                              ? sliderValue >= 10
                                ? "15%"
                                : "25%"
                              : "8%"
                          }
                          fontSize=".58rem"
                          fontWeight="bold"
                          textAlign="center"
                        >
                          {sliderValue}%
                        </Text>
                      </Box>
                    </SliderMark>
                    <SliderTrack bg="#343333">
                      <SliderFilledTrack bg="white" w={`${sliderValue}`} />
                    </SliderTrack>
                  </Slider>
                </Box>
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
                    placement="bottom-start"
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
                  onClick={() =>
                    handleDropdownClick("borrowModalBorrowMarketDropdown")
                  }
                  as="button"
                >
                  <Box display="flex" gap="1">
                    <Box p="1">{getCoin(currentBorrowCoin)}</Box>
                    <Text>{currentBorrowCoin}</Text>
                  </Box>
                  <Box pt="1" className="navbar-button">
                    {activeModal=="borrowModalBorrowMarketDropdown" ? <ArrowUp/>:<DropdownUp/>}
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
                    placement="bottom-start"
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
                    inputBorrowAmount > walletBalance
                      ? "1px solid #CF222E"
                      : inputBorrowAmount < 0
                      ? "1px solid #CF222E"
                      : isNaN(inputBorrowAmount)
                      ? "1px solid #CF222E"
                      : inputBorrowAmount > 0 &&
                        inputBorrowAmount <= walletBalance
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
                    value={inputBorrowAmount ? inputBorrowAmount : ""}
                    step={parseFloat(`${inputBorrowAmount <= 99999 ? 0.1 : 0}`)}
                  >
                    <NumberInputField
                      placeholder={`Minimum 0.01536 ${currentBorrowCoin}`}
                      color={`${
                        inputBorrowAmount > walletBalance
                          ? "#CF222E"
                          : isNaN(inputBorrowAmount)
                          ? "#CF222E"
                          : inputBorrowAmount < 0
                          ? "#CF222E"
                          : inputBorrowAmount == 0
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
                      setinputBorrowAmount(walletBalance);
                      setsliderValue2(100);
                      dispatch(setInputBorrowModalBorrowAmount(walletBalance));
                    }}
                  >
                    MAX
                  </Button>
                </Box>
                {inputBorrowAmount > walletBalance || inputBorrowAmount < 0 ? (
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
                        {inputBorrowAmount > walletBalance
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
                      setinputBorrowAmount(ans);
                    }}
                    focusThumbOnChange={false}
                  >
                    <SliderMark value={sliderValue2}>
                      <Box
                        position="absolute"
                        bottom="-8px"
                        left="-11px"
                        zIndex="1"
                      >
                        <SliderTooltip />
                        <Text
                          position="absolute"
                          color="black"
                          top="6px"
                          left={
                            sliderValue2 !== 100
                              ? sliderValue2 >= 10
                                ? "15%"
                                : "25%"
                              : "8%"
                          }
                          fontSize=".58rem"
                          fontWeight="bold"
                          textAlign="center"
                        >
                          {sliderValue2}%
                        </Text>
                      </Box>
                    </SliderMark>
                    <SliderTrack bg="#343333">
                      <SliderFilledTrack bg="white" w={`${sliderValue2}`} />
                    </SliderTrack>
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

            {inputCollateralAmount > 0 &&
            inputBorrowAmount > 0 &&
            inputCollateralAmount <= walletBalance && inputBorrowAmount<=walletBalance ? (
              buttonId == 1 ? (
                <SuccessButton successText="Borrow successful." />
              ) : buttonId == 2 ? (
                <ErrorButton errorText="Copy error!" />
              ) : (
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
                  labelArray={[
                    "Collateral received",
                    "Processing the borrow request.",
                    // <ErrorButton errorText="Transaction failed" />,
                    // <ErrorButton errorText="Copy error!" />,
                    <SuccessButton
                      key={"successButton"}
                      successText={"Borrow successful."}
                    />,
                  ]}
                >
                  Borrow
                </AnimatedButton>
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

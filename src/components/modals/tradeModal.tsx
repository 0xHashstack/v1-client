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
  RadioGroup,
  Stack,
  Radio,
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
  setInputTradeModalCollateralAmount,
  setInputTradeModalBorrowAmount,
} from "@/store/slices/userAccountSlice";
import {
  selectNavDropdowns,
  setNavDropdown,
  setModalDropdown,
  selectModalDropDowns,
} from "@/store/slices/dropdownsSlice";
import { useState } from "react";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import MySwapDisabled from "@/assets/icons/dapps/mySwapDisabled";
import EthToUsdc from "@/assets/icons/pools/ethToUsdc";
import EthToUsdt from "@/assets/icons/pools/ethToUsdt";
import UsdcToUsdt from "@/assets/icons/pools/usdcToUsdt";
import SmallEth from "@/assets/icons/coins/smallEth";
import SmallUsdt from "@/assets/icons/coins/smallUsdt";
import DaiToEth from "@/assets/icons/pools/daiToEth";
import BtcToEth from "@/assets/icons/pools/btcToEth";
import BtcToUsdt from "@/assets/icons/pools/btcToUsdt";

const TradeModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //   console.log("isopen", isOpen, "onopen", onOpen, "onClose", onClose);
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderValue2, setsliderValue2] = useState(0);
  const dispatch = useDispatch();
  const walletBalance = useSelector(selectWalletBalance);
  const [inputAmount, setinputAmount] = useState(0);
  const [inputCollateralAmount, setinputCollateralAmount] = useState(0);
  const [inputBorrowAmount, setinputBorrowAmount] = useState(0);
  const modalDropdowns = useSelector(selectModalDropDowns);

  const dapps = [
    { name: "Jediswap", status: "enable" },
    { name: "mySwap", status: "disable" },
  ];

  const pools = [
    "ETH/USDT",
    "USDC/USDT",
    "ETH/USDC",
    "DAI/ETH",
    "BTC/ETH",
    "BTC/USDT",
  ];
  const [currentDapp, setCurrentDapp] = useState("Jediswap");
  const [currentPool, setCurrentPool] = useState("ETH/USDT");
  const [currentPoolCoin, setCurrentPoolCoin] = useState("ETH");

  const getCoin = (CoinName: string) => {
    switch (CoinName) {
      case "BTC":
        return <BTCLogo />;
        break;
      case "USDC":
        return <USDCLogo />;
        break;
      case "USDT":
        return <USDTLogo />;
        break;
      case "ETH":
        return <ETHLogo />;
        break;
      case "DAI":
        return <DAILogo />;
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

  const handleDropdownClick = (dropdownName: string) => {
    dispatch(setModalDropdown(dropdownName));
  };
  const handleChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setinputCollateralAmount(newValue);
      dispatch(setInputTradeModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage * 100) / 100;
      setSliderValue(percentage);
      setinputCollateralAmount(newValue);
      dispatch(setInputTradeModalCollateralAmount(newValue));
      // dispatch((newValue));
    }
  };
  const handleBorrowChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setsliderValue2(100);
      setinputBorrowAmount(newValue);
      dispatch(setInputTradeModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage * 100) / 100;
      setsliderValue2(percentage);
      setinputBorrowAmount(newValue);
      dispatch(setInputTradeModalCollateralAmount(newValue));
      // dispatch((newValue));
    }
  };

  const moreOptions = ["Liquidations", "Dummy1", "Dummy2", "Dummy3"];
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const [currentCollateralCoin, setCurrentCollateralCoin] = useState("BTC");
  const [currentBorrowCoin, setCurrentBorrowCoin] = useState("BTC");
  const [radioValue, setRadioValue] = useState("1");

  return (
    <Box>
      <Button
        key="borrow"
        height={"2rem"}
        padding="0rem 1rem"
        border="1px solid #2b2f35"
        color="#6e6e6e"
        fontSize={"12px"}
        bgColor="#101216"
        _hover={{ bgColor: "#2DA44E", color: "#E6EDF3" }}
        borderRadius={"6px"}
        onClick={onOpen}
      >
        Borrow
      </Button>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />
        <ModalContent mt="5rem" bg={"#010409"} maxW="884px">
          <ModalCloseButton mt="1rem" mr="1rem" color="white" />
          {/* <ModalHeader>Borrow</ModalHeader> */}
          <ModalBody color={"#E6EDF3"}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              fontSize={"sm"}
              my={"2"}
            >
              <Heading fontSize="md" fontWeight="medium" mt="0.9rem">
                Trade
              </Heading>
              <ModalCloseButton mt="1rem" mr="1rem" color="white" />
            </Box>
            <Box
              display="flex"
              justifyContent="space-around"
              gap="5"
              //   alignItems="center"
            >
              <Box w="48%">
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
                        handleDropdownClick(
                          "tradeModalCollateralMarketDropdown"
                        )
                      }
                      as="button"
                    >
                      <Box display="flex" gap="1">
                        <Box p="1">{getCoin(currentCollateralCoin)}</Box>
                        <Text>{currentCollateralCoin}</Text>
                      </Box>
                      <Box pt="1" className="navbar-button">
                        <DropdownUp />
                      </Box>
                      {modalDropdowns.tradeModalCollateralMarketDropdown && (
                        <Box
                          w="full"
                          left="0"
                          bg="#03060B"
                          py="2"
                          className="dropdown-container"
                          boxShadow="dark-lg"
                        >
                          {coins.map((coin, index) => {
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
                      color="white"
                      border="1px solid #2B2F35"
                      borderRadius="6px"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <NumberInput
                        border="0px"
                        min={0}
                        keepWithinRange={true}
                        onChange={handleChange}
                        value={inputCollateralAmount}
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
                            setInputTradeModalCollateralAmount(walletBalance)
                          );
                        }}
                      >
                        MAX
                      </Button>
                    </Box>
                    <Text
                      textAlign="right"
                      fontSize="12px"
                      fontWeight="500"
                      fontStyle="normal"
                    >
                      Wallet Balance: {walletBalance}
                      <Text as="span" color="#8B949E">
                        {` ${currentCollateralCoin}`}
                      </Text>
                    </Text>
                    <Box pt={5} pb={2} mt="0.4rem">
                      <Slider
                        aria-label="slider-ex-6"
                        defaultValue={sliderValue}
                        value={sliderValue}
                        onChange={(val) => {
                          setSliderValue(val);
                          var ans = (val / 100) * walletBalance;
                          ans = Math.round(ans * 100) / 100;
                          dispatch(setInputTradeModalCollateralAmount(ans));
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
                                  : "0"
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
                        handleDropdownClick("tradeModalBorrowMarketDropdown")
                      }
                      as="button"
                    >
                      <Box display="flex" gap="1">
                        <Box p="1">{getCoin(currentBorrowCoin)}</Box>
                        <Text>{currentBorrowCoin}</Text>
                      </Box>
                      <Box pt="1" className="navbar-button">
                        <DropdownUp />
                      </Box>
                      {modalDropdowns.tradeModalBorrowMarketDropdown && (
                        <Box
                          w="full"
                          left="0"
                          bg="#03060B"
                          py="2"
                          className="dropdown-container"
                          boxShadow="dark-lg"
                        >
                          {coins.map((coin, index) => {
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
                                  px={`${
                                    coin === currentBorrowCoin ? "1" : "5"
                                  }`}
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
                      border="1px solid #2B2F35"
                      borderRadius="6px"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <NumberInput
                        border="0px"
                        min={0}
                        keepWithinRange={true}
                        onChange={handleBorrowChange}
                        value={inputBorrowAmount}
                      >
                        <NumberInputField
                          placeholder={`Minimum 0.01536 ${currentBorrowCoin}`}
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
                          dispatch(
                            setInputTradeModalBorrowAmount(walletBalance)
                          );
                        }}
                      >
                        MAX
                      </Button>
                    </Box>
                    <Box pt={5} pb={2} mt="0.4rem">
                      <Slider
                        aria-label="slider-ex-6"
                        defaultValue={sliderValue2}
                        value={sliderValue2}
                        onChange={(val) => {
                          setsliderValue2(val);
                          var ans = (val / 100) * walletBalance;
                          ans = Math.round(ans * 100) / 100;
                          dispatch(setInputTradeModalBorrowAmount(ans));
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
                                  : "0"
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
              </Box>
              <Box w="48%">
                <Box display="flex" flexDir="column" p="3" gap="1">
                  <Box>
                    <RadioGroup onChange={setRadioValue} value={radioValue}>
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
                      borderRadius="md"
                      className="navbar"
                      onClick={() =>
                        handleDropdownClick("yourBorrowDappDropdown")
                      }
                      as="button"
                    >
                      <Box display="flex" gap="1">
                        <Box p="1">{getCoin(currentDapp)}</Box>
                        <Text>{currentDapp}</Text>
                      </Box>
                      <Box pt="1" className="navbar-button">
                        <DropdownUp />
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
                      borderRadius="md"
                      className="navbar"
                      onClick={() =>
                        handleDropdownClick("yourBorrowPoolDropdown")
                      }
                      as="button"
                    >
                      <Box display="flex" gap="1">
                        <Box p="1">
                          {getCoin(
                            radioValue === "1" ? currentPool : currentPoolCoin
                          )}
                        </Box>
                        <Text>
                          {radioValue === "1" ? currentPool : currentPoolCoin}
                        </Text>
                      </Box>
                      <Box pt="1" className="navbar-button">
                        <DropdownUp />
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
                          {coins.map((coin, index) => {
                            return (
                              <Box
                                as="button"
                                w="full"
                                display="flex"
                                alignItems="center"
                                gap="1"
                                pr="2"
                                onClick={() => {
                                  setCurrentPoolCoin(coin);
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
                                  px={`${coin === currentPoolCoin ? "1" : "5"}`}
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
                <Box
                  p="4"
                  borderRadius="md"
                  border="1px"
                  borderColor="#2B2F35"
                  bg="#101216"
                  my="4"
                >
                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#6E7681" fontSize="xs">
                        est LP tokens recieved:{" "}
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
                    <Text color="#6E7681" fontSize="xs">
                      $ 10.91
                    </Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#6E7681" fontSize="xs">
                        Fees:{" "}
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
                    <Text color="#6E7681" fontSize="xs">
                      0.1%
                    </Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#6E7681" fontSize="xs">
                        Borrow apr:{" "}
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
                    <Text color="#6E7681" fontSize="xs">
                      5.56%
                    </Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#6E7681" fontSize="xs">
                        Gas estimate:{" "}
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
                        <Box className="p-1">
                          <InfoIcon />
                        </Box>
                      </Tooltip>
                    </Box>
                    <Text color="#6E7681" fontSize="xs">
                      5.56%
                    </Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#6E7681" fontSize="xs">
                        Effective apr:{" "}
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
                        <Box className="p-1">
                          <InfoIcon />
                        </Box>
                      </Tooltip>
                    </Box>
                    <Text color="#6E7681" fontSize="xs">
                      5.56%
                    </Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Box display="flex">
                      <Text color="#6E7681" fontSize="xs">
                        Health factor:{" "}
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
                        <Box className="p-1">
                          <InfoIcon />
                        </Box>
                      </Tooltip>
                    </Box>
                    <Text color="#6E7681" fontSize="xs">
                      1.10
                    </Text>
                  </Box>
                </Box>
                {inputCollateralAmount > 0 && inputBorrowAmount > 0 ? (
                  <Button
                    bg="#8B949E"
                    color="white"
                    size="sm"
                    width="100%"
                    mt="3"
                    mb="2rem"
                    border="1px solid #2B2F35"
                    _hover={{ bg: "#2DA44E" }}
                    _focus={{ bg: "#298E46" }}
                  >
                    Borrow
                  </Button>
                ) : (
                  <Button
                    bg="#101216"
                    color="#6E7681"
                    size="sm"
                    width="100%"
                    mt="3"
                    mb="2rem"
                    border="1px solid #2B2F35"
                    _hover={{ bg: "#101216" }}
                  >
                    Borrow
                  </Button>
                )}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TradeModal;

{
  /* 
<Box className="p-4 bg-[#101216] rounded-md border border-[#2B2F35] my-6">
  <Box className="flex justify-between">
    <Box className="flex">
      <Text
        className="text-xs text-[#8B949E]"
        font-style="normal"
        font-weight="400"
        font-size="12px"
        lineHeight="16px"
        color="#6A737D"
      >
        Gas estimate:{" "}
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
        <Box className="p-1">
          <InfoIcon />
        </Box>
      </Tooltip>
    </Box>
    <Text className="text-xs text-[#6E7681] font-bold">
      $ 10.91
    </Text>
  </Box>
  <Box className="flex justify-between">
    <Box className="flex">
      <Text
        className="text-xs text-[#8B949E]"
        font-style="normal"
        font-weight="400"
        font-size="12px"
        lineHeight="16px"
        color="#6A737D"
      >
        Borrow apr:{" "}
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
        <Box className="p-1">
          <InfoIcon />
        </Box>
      </Tooltip>
    </Box>
    <Text className="text-xs text-[#6E7681] font-bold">5.56%</Text>
  </Box>
  <Box className="flex justify-between">
    <Box className="flex">
      <Text
        className="text-xs text-[#8B949E]"
        font-style="normal"
        font-weight="400"
        font-size="12px"
        lineHeight="16px"
        color="#6A737D"
      >
        Effective apr:{" "}
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
        <Box className="p-1">
          <InfoIcon />
        </Box>
      </Tooltip>
    </Box>
    <Text className="text-xs text-[#6E7681] font-bold">5.56%</Text>
  </Box>
  <Box className="flex justify-between">
    <Box className="flex">
      <Text
        className="text-xs text-[#8B949E]"
        font-style="normal"
        font-weight="400"
        font-size="12px"
        lineHeight="16px"
        color="#6A737D"
      >
        Health factor:{" "}
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
        <Box className="p-1">
          <InfoIcon />
        </Box>
      </Tooltip>
    </Box>
    <Text className="text-xs text-[#6E7681] font-bold">5.56%</Text>
  </Box>
</Box> */
}

{
}

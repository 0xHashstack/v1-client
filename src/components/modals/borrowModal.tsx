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
  selectInputSupplyAmount,
  selectCoinSelectedSupplyModal,
  setCoinSelectedSupplyModal,
  selectWalletBalance,
  setInputSupplyAmount,
  setInputBorrowModalCollateralAmount,
  setInputBorrowModalBorrowAmount,
} from "@/store/slices/userAccountSlice";
import {
  selectNavDropdowns,
  setNavDropdown,
} from "@/store/slices/dropdownsSlice";
import { useState } from "react";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";

const BorrowModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //   console.log("isopen", isOpen, "onopen", onOpen, "onClose", onClose);
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderValue2, setsliderValue2] = useState(0);
  const dispatch = useDispatch();
  const walletBalance = useSelector(selectWalletBalance);
  const [inputAmount, setinputAmount] = useState(0);
  const [inputCollateralAmount, setinputCollateralAmount] = useState(0);
  const [inputBorrowAmount, setinputBorrowAmount] = useState(0);
  const navDropdowns = useSelector(selectNavDropdowns);

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
      default:
        break;
    }
  };

  const handleDropdownClick = (dropdownName: string) => {
    dispatch(setNavDropdown(dropdownName));
  };
  const handleChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setinputCollateralAmount(newValue);
      dispatch(setInputBorrowModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage * 100) / 100;
      setSliderValue(percentage);
      setinputCollateralAmount(newValue);
      dispatch(setInputBorrowModalCollateralAmount(newValue));
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
      percentage = Math.round(percentage * 100) / 100;
      setsliderValue2(percentage);
      setinputBorrowAmount(newValue);
      dispatch(setInputBorrowModalCollateralAmount(newValue));
      // dispatch((newValue));
    }
  };

  const moreOptions = ["Liquidations", "Dummy1", "Dummy2", "Dummy3"];
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const [currentCollateralCoin, setCurrentCollateralCoin] = useState("BTC");
  const [currentBorrowCoin, setCurrentBorrowCoin] = useState("BTC");

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
        <ModalContent mt="5rem" bg={"#010409"} maxW="442px">
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
                Borrow
              </Heading>
              <ModalCloseButton mt="1rem" mr="1rem" color="white" />
              {/* <button onClick={onClose}>Cancel</button> */}
            </Box>
            <Box mt="4">
              <Text fontSize="xs" color="#0969DA" fontWeight="semibold">
                Borrow ID - 123456
              </Text>
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
                    <DropdownUp />
                  </Box>
                  {navDropdowns.borrowModalCollateralMarketDropdown && (
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
                        setInputBorrowModalCollateralAmount(walletBalance)
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
                    handleDropdownClick("borrowModalBorrowMarketDropdown")
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
                  {navDropdowns.borrowModalBorrowMarketDropdown && (
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
                      dispatch(setInputBorrowModalBorrowAmount(walletBalance));
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
            </Box>

            {inputCollateralAmount > 0 && inputBorrowAmount > 0 ? (
              <Button
                bg="#8B949E"
                color="white"
                size="sm"
                width="100%"
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
                mb="2rem"
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

import React, { useState } from "react";

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
} from "@chakra-ui/react";

import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import { useDisclosure } from "@chakra-ui/react";
import InfoIcon from "@/assets/icons/infoIcon";
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import DropdownUp from "@/assets/icons/dropdownUpIcon";

import {
  selectInputSupplyAmount,
  setCoinSelectedSupplyModal,
  selectWalletBalance,
  setInputSupplyAmount,
} from "@/store/slices/userAccountSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalDropdown,
  selectModalDropDowns,
} from "@/store/slices/dropdownsSlice";

const SupplyModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sliderValue, setSliderValue] = useState(0);
  const walletBalance = useSelector(selectWalletBalance);
  const [currentSelectedCoin, setCurrentSelectedCoin] = useState("BTC");
  const inputAmount1 = useSelector(selectInputSupplyAmount);
  const [inputAmount, setinputAmount] = useState(0);

  const dispatch = useDispatch();
  const modalDropdowns = useSelector(selectModalDropDowns);
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
    dispatch(setModalDropdown(dropdownName));
  };
  const handleChange = (newValue: any) => {
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
  //   console.log(currentSelectedCoin);
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  return (
    <div>
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
        Supply
      </Button>
      <Portal>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={{ width: "700px", height: "100px" }}
          isCentered
        >
          <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />
          <ModalContent
            bg="#010409"
            color="white"
            borderRadius="md"
            maxW="442px"
            mt="5rem"
            zIndex={1}
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
            <ModalCloseButton mt="1rem" mr="1rem" />
            <ModalBody>
              <Text
                color="#0969DA"
                mb="8px"
                fontSize="12px"
                fontStyle="normal"
                fontWeight="500"
                lineHeight="16px"
              >
                Supply ID-12345
              </Text>
              <Card
                bg="#101216"
                mb="0.5rem"
                p="1rem"
                border="1px solid #2B2F35"
              >
                <Text color="#8B949E" display="flex" alignItems="center">
                  <Text mr="0.3rem">Market</Text>
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
                  display="flex"
                  border="1px"
                  borderColor="#2B2F35"
                  justifyContent="space-between"
                  py="2"
                  pl="3"
                  pr="3"
                  mb="1rem"
                  mt="0.5rem"
                  borderRadius="md"
                  className="navbar"
                  cursor="pointer"
                  onClick={() => handleDropdownClick("supplyModalDropdown")}
                >
                  <Box display="flex" gap="1">
                    <Box p="1">{getCoin(currentSelectedCoin)}</Box>
                    <Text color="white">{currentSelectedCoin}</Text>
                  </Box>
                  <Box pt="1" className="navbar-button">
                    <DropdownUp />
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
                              setCurrentSelectedCoin(coin);
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
                    value={inputAmount}
                    outline="none"
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
                      setinputAmount(walletBalance);
                      setSliderValue(100);
                      dispatch(setInputSupplyAmount(walletBalance));
                    }}
                  >
                    MAX
                  </Button>
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
                  Wallet Balance: {walletBalance}
                  <Text color="#6E7781" ml="0.2rem">
                    {` ${currentSelectedCoin}`}
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
                      dispatch(setInputSupplyAmount(ans));
                      setinputAmount(ans);
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
                          top="5px"
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
              </Card>
              <Checkbox defaultChecked mt="0.7rem" w="390px">
                <Text
                  fontSize="10px"
                  color="#6E7681"
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="20px"
                >
                  Ticking would stake the received rTokens unchecking
                  wouldn&apos;t stake rTokens
                </Text>
              </Checkbox>

              <Card bg="#101216" mt="1rem" p="1rem" border="1px solid #2B2F35">
                <Text
                  display="flex"
                  justifyContent="space-between"
                  fontSize="0.9rem"
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
                  <Text color="#6E7681">5.56%</Text>
                </Text>
                <Text
                  color="#8B949E"
                  display="flex"
                  justifyContent="space-between"
                  fontSize="0.9rem"
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
                  <Text color="#6E7681">$ 0.50</Text>
                </Text>
                <Text
                  color="#8B949E"
                  display="flex"
                  justifyContent="space-between"
                  fontSize="0.9rem"
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
                      Supply apr:
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
                  <Text color="#6E7681">5.56%</Text>
                </Text>
              </Card>
              {inputAmount1 > 0 ? (
                <Button
                  bg="#8B949E"
                  color="white"
                  size="sm"
                  width="100%"
                  mt="2rem"
                  mb="2rem"
                  border="1px solid #2B2F35"
                  _hover={{ bg: "#2DA44E" }}
                  _focus={{ bg: "#298E46" }}
                >
                  Supply
                </Button>
              ) : (
                <Button
                  bg="#101216"
                  color="#6E7681"
                  size="sm"
                  width="100%"
                  mt="2rem"
                  mb="2rem"
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

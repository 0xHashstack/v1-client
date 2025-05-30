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
import TransactionFees from "../../../TransactionFees.json";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";
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
import ErrorButton from "../uiElements/buttons/ErrorButton";
import { useRouter } from "next/router";

const SupplyEquivalentModal = ({ buttonText, ...restProps }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentSelectedCoin, setCurrentSelectedCoin] = useState("USDT");
  const [inputAmount, setinputAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [buttonId, setButtonId] = useState(0);

  const dispatch = useDispatch();
  const modalDropdowns = useSelector(selectModalDropDowns);
  const walletBalance = useSelector(selectWalletBalance);
  const inputAmount1 = useSelector(selectInputSupplyAmount);
  const router = useRouter();

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
  ////console.log(inputAmount);

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
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage);
        setinputAmount(newValue);
        dispatch(setInputSupplyAmount(newValue));
      }
    }
  };

  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const resetStates = () => {
    setinputAmount(0);
    setSliderValue(0);
    setCurrentSelectedCoin("USDT");
  };

  return (
    <div>
      <Button onClick={onOpen} {...restProps}>
        {buttonText}
      </Button>
      <Portal>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            resetStates();
          }}
          size={{ width: "700px", height: "100px" }}
          isCentered
        >
          <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />
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
              Supply $10 equivalent
            </ModalHeader>
            <ModalCloseButton mt="1rem" mr="1rem" />
            <ModalBody>
              <Card
                bg="#101216"
                mb="0.5rem"
                p="1rem"
                border="1px solid #2B2F35"
                mt="-1.5"
              >
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
                    label="Select supply market"
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
                  onClick={() =>
                    handleDropdownClick("supplyEquivalentMarketDropDown")
                  }
                >
                  <Box display="flex" gap="1">
                    <Box p="1">{getCoin(currentSelectedCoin)}</Box>
                    <Text color="white">{currentSelectedCoin}</Text>
                  </Box>

                  <Box pt="1" className="navbar-button">
                    <DropdownUp />
                  </Box>
                  {modalDropdowns.supplyEquivalentMarketDropDown && (
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
                    label="Enter amount"
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
                    inputAmount > walletBalance
                      ? "1px solid #CF222E"
                      : inputAmount < 0
                      ? "1px solid #CF222E"
                      : isNaN(inputAmount)
                      ? "1px solid #CF222E"
                      : inputAmount > 0 && inputAmount <= walletBalance
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
                    value={inputAmount ? inputAmount : ""}
                    outline="none"
                    // precision={1}
                    step={parseFloat(`${inputAmount <= 99999 ? 0.1 : 0}`)}
                  >
                    <NumberInputField
                      placeholder={`0.01536 ${currentSelectedCoin}`}
                      color={`${
                        inputAmount > walletBalance
                          ? "#CF222E"
                          : isNaN(inputAmount)
                          ? "#CF222E"
                          : inputAmount < 0
                          ? "#CF222E"
                          : inputAmount == 0
                          ? "white"
                          : "#1A7F37"
                      }`}
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
                    _hover={{
                      bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))",
                    }}
                    onClick={() => {
                      setinputAmount(walletBalance);
                      setSliderValue(100);
                      dispatch(setInputSupplyAmount(walletBalance));
                    }}
                  >
                    MAX
                  </Button>
                </Box>
                {inputAmount > walletBalance ||
                inputAmount < 0 ||
                isNaN(inputAmount) ? (
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
                        {inputAmount > walletBalance
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
                <Box pt={5} pb={2} mt="0.9rem">
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
                          top="7px"
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
                    <SliderTrack bg="#3E415C">
                      <SliderFilledTrack bg="white" w={`${sliderValue}`} />
                    </SliderTrack>
                  </Slider>
                </Box>
              </Card>
              <Checkbox
                defaultChecked
                mt="0.7rem"
                w="410px"
                size="md"
                iconSize="1rem"
                _focus={{ boxShadow: "none" }}
                borderColor="#2B2F35"
              >
                <Text
                  fontSize="10.5px"
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
                      label="Fees"
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
                    {TransactionFees.supply}%
                  </Text>
                </Text>
                {/* <Text
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
                      label="Estimated gas fees for transaction"
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
                </Text> */}
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
                      Supply APR:
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="right"
                      boxShadow="dark-lg"
                      label="Supply APR"
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
              {inputAmount > 0 && inputAmount <= walletBalance ? (
                buttonId == 1 ? (
                  <SuccessButton successText="Supply success" />
                ) : buttonId == 2 ? (
                  <ErrorButton errorText="Copy error!" />
                ) : (
                  <Button
                    bgColor="#101216"
                    // bgColor="red"
                    // p={0}
                    color="#8B949E"
                    size="sm"
                    width="100%"
                    mt="1.5rem"
                    mb="1.5rem"
                    border="1px solid #8B949E"
                    // labelArray={[
                    //   "Deposit Amount approved",
                    //   "Successfully transferred to Hashstack’s supply vault.",
                    //   "Determining the rToken amount to mint.",
                    //   "rTokens have been minted successfully.",
                    //   "Transaction complete.",
                    //   // <ErrorButton errorText="Transaction failed" />,
                    //   // <ErrorButton errorText="Copy error!" />,
                    //   <SuccessButton
                    //     key={"successButton"}
                    //     successText={"Success"}
                    //   />,
                    // ]}
                    _hover={{ background: "white", color: "black" }}
                    onClick={() => {
                      router.replace("/market");
                    }}
                  >
                    Supply
                  </Button>
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
                  _hover={{
                    bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))",
                  }}
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
export default SupplyEquivalentModal;

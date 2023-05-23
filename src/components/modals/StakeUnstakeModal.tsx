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
  TabList,
  Tab,
  TabPanel,
  Tabs,
  TabPanels,
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
} from "@/store/slices/dropdownsSlice";
import { useState } from "react";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import EthToUsdt from "@/assets/icons/pools/ethToUsdt";
import MySwapDisabled from "@/assets/icons/dapps/mySwapDisabled";
import UsdcToUsdt from "@/assets/icons/pools/usdcToUsdt";
import EthToUsdc from "@/assets/icons/pools/ethToUsdc";
import DaiToEth from "@/assets/icons/pools/daiToEth";
import BtcToEth from "@/assets/icons/pools/btcToEth";
import BtcToUsdt from "@/assets/icons/pools/btcToUsdt";
import AnimatedButton from "../uiElements/buttons/AnimationButton";

import { selectWalletBalance } from "@/store/slices/userAccountSlice";
import SmallErrorIcon from "@/assets/icons/smallErrorIcon";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import SupplyModal from "./SupplyModal";
const StakeUnstakeModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [sliderValue, setSliderValue] = useState(0);
  const modalDropdowns = useSelector(selectModalDropDowns);
  const [sliderValue2, setSliderValue2] = useState(0);
  const [inputStakeAmount, setInputStakeAmount] = useState(0);
  const [inputUnstakeAmount, setInputUnstakeAmount] = useState(0);

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
  const handleChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setInputStakeAmount(newValue);
      // dispatch(setInputSupplyAmount(newValue));
    } else {
      percentage = Math.round(percentage * 100) / 100;
      setSliderValue(percentage);
      setInputStakeAmount(newValue);
      // dispatch(setInputSupplyAmount(newValue));
    }
  };
  const handleUnstakeChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue2(100);
      setInputUnstakeAmount(newValue);
      // dispatch(setInputSupplyAmount(newValue));
    } else {
      percentage = Math.round(percentage * 100) / 100;
      setSliderValue2(percentage);
      setInputUnstakeAmount(newValue);
      // dispatch(setInputSupplyAmount(newValue));
    }
  };
  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setModalDropdown(dropdownName));
  };
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const rcoins = ["rBTC", "rUSDT", "rUSDC", "rETH", "rDAI"];
  const walletBalance = useSelector(selectWalletBalance);
  const [currentSelectedSupplyCoin, setCurrentSelectedSupplyCoin] =
    useState("BTC");
  const [currentSelectedStakeCoin, setCurrentSelectedStakeCoin] =
    useState("rBTC");
  const [currentSelectedUnstakeCoin, setcurrentSelectedUnstakeCoin] =
    useState("rBTC");
  const [currentSelectedWithdrawlCoin, setcurrentSelectedWithdrawlCoin] =
    useState("BTC");
  const [buttonId, setButtonId] = useState(0);
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
        onClose={onClose}
        isCentered
        //   scrollBehavior="inside"
      >
        <ModalOverlay mt="3.8rem" bg="rgba(244, 242, 255, 0.5);" />
        <ModalContent mt="8rem" bg={"#010409"} maxW="464px">
          {/* <ModalHeader>Borrow</ModalHeader> */}
          <ModalCloseButton mt="1rem" mr="1rem" color="white" />
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
                          mt="0.2rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          onClick={() =>
                            handleDropdownClick("stakeMarketDropDown")
                          }
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">{getCoin(currentSelectedStakeCoin)}</Box>
                            <Text color="white" mt="0.1rem">
                              {currentSelectedStakeCoin}
                            </Text>
                          </Box>
                          <Box pt="1" className="navbar-button">
                            <DropdownUp />
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
                              {rcoins.map((coin, index) => {
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
                          width="100%"
                          color="white"
                          border={`${
                            inputStakeAmount > walletBalance
                              ? "1px solid #CF222E"
                              : inputStakeAmount < 0
                              ? "1px solid #CF222E"
                              : inputStakeAmount > 0 &&
                                inputStakeAmount <= walletBalance
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
                            value={inputStakeAmount ? inputStakeAmount : ""}
                            outline="none"
                            step={parseFloat(
                              `${inputStakeAmount <= 99999 ? 0.1 : 0}`
                            )}
                          >
                            <NumberInputField
                              placeholder={`Minimum 0.01536 ${currentSelectedSupplyCoin}`}
                              color={`${
                                inputStakeAmount > walletBalance
                                  ? "#CF222E"
                                  : inputStakeAmount < 0
                                  ? "#CF222E"
                                  : inputStakeAmount == 0
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
                            _hover={{ bg: "#101216" }}
                            onClick={() => {
                              setInputStakeAmount(walletBalance);
                              setSliderValue(100);
                            }}
                          >
                            MAX
                          </Button>
                        </Box>
                        {inputStakeAmount > walletBalance ||
                        inputStakeAmount < 0 ? (
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
                                {inputStakeAmount > walletBalance
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
                              setInputStakeAmount(ans);
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
                                      : "5%"
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
                              <SliderFilledTrack
                                bg="white"
                                w={`${sliderValue}`}
                              />
                            </SliderTrack>
                          </Slider>
                        </Box>
                      </Card>

                      <Card
                        bg="#101216"
                        mt="1.5rem"
                        p="1rem"
                        border="1px solid #2B2F35"
                        mb="0.5rem"
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
                          <Text color="#6E7681">0.3%</Text>
                        </Text>
                      </Card>
                      <Text
                        padding="0px"
                        fontSize="12px"
                        fontWeight="400"
                        fontStyle="normal"
                        color=" #6A737D"
                        mt="1rem"
                        lineHeight="18px"
                      >
                        To stake you need to supply any asset to receive
                        rTokens. <br></br>
                        click here To
                        <Text
                          display="inline"
                          color="#0969DA"
                          cursor="pointer"
                          ml="0.4rem"
                          lineHeight="18px"
                        >
                          Add Supply
                        </Text>
                      </Text>
                      {inputStakeAmount > 0 &&
                      inputStakeAmount <= walletBalance ? (
                        buttonId == 1 ? (
                          <SuccessButton successText="Stake success" />
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
                          >
                            Stake
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
                          Stake
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
                          mt="0.2rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          onClick={() =>
                            handleDropdownClick("unstakeMarketDropDown")
                          }
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
                            <DropdownUp />
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
                              {rcoins.map((coin, index) => {
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
                          width="100%"
                          color="white"
                          border={`${
                            inputUnstakeAmount > walletBalance
                              ? "1px solid #CF222E"
                              : inputUnstakeAmount < 0
                              ? "1px solid #CF222E"
                              : inputUnstakeAmount > 0 &&
                                inputUnstakeAmount <= walletBalance
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
                            value={inputUnstakeAmount ? inputUnstakeAmount : ""}
                            outline="none"
                            step={parseFloat(
                              `${inputUnstakeAmount <= 99999 ? 0.1 : 0}`
                            )}
                          >
                            <NumberInputField
                              placeholder={`Minimum 0.01536 ${currentSelectedSupplyCoin}`}
                              color={`${
                                inputUnstakeAmount > walletBalance
                                  ? "#CF222E"
                                  : inputUnstakeAmount < 0
                                  ? "#CF222E"
                                  : inputUnstakeAmount == 0
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
                            _hover={{ bg: "#101216" }}
                            onClick={() => {
                              setInputUnstakeAmount(walletBalance);
                              setSliderValue2(100);
                            }}
                          >
                            MAX
                          </Button>
                        </Box>
                        {inputUnstakeAmount > walletBalance ||
                        inputUnstakeAmount < 0 ? (
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
                                {inputUnstakeAmount > walletBalance
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
                            value={sliderValue2}
                            onChange={(val) => {
                              setSliderValue2(val);
                              var ans = (val / 100) * walletBalance;
                              ans = Math.round(ans * 100) / 100;
                              // dispatch(setInputSupplyAmount(ans))
                              setInputUnstakeAmount(ans);
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
                                  top="7px"
                                  left={
                                    sliderValue2 !== 100
                                      ? sliderValue2 >= 10
                                        ? "15%"
                                        : "25%"
                                      : "5%"
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
                              <SliderFilledTrack
                                bg="white"
                                w={`${sliderValue2}`}
                              />
                            </SliderTrack>
                          </Slider>
                        </Box>
                      </Card>

                      <Card
                        bg="#101216"
                        mt="1.5rem"
                        p="1rem"
                        border="1px solid #2B2F35"
                        mb="0.5rem"
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
                          <Text color="#6E7681">0.3%</Text>
                        </Text>
                      </Card>
                      <Text
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
                        <Text>You have not staked any rTokens to unstake</Text>
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
                          />
                        </Text>
                      </Text>
                      {inputUnstakeAmount > 0 &&
                      inputUnstakeAmount <= walletBalance ? (
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
                        >
                          Unstake
                        </AnimatedButton>
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

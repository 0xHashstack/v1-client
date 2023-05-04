import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Tooltip,
  InputGroup,
  Input,
  InputRightElement,
  Box,
  Text,
  Heading,
  TabList,
  Tab,
  TabPanel,
  Tabs,
  TabPanels,
  RadioGroup,
  Radio,
  Stack,
  NumberInput,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  NumberInputField,
} from "@chakra-ui/react";

/* Coins logo import  */
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";

import DropdownUp from "../../assets/icons/dropdownUpIcon";
import InfoIcon from "../../assets/icons/infoIcon";
import SliderWithInput from "../uiElements/sliders/sliderWithInput";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNavDropdowns,
  setNavDropdown,
} from "@/store/slices/dropdownsSlice";
import { useState } from "react";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import EthToUsdt from "@/assets/icons/pools/ethToUsdt";
import SmallEth from "@/assets/icons/coins/smallEth";
import SmallUsdt from "@/assets/icons/coins/smallUsdt";
import MySwap from "@/assets/icons/dapps/mySwap";
import MySwapDisabled from "@/assets/icons/dapps/mySwapDisabled";
import UsdcToUsdt from "@/assets/icons/pools/usdcToUsdt";
import EthToUsdc from "@/assets/icons/pools/ethToUsdc";
import DaiToEth from "@/assets/icons/pools/daiToEth";
import BtcToEth from "@/assets/icons/pools/btcToEth";
import BtcToUsdt from "@/assets/icons/pools/btcToUsdt";

import {
  selectInputSupplyAmount,
  selectCoinSelectedSupplyModal,
  setCoinSelectedSupplyModal,
  selectWalletBalance,
  setInputSupplyAmount,
  setInputBorrowModalCollateralAmount,
  setInputBorrowModalBorrowAmount,
  setInputYourBorrowModalRepayAmount,
} from "@/store/slices/userAccountSlice";

import SliderTooltip from "../uiElements/sliders/sliderTooltip";

const YourBorrowModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const dispatch = useDispatch();
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

  const getContainer = (action: string) => {
    switch (action) {
      case "Spend Borrow":
        return (
          <Box
            p="2"
            borderRadius="md"
            border="1px"
            borderColor="#2B2F35"
            bg="#101216"
            my="6"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
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
              <Text color="#8B949E" fontSize="xs">
                $ 10.91
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  Liquidity spill:{" "}
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
              <Box display="flex" color="#8B949E" fontSize="xs" gap="2">
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
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
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
              <Text color="#8B949E" fontSize="xs">
                0.1%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
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
              <Text color="#8B949E" fontSize="xs">
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
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
              <Text color="#8B949E" fontSize="xs">
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
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
              <Text color="#8B949E" fontSize="xs">
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
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
              <Text color="#8B949E" fontSize="xs">
                1.10
              </Text>
            </Box>
          </Box>
        );
        break;

      case "Repay Borrow":
        return (
          <Box
            p="2"
            borderRadius="md"
            border="1px"
            borderColor="#2B2F35"
            bg="#101216"
            my="6"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  Borrowed market:{" "}
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
              <Text color="#8B949E" fontSize="xs">
                1 BTC
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  rTokens unlocked:{" "}
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
              <Text color="#8B949E" fontSize="xs">
                1.23
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  Est collateral value:{" "}
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
              <Text color="#8B949E" fontSize="xs">
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
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
                  <Box className="p-1">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text color="#8B949E" fontSize="xs">
                0.1%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
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
              <Text color="#8B949E" fontSize="xs">
                5.56%
              </Text>
            </Box>
          </Box>
        );
        break;

      case "Zero Repay":
        return (
          <Box
            p="2"
            borderRadius="md"
            border="1px"
            borderColor="#2B2F35"
            bg="#101216"
            my="6"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  Dapp:{" "}
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
              <Box display="flex" color="#8B949E" fontSize="xs" gap="2">
                <Box display="flex" gap="2px">
                  <Box>
                    <JediswapLogo />
                  </Box>
                  <Text>Jediswap</Text>
                </Box>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  Borrow amount:{" "}
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
              <Text color="#8B949E" fontSize="xs">
                1 BTC
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  rTokens unlocked:{" "}
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
              <Text color="#8B949E" fontSize="xs">
                1.23
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
                  Est collateral value:{" "}
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
              <Text color="#8B949E" fontSize="xs">
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
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
                  <Box className="p-1">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text color="#8B949E" fontSize="xs">
                0.1%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#8B949E" fontSize="xs">
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
              <Text color="#8B949E" fontSize="xs">
                5.56%
              </Text>
            </Box>
          </Box>
        );
        break;

      default:
        break;
    }
  };

  const handleDropdownClick = (dropdownName: string) => {
    dispatch(setNavDropdown(dropdownName));
  };
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const actions = [
    "Spend Borrow",
    "Repay Borrow",
    "Zero Repay",
    "Add Collateral",
  ];
  const borrowIds = [
    "ID - 123456",
    "ID - 123457",
    "ID - 123458",
    "ID - 123459",
    "ID - 1234510",
  ];

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

  const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] = useState("BTC");
  const [currentAction, setCurrentAction] = useState("Zero Repay");
  const [currentBorrowId, setCurrentBorrowId] = useState("ID - 123456");
  const [currentDapp, setCurrentDapp] = useState("Jediswap");
  const [currentPool, setCurrentPool] = useState("ETH/USDT");

  const [sliderValue, setSliderValue] = useState(0);
  const dispatch = useDispatch();
  const walletBalance = useSelector(selectWalletBalance);
  const [inputAmount, setinputAmount] = useState(0);
  const [inputRepayAmount, setinputRepayAmount] = useState(0);

  const handleChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setinputRepayAmount(newValue);
      dispatch(setInputYourBorrowModalRepayAmount(newValue));
    } else {
      percentage = Math.round(percentage * 100) / 100;
      setSliderValue(percentage);
      setinputRepayAmount(newValue);
      dispatch(setInputYourBorrowModalRepayAmount(newValue));
      // dispatch((newValue));
    }
  };

  return (
    <Box>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
        // size="sm"
      >
        <ModalOverlay mt="3.8rem" bg="rgba(244, 242, 255, 0.5);" />
        <ModalContent mt="5rem" bg={"#010409"} maxW="442px">
          {/* <ModalHeader>Borrow</ModalHeader> */}
          <ModalCloseButton top={"8"} right={"6"} color={"white"} size={"sm"} />
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
                      Borrow Actions
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
                      Add Collateral
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p="0">
                      <Box
                        display="flex"
                        flexDirection="column"
                        backgroundColor="#101216"
                        border="1px"
                        borderColor="#2B2F35"
                        p="5"
                        // my="4"
                        borderRadius="md"
                        gap="3"
                        mt="1.5rem"
                      >
                        <Box display="flex" flexDirection="column" gap="1">
                          <Box display="flex">
                            <Text fontSize="xs" color="#8B949E">
                              Action
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
                              handleDropdownClick(
                                "yourBorrowModalActionDropdown"
                              )
                            }
                            as="button"
                          >
                            <Text display="flex" gap="1">
                              {currentAction}
                            </Text>
                            <Box pt="1" className="navbar-button">
                              <DropdownUp />
                            </Box>
                            {navDropdowns.yourBorrowModalActionDropdown && (
                              <Box
                                w="full"
                                left="0"
                                bg="#03060B"
                                py="2"
                                className="dropdown-container"
                                boxShadow="dark-lg"
                              >
                                {actions.map((action, index) => {
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
                                        setCurrentAction(action);
                                      }}
                                    >
                                      {action === currentAction && (
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
                                          action === currentAction ? "2" : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          action === currentAction
                                            ? "#0C6AD9"
                                            : "inherit"
                                        }`}
                                        borderRadius="md"
                                      >
                                        {/* <Box p="1">{getCoin(action)}</Box> */}
                                        <Text>{action}</Text>
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
                              Borrow ID
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
                              handleDropdownClick("yourBorrowBorrowIDsDropdown")
                            }
                            as="button"
                          >
                            <Box display="flex" gap="1">
                              {currentBorrowId}
                            </Box>
                            <Text pt="1" className="navbar-button">
                              <DropdownUp />
                            </Text>
                            {navDropdowns.yourBorrowBorrowIDsDropdown && (
                              <Box
                                w="full"
                                left="0"
                                bg="#03060B"
                                py="2"
                                className="dropdown-container"
                                boxShadow="dark-lg"
                              >
                                {borrowIds.map((coin, index) => {
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
                                        setCurrentBorrowId(coin);
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
                                          coin === currentBorrowId ? "2" : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          coin === currentBorrowId
                                            ? "#0C6AD9"
                                            : "inherit"
                                        }`}
                                        borderRadius="md"
                                      >
                                        {/* <Box p="1">{getCoin(coin)}</Box> */}
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
                            pl="3"
                            pr="3"
                            borderRadius="md"
                            className="navbar"
                            onClick={() =>
                              handleDropdownClick(
                                "yourBorrowModalBorrowMarketDropdown"
                              )
                            }
                            as="button"
                          >
                            <Box display="flex" gap="1">
                              <Box p="1">
                                {getCoin(currentBorrowMarketCoin)}
                              </Box>
                              <Text>{currentBorrowMarketCoin}</Text>
                            </Box>
                            <Box pt="1" className="navbar-button">
                              <DropdownUp />
                            </Box>
                            {navDropdowns.yourBorrowModalBorrowMarketDropdown && (
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
                                        setCurrentBorrowMarketCoin(coin);
                                      }}
                                    >
                                      {coin === currentBorrowMarketCoin && (
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
                                          coin === currentBorrowMarketCoin
                                            ? "1"
                                            : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          coin === currentBorrowMarketCoin
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
                          <Text textAlign="right" fontSize="xs">
                            Borrow Balance: 0.00{" "}
                            <Text as="span" color="#8B949E">
                              {currentBorrowMarketCoin}
                            </Text>
                          </Text>
                        </Box>
                        {currentAction !== "Spend Borrow" && (
                          <Box display="flex" flexDirection="column" gap="1">
                            <Box display="flex">
                              <Text fontSize="xs" color="#8B949E">
                                Repay Amount
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
                                value={inputRepayAmount}
                              >
                                <NumberInputField
                                  placeholder={`Minimum 0.01536 ${currentBorrowMarketCoin}`}
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
                                  setinputRepayAmount(walletBalance);
                                  setSliderValue(100);
                                  dispatch(
                                    setInputYourBorrowModalRepayAmount(
                                      walletBalance
                                    )
                                  );
                                }}
                              >
                                MAX
                              </Button>
                            </Box>
                            <Text
                              textAlign="right"
                              fontSize="xs"
                              fontWeight="thin"
                            >
                              Wallet Balance: 0.00{" "}
                              <Text as="span" color="#8B949E">
                                BTC
                              </Text>
                            </Text>
                            <Slider
                              mt="12"
                              mb="2"
                              aria-label="slider-ex-6"
                              defaultValue={sliderValue}
                              value={sliderValue}
                              onChange={(val) => {
                                setSliderValue(val);
                                var ans = (val / 100) * walletBalance;
                                ans = Math.round(ans * 100) / 100;
                                dispatch(
                                  setInputYourBorrowModalRepayAmount(ans)
                                );
                                setinputRepayAmount(ans);
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
                                <SliderFilledTrack
                                  bg="white"
                                  w={`${sliderValue}`}
                                />
                              </SliderTrack>
                            </Slider>
                          </Box>
                        )}
                      </Box>
                      {currentAction === "Spend Borrow" && (
                        <Box display="flex" flexDir="column" p="3" gap="1">
                          <Box display="flex">
                            <Text fontSize="xs" color="#8B949E">
                              Purpose
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
                          <Box>
                            <RadioGroup defaultValue="1">
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
                      )}
                      {currentAction === "Spend Borrow" && (
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
                                Select Dapp
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
                              {navDropdowns.yourBorrowDappDropdown && (
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
                                            dapp.name === currentDapp
                                              ? "1"
                                              : "5"
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
                                <Box p="1">{getCoin(currentPool)}</Box>
                                <Text>{currentPool}</Text>
                              </Box>
                              <Box pt="1" className="navbar-button">
                                <DropdownUp />
                              </Box>
                              {navDropdowns.yourBorrowPoolDropdown && (
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
                                          px={`${
                                            pool === currentPool ? "1" : "5"
                                          }`}
                                          gap="1"
                                          bg={`${
                                            pool === currentPool
                                              ? "#0C6AD9"
                                              : "inherit"
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
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )}
                      {getContainer(currentAction)}

                      {inputRepayAmount > 0 ? (
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
                    </TabPanel>
                    <TabPanel>
                      <p>two!</p>
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

export default YourBorrowModal;

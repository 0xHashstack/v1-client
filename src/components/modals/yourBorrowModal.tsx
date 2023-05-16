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
  TabList,
  Tab,
  TabPanel,
  Tabs,
  TabPanels,
  RadioGroup,
  Radio,
  NumberInput,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  NumberInputField,
  Stack,
  Card,
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
  setModalDropdown,
  selectNavDropdowns,
  selectModalDropDowns,
} from "@/store/slices/dropdownsSlice";
import { useState } from "react";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import EthToUsdt from "@/assets/icons/pools/ethToUsdt";
import SmallEth from "@/assets/icons/coins/smallEth";
import SmallUsdt from "@/assets/icons/coins/smallUsdt";
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
import SmallErrorIcon from "@/assets/icons/smallErrorIcon";

const YourBorrowModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const dispatch = useDispatch();
  const dispatch = useDispatch();
  const [sliderValue1, setSliderValue1] = useState(0);
  const modalDropdowns = useSelector(selectModalDropDowns);
  const [inputAmount1, setinputAmount1] = useState(0);

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
            bg="#101216"
            borderRadius="6px"
            p="1rem"
            border="1px solid #2B2F35"
            mt="1.5rem"
            mb="1.5rem"
          >
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
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
                  <Box ml="0.1rem" mt="0.3rem">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text
                color="#6A737D"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                $ 10.91
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
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
                  <Box ml="0.1rem" mt="0.3rem">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Box
                display="flex"
                gap="2"
                color="#6A737D"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
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
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
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
                  <Box ml="0.1rem" mt="0.3rem">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text
                color="#6A737D"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                0.1%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
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
                  <Box ml="0.1rem" mt="0.3rem">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text
                color="#6A737D"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
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
                  <Box ml="0.1rem" mt="0.3rem">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text
                color="#6A737D"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
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
                  <Box ml="0.1rem" mt="0.3rem">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text
                color="#6A737D"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#6A737D"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
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
                  <Box ml="0.1rem" mt="0.3rem">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text
                color="#6A737D"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                1.10
              </Text>
            </Box>
          </Box>
        );
        break;

      case "Repay Borrow":
        return (
          <Box
            p="1rem"
            borderRadius="md"
            border="1px"
            borderColor="#2B2F35"
            bg="#101216"
            my="6"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#8B949E"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
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
              <Text
                color="#8B949E"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                1 BTC
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#8B949E"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
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
              <Text
                color="#8B949E"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                1.23
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#8B949E"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
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
              <Text
                color="#8B949E"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                5.56%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#8B949E"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
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
                  <Box padding="0.25rem">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text
                color="#8B949E"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                0.1%
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#8B949E"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
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
                  <Box padding="0.25rem">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text
                color="#8B949E"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                5.56%
              </Text>
            </Box>
          </Box>
        );
        break;

      case "Zero Repay":
        return (
          <Box
            p="1rem"
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
                  <Box padding="0.25rem">
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
                  <Box padding="0.25rem">
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

  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setModalDropdown(dropdownName));
  };
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const actions = ["Spend Borrow", "Repay Borrow", "Zero Repay"];
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

  const [radioValue, setRadioValue] = useState("1");

  const [currentBorrowMarketCoin1, setCurrentBorrowMarketCoin1] =
    useState("BTC");
  const [currentBorrowMarketCoin2, setCurrentBorrowMarketCoin2] =
    useState("BTC");
  const [currentPoolCoin, setCurrentPoolCoin] = useState("ETH");
  const [currentAction, setCurrentAction] = useState("Spend Borrow");
  const [currentBorrowId1, setCurrentBorrowId1] = useState("ID - 123456");
  const [currentBorrowId2, setCurrentBorrowId2] = useState("ID - 123456");
  const [currentDapp, setCurrentDapp] = useState("Jediswap");
  const [currentPool, setCurrentPool] = useState("ETH/USDT");

  const [sliderValue, setSliderValue] = useState(0);
  // const dispatch = useDispatch();
  const walletBalance = useSelector(selectWalletBalance);
  const [inputAmount, setinputAmount] = useState(0);
  const [inputCollateralAmount, setinputCollateralAmount] = useState(0);
  const [sliderValue2, setSliderValue2] = useState(0);
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

  const handleCollateralChange = (newValue: any) => {
    var percentage = (newValue * 100) / walletBalance;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue2(100);
      setinputCollateralAmount(newValue);
      // dispatch(setInputYourBorrowModalRepayAmount(newValue));
    } else {
      percentage = Math.round(percentage * 100) / 100;
      setSliderValue2(percentage);
      setinputCollateralAmount(newValue);
      // dispatch(setInputYourBorrowModalRepayAmount(newValue));
      // dispatch((newValue));
    }
  };

  // const walletBalance = useSelector(selectWalletBalance);
  const [currentSelectedCoin, setCurrentSelectedCoin] = useState("BTC");
  return (
    <Box>
      <Button
        key="suppy"
        backgroundColor="#101216"
        height={"2rem"}
        padding="0rem 1rem"
        border="1px solid #2b2f35"
        fontSize={"12px"}
        color="#6e6e6e"
        _hover={{ bgColor: "#2DA44E", color: "#E6EDF3" }}
        borderRadius={"6px"}
        onClick={onOpen}
      >
        Actions
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
        // size="sm"
      >
        <ModalOverlay mt="3.8rem" bg="rgba(244, 242, 255, 0.5);" />
        <ModalContent mt="8rem" bg={"#010409"} maxW="464px">
          {/* <ModalHeader>Borrow</ModalHeader> */}
          <ModalCloseButton color="white" mt="1rem" mr="1rem"/>
          <ModalBody color={"#E6EDF3"} pt={6} px={7}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              fontSize={"sm"}
              // my={"2"}
            >
              <Box w="full">
                <Tabs variant="unstyled">
                  <TabList borderRadius="md" >
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
                    <TabPanel p="0" m="0">
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
                            {modalDropdowns.yourBorrowModalActionDropdown && (
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
                                        if (action === "Zero Repay") {
                                          setinputRepayAmount(0);
                                          setSliderValue(0);
                                        }
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
                            <Text
                              fontSize="12px"
                              fontWeight="400"
                              fontStyle="normal"
                              color="#8B949E"
                            >
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
                              handleDropdownClick(
                                "yourBorrowBorrowIDsDropdown1"
                              )
                            }
                            as="button"
                          >
                            <Box display="flex" gap="1">
                              {currentBorrowId1}
                            </Box>
                            <Text pt="1" className="navbar-button">
                              <DropdownUp />
                            </Text>
                            {modalDropdowns.yourBorrowBorrowIDsDropdown1 && (
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
                                        setCurrentBorrowId1(coin);
                                      }}
                                    >
                                      {coin === currentBorrowId1 && (
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
                                          coin === currentBorrowId1 ? "2" : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          coin === currentBorrowId1
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
                            <Text
                              fontSize="12px"
                              fontWeight="400"
                              fontStyle="normal"
                              color="#8B949E"
                            >
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
                                "yourBorrowModalBorrowMarketDropdown1"
                              )
                            }
                            as="button"
                          >
                            <Box display="flex" gap="1">
                              <Box p="1">
                                {getCoin(currentBorrowMarketCoin1)}
                              </Box>
                              <Text mt="0.15rem">{currentBorrowMarketCoin1}</Text>
                            </Box>
                            <Box pt="1" className="navbar-button">
                              <DropdownUp />
                            </Box>
                            {modalDropdowns.yourBorrowModalBorrowMarketDropdown1 && (
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
                                        setCurrentBorrowMarketCoin1(coin);
                                      }}
                                    >
                                      {coin === currentBorrowMarketCoin1 && (
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
                                          coin === currentBorrowMarketCoin1
                                            ? "1"
                                            : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          coin === currentBorrowMarketCoin1
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
                              {currentBorrowMarketCoin1}
                            </Text>
                          </Text>
                        </Box>
                        {currentAction !== "Spend Borrow" && (
                          <Box display="flex" flexDirection="column" gap="1" mt="0">
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
                                isDisabled={currentAction === "Zero Repay"}
                              >
                                <NumberInputField
                                  placeholder={`Minimum 0.01536 ${currentBorrowMarketCoin1}`}
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
                                  if (currentAction === "Zero Repay") return;
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
                                if (currentAction === "Zero Repay") return;
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
                                  <SliderTooltip
                                    color={`${
                                      currentAction === "Zero Repay"
                                        ? "#6E7681"
                                        : "#DEDEDE"
                                    }`}
                                  />
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
                                  bg={`${
                                    currentAction === "Zero Repay"
                                      ? "#6E7681"
                                      : "white"
                                  }`}
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
                            <RadioGroup
                              onChange={setRadioValue}
                              value={radioValue}
                            >
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
                                <Box p="1">
                                  {getCoin(
                                    radioValue === "1"
                                      ? currentPool
                                      : currentPoolCoin
                                  )}
                                </Box>
                                <Text>
                                  {radioValue === "1"
                                    ? currentPool
                                    : currentPoolCoin}
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
                                        key={index}
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
                                          px={`${
                                            coin === currentPoolCoin ? "1" : "5"
                                          }`}
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
                      )}
                      {getContainer(currentAction)}

                      {inputRepayAmount > 0 ? (
                        <Button
                        bg="#101216"
                        color="#8B949E"
                        size="sm"
                        width="100%"
                        mb="1.5rem"
                        border="1px solid #8B949E"
                        _hover={{ bg: "#10216" }}
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
                    <TabPanel m="0" p="0">
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
                            <Text
                              fontSize="12px"
                              fontWeight="400"
                              fontStyle="normal"
                              color="#8B949E"
                            >
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
                              handleDropdownClick(
                                "yourBorrowBorrowIDsDropdown2"
                              )
                            }
                            as="button"
                          >
                            <Box display="flex" gap="1">
                              {currentBorrowId2}
                            </Box>
                            <Text pt="1" className="navbar-button">
                              <DropdownUp />
                            </Text>
                            {modalDropdowns.yourBorrowBorrowIDsDropdown2 && (
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
                                        setCurrentBorrowId2(coin);
                                      }}
                                    >
                                      {coin === currentBorrowId2 && (
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
                                          coin === currentBorrowId2 ? "2" : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          coin === currentBorrowId2
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
                            <Text
                              fontSize="12px"
                              fontWeight="400"
                              fontStyle="normal"
                              color="#8B949E"
                            >
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
                                    mt="0.3rem"
                                    borderRadius="md"
                                    className="navbar"
                                    cursor="pointer"
                                    onClick={() =>
                                        handleDropdownClick("yourBorrowModalBorrowMarketDropdown2")
                                    }
                                >
                                    <Box display="flex" gap="1">
                                        <Box p="1">{getCoin(currentBorrowMarketCoin2)}</Box>
                                        <Text color="white" mt="0.12rem">{currentBorrowMarketCoin2}</Text>
                                    </Box>
                                    
                                    <Box pt="1" className="navbar-button">
                                        <DropdownUp />
                                    </Box>
                                    {modalDropdowns.yourBorrowModalBorrowMarketDropdown2 && (
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
                                                          setCurrentBorrowMarketCoin2(coin);
                                                            // dispatch(setCoinSelectedSupplyModal(coin))
                                                        }}
                                                    >
                                                        {coin === currentBorrowMarketCoin2 && (
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
                                                            px={`${coin === currentBorrowMarketCoin2 ? "1" : "5"
                                                                }`}
                                                            gap="1"
                                                            bg={`${coin === currentBorrowMarketCoin2
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
                            Collateral Balance
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="Hashstack self liquidates your collateral
                            & debt positions to repay the borrow.
                            The balance will be updated into rTokens"
                            bg="#24292F"
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            pt="16px"
                            pl="16px"
                            fontSize="11px"
                            fontWeight="400"
                            fontStyle="normal"
                            lineHeight="16px"
                            color="#E6EDF3"
                            letterSpacing="-0.15px"
                            borderRadius="6px"
                            backgroundColor="#101216"
                            border="1px solid #2B2F35"
                            flex="none"
                            order="0"
                            flexGrow="0"
                            zIndex="0"
                            width="240px"
                            height="80px"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Text>
                        <Box
                          w="full"
                          backgroundColor="#101216"
                          py="2"
                          border="1px solid #2B2F35"
                          borderRadius="6px"
                          mt="-0.5rem"
                        >
                          <Text ml="1rem" color="white">
                            1234 rBTC
                          </Text>
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
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Text>
                        <Box
                          width="100%"
                          color="white"
                          border={`${inputCollateralAmount > walletBalance ? "1px solid #CF222E" :inputCollateralAmount>0 && inputAmount<=walletBalance?"1px solid #1A7F37":"1px solid #2B2F35 "}`}
                          borderRadius="6px"
                          display="flex"
                          justifyContent="space-between"
                          mt="-0.5rem"
                        >
                          <NumberInput
                            border="0px"
                            min={0}
                            color={`${inputCollateralAmount>walletBalance?"#CF222E":inputCollateralAmount==0?"white": "#1A7F37"}`}
                            keepWithinRange={true}
                            onChange={handleCollateralChange}
                            value={inputCollateralAmount?inputCollateralAmount:""}
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
                              setinputCollateralAmount(walletBalance);
                              setSliderValue2(100);
                            }}
                          >
                            MAX
                          </Button>
                        </Box>
                        {inputCollateralAmount > walletBalance ? <Text display="flex" justifyContent="space-between" color="#E6EDF3"  fontSize="12px" fontWeight="500" fontStyle="normal" fontFamily="Inter">

<Text color="#CF222E" display="flex">
  <Text mt="0.2rem"><SmallErrorIcon /> </Text><Text ml="0.3rem">Invalid Input</Text></Text>
<Text color="#E6EDF3" display="flex" justifyContent="flex-end" >
  Wallet Balance: {walletBalance}
  <Text color="#6E7781" ml="0.2rem">
    {` ${currentSelectedCoin}`}
  </Text>
</Text>

</Text> : <Text color="#E6EDF3" display="flex" justifyContent="flex-end" fontSize="12px" fontWeight="500" fontStyle="normal" fontFamily="Inter">
Wallet Balance: {walletBalance}
<Text color="#6E7781" ml="0.2rem">
  {` ${currentSelectedCoin}`}
</Text>
</Text>

}
                        <Box pt={5} pb={2} mt="0.2rem">
                          <Slider
                            aria-label="slider-ex-6"
                            defaultValue={sliderValue2}
                            value={sliderValue2}
                            onChange={(val) => {
                              setSliderValue2(val);
                              var ans = (val / 100) * walletBalance;
                              ans = Math.round(ans * 100) / 100;
                              // dispatch(setInputSupplyAmount(ans))
                              setinputCollateralAmount(ans);
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
                                  top="5px"
                                  left={
                                    sliderValue2 !== 100
                                      ? sliderValue2 >= 10
                                        ? "15%"
                                        : "25%"
                                      : "10%"
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
                      </Box>
                      <Card
                        bg="#101216"
                        mt="2rem"
                        p="1rem"
                        border="1px solid #2B2F35"
                      >
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
                              Borrow amount:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="bottom"
                              boxShadow="dark-lg"
                              label=" Actual debt:               12345&#10;accured intrest:        12345"
                              bg="#24292F"
                              fontSize="12px"
                              fontWeight="500"
                              fontStyle="normal"
                              borderRadius="6px"
                              background="#101216"
                              border="1px solid #2B2F35"
                              pt="12px"
                              pl="10px"
                              gap="80px"
                              display="flex"
                              flexDirection="column"
                              justifyContent="space-between"
                              width="197px"
                              height="72px"
                              whiteSpace="pre-wrap"
                              color="#E6EDF3"
                              textAlign="center"
                              lineHeight="2"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#6E7681">1 BTC</Text>
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
                              font-size="12px"
                              lineHeight="16px"
                              color="#6A737D"
                            >
                              est rTokens minted:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Adding <amount> as collateral will mint
                            <number> r<market_symbol> tokens.
                            These tokens will accrue supply apr
                            and remain locked till the debt is repaid"
                              bg="#24292F"
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              pt="16px"
                              pl="16px"
                              fontSize="11px"
                              fontWeight="400"
                              fontStyle="normal"
                              lineHeight="16px"
                              color="#E6EDF3"
                              letterSpacing="-0.15px"
                              borderRadius="6px"
                              backgroundColor="#101216"
                              border="1px solid #2B2F35"
                              flex="none"
                              order="0"
                              flexGrow="0"
                              zIndex="0"
                              width="225px"
                              height="96px"
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
                          <Text color="#6E7681">0.1%</Text>
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
                          <Text color="#6E7681">5.56%</Text>
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
                              font-size="12px"
                              lineHeight="16px"
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
                          <Text color="#6E7681">5.56%</Text>
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
                              font-size="12px"
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
                          <Text color="#6E7681">5.56%</Text>
                        </Text>
                        <Text
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
                              lineHeight="16px"
                              color="#6A737D"
                            >
                              Health factor
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
                          <Text color="#6E7681">1.10</Text>
                        </Text>
                      </Card>
                      {inputCollateralAmount > 0 &&inputCollateralAmount<=walletBalance ? (
                        <Button
                        bg="#101216"
                        color="#8B949E"
                        size="sm"
                        width="100%"
                        mt="1.5rem"
                        mb="1.5rem"
                        border="1px solid #8B949E"
                        _hover={{ bg: "#10216" }}
                        >
                          Add Collateral
                        </Button>
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
                          Add Collateral
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

export default YourBorrowModal;

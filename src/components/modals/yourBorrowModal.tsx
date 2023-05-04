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

const YourBorrowModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
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
  const [currentAction, setCurrentAction] = useState("Spend Borrow");
  const [currentBorrowId, setCurrentBorrowId] = useState("ID - 123456");
  const [currentDapp, setCurrentDapp] = useState("Jediswap");
  const [currentPool, setCurrentPool] = useState("ETH/USDT");
  return (
    <Box>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="outside"
        size="sm"
      >
        <ModalOverlay mt="20" bg="rgba(244, 242, 255, 0.5);" />
        <ModalContent mt="32" bg={"#010409"}>
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
                    <TabPanel px="0" pb="0">
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
                        {false && (
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
                            <InputGroup>
                              <Input
                                min="0"
                                type="number"
                                textColor="white"
                                focusBorderColor="#2B2F35"
                                placeholder="Minimum 0.01536 BTC"
                                _hover={{
                                  outline: "none",
                                }}
                                _focus={{
                                  boxShadow: "none",
                                  outline: "0",
                                }}
                                _placeholder={{
                                  color: "#393D4F",
                                  fontSize: ".89rem",
                                  fontWeight: "600",
                                  outline: "0",
                                }}
                                borderColor={"#2B2F35"}
                                pl={"4"}
                                pb={"1"}
                              />
                              <InputRightElement
                                pr={"6"}
                                pb={"1"}
                                fontSize={"sm"}
                              >
                                <Box as="button" color="#0969DA">
                                  MAX
                                </Box>
                              </InputRightElement>
                            </InputGroup>
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
                          </Box>
                        )}
                        {false && (
                          <Box>
                            <SliderWithInput />
                          </Box>
                        )}
                      </Box>
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
                      <Box className="p-2 bg-[#101216] rounded-md border border-[#2B2F35] my-6">
                        <Box className="flex justify-between">
                          <Box className="flex">
                            <Text className="text-xs text-[#8B949E]">
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
                              <Box className="p-1">
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                          <Text className="text-xs text-[#8B949E]">
                            $ 10.91
                          </Text>
                        </Box>
                        <Box className="flex justify-between">
                          <Box className="flex">
                            <Text className="text-xs text-[#8B949E]">
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
                              <Box className="p-1">
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Box>
                          <Box
                            display="flex"
                            className="text-xs text-[#8B949E]"
                            gap="2"
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
                        <Box className="flex justify-between">
                          <Box className="flex">
                            <Text className="text-xs text-[#8B949E]">
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
                          <Text className="text-xs text-[#8B949E]">0.1%</Text>
                        </Box>
                        <Box className="flex justify-between">
                          <Box className="flex">
                            <Text className="text-xs text-[#8B949E]">
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
                          <Text className="text-xs text-[#8B949E]">5.56%</Text>
                        </Box>
                        <Box className="flex justify-between">
                          <Box className="flex">
                            <Text className="text-xs text-[#8B949E]">
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
                          <Text className="text-xs text-[#8B949E]">5.56%</Text>
                        </Box>
                        <Box className="flex justify-between">
                          <Box className="flex">
                            <Text className="text-xs text-[#8B949E]">
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
                          <Text className="text-xs text-[#8B949E]">5.56%</Text>
                        </Box>
                        <Box className="flex justify-between">
                          <Box className="flex">
                            <Text className="text-xs text-[#8B949E]">
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
                          <Text className="text-xs text-[#8B949E]">1.10</Text>
                        </Box>
                      </Box>

                      <Box
                        as="button"
                        className="w-full bg-[#101216] hover:bg-[#2EA043] text-[#6E7681] hover:text-[white] rounded-md border border-[#2B2F35] py-1 mb-6"
                      >
                        Borrow
                      </Box>
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

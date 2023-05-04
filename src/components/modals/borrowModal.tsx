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

const BorrowModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //   console.log("isopen", isOpen, "onopen", onOpen, "onClose", onClose);

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
      default:
        break;
    }
  };

  const handleDropdownClick = (dropdownName: string) => {
    dispatch(setNavDropdown(dropdownName));
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
        scrollBehavior="outside"
        size={"sm"}
      >
        <ModalOverlay mt="20" />
        <ModalContent mt="80" mb="10" bg={"#010409"}>
          {/* <ModalHeader>Borrow</ModalHeader> */}
          <ModalCloseButton
            top={"10"}
            right={"6"}
            color={"white"}
            size={"sm"}
          />
          <ModalBody color={"#E6EDF3"} pt={8} px={6}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              fontSize={"sm"}
              my={"2"}
            >
              <Heading fontSize="md" fontWeight="medium">
                Borrow
              </Heading>
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
              p="3"
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
                  borderRadius="md"
                  className="navbar"
                  onClick={() =>
                    handleDropdownClick("borrowModalCollateralMarketDropdown")
                  }
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
                  <InputRightElement pr={"6"} pb={"1"} fontSize={"sm"}>
                    <Box as="button" color="#0969DA">
                      MAX
                    </Box>
                  </InputRightElement>
                </InputGroup>
                <Text textAlign="right" fontSize="xs" fontWeight="thin">
                  Wallet Balance: 0.00{" "}
                  <Text as="span" color="#8B949E">
                    BTC
                  </Text>
                </Text>
              </Box>
              <Box>
                <SliderWithInput />
              </Box>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              backgroundColor="#101216"
              border="1px"
              borderColor="#2B2F35"
              p="3"
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
                  onClick={() =>
                    handleDropdownClick("borrowModalBorrowMarketDropdown")
                  }
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
                <InputGroup>
                  <Input
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
                    pl={"3"}
                    pb={"1"}
                  />
                  <InputRightElement pr={"6"} pb={"1"} fontSize={"sm"}>
                    <Box as="button" color="#0969DA">
                      MAX
                    </Box>
                  </InputRightElement>
                </InputGroup>
              </Box>
              <Box>
                <SliderWithInput />
              </Box>
            </Box>

            <Box className="p-2 bg-[#101216] rounded-md border border-[#2B2F35] my-6">
              <Box className="flex justify-between">
                <Box className="flex">
                  <Text className="text-xs text-[#8B949E]">Gas estimate: </Text>
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
                <Text className="text-xs text-[#8B949E] font-bold">
                  $ 10.91
                </Text>
              </Box>
              <Box className="flex justify-between">
                <Box className="flex">
                  <Text className="text-xs text-[#8B949E]">Borrow apr: </Text>
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
                <Text className="text-xs text-[#8B949E] font-bold">5.56%</Text>
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
                <Text className="text-xs text-[#8B949E] font-bold">5.56%</Text>
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
                <Text className="text-xs text-[#8B949E] font-bold">5.56%</Text>
              </Box>
            </Box>

            <button className="w-full bg-[#101216] hover:bg-[#2EA043] text-[#6E7681] hover:text-[white] rounded-md border border-[#2B2F35] py-1 mb-6">
              Borrow
            </button>
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

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
import BitcoinLogo from "../../assets/icons/coins/bitcoin";
import DropdownUp from "../../assets/icons/dropdownUpIcon";
import InfoIcon from "../../assets/icons/infoIcon";
import SliderWithInput from "../uiElements/sliders/sliderWithInput";
const BorrowModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //   console.log("isopen", isOpen, "onopen", onOpen, "onClose", onClose);

  return (
    <Box>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="outside"
        size={"sm"}
      >
        <ModalOverlay />
        <ModalContent bg={"#010409"}>
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
                  pl="2"
                  pr="3"
                  borderRadius="md"
                >
                  <Box display="flex" gap="1">
                    <Box p="1">
                      <BitcoinLogo />
                    </Box>
                    <Text>BTC</Text>
                  </Box>
                  <Box pt="1">
                    <DropdownUp />
                  </Box>
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
                    type="number"
                    textColor="white"
                    focusBorderColor="#2B2F35"
                    placeholder="Minimum 0.01536 BTC"
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
                  pl="2"
                  pr="3"
                  borderRadius="md"
                >
                  <Box display="flex" gap="1">
                    <Box p="1">
                      <BitcoinLogo />
                    </Box>
                    <Text>BTC</Text>
                  </Box>
                  <Box pt="1">
                    <DropdownUp />
                  </Box>
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
                    textColor={"#343848"}
                    placeholder="Minimum 0.01536 BTC"
                    _placeholder={{
                      color: "#393D4F",
                      fontSize: ".89rem",
                      fontWeight: "600",
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
              <Text textAlign="right" fontSize="xs" fontWeight="thin">
                Wallet Balance: 0.00{" "}
                <Text as="span" color="#8B949E">
                  BTC
                </Text>
              </Text>
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

            <button className="w-full bg-[#30363D] hover:bg-[#2EA043] text-[#6E7681] hover:text-[white] rounded-md border border-[#8B949E] py-1 mb-6">
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

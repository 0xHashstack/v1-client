import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
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
import { useDisclosure } from "@chakra-ui/react";
import SliderWithInput from "../uiElements/sliders/sliderWithInput";
import InfoIcon from "@/assets/icons/infoIcon";
import BTCLogo from "../../assets/icons/coins/btc";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
const SupplyModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sliderValue, setSliderValue] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [coin, setCoin] = useState("BTC");
  const [inputAmount, setinputAmount] = useState(0);
  return (
    <div>
      <Button onClick={onOpen}>Open Modal</Button>
      <Portal>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          isCentered
          size={{ width: "700px", height: "100px" }}
        >
          <ModalOverlay bg="rgba(244, 242, 255, 0.5);" />
          <ModalContent
            bg="#010409"
            color="white"
            borderRadius="md"
            maxW="480px"
          >
            <ModalHeader mt="1rem">Supply</ModalHeader>
            <ModalCloseButton mt="1rem" mr="1rem" />
            <ModalBody>
              <Text color="#0969DA" mb="8px">
                Supply ID-12345
              </Text>
              <Card
                bg="#101216"
                mb="0.5rem"
                p="1.5rem"
                border="1px solid #6E7681"
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
                <Button
                  mb="1rem"
                  mt="0.5rem"
                  bg="none"
                  display="flex"
                  justifyContent="space-between"
                  border="1px solid #2B2F35"
                  _hover={{ bg: "#101216" }}
                >
                  <Box display="flex" alignItems="center">
                    <BTCLogo />
                    <Text color="white" ml="0.4rem">
                      BTC
                    </Text>
                  </Box>
                  <DropdownUp />
                </Button>
                <Box
                  width="100%"
                  color="white"
                  border="1px solid #2B2F35"
                  borderRadius="6px"
                  display="flex"
                  justifyContent="space-between"
                >
                  <NumberInput border="0px">
                    <NumberInputField
                      placeholder="Minimum 0.000678 BTC"
                      border="0px"
                    />
                  </NumberInput>
                  <Button
                    variant="ghost"
                    color="#0969DA"
                    _hover={{ bg: "#101216" }}
                    onClick={() => {
                      setinputAmount(walletBalance);
                    }}
                  >
                    MAX
                  </Button>
                </Box>
                <Text
                  color="#E6EDF3"
                  display="flex"
                  justifyContent="flex-end"
                  mt="0.2rem"
                >
                  Wallet Balance: {walletBalance} {` ${coin}`}
                </Text>
                <Box mt="0.3rem">
                  <SliderWithInput />
                </Box>
              </Card>
              <Checkbox defaultChecked mt="1rem">
                <Text fontSize="0.65rem">
                  Ticking would stake the received rTokens unchecking
                  wouldn&apos;t stake rTokens
                </Text>
              </Checkbox>

              <Card bg="#101216" mt="2rem" p="1rem" border="1px solid #6E7681">
                <Text
                  color="#8B949E"
                  display="flex"
                  justifyContent="space-between"
                  fontSize="0.9rem"
                  mb="0.4rem"
                >
                  <Text display="flex" alignItems="center">
                    <Text mr="0.3rem">Fees:</Text>
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
                  <Text>5.56%</Text>
                </Text>
                <Text
                  color="#8B949E"
                  display="flex"
                  justifyContent="space-between"
                  fontSize="0.9rem"
                  mb="0.4rem"
                >
                  <Text display="flex" alignItems="center">
                    <Text mr="0.3rem">Gas estimate:</Text>
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
                  <Text>$ 0.50</Text>
                </Text>
                <Text
                  color="#8B949E"
                  display="flex"
                  justifyContent="space-between"
                  fontSize="0.9rem"
                  mb="0.4rem"
                >
                  <Text display="flex" alignItems="center">
                    <Text mr="0.3rem">Supply apr:</Text>
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
                  <Text>5.56%</Text>
                </Text>
              </Card>
              <Button
                bg="#101216"
                color="#6E7681"
                size="sm"
                width="100%"
                mt="2rem"
                mb="2rem"
                border="1px solid #6E7681"
                _hover={{ bg: "#101216" }}
              >
                Supply
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </div>
  );
};

export default SupplyModal;

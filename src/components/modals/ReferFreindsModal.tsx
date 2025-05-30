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
import { useDisclosure } from "@chakra-ui/react";
import InfoIcon from "@/assets/icons/infoIcon";
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
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

const ReferFreindsModal = ({ buttonText, ...restProps }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [inputAmount, setinputAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [buttonId, setButtonId] = useState(0);

  const dispatch = useDispatch();
  const walletBalance = useSelector(selectWalletBalance);
  const inputAmount1 = useSelector(selectInputSupplyAmount);



  return (
    <div>
      <Button onClick={onOpen} {...restProps}>
        {buttonText}
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
              Refer friends
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
                    Referal Link
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
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
                  w="full"
                  backgroundColor="#101216"
                  py="2"
                  border="1px solid #2B2F35"
                  borderRadius="6px"
                  mt="0.2rem"
                >
                  <Text ml="1rem" color="white">
                    Oxdshdjchicclzm zb jbJKCaklscjl;CJ
                  </Text>
                </Box>
              </Card>
              <Card
                bg="#101216"
                mb="0.5rem"
                p="1rem"
                border="1px solid #2B2F35"
                mt="0.5rem"
              >
                <Text color="#8B949E" display="flex" alignItems="center">
                  <Text
                    mr="0.3rem"
                    fontSize="12px"
                    fontStyle="normal"
                    fontWeight="400"
                  >
                    Terms and regulation
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
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
                <Text
                  color="#6A737D"
                  mt="8px"
                  fontSize="12px"
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="20px"
                >
                  1. &quot;Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt ut labore et dolore
                  magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                  sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.&quot;
                </Text>
              </Card>

              {inputAmount1 > 0 && inputAmount <= walletBalance ? (
                buttonId == 1 ? (
                  <SuccessButton successText="Supply success" />
                ) : buttonId == 2 ? (
                  <ErrorButton errorText="Copy error!" />
                ) : (
                  <></>
                  // <AnimatedButton
                  //   bgColor="#101216"
                  //   // bgColor="red"
                  //   // p={0}
                  //   color="#8B949E"
                  //   size="sm"
                  //   width="100%"
                  //   mt="1.5rem"
                  //   mb="1.5rem"
                  //   border="1px solid #8B949E"
                  //   labelSuccessArray={[
                  //     "Deposit Amount approved",
                  //     "Successfully transferred to Hashstac&apos;s supply vault.",
                  //     "Determining the rToken amount to mint.",
                  //     "rTokens have been minted successfully.",
                  //     "Transaction complete.",
                  //     // <ErrorButton errorText="Transaction failed" />,
                  //     // <ErrorButton errorText="Copy error!" />,
                  //     <SuccessButton
                  //       key={"successButton"}
                  //       successText={"Success"}
                  //     />,
                  //   ]}
                  //   onClick={onClose}
                  // >
                  //   Copy Referal Link
                  // </AnimatedButton>
                )
              ) : (
                <Button
                  bg="#101216"
                  color="#6E7681"
                  size="sm"
                  width="100%"
                  mt="1rem"
                  mb="1rem"
                  border="1px solid #2B2F35"
                  _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
                  onClick={onClose}
                >
                  Copy Referal Link
                </Button>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </div>
  );
};
export default ReferFreindsModal;

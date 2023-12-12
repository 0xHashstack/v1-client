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
  Checkbox,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Text,
  Box,
  HStack,
  useMediaQuery,
  Portal,
} from "@chakra-ui/react";
import TransactionFees from "../../../TransactionFees.json";
import TickIcon from "@/assets/icons/tickIcon";
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
import Image from "next/image";
import {
  setModalDropdown,
  selectModalDropDowns,
} from "@/store/slices/dropdownsSlice";
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import AaveLogo from "@/assets/icons/coins/aave";
import CompoundLogo from "@/assets/icons/coins/compound";
import { useRouter } from "next/router";
import PenIcon from "@/assets/icons/penIcon";
import numberFormatter from "@/utils/functions/numberFormatter";
import PenIconDisabled from "@/assets/icons/penIconDisabled";

export interface ICoin {
  name: string;
  symbol: string;
  icon: string;
}

export const Coins: ICoin[] = [
  { name: "USDT", icon: "mdi-bitcoin", symbol: "USDT" },
  { name: "USDC", icon: "mdi-ethereum", symbol: "USDC" },
  { name: "BTC", icon: "mdi-bitcoin", symbol: "WBTC" },
  { name: "ETH", icon: "mdi-ethereum", symbol: "WETH" },
  { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
];

const TransferDepositModal = ({ buttonText, ...restProps }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentProtocol, setcurrentProtocol] = useState("Aave");

  const [currentSelectedCoin, setCurrentSelectedCoin] = useState("BTC");
  const [inputAmount, setinputAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [buttonId, setButtonId] = useState(0);

  const dispatch = useDispatch();
  const modalDropdowns = useSelector(selectModalDropDowns);
  const walletBalance = useSelector(selectWalletBalance);
  const inputAmount1 = useSelector(selectInputSupplyAmount);
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState("");
  const router = useRouter();
  const [isLargerThan1280] = useMediaQuery("(min-width: 1248px)");
  const [currentBorrowAPR, setCurrentBorrowAPR] = useState<number>();
  const [currentSupplyAPR, setCurrentSupplyAPR] = useState<number>();
  const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] = useState("BTC");
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
      case "Aave":
        return <AaveLogo />;
        break;
      case "Compound":
        return <CompoundLogo />;
        break;
      case "Aave":
        return <AaveLogo />;
        break;
      case "Compound":
        return <CompoundLogo />;
        break;
      default:
        break;
    }
  };

  const columnItems = [
    "Market",
    "Dapp",
    "Current yield",
    "Hashstack yield",
  ];

  ////console.log(inputAmount);

  //This Function handles the modalDropDowns
  const handleDropdownClick = (dropdownName: any) => {
    // Dispatches an action called setModalDropdown with the dropdownName as the payload
    dispatch(setModalDropdown(dropdownName));
  };
  const tooltips = [
    "Available markets.",
    "The number of tokens that are currently borrowed from the protocol.",
    "The number of tokens that can be borrowed from the protocol.",
    "Represents how much of a pool has been borrowed",
    "The annual interest rate charged on borrowed funds from the protocol.",
  ];
  const [editSelected, seteditSelected] = useState(false)
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
  const protocols = ["Aave", "Compound"];
  const resetStates = () => {
    setcurrentProtocol("Aave");
    setinputAmount(0);
    setSliderValue(0);
    setCurrentSelectedCoin("BTC");
  };

  return (
    <div>
      <Button onClick={onOpen} {...restProps}>
      <Image
                src={"/transferDepositDisabled.svg"}
                alt="Picture of the author"
                width="20"
                height="20"
                // style={{ cursor: Render ? "pointer" : "not-allowed" }}

              />
               <Text fontSize="14px" lineHeight="14px" color="#676D9A">
                Transfer Deposit
              </Text>
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
          scrollBehavior="inside"
        >
          <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />
          <ModalContent
            background="var(--Base_surface, #02010F)"
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
              Transfer Deposit
            </ModalHeader>
            <ModalCloseButton mt="1rem" mr="1rem" />
            <ModalBody>
              <Box
                mb="0.5rem"
                mt="-1.5"
              >
                <Text color="#F0F0F5" fontSize="14px" fontStyle="normal" fontWeight="400">
                  You currently have active deposits on Dapp 1, Dapp 2, Dapp 3 equating to USD $ XXXX in cumulative value, earning a cumulative of x% in supply apr. When you migrate these deposits to Hashstack, you earn y% more yield on your supply and an additional 10% of supply apr as bonus. That’s not all, Hashstack will reward you x USDT. This will be deposited on your behalf into the protocol. Terms & conditions apply.
                </Text>
              </Box>
              <Box width="100%" display="flex" alignItems="flex-end" justifyContent="flex-end" cursor="pointer" onClick={()=>{
                seteditSelected(!editSelected)
              }}>
                {!editSelected ?<PenIconDisabled/>:<PenIcon />}
              </Box>
              <TableContainer
                borderRadius="6px"
                backgroundColor="rgba(103, 109, 154, 0.10)"
                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                color="white"
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-start"
                // bgColor={"yellow"}
                height={"100%"}
                paddingX={isLargerThan1280 ? "1rem" : "1rem"}
                pt={"1.7rem"}
                mt="1rem"
                // pb={"0.5rem"}
                overflowX="hidden"
              >
                <Table variant="unstyled" width="100%" height="100%">
                  <Thead width={"100%"} height={"2.7rem"}>
                    <Tr width={"100%"}>
                      {columnItems.map((val, idx) => (
                        <Td
                          key={idx}
                          // width={`${gap2[idx]}%`}
                          // maxWidth={`${gap[idx1][idx2]}%`}
                          fontSize={"12px"}
                          fontWeight={400}
                          // border="1px solid blue"
                          padding={0}
                        >
                          <Text
                            whiteSpace="pre-wrap"
                            overflowWrap="break-word"
                            //   bgColor={"red"}
                            width={"100%"}
                            height={"2rem"}
                            // textAlign="center"
                            textAlign={idx == 0 ? "left" : "center"}
                            color={"#BDBFC1"}
                            padding={0}
                            pl={idx == 0 ? 0 : 14}
                          >
                            <Tooltip
                              hasArrow
                              label={tooltips[idx]}
                              placement={
                                (idx === 0 && "bottom-start") ||
                                (idx === columnItems.length - 1 && "bottom-end") ||
                                "bottom"
                              }
                              rounded="md"
                              boxShadow="dark-lg"
                              bg="#02010F"
                              fontSize={"13px"}
                              fontWeight={"400"}
                              borderRadius={"lg"}
                              padding={"2"}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                              arrowShadowColor="#2B2F35"
                            // maxW="222px"
                            // mt="28px"
                            >
                              {val}
                            </Tooltip>
                          </Text>
                        </Td>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody
                    position="relative"
                    overflowX="hidden"
                  //   display="flex"
                  //   flexDirection="column"
                  //   gap={"1rem"}
                  >
                    {Coins?.map((coin, idx) => (
                      <>
                        <Tr
                          key={idx}
                          width={"100%"}
                          height={"5rem"}
                          // bgColor="blue"
                          // borderBottom="1px solid #2b2f35"
                          position="relative"
                        >
                          <Td
                            width={"14%"}
                            // maxWidth={`${gap[idx1][idx2]}%`}
                            fontSize={"12px"}
                            fontWeight={400}
                            padding={0}
                            textAlign="left"
                          // bgColor={"red"}
                          >
                            <HStack gap="10px">
                              <Box height="32px" width="32px">
                                <Image
                                  src={`/${coin?.name}.svg`}
                                  alt="Picture of the author"
                                  width="32"
                                  height="32"
                                />
                              </Box>
                              <Text fontSize="14px">{(coin?.name == "BTC" || coin?.name == "ETH") ? "w" + coin?.name : coin?.name}</Text>
                            </HStack>
                          </Td>
                          <Td
                            width={"17%"}
                            maxWidth={"3rem"}
                            fontSize={"14px"}
                            fontWeight={400}
                            overflow={"hidden"}
                            textAlign={"center"}
                            // paddingInline="0"
                          >
                            <Box
                              width="100%"
                              height="100%"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontWeight="400"
                            // bgColor={"blue"}
                            >
                              {/* {checkGap(idx1, idx2)} */}
                              {/* {totalBorrows[idx]==null ? (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    ) : (
                      numberFormatter(totalBorrows[idx])
                    )} */}
                    AAVE
                            </Box>
                          </Td>
                          <Td
                            width={"17%"}
                            maxWidth={"3rem"}
                            fontSize={"14px"}
                            fontWeight={400}
                            overflow={"hidden"}
                            textAlign={"center"}
                          >
                            <Box
                              width="100%"
                              height="100%"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontWeight="400"
                            // bgColor={"blue"}
                            >
                              {/* {checkGap(idx1, idx2)} */}
                              {/* {availableReserves[idx]==null ? (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    ) : (
                      numberFormatter(availableReserves[idx])
                    )} */}
                    6.7%
                            </Box>
                          </Td>
                          <Td
                            width={"15%"}
                            maxWidth={"3rem"}
                            fontSize={"14px"}
                            fontWeight={400}
                            overflow={"hidden"}
                            textAlign={"center"}
                          >
                            <Box
                              width="100%"
                              height="100%"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontWeight="400"
                            // bgColor={"blue"}
                            >
                              {/* {checkGap(idx1, idx2)} */}
                              {/* {utilization[idx]==null ? (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    ) : (
                      numberFormatterPercentage(utilization[idx]) + "%"
                    )} */}
                    9%
                            </Box>
                          </Td>
                          <Td
                            width={"15%"}
                            maxWidth={"3rem"}
                            fontSize={"14px"}
                            fontWeight={400}
                            overflow={"hidden"}
                            textAlign={"center"}
                          >
                            <Box
                              width="100%"
                              height="100%"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontWeight="400"
                            // bgColor={"blue"}
                            >
                              {/* {checkGap(idx1, idx2)} */}
                              {/* {borrowAPRs[idx]==null ? (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    ) : (
                      "-"+numberFormatterPercentage(borrowAPRs[idx]) + "%"
                    )} */}
                    
                            </Box>
                          </Td>
                        </Tr>
                        <Tr
                          style={{
                            position: "absolute",
                            height: "1px",
                            borderWidth: "0",
                            backgroundColor: "#2b2f35",
                            width: "100%",
                            // left: "1.75%",
                            display: `${idx == Coins.length - 1 ? "none" : "block"}`,
                          }}
                        />
                      </>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Box display="flex" mt="1rem">
                <Text fontSize="14px" fontWeight="400" lineHeight="22px" color="#F0F0F5">
                  Don’t see one of your positions?
                </Text>
                <Text fontSize="14px" fontWeight="400" lineHeight="22px" color="#4D59E8" ml="1" cursor="pointer">
                  Get help.
                </Text>
              </Box>
              {inputAmount > 0 && inputAmount <= walletBalance ? (
                buttonId == 1 ? (
                  <SuccessButton successText="Supply success" />
                ) : buttonId == 2 ? (
                  <ErrorButton errorText="Copy error!" />
                ) : (
                  <AnimatedButton
                    background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                    color="#6E7681"
                    size="sm"
                    width="100%"
                    mt="1.5rem"
                    mb="1.5rem"
                    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
                    labelSuccessArray={[
                      "Deposit Amount approved",
                      "Successfully transferred to Hashstacks supply vault.",
                      "Determining the rToken amount to mint.",
                      "rTokens have been minted successfully.",
                      "Transaction complete.",
                      // <ErrorButton errorText="Transaction failed" />,
                      // <ErrorButton errorText="Copy error!" />,
                      <SuccessButton
                        key={"successButton"}
                        successText={"Success"}
                      />,
                    ]}
                    labelErrorArray={[
                      <ErrorButton
                        errorText="Transaction failed"
                        key={"error1"}
                      />,
                      <ErrorButton errorText="Copy error!" key={"error2"} />,
                    ]}
                    currentTransactionStatus={currentTransactionStatus}
                    setCurrentTransactionStatus={setCurrentTransactionStatus}
                    onClick={() => {
                      router.push("/market");
                    }}
                  >
                    Transfer Deposit
                  </AnimatedButton>
                )
              ) : (
                <Button
                  background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                  color="#EDEEFC"
                  size="sm"
                  width="100%"
                  mt="1.5rem"
                  mb="1.5rem"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
                >
                  Transfer Deposit
                </Button>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </div>
  );
};
export default TransferDepositModal;

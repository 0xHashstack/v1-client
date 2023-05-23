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
    Tooltip,
    Box,
    Portal,
} from "@chakra-ui/react";

import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import { useDisclosure } from "@chakra-ui/react";
import InfoIcon from "@/assets/icons/infoIcon";
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import ETHLogo from "@/assets/icons/coins/eth";
import SmallEth from "@/assets/icons/coins/smallEth";
import SmallUsdt from "@/assets/icons/coins/smallUsdt";
import DAILogo from "@/assets/icons/coins/dai";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import SmallJediswapLogo from "@/assets/icons/coins/smallJediswap";
import TableMySwap from "../layouts/table/tableIcons/mySwap";
import TableMySwapDull from "../layouts/table/tableIcons/mySwapDull";
import TableJediswapLogo from "../layouts/table/tableIcons/jediswapLogo";
import TableJediswapLogoDull from "../layouts/table/tableIcons/jediswapLogoDull";
import {
    selectInputSupplyAmount,
    setCoinSelectedSupplyModal,
    selectWalletBalance,
    setInputSupplyAmount,
    selectSelectedDapp,
} from "@/store/slices/userAccountSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    setModalDropdown,
    selectModalDropDowns
} from "@/store/slices/dropdownsSlice";

const SwapModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [currentSelectedCoin, setCurrentSelectedCoin] = useState("Select a market");
    const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] = useState("ETH");
    const [currentBorrowId, setCurrentBorrowId] = useState("ID - 123456");
    const [inputAmount, setinputAmount] = useState(0);
    const [sliderValue, setSliderValue] = useState(0);

    const dispatch = useDispatch();
    const modalDropdowns = useSelector(selectModalDropDowns);
    const walletBalance = useSelector(selectWalletBalance);
    const inputAmount1 = useSelector(selectInputSupplyAmount);
    const selectedDapp=useSelector(selectSelectedDapp);

    const getCoin = (CoinName: string) => {
        switch (CoinName) {
            case "BTC":
                return <BTCLogo height={"16px"} width={"16px"}/>;
                break;
            case "USDC":
                return <USDCLogo height={"16px"} width={"16px"}/>;
                break;
            case "USDT":
                return <USDTLogo height={"16px"} width={"16px"}/>;
                break;
            case "ETH":
                return <ETHLogo height={"16px"} width={"16px"}/>;
                break;
            case "DAI":
                return <DAILogo height={"16px"} width={"16px"}/>;
                break;
            default:
                break;
        }
    };
    const borrowIds = [
        "ID - 123456",
        "ID - 123457",
        "ID - 123458",
        "ID - 123459",
        "ID - 1234510",
    ];

    //This Function handles the modalDropDowns
    const handleDropdownClick = (dropdownName: any) => {
        // Dispatches an action called setModalDropdown with the dropdownName as the payload
        dispatch(setModalDropdown(dropdownName));
    };

    //This function is used to find the percentage of the slider from the input given by the user
    const handleChange = (newValue: any) => {
        // Calculate the percentage of the new value relative to the wallet balance
        var percentage = (newValue * 100) / walletBalance;
        percentage = Math.max(0, percentage);
        if (percentage > 100) {
            setSliderValue(100);
            setinputAmount(newValue);
            dispatch(setInputSupplyAmount(newValue));
        } else {
            percentage = Math.round(percentage * 100) / 100;
            setSliderValue(percentage);
            setinputAmount(newValue);
            dispatch(setInputSupplyAmount(newValue));
        }
    };
    // console.log(onOpen)

    const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
    const resetStates=()=>{
        setSliderValue(0);
        setinputAmount(0);
        setCurrentBorrowMarketCoin("ETH");
        setCurrentSelectedCoin("Select a market");
        setCurrentBorrowId("ID - 123456");
    }

    return (
        <div>
                            <Box display="flex" gap="14" mt="1rem">
                  <Box cursor="pointer" onClick={onOpen}>
                    {selectedDapp != "" ? <TableMySwap /> : <TableMySwapDull />}
                  </Box>
                  <Box cursor="pointer" onClick={onOpen}>
                    {selectedDapp != "" ? (
                      <Box >
                        <TableJediswapLogo />
                      </Box>
                    ) : (
                      <TableJediswapLogoDull />
                    )}
                  </Box>
                </Box>
                <Modal isOpen={isOpen} onClose={()=>{
                    onClose();
                    resetStates();
                }}  isCentered scrollBehavior="inside">
                    <ModalOverlay
                        bg="rgba(244, 242, 255, 0.5);"
                        mt="3.8rem"
                    />
                    <ModalContent
                        bg="#010409"
                        color="white"
                        borderRadius="md"
                        maxW="464px"
                        zIndex={1}
                        mt="8rem"
                        className="modal-content"

                    >
                        <ModalHeader mt="1rem" fontSize="14px" fontWeight="600" fontStyle="normal" lineHeight="20px">Swap</ModalHeader>
                        <ModalCloseButton mt="1rem" mr="1rem" />
                        <ModalBody>
                            <Card bg="#101216" mb="0.5rem" p="1rem" border="1px solid #2B2F35" >
                                <Text color="#8B949E" display="flex" alignItems="center">
                                    <Text mr="0.3rem" fontSize="12px">
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
                                        handleDropdownClick("swapModalSupplyMarketDropDown")
                                    }
                                >
                                    <Box display="flex" gap="1">
                                        {currentSelectedCoin!='Select a market'?<Box p="1">{getCoin(currentSelectedCoin)}</Box>:""}
                                        
                                        <Text color="white">{currentSelectedCoin}</Text>
                                    </Box>
                                    
                                    <Box pt="1" className="navbar-button">
                                        <DropdownUp />
                                    </Box>
                                    {modalDropdowns.swapModalSupplyMarketDropDown && (
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
                                                            setCurrentSelectedCoin(coin);
                                                            dispatch(setCoinSelectedSupplyModal(coin))
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
                                                            px={`${coin === currentSelectedCoin ? "1" : "5"
                                                                }`}
                                                            gap="1"
                                                            bg={`${coin === currentSelectedCoin
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
                                    <Text mr="0.3rem" fontSize="12px">
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
                                        mt="0.2rem"

                                        borderRadius="md"
                                        color="white"
                                        className="navbar"
                                        onClick={() =>
                                            handleDropdownClick("swapModalBorrowIDDropDown")
                                        }
                                        as="button"
                                    >
                                        <Box display="flex" gap="1">
                                            {currentBorrowId}
                                        </Box>
                                        <Text pt="1" className="navbar-button">
                                            <DropdownUp />
                                        </Text>
                                        {modalDropdowns.swapModalBorrowIDDropDown && (
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
                                                                px={`${coin === currentBorrowId ? "2" : "5"
                                                                    }`}
                                                                gap="1"
                                                                bg={`${coin === currentBorrowId
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
                                <Text color="#8B949E" display="flex" alignItems="center" mt="1rem">
                                    <Text mr="0.3rem" fontSize="12px">
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
                                    mt="0.2rem"
                                    borderRadius="md"
                                    className="navbar"
                                    cursor="pointer"
                                    onClick={() =>
                                        handleDropdownClick("swapModalBorrowMarketDropDown")
                                    }
                                >
                                    <Box display="flex" gap="1">
                                        <Box p="1">{getCoin(currentBorrowMarketCoin)}</Box>
                                        <Text color="white">{currentBorrowMarketCoin}</Text>
                                    </Box>
                                    
                                    <Box pt="1" className="navbar-button">
                                        <DropdownUp />
                                    </Box>
                                    {modalDropdowns.swapModalBorrowMarketDropDown && (
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
                                                            // dispatch(setCoinSelectedSupplyModal(coin))
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
                                                            px={`${coin === currentBorrowMarketCoin ? "1" : "5"
                                                                }`}
                                                            gap="1"
                                                            bg={`${coin === currentBorrowMarketCoin
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
                                <Text color="#E6EDF3" display="flex" justifyContent="flex-end" mt="0.4rem" fontSize="12px" fontWeight="500" fontStyle="normal" fontFamily="Inter">
                                    Borrow Balance: {walletBalance}
                                    <Text color="#6E7781" ml="0.2rem">
                                        {` ${currentBorrowMarketCoin}`}
                                    </Text>
                                </Text>

                            </Card>

                            <Box bg="#101216" borderRadius="6px" p="1rem" border="1px solid #2B2F35" mt="1.5rem" >
                                <Box  display="flex" justifyContent="space-between" mb="0.3rem">
                                    <Box  display="flex">
                                        <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">
                                            Dapp:
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
                                            <Box ml="0.1rem" mt="0.2rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Box display="flex" gap="2px">
                                            <Box mt="2px">
                                                <SmallJediswapLogo/>
                                            </Box>
                                        <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">Jediswap</Text>
                                            
                                        </Box>
                                </Box>
                                <Box  display="flex" justifyContent="space-between" mb="0.3rem">
                                    <Box display="flex">
                                    <Box display="flex" gap="2px">
                                        <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">est</Text>
                                            <Box mt="2px">
                                                <SmallEth/>
                                            </Box>
                                        </Box>
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
                                            <Box ml="0.2rem" mt="0.2rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">0.1%</Text>
                                </Box>
                                <Box  display="flex" justifyContent="space-between" mb="0.3rem">
                                    <Box  display="flex">
                                        <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">
                                            Liquidity split:{" "}
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
                                            <Box ml="0.2rem" mt="0.2rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Box
                                        display="flex"
                                        gap="2"
                                        color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal"
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
                                <Box  display="flex" justifyContent="space-between" mb="0.3rem">
                                    <Box  display="flex">
                                        <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.2rem" mt="0.2rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">0.1%</Text>
                                </Box>
                                <Box  display="flex" justifyContent="space-between" mb="0.3rem">
                                    <Box  display="flex">
                                        <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.2rem" mt="0.2rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">5.56%</Text>
                                </Box>
                                <Box  display="flex" justifyContent="space-between" mb="0.3rem">
                                    <Box display="flex">
                                        <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.2rem" mt="0.2rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">5.56%</Text>
                                </Box>
                                <Box  display="flex" justifyContent="space-between" mb="0.3rem">
                                    <Box display="flex">
                                        <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.2rem" mt="0.2rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">5.56%</Text>
                                </Box>
                                <Box  display="flex" justifyContent="space-between">
                                    <Box  display="flex">
                                        <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.2rem" mt="0.2rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="12px" fontWeight="400" fontStyle="normal">1.10</Text>
                                </Box>
                                </Box>
                            {currentSelectedCoin!="Select a market" ? (
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
                                    Spend Borrow
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
                                    Spend Borrow
                                </Button>
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>
        </div>
    );
};
export default SwapModal;

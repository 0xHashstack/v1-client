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
    Tooltip,
    Box,
    NumberInput,
    NumberInputField,
    Portal,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import DropdownUp from "../../assets/icons/dropdownUpIcon";
import InfoIcon from "../../assets/icons/infoIcon";
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
    setCoinSelectedSupplyModal,
    selectWalletBalance,
    setInputSupplyAmount,
} from "@/store/slices/userAccountSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    setModalDropdown,
    selectModalDropDowns
} from "@/store/slices/dropdownsSlice";

const SpendBorrowModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [currentSelectedCoin, setCurrentSelectedCoin] = useState("BTC");
    const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] = useState("BTC");
    const [currentAction, setCurrentAction] = useState("Stake");
    const [currentBorrowId, setCurrentBorrowId] = useState("ID - 123456");
    const [currentDapp, setCurrentDapp] = useState("Jediswap");
    const [currentPool, setCurrentPool] = useState("ETH/USDT");
    const [inputAmount, setinputAmount] = useState(0);
    const [sliderValue, setSliderValue] = useState(0);

    const dispatch = useDispatch();
    const modalDropdowns = useSelector(selectModalDropDowns);
    const walletBalance = useSelector(selectWalletBalance);
    const inputAmount1 = useSelector(selectInputSupplyAmount);

    const borrowIds = [
        "ID - 123456",
        "ID - 123457",
        "ID - 123458",
        "ID - 123459",
        "ID - 1234510",
    ];

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

    //This Function handles the modalDropDowns
    const handleDropdownClick = (dropdownName: string) => {
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

    const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
    const rcoins = ["rBTC", "rUSDT", "rUSDC", "rETH", "rDAI"];
    const actions = [
        "Stake",
        "Swap",
        "Trade",
        "Liquidity Provision"
    ];
    return (
        <div>
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
                Supply
            </Button>
            <Portal>
                <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
                    <ModalOverlay
                        bg="rgba(244, 242, 255, 0.5);"
                        mt="3.8rem"
                    />
                    <ModalContent
                        bg="#010409"
                        color="white"
                        borderRadius="md"
                        maxW="462px"
                        mt="5rem"
                        zIndex={1}
                        className="modal-content"

                    >
                        <ModalHeader mt="1rem" fontSize="14px" fontWeight="600" fontStyle="normal" lineHeight="20px">Spend Borrow</ModalHeader>
                        <ModalCloseButton mt="1rem" mr="1rem" />
                        <ModalBody>
                            <Card bg="#101216" mb="0.5rem" p="1rem" border="1px solid #2B2F35" >
                                <Text color="#8B949E" display="flex" alignItems="center" mb="0.1rem">
                                    <Text mr="0.3rem" ml="0.2rem" fontSize="12px" fontWeight="400" fontStyle="normal">
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
                                    mb="0.1rem"
                                    mt="0.1rem"
                                    borderRadius="md"
                                    color="white"
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
                                                            px={`${action === currentAction ? "2" : "5"
                                                                }`}
                                                            gap="1"
                                                            bg={`${action === currentAction
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
                                <Box display="flex" flexDirection="column" gap="1" mt="0.5rem">
                                    <Box display="flex" mt="0.3rem">
                                        <Text  color="#8B949E" ml="0.2rem" fontSize="12px" fontWeight="400" fontStyle="normal" >
                                            Borrow ID
                                        </Text>
                                        <Tooltip
                                            hasArrow
                                            placement="bottom-start"
                                            boxShadow="dark-lg"
                                            label="all the assets to the market"
                                            bg="#24292F"

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
                                        color="white"
                                        className="navbar"
                                        onClick={() =>
                                            handleDropdownClick("spendBorrowBorrowIDDropdown")
                                        }
                                        as="button"
                                    >
                                        <Box display="flex" gap="1">
                                            {currentBorrowId}
                                        </Box>
                                        <Text pt="1" className="navbar-button">
                                            <DropdownUp />
                                        </Text>
                                        {modalDropdowns.spendBorrowBorrowIDDropdown && (
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
                                </Box>
                                <Box display="flex" flexDirection="column" gap="1" mt="0.5rem">
                                    <Box display="flex" mt="0.5rem">
                                        <Text  color="#8B949E" fontSize="12px" fontWeight="400" fontStyle="normal">
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
                                            color="white"
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
                                        color="white"
                                        onClick={() =>
                                            handleDropdownClick(
                                                "spendBorrowBorrowMarketDropdown"
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
                                        {modalDropdowns.spendBorrowBorrowMarketDropdown && (
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
                                                                px={`${coin === currentBorrowMarketCoin
                                                                    ? "1"
                                                                    : "5"
                                                                    }`}
                                                                gap="1"
                                                                bg={`${coin === currentBorrowMarketCoin
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
                                    <Text textAlign="right" fontSize="xs" color="white">
                                        Borrow Balance: 0.00{" "}
                                        <Text as="span" color="#8B949E">
                                            {currentBorrowMarketCoin}
                                        </Text>
                                    </Text>
                                </Box>
                            </Card>
                            {/* Dropdowns For when the user selects trade or liquidity or anything */}
                            {currentAction == "Stake" &&
                                <Card bg="#101216" mb="0.5rem" p="1rem" border="1px solid #2B2F35" mt="1rem">
                                    <Text color="#8B949E" display="flex" alignItems="center">
                                        <Text mr="0.3rem">
                                            Market
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
                                        mt="0.5rem"
                                        borderRadius="md"
                                        className="navbar"
                                        cursor="pointer"
                                        onClick={() =>
                                            handleDropdownClick("supplyModalDropdown")
                                        }
                                    >
                                        <Box display="flex" gap="1">
                                            <Box p="1">{getCoin(currentSelectedCoin)}</Box>
                                            <Text color="white">{currentSelectedCoin}</Text>
                                        </Box>
                                        <Box pt="1" className="navbar-button">
                                            <DropdownUp />
                                        </Box>
                                        {modalDropdowns.supplyModalDropdown && (
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
                                        <Text mr="0.3rem">
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
                                    <Box width="100%" color="white" border="1px solid #2B2F35" borderRadius="6px" display="flex" justifyContent="space-between">
                                        <NumberInput border="0px" min={0} keepWithinRange={true} onChange={handleChange} value={inputAmount} outline="none"
                                        >
                                            <NumberInputField placeholder={`Minimum 0.01536 ${currentSelectedCoin}`} border="0px" _placeholder={{
                                                color: "#393D4F",
                                                fontSize: ".89rem",
                                                fontWeight: "600",
                                                outline: "none"
                                            }}
                                                _focus={{
                                                    outline: "0",
                                                    boxShadow: "none"
                                                }}
                                            />
                                        </NumberInput>
                                        <Button variant="ghost" color="#0969DA" _hover={{ bg: "#101216" }} onClick={() => { setinputAmount(walletBalance); setSliderValue(100); dispatch(setInputSupplyAmount(walletBalance)) }}>
                                            MAX
                                        </Button>
                                    </Box>
                                    <Text color="#E6EDF3" display="flex" justifyContent="flex-end" mt="0.4rem" fontSize="12px" fontWeight="500" fontStyle="normal" fontFamily="Inter">
                                        Wallet Balance: {walletBalance}
                                        <Text color="#6E7781" ml="0.2rem">
                                            {` ${currentSelectedCoin}`}
                                        </Text>
                                    </Text>
                                    <Box pt={5} pb={2} mt="0.8rem">
                                        <Slider
                                            aria-label="slider-ex-6"
                                            defaultValue={sliderValue}
                                            value={sliderValue}
                                            onChange={(val) => {
                                                setSliderValue(val);
                                                var ans = ((val / 100) * walletBalance);
                                                ans = Math.round(ans * 100) / 100;
                                                dispatch(setInputSupplyAmount(ans))
                                                setinputAmount(ans);
                                            }}
                                            focusThumbOnChange={false}
                                        >
                                            <SliderMark value={sliderValue}>
                                                <Box position="absolute" bottom="-8px" left="-11px" zIndex="1">
                                                    <SliderTooltip />
                                                    <Text
                                                        position="absolute"
                                                        color="black"
                                                        top="7px"
                                                        left={
                                                            sliderValue !== 100 ? (sliderValue >= 10 ? "15%" : "25%") : "5%"
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
                                                <SliderFilledTrack bg="white" w={`${sliderValue}`} />
                                            </SliderTrack>
                                        </Slider>
                                    </Box>
                                </Card>
                            }
                            {currentAction == "Swap" && <Box
                                display="flex"
                                flexDirection="column"
                                backgroundColor="#101216"
                                border="1px"
                                borderColor="#2B2F35"
                                p="3"
                                // my="4"
                                borderRadius="md"
                                mt="1.5rem"
                                gap="3"
                            >
                                <Box display="flex" flexDirection="column" gap="1">
                                    <Box display="flex">
                                        <Text fontSize="12px" fontWeight="400" fontStyle="normal"  color="#8B949E">
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
                                                            key={index}
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
                                                                px={`${dapp.name === currentDapp ? "1" : "5"
                                                                    }`}
                                                                gap="1"
                                                                bg={`${dapp.name === currentDapp
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
                                <Box gap="2px">

                                    <Text display="flex" color="#6E7681" fontSize="12px" fontWeight="400" >
                                        From
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
                                            mt="1rem"
                                        >
                                            <Box p="1" >
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Text>
                                    <Text display="flex" color="#6E7681" fontSize="14px" fontWeight="400" gap="4px" fontStyle="normal">
                                        Borrowed Market:
                                        <BTCLogo />
                                        <Text color="white" fontSize="14px" fontStyle="normal">
                                            BTC
                                        </Text>

                                    </Text>
                                    <Text display="flex" color="#6E7681" fontSize="14px" fontWeight="400" fontStyle="normal">
                                        Available borrowed Amount:<Text color="white" ml="0.2rem">00.00</Text>
                                        <Text color="white" ml="0.2rem" fontSize="14px" fontStyle="normal">
                                            BTC

                                        </Text>
                                    </Text>
                                </Box>
                                <Box display="flex" flexDirection="column" gap="1px">
                                    <Box display="flex">
                                        <Text  color="#8B949E" fontSize="12px" fontWeight="400" fontStyle="normal">
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
                                        mt="0.1rem"
                                        borderRadius="md"
                                        className="navbar"
                                        cursor="pointer"
                                        onClick={() =>
                                            handleDropdownClick("supplyModalDropdown")
                                        }
                                    >
                                        <Box display="flex" gap="1">
                                            <Box p="1">{getCoin(currentSelectedCoin)}</Box>
                                            <Text color="white">{currentSelectedCoin}</Text>
                                        </Box>
                                        <Box pt="1" className="navbar-button">
                                            <DropdownUp />
                                        </Box>
                                        {modalDropdowns.supplyModalDropdown && (
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
                                </Box>

                            </Box>}

                            {currentAction == "Trade" && <Box
                                display="flex"
                                flexDirection="column"
                                backgroundColor="#101216"
                                border="1px"
                                borderColor="#2B2F35"
                                p="3"
                                // my="4"
                                borderRadius="md"
                                mt="1.5rem"
                                gap="3"
                            >
                                <Box display="flex" flexDirection="column" gap="1">
                                    <Box display="flex">
                                        <Text fontSize="12px" fontWeight="400" fontStyle="normal"  color="#8B949E">
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
                                                            key={index}
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
                                                                px={`${dapp.name === currentDapp ? "1" : "5"
                                                                    }`}
                                                                gap="1"
                                                                bg={`${dapp.name === currentDapp
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
                                        <Text fontSize="12px" fontWeight="400" fontStyle="normal"  color="#8B949E">
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
                                        mb="0.5rem"
                                        borderRadius="md"
                                        className="navbar"
                                        cursor="pointer"
                                        onClick={() =>
                                            handleDropdownClick("supplyModalDropdown")
                                        }
                                    >
                                        <Box display="flex" gap="1">
                                            <Box p="1">{getCoin(currentSelectedCoin)}</Box>
                                            <Text color="white">{currentSelectedCoin}</Text>
                                        </Box>
                                        <Box pt="1" className="navbar-button">
                                            <DropdownUp />
                                        </Box>
                                        {modalDropdowns.supplyModalDropdown && (
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
                                </Box>

                            </Box>}
                            {currentAction == "Liquidity Provision" && <Box
                                display="flex"
                                flexDirection="column"
                                backgroundColor="#101216"
                                border="1px"
                                borderColor="#2B2F35"
                                p="3"
                                // my="4"
                                borderRadius="md"
                                mt="1.5rem"
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
                                                            key={index}
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
                                                                px={`${dapp.name === currentDapp ? "1" : "5"
                                                                    }`}
                                                                gap="1"
                                                                bg={`${dapp.name === currentDapp
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
                                        {modalDropdowns.yourBorrowPoolDropdown && (
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
                                                                px={`${pool === currentPool ? "1" : "5"
                                                                    }`}
                                                                gap="1"
                                                                bg={`${pool === currentPool
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
                            </Box>}
                            {/* All the info on the fees and all the other requirements  */}
                            {currentAction == "Swap" &&
                                <Card bg="#101216" mt="1.5rem" padding="1rem" border="1px solid #2B2F35">
                                    <Text
                                        display="flex"
                                        justifyContent="space-between"
                                        fontSize="0.9rem"
                                        mb="0.4rem"
                                        lineHeight="14px"
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
                                        fontSize="0.9rem"
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
                                        fontSize="0.9rem"
                                    >
                                        <Text display="flex" alignItems="center">
                                            <Text
                                                mr="0.2rem"
                                                font-style="normal"
                                                font-weight="400"
                                                font-size="12px"
                                                color="#6A737D"
                                            >
                                                Health Factor:
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
                            }
                            {currentAction == "Stake" &&
                                <Card bg="#101216" mt="1rem" padding="1rem" border="1px solid #2B2F35">
                                    <Text
                                        display="flex"
                                        justifyContent="space-between"
                                        fontSize="0.9rem"
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
                                                Staking Rewards:
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
                                        fontSize="0.9rem"
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
                                        fontSize="0.9rem"
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
                            }
                            {currentAction == "Stake" &&
                                <Text padding="0px" fontSize="12px" fontWeight="400" fontStyle="normal" color=" #6A737D" mt="1rem">
                                    To stake you need to supply any asset to receive rTokens. <br></br>
                                    Click here To
                                    <Text display="inline" mt="1rem" color="#0969DA" cursor="pointer" ml="0.4rem">
                                        Add Supply
                                    </Text>
                                </Text>
                            }
                            {currentAction == "Trade" &&
                                <Card bg="#101216" mt="2rem" p="1rem" border="1px solid #2B2F35">
                                    <Text
                                        display="flex"
                                        justifyContent="space-between"
                                        fontSize="0.9rem"
                                        mb="0.2rem"
                                    >
                                        <Text display="flex" alignItems="center">
                                            <Text
                                                mr="0.2rem"
                                                font-style="normal"
                                                font-weight="400"
                                                font-size="12px"
                                                lineHeight="16px"
                                                display="flex"
                                                color="#6A737D"
                                                gap="px"
                                            >
                                                est
                                                <ETHLogo />:
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
                                        <Text color="#6E7681">$ 10.91</Text>
                                    </Text>
                                    <Text
                                        color="#8B949E"
                                        display="flex"
                                        justifyContent="space-between"
                                        fontSize="0.9rem"
                                        mb="0.2rem"
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
                                        fontSize="0.9rem"
                                        mb="0.2rem"
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
                                        fontSize="0.9rem"
                                        mb="0.2rem"
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
                                        fontSize="0.9rem"
                                        mb="0.2rem"
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
                                        fontSize="0.9rem"
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
                            }
                            {currentAction == "Liquidity Provision" && <Box bg="#101216" borderRadius="6px" p="1rem" border="1px solid #2B2F35" mt="1.5rem">
                                <Box className="flex justify-between" mb="0.2rem">
                                    <Box className="flex">
                                        <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.1rem" mt="0.4rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">
                                        $ 10.91
                                    </Text>
                                </Box>
                                <Box className="flex justify-between" mb="0.2rem">
                                    <Box className="flex">
                                        <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.1rem" mt="0.4rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Box
                                        display="flex"
                                        gap="2"
                                        color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal"
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
                                <Box className="flex justify-between" mb="0.2rem">
                                    <Box className="flex">
                                        <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.1rem" mt="0.4rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">0.1%</Text>
                                </Box>
                                <Box className="flex justify-between" mb="0.2rem">
                                    <Box className="flex">
                                        <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.1rem" mt="0.4rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">5.56%</Text>
                                </Box>
                                <Box className="flex justify-between" mb="0.2rem">
                                    <Box className="flex">
                                        <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.1rem" mt="0.4rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">5.56%</Text>
                                </Box>
                                <Box className="flex justify-between" mb="0.2rem">
                                    <Box className="flex">
                                        <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.1rem" mt="0.4rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">5.56%</Text>
                                </Box>
                                <Box className="flex justify-between">
                                    <Box className="flex">
                                        <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">
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
                                            <Box ml="0.1rem" mt="0.4rem">
                                                <InfoIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    <Text color="#6A737D" fontSize="14px" fontWeight="400" fontStyle="normal">1.10</Text>
                                </Box>
                            </Box>}
                            {inputAmount1 > 0 ? (
                                <Button
                                    bg="#8B949E"
                                    color="white"
                                    size="sm"
                                    width="100%"
                                    mt="2rem"
                                    mb="2rem"
                                    border="1px solid #2B2F35"
                                    _hover={{ bg: "#2DA44E" }}
                                    _focus={{ bg: "#298E46" }}
                                >
                                    {currentAction}
                                </Button>
                            ) : (
                                <Button
                                    bg="#101216"
                                    color="#6E7681"
                                    size="sm"
                                    width="100%"
                                    mt="2rem"
                                    mb="2rem"
                                    border="1px solid #2B2F35"
                                    _hover={{ bg: "#101216" }}
                                >
                                    {currentAction}
                                </Button>
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Portal>
        </div>
    );
};
export default SpendBorrowModal;

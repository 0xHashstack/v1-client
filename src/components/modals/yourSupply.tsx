import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Tooltip,
    Checkbox,
    Box,
    Text,
    Card,
    NumberInput,
    NumberInputField,
    Slider,
    SliderMark,
    SliderThumb,
    SliderTrack,
    SliderFilledTrack,
    TabList,
    Tab,
    TabPanel,
    Tabs,
    TabPanels,
    RadioGroup,
    Radio,
    Stack
} from "@chakra-ui/react";

/* Coins logo import  */
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import DropdownUp from "../../assets/icons/dropdownUpIcon";
import InfoIcon from "../../assets/icons/infoIcon";
import SliderWithInput from "../uiElements/sliders/sliderWithInput";
import { useDispatch, useSelector } from "react-redux";

import {
    selectNavDropdowns,
    setNavDropdown,
    setModalDropdown,
    selectModalDropDowns
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
} from "@/store/slices/userAccountSlice";
const YourSupplyModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const [sliderValue, setSliderValue] = useState(0);
    const modalDropdowns = useSelector(selectModalDropDowns);
    const [inputAmount, setinputAmount] = useState(0);
    const [inputSupplyAmount, setinputSupplyAmount] = useState(0)
    const [inputWithdrawlAmount, setinputWithdrawlAmount] = useState(0)
    const [sliderValue2, setSliderValue2] = useState(0);


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
    const handleChange = (newValue: any) => {
        var percentage = (newValue * 100) / walletBalance;
        percentage = Math.max(0, percentage);
        if (percentage > 100) {
            setSliderValue(100);
            setinputSupplyAmount(newValue);
            // dispatch(setInputSupplyAmount(newValue));
        } else {
            percentage = Math.round(percentage * 100) / 100;
            setSliderValue(percentage);
            setinputSupplyAmount(newValue);
            // dispatch(setInputSupplyAmount(newValue));
        }
    };
    const handleWithdrawlChange = (newValue: any) => {
        var percentage = (newValue * 100) / walletBalance;
        percentage = Math.max(0, percentage);
        if (percentage > 100) {
            setSliderValue2(100);
            setinputWithdrawlAmount(newValue);
            // dispatch(setInputSupplyAmount(newValue));
        } else {
            percentage = Math.round(percentage * 100) / 100;
            setSliderValue2(percentage);
            setinputWithdrawlAmount(newValue);
            // dispatch(setInputSupplyAmount(newValue));
        }
    };
    const handleDropdownClick = (dropdownName: any) => {
        dispatch(setModalDropdown(dropdownName));
    };
    const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
    const walletBalance = useSelector(selectWalletBalance);
    const [currentSelectedSupplyCoin, setCurrentSelectedSupplyCoin] = useState("BTC");
    const [currentSelectedWithdrawlCoin, setcurrentSelectedWithdrawlCoin] = useState("BTC")
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
                Repay
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            //   scrollBehavior="inside"
            >
                <ModalOverlay mt="3.8rem" bg="rgba(244, 242, 255, 0.5);" />
                <ModalContent mt="5rem" bg={"#010409"} maxW="442px">
                    {/* <ModalHeader>Borrow</ModalHeader> */}
                    <ModalCloseButton mt="1rem" mr="1rem" color="white" />
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
                                            Add supply
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
                                            Withdraw supply
                                        </Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel p="0" m="0">

                                            <Card bg="#101216" mb="0.5rem" p="1rem" border="1px solid #2B2F35" mt="1.5rem">
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
                                                        handleDropdownClick("yourSupplyAddsupplyDropdown")
                                                    }
                                                >
                                                    <Box display="flex" gap="1">
                                                        <Box p="1">{getCoin(currentSelectedSupplyCoin)}</Box>
                                                        <Text color="white">{currentSelectedSupplyCoin}</Text>
                                                    </Box>
                                                    <Box pt="1" className="navbar-button">
                                                        <DropdownUp />
                                                    </Box>
                                                    {modalDropdowns.yourSupplyAddsupplyDropdown && (
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
                                                                            setCurrentSelectedSupplyCoin(coin);
                                                                            // dispatch(setCoinSelectedSupplyModal(coin))
                                                                        }}
                                                                    >
                                                                        {coin === currentSelectedSupplyCoin && (
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
                                                                            px={`${coin === currentSelectedSupplyCoin ? "1" : "5"
                                                                                }`}
                                                                            gap="1"
                                                                            bg={`${coin === currentSelectedSupplyCoin
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
                                                <Box width="100%" color="white" border="1px solid #2B2F35" borderRadius="6px" display="flex" justifyContent="space-between">
                                                    <NumberInput border="0px" min={0} keepWithinRange={true} onChange={handleChange} value={inputSupplyAmount} outline="none"
                                                    >
                                                        <NumberInputField placeholder={`Minimum 0.01536 ${currentSelectedSupplyCoin}`} border="0px" _placeholder={{
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
                                                    <Button variant="ghost" color="#0969DA" _hover={{ bg: "#101216" }} onClick={() => { setinputSupplyAmount(walletBalance); setSliderValue(100); }}>
                                                        MAX
                                                    </Button>
                                                </Box>
                                                <Text color="#E6EDF3" display="flex" justifyContent="flex-end" mt="0.4rem" fontSize="12px" fontWeight="500" fontStyle="normal" fontFamily="Inter">
                                                    Wallet Balance: {walletBalance}
                                                    <Text color="#6E7781" ml="0.2rem">
                                                        {` ${currentSelectedSupplyCoin}`}
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
                                                            // dispatch(setInputSupplyAmount(ans))
                                                            setinputSupplyAmount(ans);
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
                                            <Checkbox defaultChecked mt="0.7rem" w="390px">
                                                <Text fontSize="10px" color="#6E7681" fontStyle="normal" fontWeight="400" lineHeight="20px">
                                                    Ticking would stake the received rTokens unchecking wouldn&apos;t stake rTokens
                                                </Text>
                                            </Checkbox>

                                            <Card bg="#101216" mt="1rem" p="1rem" border="1px solid #2B2F35" mb="0.5rem">
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
                                                            Wallet balance:
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
                                                            Supply apr:
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
                                                    <Text color="#6E7681">7.75%</Text>
                                                </Text>
                                            </Card>
                                            {inputSupplyAmount > 0 ? (
                                                <Button
                                                    bg="#8B949E"
                                                    color="white"
                                                    size="sm"
                                                    width="100%"
                                                    mt="1rem"
                                                    mb="1rem"
                                                    border="1px solid #2B2F35"
                                                    _hover={{ bg: "#2DA44E" }}
                                                    _focus={{ bg: "#298E46" }}
                                                >
                                                    Supply
                                                </Button>
                                            ) : (
                                                <Button
                                                    bg="#101216"
                                                    color="#6E7681"
                                                    size="sm"
                                                    width="100%"
                                                    mt="1rem"
                                                    mb="1rem"
                                                    border="1px solid #2B2F35"
                                                    _hover={{ bg: "#101216" }}
                                                >
                                                    Supply
                                                </Button>
                                            )}
                                        </TabPanel>
                                        <TabPanel p="0" m="0">
                                            <Card bg="#101216" mb="0.5rem" p="1rem" border="1px solid #2B2F35" mt="1.5rem">
                                                <Text color="#8B949E" display="flex" alignItems="center">
                                                    <Text mr="0.3rem">
                                                        Supply market
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
                                                        handleDropdownClick("yourSupplyWithdrawlDropdown")
                                                    }
                                                >
                                                    <Box display="flex" gap="1">
                                                        <Box p="1">{getCoin(currentSelectedWithdrawlCoin)}</Box>
                                                        <Text color="white">{currentSelectedWithdrawlCoin}</Text>
                                                    </Box>
                                                    <Box pt="1" className="navbar-button">
                                                        <DropdownUp />
                                                    </Box>
                                                    {modalDropdowns.yourSupplyWithdrawlDropdown && (
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
                                                                            setcurrentSelectedWithdrawlCoin(coin);
                                                                            // dispatch(setCoinSelectedSupplyModal(coin))
                                                                        }}
                                                                    >
                                                                        {coin === currentSelectedWithdrawlCoin && (
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
                                                                            px={`${coin === currentSelectedWithdrawlCoin ? "1" : "5"
                                                                                }`}
                                                                            gap="1"
                                                                            bg={`${coin === currentSelectedWithdrawlCoin
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
                                                        Withdraw amount
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
                                                <Box width="100%" color="white" border="1px solid #2B2F35" borderRadius="6px" display="flex" justifyContent="space-between" mt="0.5rem">
                                                    <NumberInput border="0px" min={0} keepWithinRange={true} onChange={handleWithdrawlChange} value={inputWithdrawlAmount} outline="none"
                                                    >
                                                        <NumberInputField placeholder={`Minimum 0.01536 ${currentSelectedWithdrawlCoin}`} border="0px" _placeholder={{
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
                                                    <Button variant="ghost" color="#0969DA" _hover={{ bg: "#101216" }} onClick={() => { setinputWithdrawlAmount(walletBalance); setSliderValue2(100); }}>
                                                        MAX
                                                    </Button>
                                                </Box>
                                                <Text color="#E6EDF3" display="flex" justifyContent="flex-end" mt="0.4rem" fontSize="12px" fontWeight="500" fontStyle="normal" fontFamily="Inter">
                                                    Wallet Balance: {walletBalance}
                                                    <Text color="#6E7781" ml="0.2rem">
                                                        {` ${currentSelectedWithdrawlCoin}`}
                                                    </Text>
                                                </Text>
                                                <Box pt={5} pb={2} mt="0.8rem">
                                                    <Slider
                                                        aria-label="slider-ex-6"
                                                        defaultValue={sliderValue2}
                                                        value={sliderValue2}
                                                        onChange={(val) => {
                                                            setSliderValue2(val);
                                                            var ans = ((val / 100) * walletBalance);
                                                            ans = Math.round(ans * 100) / 100;
                                                            // dispatch(setInputSupplyAmount(ans))
                                                            setinputWithdrawlAmount(ans);
                                                        }}
                                                        focusThumbOnChange={false}
                                                    >
                                                        <SliderMark value={sliderValue2}>
                                                            <Box position="absolute" bottom="-8px" left="-11px" zIndex="1">
                                                                <SliderTooltip />
                                                                <Text
                                                                    position="absolute"
                                                                    color="black"
                                                                    top="7px"
                                                                    left={
                                                                        sliderValue2 !== 100 ? (sliderValue2 >= 10 ? "15%" : "25%") : "5%"
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
                                                            <SliderFilledTrack bg="white" w={`${sliderValue2}`} />
                                                        </SliderTrack>
                                                    </Slider>
                                                </Box>
                                            </Card>
                                            <Checkbox defaultChecked mt="0.7rem" w="390px">
                                                <Text fontSize="10px" color="#6E7681" fontStyle="normal" fontWeight="400" lineHeight="20px">
                                                    Ticking would stake the received rTokens unchecking wouldn&apos;t stake rTokens
                                                </Text>
                                            </Checkbox>

                                            <Card bg="#101216" mt="1rem" p="1rem" border="1px solid #2B2F35" mb="0.5rem">
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
                                                            est. supply unlocked:
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
                                                            Earned APR:
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
                                                    <Text color="#6E7681">1.240 rETH</Text>
                                                </Text>
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
                                                            Gas Estimate balance:
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
                                            </Card>
                                            {inputWithdrawlAmount > 0 ? (
                                                <Button
                                                    bg="#8B949E"
                                                    color="white"
                                                    size="sm"
                                                    width="100%"
                                                    mt="1rem"
                                                    mb="1rem"
                                                    border="1px solid #2B2F35"
                                                    _hover={{ bg: "#2DA44E" }}
                                                    _focus={{ bg: "#298E46" }}
                                                >
                                                    Withdraw
                                                </Button>
                                            ) : (
                                                <Button
                                                    bg="#101216"
                                                    color="#6E7681"
                                                    size="sm"
                                                    width="100%"
                                                    mt="1rem"
                                                    mb="1rem"
                                                    border="1px solid #2B2F35"
                                                    _hover={{ bg: "#101216" }}
                                                >
                                                    Withdraw
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

export default YourSupplyModal;

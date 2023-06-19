import React, { useEffect, useState } from "react";
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
    SliderThumb,
} from "@chakra-ui/react";
import ArrowUp from "@/assets/icons/arrowup";
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
import ErrorToast from "../uiElements/toasts/ErrorToast";
import useGetTokens from "@/Blockchain/hooks/Writes/useGetTokens";
import {
    useAccount,
    useBalance,
    useWaitForTransaction,
} from "@starknet-react/core";
import useDeposit from "@/Blockchain/hooks/Writes/useDeposit";
import SliderPointer from "@/assets/icons/sliderPointer";
import SliderPointerWhite from "@/assets/icons/sliderPointerWhite";
import { useToast } from "@chakra-ui/react";
import { BNtoNum } from "@/Blockchain/utils/utils";
import { uint256 } from "starknet";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import useWithdrawDeposit from "@/Blockchain/hooks/Writes/useWithdrawDeposit";
import SuccessToast from "../uiElements/toasts/SuccessToast";
import SuccessTick from "@/assets/icons/successTick";
import CancelIcon from "@/assets/icons/cancelIcon";
import CancelSuccessToast from "@/assets/icons/cancelSuccessToast";
import Link from "next/link";
import { NativeToken } from "@/Blockchain/interfaces/interfaces";
import { useDispatch } from "react-redux";
import { setTransactionStatus } from "@/store/slices/userAccountSlice";
import { toast } from "react-toastify";
const GetTokensModal = ({
    buttonText,
    coin,
    backGroundOverLay,
    ...restProps
}: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();


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
            default:
                break;
        }
    };


    // useEffect(() => {
    //   getUserLoans("0x05f2a945005c66ee80bc3873ade42f5e29901fc43de1992cd902ca1f75a1480b");
    // }, [])
    // console.log(inputAmount);

    //This Function handles the modalDropDowns

    // console.log(activeModal)



    const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
    const [currentSelectedCoin, setCurrentSelectedCoin] = useState<any>("")
    const {
        token,
        setToken,

        dataGetTokens,
        errorGetTokens,
        resetGetTokens,
        writeGetTokens,
        writeAsyncGetTokens,
        isErrorGetTokens,
        isIdleGetTokens,
        isLoadingGetTokens,
        isSuccessGetTokens,
        statusGetTokens,
    }
=useGetTokens(currentSelectedCoin);
const dispatch=useDispatch();


    const handleGetToken=async()=>{
        try{
            console.log(token)
            const getTokens=await writeAsyncGetTokens();
            console.log(getTokens)
            // dispatch(setTransactionStatus("success"));
        }catch(err){
            console.log(err);
            // dispatch(setTransactionStatus("failed"));
            toast.error(`Failed to mint TestToken: ${currentSelectedCoin}`, {
                position: toast.POSITION.BOTTOM_RIGHT
              });
        }

    }
    





    // const { } = useBalanceOf();
    // const { } = useTransfer();

    return (
        <div>
            <Button onClick={onOpen} {...restProps}>
                {buttonText}
            </Button>
            <Portal>
                <Modal
                    isOpen={isOpen}
                    onClose={() => {
                        onClose();
                        // if (setIsOpenCustom) setIsOpenCustom(false);
                    }}
                    size={{ width: "800px", height: "100px" }}
                    isCentered
                >
                    <ModalOverlay bg={backGroundOverLay} mt="3.8rem" />
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
                            Get Tokens
                        </ModalHeader>
                        <ModalCloseButton
                            // onClick={() => {
                            //   if (setIsOpenCustom) setIsOpenCustom(false);
                            // }}
                            mt="1rem"
                            mr="1rem"
                        />
                        <ModalBody>
                            <Box display="flex" flexDirection="row" justifyContent="space-between" gap="20px">
                            <Button bg="#101216"
                                    color="#6E7681"
                                    size="sm"
                                    width="100%"
                                    mt="1.5rem"
                                    mb="1.5rem"
                                    border="1px solid #8B949E"
                                    _hover={{  bgColor: "white", color: "black" }}
                                    _active={{border:"3px solid grey"}}
                                    onClick={()=>{
                                        setCurrentSelectedCoin("BTC")
                                        setToken("BTC");
                                        handleGetToken();
                                    }}
                                    >wBTC</Button>
                                                                    <Button bg="#101216"
                                    color="#6E7681"
                                    size="sm"
                                    width="100%"
                                    mt="1.5rem"
                                    mb="1.5rem"
                                    border="1px solid #8B949E"
                                    _hover={{  bgColor: "white", color: "black" }}
                                    _active={{border:"3px solid grey"}}
                                    onClick={()=>{
                                        setCurrentSelectedCoin("ETH")
                                        setToken("ETH");
                                        handleGetToken();
                                    }}
                                    >wETH</Button>
                                <Button bg="#101216"
                                    color="#6E7681"
                                    size="sm"
                                    width="100%"
                                    mt="1.5rem"
                                    mb="1.5rem"
                                    border="1px solid #8B949E"
                                    _hover={{  bgColor: "white", color: "black" }}
                                    _active={{border:"3px solid grey"}}
                                    onClick={()=>{
                                        setCurrentSelectedCoin("USDT")
                                        setToken("USDT");
                                        handleGetToken();
                                    }}
                                    >USDT</Button>

                                                                    <Button bg="#101216"
                                    color="#6E7681"
                                    size="sm"
                                    width="100%"
                                    mt="1.5rem"
                                    mb="1.5rem"
                                    border="1px solid #8B949E"
                                    _hover={{  bgColor: "white", color: "black" }}
                                    _active={{border:"3px solid grey"}}
                                    onClick={()=>{
                                        setCurrentSelectedCoin("USDC")
                                        setToken("USDC");
                                        handleGetToken();
                                    }}
                                    >USDC</Button>

                                <Button bg="#101216"
                                    color="#6E7681"
                                    size="sm"
                                    width="100%"
                                    mt="1.5rem"
                                    mb="1.5rem"
                                    border="1px solid #8B949E"
                                    _hover={{  bgColor: "white", color: "black" }}
                                    _active={{border:"3px solid grey"}}
                                    onClick={()=>{
                                        setCurrentSelectedCoin("DAI")
                                        setToken("DAI");
                                        handleGetToken();
                                    }}
                                    >DAI</Button>
                            </Box>
                            <Box display="flex" justifyContent="center" alignItems="center" mt="0.5rem" mb="2rem" bg="#101216" padding="8px" border="1px solid #101216" borderRadius="6px" >
                                <Link href="https://faucet.goerli.starknet.io/" target="_blank">
                                    <Text>Get Eth for free</Text>
                                </Link>
                            </Box>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Portal>
        </div>
    );
};
export default GetTokensModal;

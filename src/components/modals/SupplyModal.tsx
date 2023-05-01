import React, { useState } from 'react'
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
    Portal
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import SliderWithInput from "../uiElements/sliders/sliderWithInput";
const SupplyModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [sliderValue, setSliderValue] = useState(0)
    const [walletBalance, setWalletBalance] = useState(0)
    const [coin, setCoin] = useState("BTC")
    return (
        <div>
            <Button onClick={onOpen}>Open Modal</Button>
            <Portal>
                <Modal isOpen={isOpen} onClose={onClose} isCentered size={{width: "700px", height: "100px"}}>
                    <ModalOverlay
                        bg="rgba(244, 242, 255, 0.5);"
                    />
                    <ModalContent
                        bg="#010409"
                        color="white"
                        borderRadius="md"
                        maxW="480px"
                    >
                        <ModalHeader mt="1rem">Supply</ModalHeader>
                        <ModalCloseButton mt="1rem" mr="1rem" />
                        <ModalBody>
                            <Text color='#0969DA' mb="8px">Supply ID-12345</Text>
                            <Card bg="#101216" mb="0.5rem" p="1.5rem" border="1px solid #6E7681" >
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
                                        <svg width="10" height="10" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5 1.4375C2.75634 1.4375 0.9375 3.25634 0.9375 5.5C0.9375 7.74369 2.75634 9.5625 5 9.5625C7.24369 9.5625 9.0625 7.74369 9.0625 5.5C9.0625 3.25634 7.24369 1.4375 5 1.4375ZM0 5.5C0 2.73857 2.23857 0.5 5 0.5C7.76144 0.5 10 2.73857 10 5.5C10 8.26144 7.76144 10.5 5 10.5C2.23857 10.5 0 8.26144 0 5.5ZM4.0625 5.34375C4.0625 5.08487 4.27237 4.875 4.53125 4.875H5.15625C5.41513 4.875 5.625 5.08487 5.625 5.34375V7.0625H5.78125C6.04013 7.0625 6.25 7.27238 6.25 7.53125C6.25 7.79012 6.04013 8 5.78125 8H4.53125C4.27237 8 4.0625 7.79012 4.0625 7.53125C4.0625 7.27238 4.27237 7.0625 4.53125 7.0625H4.6875V5.8125H4.53125C4.27237 5.8125 4.0625 5.60263 4.0625 5.34375ZM5 4.25C5.34518 4.25 5.625 3.97018 5.625 3.625C5.625 3.27982 5.34518 3 5 3C4.65483 3 4.375 3.27982 4.375 3.625C4.375 3.97018 4.65483 4.25 5 4.25Z" fill="#6A737D" />
                                        </svg>
                                    </Tooltip>
                                </Text>
                                <Button mb="1rem" mt="0.5rem" bg="none" display="flex" justifyContent="space-between" border="1px solid #2B2F35" _hover={{ bg: "#101216" }}>
                                    <Box display="flex" alignItems="center">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.1204 4.33301H4.8501V5.84678H7.22836V8.07174H8.74213V5.84678H11.1204V4.33301Z" fill="#1BA27A" />
                                            <path d="M7.99955 8.30985C6.03217 8.30985 4.43715 7.99849 4.43715 7.61435C4.43715 7.23028 6.03211 6.91885 7.99955 6.91885C9.96692 6.91885 11.5619 7.23028 11.5619 7.61435C11.5619 7.99849 9.96692 8.30985 7.99955 8.30985ZM11.9995 7.7303C11.9995 7.23498 10.2087 6.8335 7.99955 6.8335C5.79047 6.8335 3.99951 7.23498 3.99951 7.7303C3.99951 8.16649 5.38819 8.5299 7.22836 8.61042V11.8044H8.74199V8.61168C10.5963 8.53367 11.9995 8.16874 11.9995 7.7303Z" fill="#1BA27A" />
                                            <circle cx="8" cy="8" r="8" fill="#F7931A" />
                                            <path d="M11.4788 7.22502C11.6244 6.25138 10.8831 5.72801 9.86952 5.37887L10.1983 4.05999L9.3955 3.85994L9.0754 5.1441C8.86433 5.09146 8.64758 5.04186 8.43216 4.99268L8.75458 3.70005L7.95224 3.5L7.62323 4.81845C7.44857 4.77869 7.27702 4.73939 7.11059 4.69797L7.11152 4.69383L6.00438 4.41735L5.79081 5.27484C5.79081 5.27484 6.38646 5.41138 6.3739 5.41978C6.69901 5.50093 6.7578 5.71614 6.74804 5.88672L6.37347 7.38924C6.39586 7.39492 6.4249 7.40315 6.45694 7.41602C6.43016 7.40937 6.40165 7.40211 6.37208 7.39503L5.84707 9.49984C5.80733 9.59862 5.70649 9.74685 5.47919 9.69056C5.48723 9.70222 4.89567 9.54494 4.89567 9.54494L4.49707 10.4639L5.54184 10.7244C5.73621 10.7731 5.92667 10.8241 6.11424 10.8721L5.78202 12.2061L6.58393 12.4061L6.91294 11.0863C7.13201 11.1458 7.34461 11.2006 7.55275 11.2523L7.22485 12.566L8.02773 12.766L8.35992 11.4345C9.72894 11.6936 10.7583 11.5891 11.1916 10.3509C11.5408 9.3539 11.1742 8.77886 10.454 8.40386C10.9786 8.28288 11.3737 7.93786 11.4791 7.22513L11.4788 7.22495L11.4788 7.22502ZM9.64447 9.7972C9.39636 10.7942 7.71778 10.2552 7.17357 10.1201L7.61443 8.35276C8.15862 8.48862 9.90378 8.75747 9.64451 9.7972H9.64447ZM9.89276 7.21057C9.66643 8.11741 8.26933 7.6567 7.81613 7.54373L8.21583 5.94086C8.66904 6.05383 10.1285 6.26468 9.89283 7.21057H9.89276Z" fill="white" />
                                        </svg>
                                        <Text color="white" ml="0.4rem">BTC</Text>
                                    </Box>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.2 6.4001L7.99995 9.6001L4.79995 6.4001" stroke="#E6EDF3" stroke-width="1.37" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </Button>
                                <Box width="100%" color="white" border="1px solid #2B2F35" borderRadius="6px" display="flex" justifyContent="space-between">
                                    <NumberInput border="0px" >
                                        <NumberInputField placeholder='Minimum 0.000678 BTC' border="0px" />
                                    </NumberInput>
                                    <Button variant="ghost" color="#0969DA" _hover={{ bg: "#101216" }}>
                                        MAX
                                    </Button>
                                </Box>
                                <Text color="#E6EDF3" display="flex" justifyContent="flex-end" mt="0.2rem">
                                    Wallet Balance: {walletBalance} {` ${coin}`}
                                </Text>
                                <Box mt="0.3rem">
                                    <SliderWithInput />
                                </Box>
                            </Card>
                            <Checkbox defaultChecked mt="1rem">
                                <Text fontSize="0.65rem" >
                                    Ticking would stake the received rTokens unchecking wouldn't stake rTokens
                                </Text>
                            </Checkbox>

                            <Card bg="#101216" mt="2rem" p="1rem" border="1px solid #6E7681">
                                <Text color="#8B949E" display="flex" justifyContent="space-between" fontSize="0.9rem" mb="0.4rem">
                                    <Text display="flex" alignItems="center" >
                                        <Text mr="0.3rem">
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
                                            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 1.4375C2.75634 1.4375 0.9375 3.25634 0.9375 5.5C0.9375 7.74369 2.75634 9.5625 5 9.5625C7.24369 9.5625 9.0625 7.74369 9.0625 5.5C9.0625 3.25634 7.24369 1.4375 5 1.4375ZM0 5.5C0 2.73857 2.23857 0.5 5 0.5C7.76144 0.5 10 2.73857 10 5.5C10 8.26144 7.76144 10.5 5 10.5C2.23857 10.5 0 8.26144 0 5.5ZM4.0625 5.34375C4.0625 5.08487 4.27237 4.875 4.53125 4.875H5.15625C5.41513 4.875 5.625 5.08487 5.625 5.34375V7.0625H5.78125C6.04013 7.0625 6.25 7.27238 6.25 7.53125C6.25 7.79012 6.04013 8 5.78125 8H4.53125C4.27237 8 4.0625 7.79012 4.0625 7.53125C4.0625 7.27238 4.27237 7.0625 4.53125 7.0625H4.6875V5.8125H4.53125C4.27237 5.8125 4.0625 5.60263 4.0625 5.34375ZM5 4.25C5.34518 4.25 5.625 3.97018 5.625 3.625C5.625 3.27982 5.34518 3 5 3C4.65483 3 4.375 3.27982 4.375 3.625C4.375 3.97018 4.65483 4.25 5 4.25Z" fill="#6A737D" />
                                            </svg>
                                        </Tooltip>
                                    </Text>
                                    <Text>
                                        5.56%
                                    </Text>
                                </Text>
                                <Text color="#8B949E" display="flex" justifyContent="space-between" fontSize="0.9rem" mb="0.4rem">
                                    <Text display="flex" alignItems="center">
                                        <Text mr="0.3rem">
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
                                            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 1.4375C2.75634 1.4375 0.9375 3.25634 0.9375 5.5C0.9375 7.74369 2.75634 9.5625 5 9.5625C7.24369 9.5625 9.0625 7.74369 9.0625 5.5C9.0625 3.25634 7.24369 1.4375 5 1.4375ZM0 5.5C0 2.73857 2.23857 0.5 5 0.5C7.76144 0.5 10 2.73857 10 5.5C10 8.26144 7.76144 10.5 5 10.5C2.23857 10.5 0 8.26144 0 5.5ZM4.0625 5.34375C4.0625 5.08487 4.27237 4.875 4.53125 4.875H5.15625C5.41513 4.875 5.625 5.08487 5.625 5.34375V7.0625H5.78125C6.04013 7.0625 6.25 7.27238 6.25 7.53125C6.25 7.79012 6.04013 8 5.78125 8H4.53125C4.27237 8 4.0625 7.79012 4.0625 7.53125C4.0625 7.27238 4.27237 7.0625 4.53125 7.0625H4.6875V5.8125H4.53125C4.27237 5.8125 4.0625 5.60263 4.0625 5.34375ZM5 4.25C5.34518 4.25 5.625 3.97018 5.625 3.625C5.625 3.27982 5.34518 3 5 3C4.65483 3 4.375 3.27982 4.375 3.625C4.375 3.97018 4.65483 4.25 5 4.25Z" fill="#6A737D" />
                                            </svg>
                                        </Tooltip>
                                    </Text>
                                    <Text>
                                        $ 0.50
                                    </Text>
                                </Text>
                                <Text color="#8B949E" display="flex" justifyContent="space-between" fontSize="0.9rem" mb="0.4rem">
                                    <Text display="flex" alignItems="center">
                                        <Text mr="0.3rem">
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
                                            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 1.4375C2.75634 1.4375 0.9375 3.25634 0.9375 5.5C0.9375 7.74369 2.75634 9.5625 5 9.5625C7.24369 9.5625 9.0625 7.74369 9.0625 5.5C9.0625 3.25634 7.24369 1.4375 5 1.4375ZM0 5.5C0 2.73857 2.23857 0.5 5 0.5C7.76144 0.5 10 2.73857 10 5.5C10 8.26144 7.76144 10.5 5 10.5C2.23857 10.5 0 8.26144 0 5.5ZM4.0625 5.34375C4.0625 5.08487 4.27237 4.875 4.53125 4.875H5.15625C5.41513 4.875 5.625 5.08487 5.625 5.34375V7.0625H5.78125C6.04013 7.0625 6.25 7.27238 6.25 7.53125C6.25 7.79012 6.04013 8 5.78125 8H4.53125C4.27237 8 4.0625 7.79012 4.0625 7.53125C4.0625 7.27238 4.27237 7.0625 4.53125 7.0625H4.6875V5.8125H4.53125C4.27237 5.8125 4.0625 5.60263 4.0625 5.34375ZM5 4.25C5.34518 4.25 5.625 3.97018 5.625 3.625C5.625 3.27982 5.34518 3 5 3C4.65483 3 4.375 3.27982 4.375 3.625C4.375 3.97018 4.65483 4.25 5 4.25Z" fill="#6A737D" />
                                            </svg>
                                        </Tooltip>
                                    </Text>
                                    <Text>
                                        5.56%
                                    </Text>
                                </Text>
                            </Card>
                            <Button bg="#6E7681" size='sm' width="100%" mt="2rem" mb="2rem" border="1px solid #6E7681" >
                                Supply
                            </Button>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Portal>
        </div>
    )
}

export default SupplyModal
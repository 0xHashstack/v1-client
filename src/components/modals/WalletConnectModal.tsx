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
    Box,
    Portal,
} from "@chakra-ui/react";
import {
  useAccount,
  useConnectors,
  useStarknet,
  useBlock,
} from "@starknet-react/core";
import { useContract } from "@starknet-react/core";
import { useDisclosure } from "@chakra-ui/react";
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import BravosIcon from "@/assets/icons/wallets/bravos";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import StarknetLogo from "@/assets/icons/coins/starknet";
import BrowserWalletIcon from "@/assets/icons/wallets/browserwallet";
import EthWalletLogo from "@/assets/icons/coins/ethwallet";
import {
  selectInputSupplyAmount,
  selectWalletBalance,
  setInputSupplyAmount,
} from "@/store/slices/userAccountSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalDropdown,
  selectModalDropDowns,
} from "@/store/slices/dropdownsSlice";
// import {available_reserves} from '../../Blockchain/Web3Intergration/ViewFunctions'
const WalletConnectModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputAmount, setinputAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [currentNetwork, setCurrentNetwork] = useState("Select network");
  const [walletName, setWalletName] = useState("")

  const dispatch = useDispatch();
  const modalDropdowns = useSelector(selectModalDropDowns);
  const walletBalance = useSelector(selectWalletBalance);
  const { account, address, status } = useAccount();
  const { available, disconnect, connect, connectors } = useConnectors();
  // console.log(total_supply)
  // console.log(available_reserves)


  

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
      case "Starknet":
        return <StarknetLogo />;
        break;
      case "Ethereum (Coming soon)":
        return <EthWalletLogo />;
        break;
      default:
        break;
    }
  };

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

  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const networks = [
    { name: "Starknet", status: "enable" },
    { name: "Ethereum (Coming soon)", status: "disable" },
  ];

  return (
    <div>
      <Button
        key="borrow"
        bgColor="#30363d"
        color="#BDBFC1"
        border="1px solid #8b949e"
        borderRadius="6px"
        p="6px 12px"
        _hover={{ bgColor: "#2DA44E", color: "#E6EDF3" }}
        onClick={onOpen}
      >
        Connect Wallet
      </Button>
      <Portal>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />
          <ModalContent
            bg="#010409"
            color="white"
            borderRadius="md"
            maxW="462px"
            zIndex={1}
            mt="5rem"
            className="modal-content"
          >
            <ModalHeader
              mt="1rem"
              fontSize="14px"
              fontWeight="600"
              fontStyle="normal"
              lineHeight="20px"
            >
              Connect a wallet
            </ModalHeader>
            <ModalCloseButton mt="1rem" mr="1rem" />
            <ModalBody>
              <Card
                bg="#101216"
                mb="0.5rem"
                p="1rem"
                border="1px solid #2B2F35"
              >
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
                  onClick={() => handleDropdownClick("walletConnectDropDown")}
                >
                  <Box display="flex" gap="1">
                    {currentNetwork != "Select network" && (
                      <Box p="1">{getCoin(currentNetwork)}</Box>
                    )}
                    <Text color="white" p="1">
                      {currentNetwork}
                    </Text>
                  </Box>

                                    <Box pt="1" className="navbar-button">
                                        <DropdownUp />
                                    </Box>
                                    {modalDropdowns.walletConnectDropDown && (
                                        <Box
                                            w="full"
                                            left="0"
                                            bg="#03060B"
                                            py="2"
                                            className="dropdown-container"
                                            boxShadow="dark-lg"
                                        >
                                            {networks.map((network, index) => {
                                                return (
                                                    <Button
                                                        // as="button"
                                                        key={index}
                                                        w="full"
                                                        m="0"
                                                        pl="0"
                                                        display="flex"
                                                        alignItems="center"
                                                        gap="1"
                                                        pr="2"
                                                        bg="inherit"
                                                        onClick={() => {
                                                            setCurrentNetwork(network.name);
                                                        }}
                                                        fontSize="sm"
                                                        _hover={{ background: "inherit" }}
                                                        isDisabled={network.status === "disable"}
                                                    >
                                                        {network.name === currentNetwork && (
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
                                                            px={`${network.name === currentNetwork
                                                                ? "1"
                                                                : "5"
                                                                }`}
                                                            gap="1"
                                                            bg={`${network.name === currentNetwork
                                                                ? "#0C6AD9"
                                                                : "inherit"
                                                                }`}
                                                            borderRadius="md"
                                                        >
                                                            <Box p="1">{getCoin(network.name)}</Box>
                                                            <Text pt="1" color={
                                                                `${network.status == "enable" ? "white" : "#8C8C8C"}`
                                                            }>{network.name}</Text>
                                                        </Box>
                                                    </Button>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </Box>
                                <Box
                                    w="full"
                                    backgroundColor="#101216"
                                    py="2"
                                    border="1px solid #2B2F35"
                                    borderRadius="6px"
                                    gap="3px"
                                    display="flex"
                                    justifyContent="space-between"
                                    cursor="pointer"
                                >
                                    <Text ml="1rem" color="white">
                                        Bravos Wallet
                                    </Text>
                                    <Box p="1" mr="16px">
                                        <BravosIcon />

                                    </Box>
                                </Box>
                                <Box
                                    w="full"
                                    backgroundColor="#101216"
                                    py="2"
                                    border="1px solid #2B2F35"
                                    borderRadius="6px"
                                    gap="3px"
                                    mt="1rem"
                                    display="flex"
                                    justifyContent="space-between"
                                    cursor="pointer"
                                >
                                    <Text ml="1rem" color="white">
                                        Connect browser wallet
                                    </Text>
                                    <Box p="1" mr="16px">
                                        <BrowserWalletIcon />

                                    </Box>
                                </Box>
                            </Card>
                            <Box display="flex" flexDirection="row" fontSize="12px" lineHeight="30px" fontWeight="400" >
                                <Text>
                                    Don&apos;t have a supporting wallet.
                                    <Button variant="unstyled" color="#2563EB" fontSize="12px" ml="0.3rem" >
                                        Download bravos from here

                                    </Button>
                                </Text>
                            </Box>
                            <Box display="inline-flex" alignItems="center" fontSize="14px" lineHeight="22px" fontWeight="400">
                                <Text fontSize="14px" lineHeight="22px" fontWeight="400">
                                    By connecting your wallet, you agree to Hashstack&apos;s 
                                </Text>
                                <Button display="inline" variant="unstyled" color="#2563EB" fontSize="14px" marginLeft="4px">
                                    terms of
                                </Button>
                            </Box>
                            <Button display="inline" variant="unstyled" color="#2563EB" fontSize="14px" mt="-10px">
                            service & disclaimer
                                </Button>

              <Box mt="0.4rem" display="flex" flexDirection="column" pb="32px">
                <Text
                  fontSize="10px"
                  lineHeight="18px"
                  fontWeight="400"
                  color="#8C8C8C"
                >
                  This mainnet is currently in alpha with limitations on the
                  maximum supply & borrow amount. This is done in consideration
                  of the current network and liquidity constraints of the
                  Starknet. We urge the users to use the dapp with caution.
                  Hashstack will not cover any accidental loss of user funds.
                </Text>
                <Text
                  fontSize="10px"
                  lineHeight="18px"
                  fontWeight="400"
                  color="#8C8C8C"
                  mt="1rem"
                >
                  Wallets are provided by External Providers and by selecting
                  you agree to Terms of those Providers. Your access to the
                  wallet might be reliant on the External Provider being
                  operational.
                </Text>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </div>
  );
};
export default WalletConnectModal;

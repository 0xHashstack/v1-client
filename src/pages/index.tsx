import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Navbar from '@/components/Navbar'
import { Box, Text, Card, Skeleton, Button } from '@chakra-ui/react'
import Link from 'next/link'
// import 
import { useEffect, useState } from 'react'
import { useConnectors } from '@starknet-react/core'
import BravosIcon from '@/assets/bravosIcon'
import { useRouter } from 'next/router'
import { ConnectKitButton, useModal } from 'connectkit'
import { useAccount, useConnect } from "wagmi";
import WalletConnectIcon from '@/assets/walletConnectIcon'
import MetamaskIcon from '@/assets/metamaskIcon'
import CoinbaseIcon from '@/assets/coinbaseIcon'
import BlueInfoIcon from '@/assets/blueinfoIcon'
const inter = Inter({ subsets: ['latin'] })
import { ethers,JsonRpcProvider,JsonRpcApiProvider,BrowserProvider, InfuraProvider } from 'ethers'

export default function Home() {
  const [availableDataLoading, setAvailableDataLoading] = useState(true);
  const { address, isConnecting, isDisconnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  console.log("dd",address)
  const [currentAccount, setCurrentAccount] = useState("")

  const { open, setOpen } = useModal()
  // useEffect(()=>{
  //   setOpen(true)
  // },[])
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAvailableDataLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, []);
  // useEffect(() => {
  //   const interval = setInterval(refresh, 200);
  //   return () => clearInterval(interval);
  // }, [refresh]);
  useEffect(()=>{
    const connectWallet=async()=>{
      console.log("Address is ",address,"");

      if (address) {
      
        console.log("ll",address);
        let provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_JSONRPC_WALLET,'mainnet');
        let balance=await provider.getBalance(address)
        console.log("balance s",balance>50)
        if(balance>0.0048){
          router.push("/form");
        }
      }
      
    }
    if(address ){
      connectWallet()
    }
  },[address])
  useEffect(() => {
    // const connectWallet=async()=>{
    //   console.log("Address is ",address,";");
    //   if (address) {
    //     // const accounts: string[] = await window.ethereum.request({
    //     //   method: "eth_requestAccounts",
    //     // });
    //     // setCurrentAccount(accounts[0]);
    //     console.log(currentAccount,accounts);

    //     let balance=await provider.getBalance(address)
    //     console.log("balance s",balance>50)
    //     if(balance>0.0048){
    //       router.push("/form");
    //     }
    //   }
    // }
    // alert(status)
    // const storedAccount = localStorage.getItem("account");
    const hasVisited = localStorage.getItem("visited");
    const walletConnected = localStorage.getItem("lastUsedConnector");
    localStorage.setItem("transactionCheck", JSON.stringify([]));
    console.log(walletConnected);
    if (walletConnected == "braavos") {
      // disconnect();
      // connect(connectors[0]);
      if (!address) {
        return;
      } else {
        router.replace("/form");
      }
      // dispatch(setTransactionRefresh("reset"));
    } else if (walletConnected == "argentX") {
      // disconnect();
      // connect(connectors[1]);
      if (!address) {
        return;
      } else {
        router.replace("/form");
      }
      // dispatch(setTransactionRefresh("reset"));
    } else {
      // connectWallet();
      return
    }
    if (walletConnected) {
      // connectWallet()
      localStorage.setItem("connected", walletConnected);
    }
    if (!hasVisited) {
      // Set a local storage item to indicate the user has visited
      localStorage.setItem("visited", "true");
    }
    // if (storedAccount) {
    //   router.push('./market')
    // }



    // if (!isWhiteListed) {
    //   router.replace(whitelistHref);
    // } else if (isWaitListed) {
    //   router.replace(waitlistHref);
    // }
    // {
    //   router.replace(marketHref2);
    // }

    // console.log("account home", address, status);
  }, []);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#191922"
      height="100vh"
    >
      {/* <PageCard
      justifyContent="center"
      alignItems="center"
      backgroundColor="#191922"
      height="100vh"
    > */}

      <Box
        display="flex"
        background="#02010F"
        flexDirection="column"
        alignItems="flex-start"
        padding="32px"
        width="462px"
        // height="567px"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
        borderRadius="8px"
      // bgColor="red"
      >
        <Text color="#fff">Connect a wallet</Text>
        <Card
          p="1rem"
          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          width="400px"
          mt="8px"
        >
                          <Box
                  // display="flex"
                  // justifyContent="left"
                  w="100%"
                  // pb="4"
                  height="64px"
                  display="flex"
                  alignItems="center"
                  mb="1rem"
                >
                  <Box
                    display="flex"
                    bg="#222766"
                    color="#F0F0F5"
                    fontSize="12px"
                    p="4"
                    border="1px solid #3841AA"
                    fontStyle="normal"
                    fontWeight="400"
                    lineHeight="18px"
                    borderRadius="6px"
                    // textAlign="center"
                  >
                    <Box pr="3" mt="0.5" cursor="pointer">
                      <BlueInfoIcon />
                    </Box>
                    Your wallet should have more than $50 as balance in ethereum.
                    {/* <Box
                                py="1"
                                pl="4"
                                cursor="pointer"
                                // onClick={handleClick}
                              >
                                <TableClose />
                              </Box> */}
                  </Box>
                </Box>
          {connectors.map((connector: any) => (
            <Box
              w="full"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              py="2"
              borderRadius="6px"
              gap="3px"
              display="flex"
              justifyContent="space-between"
              cursor="pointer"
              mb="16px"
              // onClick={() => router.push("/market")}
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              <Box ml="1rem" color="white">
                {availableDataLoading ? (
                  <Skeleton
                    width="6rem"
                    height="1.4rem"
                    startColor="#101216"
                    endColor="#2B2F35"
                    borderRadius="6px"
                  />
                ) : connector.id == "metaMask" ?
                  "MetaMask"
                  : (
                    connector.id == "coinbaseWallet" ?
                      "Coinbase" : "Wallet Connect"
                  )}
              </Box>
              <Box p="1" mr="16px">
                {connector.id == "metaMask"
                  ? <MetamaskIcon /> : connector.id == "coinbaseWallet" ? <CoinbaseIcon /> : <WalletConnectIcon />
                }

              </Box>
            </Box>
          ))}
        </Card>
        <Box
          display="flex"
          flexDirection="row"
          fontSize="12px"
          lineHeight="30px"
          fontWeight="400"
          mt="16px"
        ></Box>
        <Box
          alignItems="center"
          fontSize="14px"
          lineHeight="22px"
          fontWeight="400"
          mt="8px"
        >
          <Text fontSize="14px" lineHeight="22px" fontWeight="400" color="#fff">
            By connecting your wallet, you agree to Hashstack&apos;s
          </Text>
          <Button
            variant="link"
            fontSize="14px"
            display="inline"
            color="#4D59E8"
            cursor="pointer"
            lineHeight="22px"
          >
            terms of service & disclaimer
          </Button>
        </Box>

        <Box
          mt="16px"
          display="flex"
          flexDirection="column"
        // pb="32px"
        // bgColor="blue"
        >
          <Text
            fontSize="12px"
            lineHeight="18px"
            fontWeight="400"
            color="#3E415C"
          >
            {/* This mainnet is currently in alpha with limitations on the maximum
            supply & borrow amount. This is done in consideration of the current
            network and liquidity constraints of the Starknet. We urge the users
            to use the dapp with caution. Hashstack will not cover any
            accidental loss of user funds. */}
            Wallets are provided by External Providers and by selecting you
            agree to Terms of those Providers. Your access to the wallet might
            be reliant on the External Provider being operational.
          </Text>
          <Text
            fontSize="12px"
            lineHeight="18px"
            fontWeight="400"
            color="#3E415C"
            mt="1rem"
          >
            We urge the users to use the dapp with caution. Hashstack will not
            cover any accidental loss of user funds.
          </Text>
        </Box>
      </Box>
      {/* </PageCard> */}
    </Box>
  )
}

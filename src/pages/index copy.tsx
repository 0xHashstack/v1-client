import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Navbar from '@/components/Navbar'
import { Box,Text,Card, Skeleton, Button } from '@chakra-ui/react'
import Link from 'next/link'
// import 
import { useEffect, useState } from 'react'
import {  useConnectors } from '@starknet-react/core'
import BravosIcon from '@/assets/bravosIcon'
import { useRouter } from 'next/router'
import { ConnectKitButton,useModal } from 'connectkit'
import { useAccount } from "wagmi";
const inter = Inter({ subsets: ['latin'] })
import { ethers,JsonRpcProvider,BrowserProvider } from 'ethers'

export default function Home() {
    const [availableDataLoading, setAvailableDataLoading] = useState(true);
    const [currentAccount, setCurrentAccount] = useState("")
    const { address, isConnecting, isDisconnected } = useAccount();
    const {open,setOpen}=useModal()
    const [provider, setProvider] = useState({})

    // useEffect(() => {
    //   if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    //     // let provider =;
    //     setProvider( new JsonRpcProvider(window.ethereum));
    //     // other stuff using provider here
    // }
    // }, []);
    // useEffect(()=>{
    //   setOpen(true)
    // },[])
    // console.log(address,"address")

    const router=useRouter();
    const { available, disconnect, connect, connectors, refresh } =
    useConnectors();
    useEffect(() => {
        const timeout = setTimeout(() => {
          setAvailableDataLoading(false);
        }, 600);
    
        return () => clearTimeout(timeout);
      }, []);
      useEffect(() => {
        const interval = setInterval(refresh, 200);
        return () => clearInterval(interval);
      }, [refresh]);
      useEffect(() => {
        const connectWallet=async()=>{
          if ((window.ethereum )) {
            const accounts: string[] = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0]);
            console.log(currentAccount,accounts);
            const provider = new BrowserProvider(window.ethereum);
            let balance=await provider.getBalance(accounts[0])
            console.log("balance s",balance)

          }
          
        }
        // alert(status)
        // const storedAccount = localStorage.getItem("account");
        const hasVisited = localStorage.getItem("visited");
        const walletConnected = localStorage.getItem("lastUsedConnector");
        localStorage.setItem("transactionCheck", JSON.stringify([]));
        if (walletConnected == "braavos") {
            disconnect();
            connect(connectors[0]);
          if(!address){
            return;
          }else{
            router.replace("/form");
          }
          // dispatch(setTransactionRefresh("reset"));
        } else if (walletConnected == "argentX") {
            disconnect();
            connect(connectors[1]);
          if(!address){
            return;
          }else{
              router.replace("/form");
          }
          // dispatch(setTransactionRefresh("reset"));
        }else{
         
          connectWallet();
        
          return;
        }
        
        if (walletConnected) {
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
              <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        return (
          <Button onClick={show} 
          w="full"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              py="2"
              background="transparent"
              borderRadius="6px"
              gap="3px"
              display="flex"
              color="white"
              fontStyle="normal"
              fontWeight="300"
              justifyContent="space-between"
              cursor="pointer"
              _active={{
                background:"transparent"
              }}
              _hover={{
                background:"transparent"
              }}
          >
            {isConnected ? address : "Connect Wallet"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
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

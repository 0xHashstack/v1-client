import { Box, HStack, Skeleton, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AccountInterface, ProviderInterface } from "starknet";
import { useAccount, useBlockNumber } from "@starknet-react/core";
import { useDispatch, useSelector } from "react-redux";

import { setBlock,selectBlock,setCurrentNetwork,selectCurrentNetwork } from "@/store/slices/readDataSlice";
interface ExtendedAccountInterface extends AccountInterface {
  provider?: {
    chainId: string;
  };
}
const Footer = () => {
  const { account,connector } = useAccount();
  const { data: block } = useBlockNumber({
    refetchInterval: 10000,
  });
  const extendedAccount = account as ExtendedAccountInterface;
  // const [walletConnected, setwalletConnected] = useState<any>()
  // useEffect(()=>{
  //   const walletConnected=localStorage.getItem('lastUsedConnector');
  //   setwalletConnected(walletConnected);
  // },[account])
  
  
  const currentBlock = useSelector(selectBlock);
  const currentChainId = useSelector(selectCurrentNetwork);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!currentBlock || currentBlock < (block ? block : -1)) {
      dispatch(setBlock(block));
    }
  }, [block]);
  // console.log(extendedAccount?.provider?.chainId,"footer")
  // console.log(walletConnected);
  useEffect(() => {
    if(connector?.options?.id == "braavos"){
      if (account && account?.chainId && account?.chainId != currentChainId) {
        dispatch(setCurrentNetwork(account?.chainId));
      }
    }else if(connector?.options?.id == "argentX"){
      if(extendedAccount && extendedAccount?.provider?.chainId && extendedAccount.provider?.chainId!=currentChainId){
        dispatch(setCurrentNetwork(extendedAccount?.provider?.chainId));
      }
    }
  }, [account?.chainId,extendedAccount?.provider?.chainId]);
  return (
    <HStack
      zIndex="14"
      position="fixed"
      bottom="0"
      // backgroundColor="#161B22"
      bgColor="#010409"
      width="100vw"
      boxShadow="rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      color="#FFF"
      height="2rem"
      // bgColor="red"
      borderY="1px solid #2B2F35"
    >
      <HStack height="100%">
        <Link href={"https://status.hashstack.finance/"} target="_blank">
          <HStack borderRight="1px solid #2B2F35" h="100%" p="8px 3.9rem">
            <Box>
              <Image
                src="/stableConnectionIcon.svg"
                alt="Picture of the author"
                width={10}
                height={10}
              />
            </Box>
            <Text color="#04C78A" fontSize="12px">
              Stable Connection
            </Text>
          </HStack>
        </Link>
        <HStack borderRight="1px solid #2B2F35" h="100%" p="8px 2rem">
          <Text color="#BDBFC1" fontSize="12px">
            Latest Synced block:
          </Text>
          <Box
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={1}
          >
            <Box color="#2EA043" fontSize="12px">
              {currentBlock || (
                <Skeleton
                  width="3rem"
                  height="0.8rem"
                  startColor="#101216"
                  endColor="#2B2F35"
                  borderRadius="6px"
                  // mt="4px"
                />
              )}
            </Box>
            <Image
              src="/latestSyncedBlockGreenDot.svg"
              alt="Picture of the author"
              width="6"
              height="6"
            />
          </Box>
        </HStack>
        <HStack borderRight="1px solid #2B2F35" h="100%" p="8px 2rem">
          <Box color="#BDBFC1" fontSize="12px" display="flex">
            Network:
            {currentChainId === "0x534e5f474f45524c49" ? (
              " Starknet Goerli"
            ) : currentChainId == "0x534e5f474f45524c4932" ? (
              " Starknet Goerli 2"
            ) : currentChainId == "0x534e5f4d41494e" ? (
              " Starknet Mainnet"
            ) : (
              <Skeleton
                width="4rem"
                height="0.8rem"
                startColor="#101216"
                endColor="#2B2F35"
                borderRadius="6px"
                ml={2}
              />
            )}
          </Box>
          <Box
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={1}
          >
            <Image
              src="/latestSyncedBlockGreenDot.svg"
              alt="Picture of the author"
              width="6"
              height="6"
            />
          </Box>
        </HStack>
      </HStack>
      <HStack>
        <HStack borderX="1px solid #2B2F35" h="100%" p="8px 2rem">
          <Text color="#BDBFC1" fontSize="12px">
            Announcement
          </Text>
        </HStack>
        <HStack borderRight="1px solid #2B2F35" h="100%" p="8px 2rem">
          <Text color="#BDBFC1" fontSize="12px">
            Dummy copy
          </Text>
        </HStack>
      </HStack>
    </HStack>
  );
};

export default Footer;

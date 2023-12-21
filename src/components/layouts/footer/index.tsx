import { Box, HStack, Skeleton, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AccountInterface, BlockNumber, ProviderInterface } from "starknet";
import { useAccount, useBlockNumber, useNetwork } from "@starknet-react/core";
import { useDispatch, useSelector } from "react-redux";

import {
  setBlock,
  selectBlock,
  setCurrentNetwork,
  selectCurrentNetwork,
} from "@/store/slices/readDataSlice";
interface ExtendedAccountInterface extends AccountInterface {
  provider?: {
    chainId: string;
  };
}
const Footer = () => {
  const { account, connector } = useAccount();
  const { data:block, isLoading, isError } = useBlockNumber({
    blockIdentifier: 'latest' as BlockNumber
  })
  console.log(block,'block')
  // const [walletConnected, setwalletConnected] = useState<any>()
  // useEffect(()=>{
  //   const walletConnected=localStorage.getItem('lastUsedConnector');
  //   setwalletConnected(walletConnected);
  // },[account])
  const extendedAccount = account as ExtendedAccountInterface;
  const currentBlock = useSelector(selectBlock);
  const currentChainId = useSelector(selectCurrentNetwork);
  const dispatch = useDispatch();
  const { chain } = useNetwork()
  useEffect(() => {
    if (!currentBlock || currentBlock < (block ? block : -1)) {
      dispatch(setBlock(block));
    }
  }, [block]);
  ////console.log(extendedAccount?.provider?.chainId,"footer")
  ////console.log(walletConnected);
  return (
    <HStack
      zIndex="14"
      position="fixed"
      bottom="0"
      // backgroundColor="#161B22"
      bgColor="#02010F"
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
            <Text color="#00D395" fontSize="12px">
              Stable Connection
            </Text>
          </HStack>
        </Link>
        <HStack borderRight="1px solid #2B2F35" h="100%" p="8px 2rem">
          <Text color="#676D9A" fontSize="12px">
            Latest Synced block:
          </Text>
          <Box
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={1}
          >
            <Box color="#00D395" fontSize="12px">
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
   
      </HStack>
      <HStack borderLeft="1px solid #2B2F35" h="100%" p="8px 2rem">
          <Box color="#676D9A" fontSize="12px" display="flex">
            Network:
            {chain?.network === "goerli" ? (
              " Starknet Goerli"
            ) : chain?.network==="mainnet" ? (
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
      {/* <HStack>
        <HStack
          borderX="1px solid #2B2F35"
          h="100%"
          p="8px 2rem"
          cursor="pointer"
        >
          <Text color="#BDBFC1" fontSize="12px">
            Announcement
          </Text>
        </HStack>
        <HStack borderRight="1px solid #2B2F35" h="100%" p="8px 2rem">
          <Text color="#BDBFC1" fontSize="12px">
            Dummy copy
          </Text>
        </HStack>
      </HStack> */}
    </HStack>
  );
};

export default Footer;

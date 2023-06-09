import { Box, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const Footer = ({ block }: { block: number }) => {
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
        <HStack borderRight="1px solid #2B2F35" h="100%" p="8px 3.9rem">
          <Box>
            <Image
              src="./stableConnectionIcon.svg"
              alt="Picture of the author"
              width={10}
              height={10}
            />
          </Box>
          <Text color="#04C78A" fontSize="12px">
            Stable Connection
          </Text>
        </HStack>
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
            <Text color="#2EA043" fontSize="12px">
              {block}
            </Text>
            <Image
              src="latestSyncedBlockGreenDot.svg"
              alt="Picture of the author"
              width="6"
              height="6"
            />
          </Box>
        </HStack>
        <HStack borderRight="1px solid #2B2F35" h="100%" p="8px 2rem">
          <Text color="#BDBFC1" fontSize="12px">
            Network: Etherum Goreli
          </Text>
          <Box
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={1}
          >
            <Image
              src="latestSyncedBlockGreenDot.svg"
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

import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const LatestSyncedBlock = ({
  width,
  height,
  block,
}: {
  width: string;
  height: string;
  block: number;
}) => {
  return (
    <Box
      // bgColor={"red"}
      // height="100%"
      // height={height}
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      border="1px solid #24282e"
      borderRadius="6px"
      padding="9px 17px"
    >
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
    </Box>
  );
};
export default LatestSyncedBlock;

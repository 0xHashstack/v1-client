import React from "react";
import { HStack, VStack, Text, Box } from "@chakra-ui/react";
import Image from "next/image";
import numberFormatter from "@/utils/functions/numberFormatter";
const Stats = ({
  header,
  onclick,
  statsData,
}: {
  header: string[];
  statsData: any[];
  onclick: () => void;
}) => {
  const gap: number = 100 / (header.length + 1);
  return (
    <HStack
      w="49%"
      h="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="#101216"
      color="#e6edf3"
      paddingLeft="2.2rem"
      boxShadow="px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409"
      border="1px solid #2B2F35"
      borderRadius="8px"
      //   minW="600px"
      //   flexGrow={1}
      //   marginBottom="3resm"
    >
      {header.map((val: string, idx: number) => {
        return (
          <VStack
            key={idx}
            h="100%"
            w={`${gap}%`}
            justifyContent="center"
            alignItems="flex-start"
            // backgroundColor={"red"}
          >
            <Text color="#6e7681" fontSize={14}>
              {val}
            </Text>
            <Text color="#E6EDF3" fontSize="20px">
              {val == "Net APR" || val == "Avg. asset utillization"
                ? statsData[idx] + "%"
                : "$" + numberFormatter(statsData[idx])}
            </Text>
          </VStack>
        );
      })}
      <Box
        // w={`${gap / 2}%`}
        display="flex"
        justifyContent="flex-end"
        paddingRight={2}
        onClick={onclick}
      >
        <Image
          src="./statsIcon.svg"
          alt="Navbar Logo"
          style={{
            marginRight: "24px",
            cursor: "pointer",
            zIndex: "2",
          }}
          height={24}
          width={24}
          // onClick={() => {
          //   toggleCustom("8");
          // }}
        />
      </Box>
    </HStack>
  );
};

export default Stats;

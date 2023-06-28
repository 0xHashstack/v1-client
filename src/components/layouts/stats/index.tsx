import React from "react";
import { HStack, VStack, Text, Box, Skeleton } from "@chakra-ui/react";
import Image from "next/image";
import numberFormatter from "@/utils/functions/numberFormatter";
const Stats = ({
  header,
  onclick,
  statsData,
}: {
  header: string[];
  statsData: Object;
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
      {Object?.entries(statsData).map(([key, value], idx) => {
        return (
          <VStack
            key={key}
            h="100%"
            w={`${gap}%`}
            justifyContent="center"
            alignItems="flex-start"
            // backgroundColor={"red"}
          >
            <Text color="#6e7681" fontSize={14}>
              {header[idx]}
            </Text>
            <Box color="#E6EDF3" fontSize="20px">
              {!value ? (
                <Skeleton
                  width="6rem"
                  height="1.9rem"
                  startColor="#101216"
                  endColor="#2B2F35"
                  borderRadius="6px"
                />
              ) : header[idx] == "Net APR" ||
                header[idx] == "Avg. asset utillization" ? (
                value + "%"
              ) : (
                "$" + numberFormatter(value)
              )}
            </Box>
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
          src="/statsIcon.svg"
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

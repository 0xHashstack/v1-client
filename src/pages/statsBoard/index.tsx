import React from "react";
import { Flex, HStack, VStack } from "@chakra-ui/react";
import Stats from "@/components/layouts/stats";
const StatsBoard = () => {
  return (
    <Flex
      display="flex"
      flexDirection="column"
      mt="3rem"
      h="8rem"
      w="95%"
      flexWrap="wrap"
      marginBottom="3rem"
      // backgroundColor="#101216"
    >
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        h="100%"
        // bg="#101216"
        flexWrap="wrap"
      >
        <Stats
          header={["Your networth", "Your Supply", "Your borrow", "Net APR"]}
        />
        <Stats
          header={[
            "Total reserves",
            "Available reserves",
            "Avg. asset utillization",
          ]}
        />
      </HStack>
    </Flex>
  );
};

export default StatsBoard;

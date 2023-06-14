import React, { memo } from "react";
import { Flex, HStack, VStack } from "@chakra-ui/react";
import Stats from "@/components/layouts/stats";
import { useRouter } from "next/router";
const StatsBoard = () => {
  const router = useRouter();
  const handleRouteChange = (path: string) => {
    router.push(path);
  };
  const protocolReserves = {
    totalReserves: 531025.0,
    availableReserves: 53104.0,
    avgAssetUtilisation: 53.1, // weighted avg of all the utilisations of markets
  };
  const userStats = {
    netWorth: 8392.14, // current values of loans - total borrow + total supply
    yourSupply: 5536.83, // usd terms
    yourBorrow: 536.83, // usd terms
    netSupplyAPR: 15.5, // usd terms
  };
  return (
    <Flex
      display="flex"
      flexDirection="column"
      // mt="2rem"
      h="6.4rem"
      w="95%"
      flexWrap="wrap"
      marginBottom="4rem"
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
          statsData={userStats}
          onclick={() => {
            handleRouteChange("/your-metrics");
          }}
        />
        <Stats
          header={[
            "Total reserves",
            "Available reserves",
            "Avg. asset utillization",
          ]}
          statsData={protocolReserves}
          onclick={() => {
            handleRouteChange("/protocol-metrics");
          }}
        />
      </HStack>
    </Flex>
  );
};

export default memo(StatsBoard);

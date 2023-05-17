import React, { memo } from "react";
import { Flex, HStack, VStack } from "@chakra-ui/react";
import Stats from "@/components/layouts/stats";
import { useRouter } from "next/router";
const StatsBoard = () => {
  const router = useRouter();
  const handleRouteChange = (path: string) => {
    router.push(path);
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
          statsData={[8392.14, 5536.83, 536.83, 15.5]}
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
          statsData={[531025.0, 53104.0, 53.1]}
          onclick={() => {
            handleRouteChange("/protocol-metrics");
          }}
        />
      </HStack>
    </Flex>
  );
};

export default memo(StatsBoard);

import React, { memo, useEffect, useState } from "react";
import { Flex, HStack, VStack } from "@chakra-ui/react";
import Stats from "@/components/layouts/stats";
import { useRouter } from "next/router";
import { getProtocolReserves } from "@/Blockchain/scripts/protocolStats";
import { getUserReserves } from "@/Blockchain/scripts/userStats";
import { IProtocolReserves } from "@/Blockchain/interfaces/interfaces";
import { useAccount } from "@starknet-react/core";
import { useSelector } from "react-redux";
import { selectProtocolReserves } from "@/store/slices/userAccountSlice";
const StatsBoard = () => {
  const { address } = useAccount();
  const router = useRouter();
  const handleRouteChange = (path: string) => {
    router.push(path);
  };
  // const [protocolReserves, setProtocolReserves] = useState<IProtocolReserves>({
  //   totalReserves: null,
  //   availableReserves: null,
  //   avgAssetUtilisation: null, // weighted avg of all the utilisations of markets
  // });
  const protocolReserves = useSelector(selectProtocolReserves);
  const [userStats, setUserStats] = useState({
    netWorth: 8392.14, // current values of loans - total borrow + total supply
    yourSupply: 5536.83, // usd terms
    yourBorrow: 536.83, // usd terms
    netSupplyAPR: 15.5, // usd terms
  });
  // useEffect(() => {
  //   try {
  //     const fetchProtocolStats = async () => {
  //       const reserves = await getProtocolReserves();
  //       console.log("protocol reserves", reserves);
  //       setProtocolReserves(reserves);
  //     };
  //     fetchProtocolStats();
  //   } catch (err) {
  //     console.log("error fetching protocol reserves ", err);
  //   }
  // }, []);
  // useEffect(() => {
  //   try {
  //     const fetchUserStats = async () => {
  //       const reserves = await getUserReserves(address);
  //       console.log("user reserves", reserves);
  //       setUserStats(reserves);
  //     };
  //     fetchUserStats();
  //   } catch (err) {
  //     console.log("error fetching user stats ", err);
  //   }
  // }, []);

  // const protocolReserves = {
  //   totalReserves: 531025.0,
  //   availableReserves: 53104.0,
  //   avgAssetUtilisation: 53.1, // weighted avg of all the utilisations of markets
  // };
  // const userStats = {
  //   netWorth: 8392.14, // current values of loans - total borrow + total supply
  //   yourSupply: 5536.83, // usd terms
  //   yourBorrow: 536.83, // usd terms
  //   netSupplyAPR: 15.5, // usd terms
  // };
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
            handleRouteChange("/v1/your-metrics");
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
            handleRouteChange("/v1/protocol-metrics");
          }}
        />
      </HStack>
    </Flex>
  );
};

export default memo(StatsBoard);

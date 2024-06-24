import { Flex, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { memo } from "react";
import { useSelector } from "react-redux";

import Stats from "@/components/layouts/stats";
import {
  selectNetAPR,
  selectNetWorth,
  selectProtocolReserves,
  selectYourBorrow,
  selectYourSupply,
} from "@/store/slices/readDataSlice";

const StatsBoard: React.FC = () => {
  const router = useRouter();
  const protocolReserves = useSelector(selectProtocolReserves);
  const netWorth = useSelector(selectNetWorth);
  const yourSupply = useSelector(selectYourSupply);
  const yourBorrow = useSelector(selectYourBorrow);
  const netAPR = useSelector(selectNetAPR);

  const handleRouteChange = (path: string) => {
    router.push(path);
  };

  return (
    <Flex
      display="flex"
      flexDirection="column"
      h="6.4rem"
      w="95%"
      flexWrap="wrap"
      marginBottom="6"
    >
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        h="100%"
        flexWrap="wrap"
      >
        <Stats
          header={["Your Net Worth", "Your Supply", "Your Borrow", "Net APR"]}
          statsData={[netWorth, yourSupply, yourBorrow, netAPR]}
          onclick={() => {
            handleRouteChange("/v1/your-metrics");
          }}
          arrowHide={false}
        />
        <Stats
          header={[
            "Total Reserves",
            "Available Reserves",
            "Avg. Asset Utillization",
          ]}
          statsData={protocolReserves}
          onclick={() => {
            handleRouteChange("/v1/protocol-metrics");
          }}
          arrowHide={true}
        />
      </HStack>
    </Flex>
  );
};

export default memo(StatsBoard);

import React from "react";
import { Box } from "@chakra-ui/react";
import AssetUtilizationChart from "../charts/AssetUtilization";
import AssetUtilizationRateChart from "../charts/AssetUtilizationRate";
import SupplyAprChart from "../charts/SupplyApr";
import BorrowAprChart from "../charts/BorrowApr";
import YourMetricsSupply from "./YourMetricsSupply";
import YourMetricsBorrow from "./YourMetricsBorrow";
const YourMetricsSupplyBorrow = ({ currentMarketCoin }: any) => {
  const series1: any = {
    BTC: [
      {
        name: "Series 1",
        data: [30000, 40000, 60000, 80000, 35000, 50000, 49000],
      },
    ],
    USDT: [
      {
        name: "Series 1",
        data: [50000, 49000, 60000, 80000, 30000, 40000, 35000],
      },
    ],
    USDC: [
      {
        name: "Series 1",
        data: [12300, 40000, 35000, 55000, 49000, 64340, 80000],
      },
    ],
    ETH: [
      {
        name: "Series 1",
        data: [30000, 40000, 15000, 50000, 12300, 60000, 80000],
      },
    ],
    DAI: [
      {
        name: "Series 1",
        data: [30000, 40000, 12300, 50000, 49800, 60000, 80000],
      },
    ],
  };

  const series2: any = {
    BTC: [
      {
        name: "Series 1",
        data: [30000, 40000, 12300, 50000, 49800, 60000, 80000],
      },
    ],
    USDT: [
      {
        name: "Series 1",
        data: [12300, 40000, 35000, 55000, 49000, 64340, 80000],
      },
    ],
    USDC: [
      {
        name: "Series 1",
        data: [50000, 49000, 60000, 80000, 30000, 40000, 35000],
      },
    ],
    ETH: [
      {
        name: "Series 1",
        data: [30000, 40000, 15000, 50000, 12300, 60000, 80000],
      },
    ],
    DAI: [
      {
        name: "Series 1",
        data: [30000, 40000, 60000, 80000, 35000, 50000, 49000],
      },
    ],
  };

  return (
    // <Box display="flex" gap="30px">
    //   <Box display="flex" flexDirection="column" gap="8px" width="50%">
    //     <Box
    //       display="flex"
    //       flexDirection="column"
    //       alignItems="flex-start"
    //       // width="723px"
    //       height="72px"
    //       border="1px solid #2B2F35"
    //       color="#E6EDF3"
    //       padding="24px 24px 16px"
    //       fontSize="20px"
    //       fontStyle="normal"
    //       fontWeight="600"
    //       lineHeight="30px"
    //       borderRadius="6px"
    //     >
    //       Supply APR:
    //     </Box>
    //     <SupplyAprChart />
    //   </Box>
    //   <Box display="flex" flexDirection="column" gap="8px" width="50%">
    //     <Box
    //       display="flex"
    //       flexDirection="column"
    //       alignItems="flex-start"
    //       // width="723px"
    //       height="72px"
    //       border="1px solid #2B2F35"
    //       color="#E6EDF3"
    //       padding="24px 24px 16px"
    //       fontSize="20px"
    //       fontStyle="normal"
    //       fontWeight="600"
    //       lineHeight="30px"
    //       borderRadius="6px"
    //     >
    //       Borrow APR:
    //     </Box>
    //     <BorrowAprChart />
    //   </Box>
    // </Box>
    <Box display="flex" gap="30px">
      <Box display="flex" flexDirection="column" gap="8px" width="100%">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          height="72px"
          border="1px solid #2B2F35"
          color="#E6EDF3"
          padding="24px 24px 16px"
          fontSize="20px"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="30px"
          borderRadius="6px"
        >
          Supply:
        </Box>
        <YourMetricsSupply
          color={"#61a6a5"}
          series={series1[currentMarketCoin]}
        />
      </Box>
      <Box display="flex" flexDirection="column" gap="8px" width="100%">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          height="72px"
          border="1px solid #2B2F35"
          color="#E6EDF3"
          padding="24px 24px 16px"
          fontSize="20px"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="30px"
          borderRadius="6px"
        >
          Borrow:
        </Box>
        <YourMetricsBorrow
          color={"#4c60ee"}
        />
      </Box>
    </Box>
  );
};

export default YourMetricsSupplyBorrow;

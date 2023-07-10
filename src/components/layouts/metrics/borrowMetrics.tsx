import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import AssetUtilizationChart from "../charts/AssetUtilization";
import AssetUtilizationRateChart from "../charts/AssetUtilizationRate";
import SupplyAprChart from "../charts/SupplyApr";
import BorrowAprChart from "../charts/BorrowApr";
// import { Button } from "reactstrap";
import SupplyAPRLiquidityProvider from "../charts/supplyAPRLiquitityProvider";
import YourMetricsBorrow from "../charts/YourMetricsBorrow";
import BorrowChart from "../charts/borrowChart";
import BorrowerChart from "../charts/borrowerChart";
const BorrowMetrics = ({ currentMarketCoin }: any) => {
  const series1: any = [
    [
      {
        name: "Series 1",
        data: [30000, 40000, 60000, 80000, 35000, 50000, 49000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [50000, 49000, 60000, 80000, 30000, 40000, 35000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [12300, 40000, 35000, 55000, 49000, 64340, 80000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [30000, 40000, 15000, 50000, 12300, 60000, 80000],
      },
    ],
  ];

  const series2: any = [
    [
      {
        name: "Series 1",
        data: [30000, 40000, 60000, 80000, 35000, 50000, 49000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [50000, 49000, 60000, 80000, 30000, 40000, 35000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [12300, 40000, 35000, 55000, 49000, 64340, 80000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [30000, 40000, 15000, 50000, 12300, 60000, 80000],
      },
    ],
  ];
  const [borrowChartPeriod, setBorrowChartPeriod] = useState(0);
  const [borrowerChartPeriod, setBorrowerChartPeriod] = useState(0);

  return (
    <Box display="flex" flexDir="column" gap="64px">
      <BorrowChart />
      <Box display="flex" gap="30px">
        {/* <Box display="flex" flexDirection="column" gap="8px" width="100%">
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
            Median Borrow{" "}
          </Box>
          <AssetUtilizationChart
            color={"#846ED4"}
            // series={series2[liquidityProviderChartPeriod]}
          />
        </Box> */}
        <BorrowerChart />
      </Box>
      <Box display="flex" gap="30px">
        {/* <Box display="flex" flexDirection="column" gap="8px" width="50%">
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
            Median Borrow By Market:{" "}
          </Box>
          <YourMetricsBorrow
            color={"#846ED4"}
            // series={series2[liquidityProviderChartPeriod]}
          />
        </Box> */}
      </Box>
    </Box>
  );
};

export default BorrowMetrics;

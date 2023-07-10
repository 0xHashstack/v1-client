import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import AssetUtilizationChart from "../charts/AssetUtilization";
import AssetUtilizationRateChart from "../charts/AssetUtilizationRate";
import SupplyAprChart from "../charts/SupplyApr";
import BorrowAprChart from "../charts/BorrowApr";
// import { Button } from "reactstrap";
import SupplyAPRLiquidityProvider from "../charts/supplyAPRLiquitityProvider";
import YourMetricsSupply from "../charts/YourMetricsSupply";
const SupplyMetrics = ({ currentMarketCoin }: any) => {
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
  const [supplyAPRChartPeriod, setSupplyAPRChartPeriod] = useState(0);
  const [liquidityProviderChartPeriod, setLiquidityProviderChartPeriod] =
    useState(0);

  return (
    <Box display="flex" flexDir="column" gap="64px">
      <Box display="flex" gap="30px">
        <Box display="flex" flexDirection="column" gap="8px" width="100%">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            height="72px"
            border="1px solid #2B2F35"
            color="#E6EDF3"
            // padding="24px 24px 16px"
            px="24px"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="600"
            lineHeight="30px"
            borderRadius="6px"
          >
            <Box
              w="100%"
              display="flex"
              gap="2"
              justifyContent="space-between"
              my="auto"
            >
              
              <Box display="flex" gap="2">
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    supplyAPRChartPeriod === 0 ? "none" : "1px solid #2B2F35"
                  }
                  variant={supplyAPRChartPeriod === 0 ? "solid" : "outline"}
                  onClick={() => {
                    setSupplyAPRChartPeriod(0);
                  }}
                >
                  1D
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    supplyAPRChartPeriod === 1 ? "none" : "1px solid #2B2F35"
                  }
                  variant={supplyAPRChartPeriod === 1 ? "solid" : "outline"}
                  onClick={() => {
                    setSupplyAPRChartPeriod(1);
                  }}
                >
                  1M
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    supplyAPRChartPeriod === 2 ? "none" : "1px solid #2B2F35"
                  }
                  variant={supplyAPRChartPeriod === 2 ? "solid" : "outline"}
                  onClick={() => {
                    setSupplyAPRChartPeriod(2);
                  }}
                >
                  3M
                </Button>

                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    supplyAPRChartPeriod === 3 ? "none" : "1px solid #2B2F35"
                  }
                  variant={supplyAPRChartPeriod === 3 ? "solid" : "outline"}
                  onClick={() => {
                    setSupplyAPRChartPeriod(3);
                  }}
                >
                  ALL
                </Button>
              </Box>
            </Box>
          </Box>
          <AssetUtilizationChart
            color={"#846ED4"}
            series={series1[supplyAPRChartPeriod]}
            chartType="bar"
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
            Supply APR:{" "}
          </Box>
          <SupplyAprChart color={"#2BA26F"} />
        </Box>
      </Box>
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
            Median Supply{" "}
          </Box>
          <AssetUtilizationChart
            color={"#846ED4"}
            // series={series2[liquidityProviderChartPeriod]}
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
            // padding="24px 24px 16px"
            px="24px"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="600"
            lineHeight="30px"
            borderRadius="6px"
          >
            <Box
              w="100%"
              display="flex"
              gap="2"
              justifyContent="space-between"
              my="auto"
            >
              <Box mt="auto">Liquidity Provider:</Box>
              <Box display="flex" gap="2">
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    liquidityProviderChartPeriod === 0
                      ? "none"
                      : "1px solid #2B2F35"
                  }
                  variant={
                    liquidityProviderChartPeriod === 0 ? "solid" : "outline"
                  }
                  onClick={() => {
                    setLiquidityProviderChartPeriod(0);
                  }}
                >
                  1D
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    liquidityProviderChartPeriod === 1
                      ? "none"
                      : "1px solid #2B2F35"
                  }
                  variant={
                    liquidityProviderChartPeriod === 1 ? "solid" : "outline"
                  }
                  onClick={() => {
                    setLiquidityProviderChartPeriod(1);
                  }}
                >
                  1M
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    liquidityProviderChartPeriod === 2
                      ? "none"
                      : "1px solid #2B2F35"
                  }
                  variant={
                    liquidityProviderChartPeriod === 2 ? "solid" : "outline"
                  }
                  onClick={() => {
                    setLiquidityProviderChartPeriod(2);
                  }}
                >
                  3M
                </Button>

                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    liquidityProviderChartPeriod === 3
                      ? "none"
                      : "1px solid #2B2F35"
                  }
                  variant={
                    liquidityProviderChartPeriod === 3 ? "solid" : "outline"
                  }
                  onClick={() => {
                    setLiquidityProviderChartPeriod(3);
                  }}
                >
                  ALL
                </Button>
              </Box>
            </Box>
          </Box>
          <AssetUtilizationChart
            color={"#2BA26F"}
            series={series2[liquidityProviderChartPeriod]}
          />
        </Box>
      </Box>
        <Box display="flex" gap="30px">
        <Box display="flex" flexDirection="column" gap="8px" width="50%">
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
            Median Supply By Market:{" "}
          </Box>
          <YourMetricsSupply
            color={"#846ED4"}
            // series={series2[liquidityProviderChartPeriod]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SupplyMetrics;

// const series1 = [
//   [
//     {
//       name: "Series 1",
//       data: [
//         30000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 12500, 98000,
//         110000, 90000,
//       ],
//       fill: {
//         colors: ["#01b6dd"], // Specify the fill color for the area under the line
//         // Set the opacity of the fill color (optional)
//         opacity: 1,
//       },
//       dataPoints: {
//         hidden: true, // Hide the data points in the area
//       },
//     },
//   ],
//   [
//     {
//       name: "Series 1",
//       data: [
//         0, 90000, 27000, 30000, 33000, 47000, 54000, 83000, 80000, 100000,
//         115000, 110000,
//       ],
//       fill: {
//         colors: ["#01b6dd"], // Specify the fill color for the area under the line
//         // Set the opacity of the fill color (optional)
//         opacity: 1,
//       },
//       dataPoints: {
//         hidden: true, // Hide the data points in the area
//       },
//     },
//   ],
//   [
//     {
//       name: "Series 1",
//       data: [
//         54000, 83000, 80000, 100000, 115000, 110000, 0, 90000, 27000, 30000,
//         33000, 47000,
//       ],
//       fill: {
//         colors: ["#01b6dd"], // Specify the fill color for the area under the line
//         // Set the opacity of the fill color (optional)
//         opacity: 1,
//       },
//       dataPoints: {
//         hidden: true, // Hide the data points in the area
//       },
//     },
//   ],
//   [
//     {
//       name: "Series 1",
//       data: [
//         30000, 33000, 47000, 54000, 83000, 0, 90000, 27000, 80000, 100000,
//         115000, 110000,
//       ],
//       fill: {
//         colors: ["#01b6dd"], // Specify the fill color for the area under the line
//         // Set the opacity of the fill color (optional)
//         opacity: 1,
//       },
//       dataPoints: {
//         hidden: true, // Hide the data points in the area
//       },
//     },
//   ],
// ];
// const series2 = [
//   [
//     {
//       name: "Series 1",
//       data: [
//         0, 90000, 27000, 30000, 33000, 47000, 54000, 83000, 80000, 100000,
//         115000, 110000,
//       ],
//       fill: {
//         colors: ["#01b6dd"], // Specify the fill color for the area under the line
//         // Set the opacity of the fill color (optional)
//         opacity: 1,
//       },
//       dataPoints: {
//         hidden: true, // Hide the data points in the area
//       },
//     },
//   ],
//   [
//     {
//       name: "Series 1",
//       data: [
//         30000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 12500, 98000,
//         110000, 90000,
//       ],
//       fill: {
//         colors: ["#01b6dd"], // Specify the fill color for the area under the line
//         // Set the opacity of the fill color (optional)
//         opacity: 1,
//       },
//       dataPoints: {
//         hidden: true, // Hide the data points in the area
//       },
//     },
//   ],
//   [
//     {
//       name: "Series 1",
//       data: [
//         54000, 83000, 80000, 100000, 115000, 110000, 0, 90000, 27000, 30000,
//         33000, 47000,
//       ],
//       fill: {
//         colors: ["#01b6dd"], // Specify the fill color for the area under the line
//         // Set the opacity of the fill color (optional)
//         opacity: 1,
//       },
//       dataPoints: {
//         hidden: true, // Hide the data points in the area
//       },
//     },
//   ],
//   [
//     {
//       name: "Series 1",
//       data: [
//         30000, 33000, 47000, 54000, 83000, 0, 90000, 27000, 80000, 100000,
//         115000, 110000,
//       ],
//       fill: {
//         colors: ["#01b6dd"], // Specify the fill color for the area under the line
//         // Set the opacity of the fill color (optional)
//         opacity: 1,
//       },
//       dataPoints: {
//         hidden: true, // Hide the data points in the area
//       },
//     },
//   ],
// ];

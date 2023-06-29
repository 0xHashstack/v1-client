import React, { useState } from "react";
import { Box, Button, Skeleton } from "@chakra-ui/react";
import AssetUtilizationChart from "../charts/AssetUtilization";
import AssetUtilizationRateChart from "../charts/AssetUtilizationRate";
import SupplyAprChart from "../charts/SupplyApr";
import BorrowAprChart from "../charts/BorrowApr";
import RiskPremiumChart from "../charts/RiskPremium";
import SupplyAPRLiquidityProvider from "../charts/supplyAPRLiquitityProvider";
import { useSelector } from "react-redux";
import { selectProtocolReserves } from "@/store/slices/userAccountSlice";
import numberFormatter from "@/utils/functions/numberFormatter";

const TotalValueLockedMetrics = () => {
  //   const series2 = [
  //     [
  //       {
  //         name: "Series 1",
  //         data: [
  //           0, 90000, 27000, 30000, 33000, 47000, 54000, 83000, 80000, 100000,
  //           115000, 110000,
  //         ],
  //         fill: {
  //           colors: ["#01b6dd"], // Specify the fill color for the area under the line
  //           // Set the opacity of the fill color (optional)
  //           opacity: 1,
  //         },
  //         dataPoints: {
  //           hidden: true, // Hide the data points in the area
  //         },
  //       },
  //     ],
  //     [
  //       {
  //         name: "Series 1",
  //         data: [
  //           30000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 12500, 98000,
  //           110000, 90000,
  //         ],
  //         fill: {
  //           colors: ["#01b6dd"], // Specify the fill color for the area under the line
  //           // Set the opacity of the fill color (optional)
  //           opacity: 1,
  //         },
  //         dataPoints: {
  //           hidden: true, // Hide the data points in the area
  //         },
  //       },
  //     ],
  //     [
  //       {
  //         name: "Series 1",
  //         data: [
  //           54000, 83000, 80000, 100000, 115000, 110000, 0, 90000, 27000, 30000,
  //           33000, 47000,
  //         ],
  //         fill: {
  //           colors: ["#01b6dd"], // Specify the fill color for the area under the line
  //           // Set the opacity of the fill color (optional)
  //           opacity: 1,
  //         },
  //         dataPoints: {
  //           hidden: true, // Hide the data points in the area
  //         },
  //       },
  //     ],
  //     [
  //       {
  //         name: "Series 1",
  //         data: [
  //           30000, 33000, 47000, 54000, 83000, 0, 90000, 27000, 80000, 100000,
  //           115000, 110000,
  //         ],
  //         fill: {
  //           colors: ["#01b6dd"], // Specify the fill color for the area under the line
  //           // Set the opacity of the fill color (optional)
  //           opacity: 1,
  //         },
  //         dataPoints: {
  //           hidden: true, // Hide the data points in the area
  //         },
  //       },
  //     ],
  //   ];

  //   const series1 = [
  //     [
  //       {
  //         name: "Series 1",
  //         data: [
  //           30000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 12500, 98000,
  //           110000, 90000,
  //         ],
  //         fill: {
  //           colors: ["#01b6dd"], // Specify the fill color for the area under the line
  //           // Set the opacity of the fill color (optional)
  //           opacity: 1,
  //         },
  //         dataPoints: {
  //           hidden: true, // Hide the data points in the area
  //         },
  //       },
  //     ],
  //     [
  //       {
  //         name: "Series 1",
  //         data: [
  //           0, 90000, 27000, 30000, 33000, 47000, 54000, 83000, 80000, 100000,
  //           115000, 110000,
  //         ],
  //         fill: {
  //           colors: ["#01b6dd"], // Specify the fill color for the area under the line
  //           // Set the opacity of the fill color (optional)
  //           opacity: 1,
  //         },
  //         dataPoints: {
  //           hidden: true, // Hide the data points in the area
  //         },
  //       },
  //     ],
  //     [
  //       {
  //         name: "Series 1",
  //         data: [
  //           54000, 83000, 80000, 100000, 115000, 110000, 0, 90000, 27000, 30000,
  //           33000, 47000,
  //         ],
  //         fill: {
  //           colors: ["#01b6dd"], // Specify the fill color for the area under the line
  //           // Set the opacity of the fill color (optional)
  //           opacity: 1,
  //         },
  //         dataPoints: {
  //           hidden: true, // Hide the data points in the area
  //         },
  //       },
  //     ],
  //     [
  //       {
  //         name: "Series 1",
  //         data: [
  //           30000, 33000, 47000, 54000, 83000, 0, 90000, 27000, 80000, 100000,
  //           115000, 110000,
  //         ],
  //         fill: {
  //           colors: ["#01b6dd"], // Specify the fill color for the area under the line
  //           // Set the opacity of the fill color (optional)
  //           opacity: 1,
  //         },
  //         dataPoints: {
  //           hidden: true, // Hide the data points in the area
  //         },
  //       },
  //     ],
  //   ];

  //   const [supplyAPRChartPeriod, setSupplyAPRChartPeriod] = useState(0);
  //   const [liquidityProviderChartPeriod, setLiquidityProviderChartPeriod] =
  //     useState(0);
  const protocolReserves = useSelector(selectProtocolReserves);
  return (
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
            {!protocolReserves ?<Skeleton
              width="6rem"
              height="1.9rem"
              startColor="#101216"
              endColor="#2B2F35"
              borderRadius="6px"
            />:<Box mt="auto">Total Value Locked: ${numberFormatter(protocolReserves?.totalReserves)}</Box>}
            
            {/* <Box display="flex" gap="2">
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
            </Box> */}
          </Box>
        </Box>
        <Box
          px="24px"
          py="16px"
          fontSize="20px"
          border="1px solid #2B2F35"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="30px"
          borderRadius="6px"
        >
          <SupplyAPRLiquidityProvider
            series={[
              {
                name: "Series 1",
                data: [
                  30000, 33000, 47000, 54000, 83000, 0, 90000, 27000, 80000,
                  100000, 115000, 110000,
                ],
                fill: {
                  colors: ["#01b6dd"], // Specify the fill color for the area under the line
                  // Set the opacity of the fill color (optional)
                  opacity: 1,
                },
                dataPoints: {
                  hidden: true, // Hide the data points in the area
                },
              },
            ]}
          />
        </Box>
      </Box>
      {/* <Box display="flex" flexDirection="column" gap="8px" width="100%">
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
        <SupplyAPRLiquidityProvider
          curveColor={"#10955e"}
          color={"#0fc778"}
          series={series2[liquidityProviderChartPeriod]}
        />
      </Box> */}
    </Box>
  );
};

export default TotalValueLockedMetrics;

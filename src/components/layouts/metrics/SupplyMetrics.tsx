import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import AssetUtilizationChart from "../charts/AssetUtilization";
import AssetUtilizationRateChart from "../charts/AssetUtilizationRate";
import SupplyAprChart from "../charts/SupplyApr";
import BorrowAprChart from "../charts/BorrowApr";
// import { Button } from "reactstrap";
import SupplyAPRLiquidityProvider from "../charts/supplyAPRLiquitityProvider";
import YourMetricsSupply from "../charts/YourMetricsSupply";
import SupplyChart from "../charts/supplyChart";
import LiquidityProvider from "../charts/liquidityProviderChart";
import LiquidityProviderChart from "../charts/liquidityProviderChart";
import TotalAccountsChart from "../charts/totalAccountsChart";
import BorrowChart from "../charts/borrowChart";
import BorrowerChart from "../charts/borrowerChart";
import TotalUtilisationRateByMarketChart from "../charts/totalUtilisationRateByMarketChart";
import APRByMarketChart from "../charts/aprByMarket";
import TotalTransactionChart from "../charts/totalTransaction";
import ExchangeRaterToken from "../charts/exchangeRaterTokenChart";
import ExchangeRatedToken from "../charts/exchangeRatedTokenChart";
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
      <Box display="flex" gap="30px" w="full">
        <SupplyAprChart />
        <BorrowAprChart/>
      </Box>
      <Box display="flex" gap="30px">
        <TotalAccountsChart/>
      </Box>
      <Box color="White" fontSize="28px" fontWeight="600">
        Supply
      </Box>
      <Box display="flex" gap="30px" w="full">
        <SupplyChart/>
        <LiquidityProvider/>
        {/* <Box display="flex" flexDirection="column" gap="8px" width="50%">
          <YourMetricsSupply
            color={"#846ED4"}
            // series={series2[liquidityProviderChartPeriod]}
          />
        </Box> */}
      </Box>
      <Box  color="White" fontSize="28px" fontWeight="600">
        Borrow
      </Box>
      <Box display="flex" gap="30px" w="full">
        <BorrowChart/>
        <BorrowerChart/>
        {/* <Box display="flex" flexDirection="column" gap="8px" width="50%">
          <YourMetricsSupply
            color={"#846ED4"}
            // series={series2[liquidityProviderChartPeriod]}
          />
        </Box> */}
      </Box>
      <Box display="flex" gap="30px" w="full">
        <TotalUtilisationRateByMarketChart/>
        <APRByMarketChart/>
        {/* <Box display="flex" flexDirection="column" gap="8px" width="50%">
          <YourMetricsSupply
            color={"#846ED4"}
            // series={series2[liquidityProviderChartPeriod]}
          />
        </Box> */}
      </Box>
      <Box display="flex" gap="30px" w="full">
        <ExchangeRaterToken/>
        <ExchangeRatedToken/>
        {/* <Box display="flex" flexDirection="column" gap="8px" width="50%">
          <YourMetricsSupply
            color={"#846ED4"}
            // series={series2[liquidityProviderChartPeriod]}
          />
        </Box> */}
      </Box>
      <Box display="flex" gap="30px">
        <TotalTransactionChart/>
      </Box>
    </Box>
  );
};

export default SupplyMetrics;

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

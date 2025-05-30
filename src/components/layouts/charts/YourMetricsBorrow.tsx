import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  selectOraclePrices,
  selectProtocolStats,
  selectUserLoans,
  selectYourMetricsBorrow,
} from "@/store/slices/readDataSlice";
import { ILoan } from "@/Blockchain/interfaces/interfaces";
import ProtocolMetrics from "@/pages/v1/protocol-metrics";
import numberFormatter from "@/utils/functions/numberFormatter";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const YourMetricsBorrow = ({ series, formatter, color, categories }: any) => {
  const userLoans = useSelector(selectUserLoans);
  const protocolStats = useSelector(selectProtocolStats);
  const oraclePrices = useSelector(selectOraclePrices);
  const borrowData = {
    BTC: 0,
    ETH: 0,
    USDT: 0,
    USDC: 0,
    DAI: 0,
    STRK:0,
  };
  // const [totalBorrow, setTotalBorrow] = useState<any>({
  //   BTC: 0,
  //   ETH: 0,
  //   USDT: 0,
  //   USDC: 0,
  //   DAI: 0,
  // });
  const totalBorrow = useSelector(selectYourMetricsBorrow);
  // useEffect(() => {
  //   try {
  //     const fetchBorrowData = async () => {
  //       const borrow = { BTC: 0, ETH: 0, USDT: 0, USDC: 0, DAI: 0 };
  //       for (let loan of userLoans) {
  //         if (
  //           loan?.loanState === "REPAID" ||
  //           loan?.loanState === "LIQUIDATED" ||
  //           loan?.loanState === null
  //         )
  //           continue;

  //         const oraclePrice = oraclePrices.find(
  //           (oraclePrice: any) =>
  //             oraclePrice.address === loan?.underlyingMarketAddress
  //         );
  //         let exchangeRate = protocolStats.find(
  //           (marketInfo: any) =>
  //             marketInfo.tokenAddress === loan?.underlyingMarketAddress
  //         )?.exchangeRateDTokenToUnderlying;
  //         if (oraclePrice && exchangeRate) {
  //           let loanAmoungUnderlying = loan?.loanAmountParsed * exchangeRate;
  //           if (loan?.underlyingMarket == "BTC") {
  //             borrow.BTC += loanAmoungUnderlying * oraclePrice.price;
  //           } else if (loan?.underlyingMarket == "USDT") {
  //             borrow.USDT += loanAmoungUnderlying * oraclePrice.price;
  //           } else if (loan?.underlyingMarket == "USDC") {
  //             borrow.USDC += loanAmoungUnderlying * oraclePrice.price;
  //           } else if (loan?.underlyingMarket == "ETH") {
  //             borrow.ETH += loanAmoungUnderlying * oraclePrice.price;
  //           } else if (loan?.underlyingMarket == "DAI") {
  //             borrow.DAI += loanAmoungUnderlying * oraclePrice.price;
  //           }
  //         }
  //       }
  //       setTotalBorrow(borrow);
  //      //console.log("totalBorrow ", totalBorrow);
  //     };
  //     if (userLoans && protocolStats && oraclePrices) {
  //       fetchBorrowData();
  //     }
  //   } catch (err) {
  //    //console.log("err fetchBorrowData ", err);
  //   }
  // }, [userLoans, protocolStats, oraclePrices]);
  const chartOptions = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: "#6E7681",
          fontSize: "12px",
          fontWeight: "400",
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        color: "grey",
      },
      categories: categories
        ? categories
        : ["wBTC", "wETH", "USDT", "USDC", "DAI","STRK"],
    },
    plotOptions: {
      bar: {
        opacity: 1,
        columnWidth: "40%",
        colors: {
          backgroundBarOpacity: 1,
        },
        horizontal: false,
      },
    },
    yaxis: {
      labels: {
        formatter: formatter
          ? formatter
          : function (value: any) {
            return "$" + numberFormatter(value);;
            },
        style: {
          colors: "#6E7681",
          fontSize: "12px",
          fontWeight: "400",
        },
      },
      min: 0,
    },
    grid: {
      borderColor: "#2B2F35",
      padding: {
        bottom: 10,
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top" as const,
      horizontalAlign: "left" as const,
      labels: {
        colors: "#fff",
        // Set the color of the legend texts to white
      },
    },
    dataLabels: {
      enabled: false,
    },
    annotations: {
      xaxis: [
        {
          x: 0,
          strokeDashArray: 0,
          borderColor: "grey",
          borderWidth: 1,
        },
      ],
    },
    colors: ["#2BA26F"],
  };
  const chartSeries = [
    {
      name: "wBTC",
      data: [totalBorrow?.BTC ? totalBorrow?.BTC : "0", 0, 0, 0, 0],
      color: "#4D3C03",
    },
    {
      name: "wETH",
      data: [0, totalBorrow?.ETH ? totalBorrow?.ETH : "0", 0, 0, 0],
      color: "#4D59E8",
    },
    {
      name: "USDT",
      data: [0, 0, totalBorrow?.USDT ? totalBorrow?.USDT : "0", 0, 0],
      color: "#2DA44E",
    },
    {
      name: "USDC",
      data: [0, 0, 0, totalBorrow?.USDC ? totalBorrow?.USDC : "0", 0],
      color: "#222766",
    },
    {
      name: "DAI",
      data: [0, 0, 0, 0, totalBorrow?.DAI ? totalBorrow?.DAI : "0"],
      color: "#A48007",
    },
    {
      name: "STRK",
      data: [0, 0, 0, 0,0, totalBorrow?.STRK ? totalBorrow?.STRK : "0"],
      color: "#0C0C4F",
    },
  ];

  return (
    <Box border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))" borderRadius="6px" padding="16px 24px 40px">
      <ApexCharts
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </Box>
  );
};

export default YourMetricsBorrow;

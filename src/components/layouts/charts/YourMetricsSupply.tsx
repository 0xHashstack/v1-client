import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import {
  selectOraclePrices,
  selectUserDeposits,
  selectYourMetricsSupply,
} from "@/store/slices/readDataSlice";
import { IDeposit } from "@/Blockchain/interfaces/interfaces";
import numberFormatter from "@/utils/functions/numberFormatter";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const YourMetricsSupply = ({ series, formatter, color, categories }: any) => {
  // const userDeposits = useSelector(selectUserDeposits);
  // const oraclePrices = useSelector(selectOraclePrices);
  const supplyData = useSelector(selectYourMetricsSupply);
  ////console.log("supplyData your metrics ", supplyData);
  // useEffect(() => {
  //   try {
  //     const fetchSupplyData = async () => {
  //       const data = userDeposits?.map((deposit: IDeposit, idx: number) => {
  //         const price = oraclePrices?.find(
  //           (oraclePrice: any) => oraclePrice?.name == deposit?.token
  //         )?.price;
  //         const token_amount =
  //           deposit?.rTokenAmountParsed + deposit?.rTokenStakedParsed;
  //         if (price && token_amount) {
  //           return price * token_amount;
  //         }
  //         return 0;
  //       });
  //       if (data && data?.length > 0) {
  //         setSupplyData(data);
  //       }
  //      //console.log("supplyData", data);
  //     };
  //     if (
  //       userDeposits &&
  //       userDeposits?.length > 0 &&
  //       oraclePrices &&
  //       oraclePrices?.length > 0
  //     ) {
  //       fetchSupplyData();
  //     }
  //   } catch (err) {
  //    //console.log("your metrics supply err ", err);
  //   }
  // }, [userDeposits, oraclePrices]);

  const chartOptions = {
    chart: {
      id: "column-chart",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ["#000000"],
      },
      formatter: function (value: any) {
        return numberFormatter(value);
      },
      position: "top",
    },
    xaxis: {
      labels: {
        style: {
          colors: "#6E7681", // Set the color of the labels
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
        columnWidth: "40%",
        horizontal: false, // Set horizontal to false for vertical bars
        opacity: 1,
        colors: {
          backgroundBarOpacity: 1,
        },
      },
    },
    // colors:[""],
    yaxis: {
      labels: {
        formatter: formatter
          ? formatter
          : function (value: any) {
              return "$" + numberFormatter(value);
            },
        style: {
          colors: "#6E7681", // Set the color of the labels
          fontSize: "12px",
          fontWeight: "400",
        },
      },
      min: 0,
    },
    grid: {
      borderColor: "#2B2F35",
      padding: {
        bottom: 10, // Add bottom padding to prevent overlap with x-axis labels
      },
    },
    fill: {
      opacity: 1,
      // colors: ['#F44336', '#E91E63', '#9C27B0']
    },
    legend: {
      position: "top" as const,
      horizontalAlign: "left" as const,
      labels: {
        colors: "#fff",
        // Set the color of the legend texts to white
      },
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
  };

  // const chartSeries = [
  //   {
  //     name: "Supply",
  //     data: supplyData ? supplyData : [44000, 55000, 41000, 17000, 15000],
  //   },
  // ];
  const chartSeries = [
    {
      name: "wBTC",
      data: supplyData ? [supplyData?.[0], 0, 0, 0, 0,0] : [44000, 0, 0, 0, 0],
      color: "#4D3C03",
    },
    {
      name: "wETH",
      data: supplyData ? [0, supplyData?.[1], 0, 0, 0,0] : [0, 55000, 0, 0, 0],
      color: "#4D59E8",
    },
    {
      name: "USDT",
      data: supplyData ? [0, 0, supplyData?.[2], 0, 0,0] : [0, 0, 41000, 0, 0],
      color: "#2DA44E",
    },
    {
      name: "USDC",
      data: supplyData ? [0, 0, 0, supplyData?.[3], 0,0] : [0, 0, 0, 17000, 0],
      color: "#222766",
    },
    {
      name: "DAI",
      data: supplyData ? [0, 0, 0, 0, supplyData?.[4],0] : [0, 0, 0, 0, 15000],
      color: "#A48007",
    },
    {
      name: "STRK",
      data: supplyData ? [0, 0, 0, 0,0, 0] : [0, 0, 0, 0, 15000],
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

export default YourMetricsSupply;

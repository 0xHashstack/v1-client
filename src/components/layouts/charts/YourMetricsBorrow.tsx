import React from "react";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const YourMetricsBorrow = ({ series, formatter, color, categories }: any) => {
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
      categories: categories ? categories : [1, 2, 3, 4, 5, 6, 7],
    },
    plotOptions: {
      bar: {
        opacity: 1,
        columnWidth: "70%",
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
              return (value / 1000).toFixed(1) + "k";
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
  };

  const chartSeries = [
    {
      name: "wBTC",
      data: [44000, 55000, 41000, 17000, 15000, 17000, 15000],
    },
    {
      name: "wETH",
      data: [13000, 23000, 20000, 17000, 15000, 17000, 15000],
    },
    {
      name: "USDC",
      data: [10001, 17000, 15000, 17000, 15000, 17000, 15000],
    },
    {
      name: "USDT",
      data: [21000, 7000, 25000, 17000, 15000, 17000, 15000],
    },
    {
      name: "DAI",
      data: [21000, 30000, 25000, 17000, 15000, 17000, 15000],
    },
  ];

  return (
    <Box border="1px solid #2B2F35" borderRadius="6px" padding="16px 24px 40px">
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

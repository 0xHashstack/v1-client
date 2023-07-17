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
      categories: categories ? categories : ["BTC","ETH","USDT","USDC","DAI"],
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
    colors: ["#2BA26F"],
  };
  const chartSeries = [
    {
      name: 'BTC',
      data:  [44000, 0, 0, 0, 0],
      color: '#804D0F',
    },
    {
      name: 'ETH',
      data: [0, 55000, 0, 0, 0],
      color: '#3B48A8',
    },
    {
      name: 'USDT',
      data: [0, 0, 41000, 0, 0],
      color: '#136B51',
    },
    {
      name: 'USDC',
      data: [0, 0, 0, 17000, 0],
      color: '#1A2683',
    },
    {
      name: 'DAI',
      data: [0, 0, 0, 0, 15000],
      color: '#996B22',
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

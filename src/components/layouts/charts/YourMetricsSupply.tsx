import React from "react";
import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const YourMetricsSupply = ({ series, formatter, color, categories }: any) => {
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
          categories: categories ? categories : ["BTC","ETH","USDT","USDC","DAI"],
    },
    plotOptions: {
      bar: {
        opacity: 1, // Set the opacity to 1 for fully opaque bars
        columnWidth: "70%", // Adjust the column width for better spacing between bars
        colors: {
          backgroundBarOpacity: 1, // Set the opacity of the background bar
        },
        horizontal: false,
      },
    },
    // colors:[""],
    yaxis: {
      labels: {
        formatter: formatter
          ? formatter
          : function (value: any) {
              return (value / 1000).toFixed(1) + "k";
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
      name: 'wBTC',
      data: [44000, 55000, 41000, 17000, 15000],
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

export default YourMetricsSupply;

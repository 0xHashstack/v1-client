import React from "react";
import { Box } from "@chakra-ui/react";
import ApexCharts from "react-apexcharts";
// const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const AssetUtilizationChart = ({
  series,
  formatter,
  color,
  categories,
}: any) => {
  const splineChartData = {
    series: series
      ? series
      : [
          {
            name: "Series 1",
            data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
          },
        ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        position: 'bottom',
        enabled: true,
        style: {
          colors: ["#000000"],
        },
        formatter: function(val:any) {
          return val / 1000 + "k"; // Display the data value as the label
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
        categories: categories ? categories : [1, 2, 3, 4, 5, 6, 7],
      },
      yaxis: {
        labels: {
          formatter: formatter
            ? formatter
            : function (value: any) {
                return value / 1000 + "k";
              },
          style: {
            colors: "#6E7681", // Set the color of the labels
            fontSize: "12px",
            fontWeight: "400",
          },
        },
        min: 0,
      },
      plotOptions: {
        bar: {
          opacity: 1, // Set the opacity to 1 for fully opaque bars
          columnWidth: "70%", // Adjust the column width for better spacing between bars
          colors: {
            backgroundBarOpacity: 1, // Set the opacity of the background bar
          },
        },
      },
      colors: [`${color ? color : "#0FCA7A"}`],
      grid: {
        borderColor: "#2B2F35",
        padding: {
          bottom: 10, // Add bottom padding to prevent overlap with x-axis labels
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
    },
  };

  return (
<Box border="1px solid #2B2F35" borderRadius="6px" padding="16px 24px 40px">
  // @ts-ignore
  <ApexCharts
    options={splineChartData.options}
    series={splineChartData.series}
    type="bar"
    height={350}
  />
</Box>

  );
};

export default AssetUtilizationChart;

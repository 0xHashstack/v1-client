import React from "react";
import dynamic from "next/dynamic";
import { Box, Text } from "@chakra-ui/react";
import SmallBlueDot from "@/assets/icons/smallBlueDot";
import SmallGreenDot from "@/assets/icons/smallGreenDot";
import { ApexOptions } from "apexcharts";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const SupplyAPRLiquidityProvider = ({ color, curveColor, series }: any) => {
  const splineChartData = {
    series: series
      ? series
      : [
          {
            name: "Series 1",
            data: [
              30000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 12500,
              98000, 110000, 90000,
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
          {
            name: "Series 2",
            data: [
              0, 90000, 27000, 30000, 33000, 47000, 54000, 83000, 80000, 100000,
              115000, 110000,
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
        ],
    options: {
      chart: {
        // offsetX: 50,
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        tooltip: {
          enabled: false, // Disable the x-axis tooltip
        },
        axisTicks: {
          show: false, // Hide the small spikes at x-axis labels
        },
        labels: {
          style: {
            colors: "#6E7681", // Set the color of the labels
            fontSize: "12px",
            fontWeight: "400",
          },
        },
        axisBorder: {
          color: "#6E7681", // Set the color of the x-axis lines
        },

        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: {
        labels: {
          formatter: function (value: any) {
            return value / 1000 + "k"; // Divide by 1000 and append 'k' for thousands
          },
          min: 0,
          style: {
            colors: "#6E7681", // Set the color of the labels
            fontSize: "12px",
            fontWeight: "400",
          },
        },
        borderColor: "#6E7681",
      },

      annotations: {
        xaxis: [
          {
            x: "Jan", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
          {
            x: "Feb", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
          {
            x: "Mar", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
          {
            x: "Apr", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
          {
            x: "May", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
          {
            x: "Jun", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
          {
            x: "Jul", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
          {
            x: "Aug", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
          {
            x: "Sep", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
          {
            x: "Oct", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
          {
            x: "Nov", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
          {
            x: "Dec", // Specify the x-axis value where the line should appear
            strokeDashArray: 0, // Set the length of the dash for the line
            borderColor: "#2B2F35", // Set the color of the line
            borderWidth: 1, // Set the width of the line
          },
        ],
      },

      stroke: {
        curve: "smooth",
        colors: [`${curveColor ? curveColor : "#79B8FF"}`],
        opacity: 1,
      },
      grid: {
        borderColor: "#2B2F35",
      },
      legend: {
        show: false, // Hide the series buttons when only one series is present
      },
      colors: [`${color ? color : "#01b6dd"}`],
    },
  };
  const options: ApexOptions = {
    ...splineChartData.options,
    stroke: {
      ...splineChartData.options.stroke,
      curve: "smooth",
    },
  };

  return (
    <Box border="1px solid #2B2F35" borderRadius="6px" padding="16px 24px 40px">
      <ApexCharts
        options={options}
        series={splineChartData.series}
        type="area"
        height={350}
      />
    </Box>
  );
};

export default SupplyAPRLiquidityProvider;

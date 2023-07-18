import React, { useEffect, useState } from "react";
import AssetUtilizationChart from "./AssetUtilization";
import { Box, Button } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectHourlyBTCData } from "@/store/slices/readDataSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
import { number } from "starknet";
import { kMaxLength } from "buffer";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const UtilisationRateChart = () => {
  const [liquidityProviderChartPeriod, setLiquidityProviderChartPeriod] =
    useState(0);
  const [chartData, setChartData] = useState([
    {
      name: "Utlization Rate",
      data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
    },
  ]);
  const btcData = useSelector(selectHourlyBTCData);
  const [xAxisCategories, setXAxisCategories] = useState([1, 2, 3, 4, 5, 6, 7]);
  useEffect(() => {
    // Fetch data based on selected option
    const fetchData = async () => {
      // Simulating API call or data update
      const { newData, newCategories } = await fetchDataBasedOnOption(
        liquidityProviderChartPeriod
      );
      setChartData(newData);
      setXAxisCategories(newCategories);
    };

    fetchData();
  }, [liquidityProviderChartPeriod]);
  //   console.log(new Date("2022-01-01").getTime(),"trial chart data")

  const fetchDataBasedOnOption = async (option: number) => {
    // Simulating API call or data update based on option
    // Replace this with your actual implementation
    let newData: any = [];
    let newCategories: any = [];
    // console.log(btcData,"util rates")

    switch (liquidityProviderChartPeriod) {
      case 0:
        btcData?.utilRates
          ? (newData = [
              {
                name: "Utlization Rate",
                data: btcData?.utilRates,
              },
            ])
          : (newData = [
              {
                name: "Utlization Rate",
                data: [
                  300, 400, 350, 500, 490, 600, 800, 400, 350, 500, 490, 600,
                  800,
                ],
              },
            ]);
        btcData?.dates
          ? (newCategories = btcData?.dates)
          : (newCategories = [
              1689152545000, 1689156145000, 1689159745000, 1689163345000,
              1689166945000, 1689170545000, 1689174145000, 1689177745000,
              1689181345000, 1689184945000, 1689188545000, 1689192145000,
            ]);
        break;
      case 1:
        newData = [
          {
            name: "Utlization Rate",
            data: [400, 100, 420, 390, 440, 410, 430],
          },
        ];
        newCategories = [
          new Date("2023-07-01").getTime(),
          new Date("2023-07-02").getTime(),
          new Date("2023-07-03").getTime(),
          new Date("2023-07-04").getTime(),
          new Date("2023-07-05").getTime(),
          new Date("2023-07-06").getTime(),
          new Date("2023-07-07").getTime(),
        ];
        break;
      case 2:
        //y data axis
        newData = [
          {
            name: "Utlization Rate",
            data: [500, 490, 520, 480, 510, 480, 500, 480, 510, 480],
          },
        ];
        //x axis data
        newCategories = [
          new Date("2023-06-03").getTime(),
          new Date("2023-06-06").getTime(),
          new Date("2023-06-09").getTime(),
          new Date("2023-06-12").getTime(),
          new Date("2023-06-15").getTime(),
          new Date("2023-06-18").getTime(),
          new Date("2023-06-21").getTime(),
          new Date("2023-06-24").getTime(),
          new Date("2023-06-27").getTime(),
          new Date("2023-06-30").getTime(),
        ];
        break;
      case 3:
        newData = [
          {
            name: "Utlization Rate",
            data: [600, 580, 620, 590, 630, 600, 620, 590, 630, 600, 620, 700],
          },
        ];

        newCategories = [
          new Date("2022-01-01").getTime(),
          new Date("2022-02-01").getTime(),
          new Date("2022-03-01").getTime(),
          new Date("2022-04-01").getTime(),
          new Date("2022-05-01").getTime(),
          new Date("2022-06-01").getTime(),
          new Date("2022-07-01").getTime(),
          new Date("2022-08-01").getTime(),
          new Date("2022-09-01").getTime(),
          new Date("2022-10-01").getTime(),
          new Date("2022-11-01").getTime(),
          new Date("2022-12-01").getTime(),
        ];
        break;
      default:
        break;
    }

    return { newData, newCategories };
  };

  const splineChartData = {
    series: chartData,
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        position: "bottom",
        enabled: false,
        style: {
          colors: ["#fff"],
        },
        formatter: function (val: any) {
          return (val / 10)?.toFixed(1) + ""; // Display the data value as the label
        },
      },

      xaxis: {
        type: "datetime" as const,
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
        categories: xAxisCategories,
      },
      yaxis: {
        labels: {
          formatter: function (value: any) {
            return (value / 10)?.toFixed(1) + "";
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
      colors: ["#04aacf"],
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
    <Box display="flex" flexDirection="column" gap="8px" width="50%">
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
          <Box mt="auto">Utilisation Rate:</Box>
          <Box display="flex" gap="2">
            <Button
              color="#2B2F35"
              size="sm"
              border={
                liquidityProviderChartPeriod === 0
                  ? "none"
                  : "1px solid #2B2F35"
              }
              variant={liquidityProviderChartPeriod === 0 ? "solid" : "outline"}
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
              variant={liquidityProviderChartPeriod === 1 ? "solid" : "outline"}
              onClick={() => {
                setLiquidityProviderChartPeriod(1);
              }}
              isDisabled={true}
              _disabled={{
                cursor: "pointer",
                color: "#2B2F35",
                border: `${
                  liquidityProviderChartPeriod === 2
                    ? "none"
                    : "1px solid #2B2F35"
                }`,
              }}
            >
              1W
            </Button>
            <Button
              color="#2B2F35"
              size="sm"
              border={
                liquidityProviderChartPeriod === 2
                  ? "none"
                  : "1px solid #2B2F35"
              }
              variant={liquidityProviderChartPeriod === 2 ? "solid" : "outline"}
              onClick={() => {
                setLiquidityProviderChartPeriod(2);
              }}
              isDisabled={true}
              _disabled={{
                cursor: "pointer",
                color: "#2B2F35",
                border: `${
                  liquidityProviderChartPeriod === 2
                    ? "none"
                    : "1px solid #2B2F35"
                }`,
              }}
            >
              1M
            </Button>

            <Button
              color="#2B2F35"
              size="sm"
              border={
                liquidityProviderChartPeriod === 3
                  ? "none"
                  : "1px solid #2B2F35"
              }
              variant={liquidityProviderChartPeriod === 3 ? "solid" : "outline"}
              onClick={() => {
                setLiquidityProviderChartPeriod(3);
              }}
              isDisabled={true}
              _disabled={{
                cursor: "pointer",
                color: "#2B2F35",
                border: `${
                  liquidityProviderChartPeriod === 2
                    ? "none"
                    : "1px solid #2B2F35"
                }`,
              }}
            >
              ALL
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        border="1px solid #2B2F35"
        borderRadius="6px"
        padding="16px 24px 40px"
      >
        <ApexCharts
          options={splineChartData.options}
          series={splineChartData.series}
          type="area"
          height={350}
        />
      </Box>
    </Box>
  );
};

export default UtilisationRateChart;

import React, { useEffect, useState } from "react";
import AssetUtilizationChart from "./AssetUtilization";
import { Box, Button } from "@chakra-ui/react";

import numberFormatter from "@/utils/functions/numberFormatter";
import { useSelector } from "react-redux";
import { selectAllBTCData, selectDailyBTCData, selectHourlyBTCData, selectMonthlyBTCData } from "@/store/slices/readDataSlice";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const SupplyChartChart = () => {
  const [liquidityProviderChartPeriod, setLiquidityProviderChartPeriod] =
    useState(0);
  const [chartData, setChartData] = useState([
    {
      name: "Supply APR",
      data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
    },
  ]);
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
  const btcData = useSelector(selectHourlyBTCData);
  const weeklyBtcData=useSelector(selectDailyBTCData);
  const monthlyBtcData=useSelector(selectMonthlyBTCData);
  const allBtcData=useSelector(selectAllBTCData);
  //   console.log(new Date("2022-01-01").getTime(),"trial chart data")

  const fetchDataBasedOnOption = async (option: number) => {
    // Simulating API call or data update based on option
    // Replace this with your actual implementation
    let newData: any = [];
    let newCategories: any = [];

    switch (liquidityProviderChartPeriod) {
      case 0:
        btcData?.supplyRates
          ? (newData = [
              {
                name: "Supply APR",
                data: btcData?.supplyRates,
              },
            ])
          : (newData = [
              {
                name: "Supply APR",
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
        weeklyBtcData?.supplyRates ?
        newData = [
          {
            name: "Supply APR",
            data: weeklyBtcData?.supplyRates,
          },
        ]:   
        newData = [
          {
            name: "Supply APR",
            data: [400, 100, 420, 390, 440, 410, 430],
          },
        ];
        weeklyBtcData?.dates ? newCategories=weeklyBtcData?.dates:
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
        monthlyBtcData?.supplyRates ?
        newData=[
          {
            name:"Supply APR",
            data:monthlyBtcData?.supplyRates,
          }
        ]:
        newData = [
          {
            name: "Supply APR",
            data: [500, 490, 520, 480, 510, 480, 500, 480, 510, 480],
          },
        ];
        monthlyBtcData?.dates ? newCategories=monthlyBtcData?.dates:
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
        allBtcData?.supplyRates ?
        newData=[
          {
            name:"Supply APR",
            data:allBtcData?.supplyRates
          }
        ]:
        newData = [
          {
            name: "Supply APR",
            data: [600, 580, 620, 590, 630, 600, 620, 590, 630, 600, 620, 700],
          },
        ];
        allBtcData?.dates ?
        newCategories=allBtcData?.dates:

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
  const minValue = Math.min(...chartData.flatMap((series) => series.data));
  const maxValue = Math.max(...chartData.flatMap((series) => series.data));
  const splineChartData = {
    series: chartData,
    options: {
      chart: {
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
          return value?.toFixed(1) + "%";
        },
        position: "top",
      },
      xaxis: {
        type: "datetime" as const, // Set x-axis type to datetime
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
        categories: xAxisCategories,
      },
      yaxis: {
        labels: {
          formatter: function (value: any) {
            return value?.toFixed(1) + "%";
          },
          style: {
            colors: "#6E7681", // Set the color of the labels
            fontSize: "12px",
            fontWeight: "400",
          },
        },
        min: minValue - 0.05 * minValue,
        max: maxValue + 0.05 * maxValue,
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
      colors: ["#2BA26F"],
      grid: {
        borderColor: "#2B2F35",
        padding: {
          bottom: 10, // Add bottom padding to prevent overlap with x-axis labels
        },
      },
      curve: "smooth",
      annotations: {
        xaxis: [
          {
            x: xAxisCategories[0],
            strokeDashArray: 0,
            borderColor: "#292D30",
            borderWidth: 1,
          },
          {
            x: xAxisCategories[xAxisCategories.length - 1], // End position for the box
            strokeDashArray: 0,
            borderColor: "#292D30",
            borderWidth: 1,
          },
        ],
      },
    },
  };
  const options: ApexOptions = {
    ...splineChartData.options,
    stroke: {
      curve: "smooth",
    },
  };

  return (
    <Box display="flex" flexDirection="column" gap="8px" width="50%">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        height="72px"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
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
          <Box mt="auto">Average Supply APR:</Box>
          <Box display="flex" gap="2">
            <Button
              color="#3E415C"
              size="sm"
              border={
                liquidityProviderChartPeriod === 0
                  ? "none"
                  : "1px solid #3E415C"
              }
              variant={liquidityProviderChartPeriod === 0 ? "solid" : "outline"}
              onClick={() => {
                setLiquidityProviderChartPeriod(0);
              }}
            >
              1D
            </Button>
            <Button
              color="#3E415C"
              size="sm"
              border={
                liquidityProviderChartPeriod === 1
                  ? "none"
                  : "1px solid #3E415C"
              }
              variant={liquidityProviderChartPeriod === 1 ? "solid" : "outline"}
              onClick={() => {
                setLiquidityProviderChartPeriod(1);
              }}
              isDisabled={false}
              _disabled={{
                cursor: "pointer",
                color: "#3E415C",
                border: `${
                  liquidityProviderChartPeriod === 2
                    ? "none"
                    : "1px solid #3E415C"
                }`,
              }}
            >
              1W
            </Button>
            <Button
              color="#3E415C"
              size="sm"
              border={
                liquidityProviderChartPeriod === 2
                  ? "none"
                  : "1px solid #3E415C"
              }
              variant={liquidityProviderChartPeriod === 2 ? "solid" : "outline"}
              onClick={() => {
                setLiquidityProviderChartPeriod(2);
              }}
              isDisabled={false}
              _disabled={{
                cursor: "pointer",
                color: "#3E415C",
                border: `${
                  liquidityProviderChartPeriod === 2
                    ? "none"
                    : "1px solid #3E415C"
                }`,
              }}
            >
              1M
            </Button>

            <Button
              color="#3E415C"
              size="sm"
              border={
                liquidityProviderChartPeriod === 3
                  ? "none"
                  : "1px solid #3E415C"
              }
              variant={liquidityProviderChartPeriod === 3 ? "solid" : "outline"}
              onClick={() => {
                setLiquidityProviderChartPeriod(3);
              }}
              isDisabled={true}
              _disabled={{
                cursor: "pointer",
                color: "#3E415C",
                border: `${
                  liquidityProviderChartPeriod === 3
                    ? "none"
                    : "1px solid #3E415C"
                }`,
              }}
            >
              ALL
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
        borderRadius="6px"
        padding="16px 24px 40px"
      >
        <ApexCharts
          options={options}
          series={splineChartData.series}
          type="line"
          height={350}
        />
      </Box>
    </Box>
  );
};

export default SupplyChartChart;

import React, { useEffect, useState } from "react";
import AssetUtilizationChart from "./AssetUtilization";
import { Box, Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  selectHourlyBTCData,
  selectHourlyDAIData,
  selectHourlyETHData,
  selectHourlyUSDCData,
  selectHourlyUSDTData,
} from "@/store/slices/readDataSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const BorrowChart = () => {
  const [liquidityProviderChartPeriod, setLiquidityProviderChartPeriod] =
    useState(0);
  const [chartData, setChartData] = useState([
    {
      name: "Borrow ",
      data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
    },
  ]);
  const [xAxisCategories, setXAxisCategories] = useState([1, 2, 3, 4, 5, 6, 7]);
  const btcData = useSelector(selectHourlyBTCData);
  const ethData = useSelector(selectHourlyETHData);
  const usdtData = useSelector(selectHourlyUSDTData);
  const usdcData = useSelector(selectHourlyUSDCData);
  const daiData = useSelector(selectHourlyDAIData);
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
  const splineColor = ["#804D0F", "#3B48A8", "#136B51", "#1A2683", "#996B22"];
  const fetchDataBasedOnOption = async (option: number) => {
    // Simulating API call or data update based on option
    // Replace this with your actual implementation
    let newData: any = [];
    let newCategories: any = [];

    switch (liquidityProviderChartPeriod) {
      case 0:
        btcData?.borrowAmounts &&
        ethData?.borrowAmounts &&
        usdtData?.borrowAmounts &&
        usdcData?.borrowAmounts &&
        daiData?.borrowAmounts
          ? (newData = [
              {
                name: "BTC",
                data: btcData?.borrowAmounts,
              },
              {
                name: "ETH",
                data: ethData?.borrowAmounts,
              },
              {
                name: "USDT",
                data: usdtData?.borrowAmounts,
              },
              {
                name: "USDC",
                data: usdcData?.borrowAmounts,
              },
              {
                name: "DAI",
                data: daiData?.borrowAmounts,
              },
            ])
          : (newData = [
              {
                name: "BTC",
                data: [
                  10000000000, 4000000000, 10000000000, 1000000000, 20000000000,
                  1000000000, 15000000000, 3000000000, 40000000000, 2000000000,
                  10000000000, 3000000000,
                ],
              },
              {
                name: "ETH",
                data: [
                  20000000000, 4000000000, 20000000000, 4000000000, 20000000000,
                  4000000000, 20000000000, 4000000000, 20000000000, 4000000000,
                  20000000000, 4000000000,
                ],
              },
              {
                name: "USDT",
                data: [
                  30000000000, 4000000000, 30000000000, 3000000000, 40000000000,
                  2000000000, 10000000000, 3000000000, 4000000000, 20000000000,
                  4000000000, 20000000000, 4000000000,
                ],
              },
              {
                name: "USDC",
                data: [
                  40000000000, 2000000000, 10000000000, 3000000000, 10000000000,
                  2000000000, 20000000000, 4000000000, 20000000000, 4000000000,
                  20000000000, 4000000000,
                ],
              },
              {
                name: "DAI",
                data: [
                  10000000000, 4000000000, 10000000000, 1000000000, 20000000000,
                  1000000000, 15000000000, 3000000000, 40000000000, 2000000000,
                  10000000000, 3000000000,
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
            name: "BTC",
            data: [
              10000000000, 4000000000, 10000000000, 1000000000, 20000000000,
              10000000000, 4000000000,
            ],
          },
          {
            name: "ETH",
            data: [
              30000000000, 1000000000, 20000000000, 4000000000, 10000000000,
              10000000000, 1000000000,
            ],
          },
          {
            name: "USDT",
            data: [
              40000000000, 4000000000, 10000000000, 2000000000, 11000000000,
              50000000000, 1300000000,
            ],
          },
          {
            name: "USDC",
            data: [
              50000000000, 2000000000, 12000000000, 2300000000, 21000000000,
              11000000000, 430000000,
            ],
          },
          {
            name: "DAI",
            data: [
              17000000000, 4100000000, 12000000000, 1400000000, 23000000000,
              10000000000, 4000000000,
            ],
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
            name: "BTC",
            data: [
              10000000000, 4000000000, 10000000000, 1000000000, 20000000000,
              10000000000, 4000000000, 11000000000, 50000000000, 1300000000,
            ],
          },
          {
            name: "ETH",
            data: [
              30000000000, 1000000000, 20000000000, 4000000000, 10000000000,
              10000000000, 1000000000, 10000000000, 4000000000, 10000000000,
            ],
          },
          {
            name: "USDT",
            data: [
              40000000000, 4000000000, 10000000000, 2000000000, 11000000000,
              50000000000, 1300000000, 10000000000, 4000000000, 11000000000,
              430000000,
            ],
          },
          {
            name: "USDC",
            data: [
              50000000000, 2000000000, 12000000000, 2300000000, 21000000000,
              11000000000, 430000000, 10000000000, 4000000000, 1300000000,
            ],
          },
          {
            name: "DAI",
            data: [
              17000000000, 4100000000, 12000000000, 1400000000, 23000000000,
              10000000000, 4000000000, 11000000000, 430000000, 10000000000,
              4000000000,
            ],
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
            name: "BTC",
            data: [
              10000000000, 4000000000, 10000000000, 1000000000, 20000000000,
              10000000000, 4000000000, 11000000000, 50000000000, 1300000000,
              4000000000, 430000000,
            ],
          },
          {
            name: "ETH",
            data: [
              30000000000, 1000000000, 20000000000, 4000000000, 10000000000,
              10000000000, 1000000000, 10000000000, 4000000000, 10000000000,
              430000000, 20000000000,
            ],
          },
          {
            name: "USDT",
            data: [
              40000000000, 4000000000, 10000000000, 2000000000, 11000000000,
              50000000000, 1300000000, 10000000000, 4000000000, 11000000000,
              430000000, 10000000000, 11000000000,
            ],
          },
          {
            name: "USDC",
            data: [
              50000000000, 2000000000, 12000000000, 2300000000, 21000000000,
              11000000000, 430000000, 10000000000, 4000000000, 1300000000,
              10000000000, 11000000000,
            ],
          },
          {
            name: "DAI",
            data: [
              17000000000, 4100000000, 12000000000, 1400000000, 23000000000,
              10000000000, 4000000000, 11000000000, 430000000, 10000000000,
              4000000000, 1300000000,
            ],
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
        stacked:true,
      },
      dataLabels: {
        position: "bottom",
        enabled: false,
        style: {
          colors: ["#fff"],
        },
        formatter: function (val: any) {
          return numberFormatter(val); // Display the data value as the label
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
            return numberFormatter(value);
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
      // colors: ["#846ED4"],
      grid: {
        borderColor: "#2B2F35",
        padding: {
          bottom: 10, // Add bottom padding to prevent overlap with x-axis labels
        },
      },
      fill: {
        type: "solid",
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
  const options: ApexOptions = {
    ...splineChartData.options,
    // stroke: {
    //   ...splineChartData.options.stroke,
    //   curve: "smooth",
    // },
    colors: splineColor,
    // colors: ["#804D0F", "#3B48A8","#136B5","#1A2683","#996B22"],
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
          <Box mt="auto">Borrow :</Box>
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
          options={options}
          series={splineChartData.series}
          type="area"
          height={350}
        />
      </Box>
    </Box>
  );
};

export default BorrowChart;

import React, { useEffect, useState } from "react";
import AssetUtilizationChart from "./AssetUtilization";
import { Box, Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  selectAllBTCData,
  selectAllDAIData,
  selectAllETHData,
  selectAllUSDCData,
  selectAllUSDTData,
  selectDailyBTCData,
  selectDailyDAIData,
  selectDailyETHData,
  selectDailySTRKData,
  selectDailyUSDCData,
  selectDailyUSDTData,
  selectHourlyBTCData,
  selectHourlyDAIData,
  selectHourlyETHData,
  selectHourlySTRKData,
  selectHourlyUSDCData,
  selectHourlyUSDTData,
  selectMonthlyBTCData,
  selectMonthlyDAIData,
  selectMonthlyETHData,
  selectMonthlySTRKData,
  selectMonthlyUSDCData,
  selectMonthlyUSDTData,
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
  const strkData = useSelector(selectHourlySTRKData);
  const weeklyBtcData = useSelector(selectDailyBTCData);
  const weeklyEthData = useSelector(selectDailyETHData);
  const weeklyUsdtData = useSelector(selectDailyUSDTData);
  const weeklyUsdcData = useSelector(selectDailyUSDCData);
  const weeklyDaiData = useSelector(selectDailyDAIData);
  const weeklyStrkData = useSelector(selectDailySTRKData);
  const monthlyBtcData = useSelector(selectMonthlyBTCData);
  const monthlyEthData = useSelector(selectMonthlyETHData);
  const monthlyUsdtData = useSelector(selectMonthlyUSDTData);
  const monthlyUsdcData = useSelector(selectMonthlyUSDCData);
  const monthlyDaiData = useSelector(selectMonthlyDAIData);
  const monthlyStrkData = useSelector(selectMonthlySTRKData);
  const allBtcData = useSelector(selectAllBTCData);
  const allEthData = useSelector(selectAllETHData);
  const allUsdtData = useSelector(selectAllUSDTData);
  const allUsdcData = useSelector(selectAllUSDCData);
  const allDaiData = useSelector(selectAllDAIData);
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
  const totalBorrow=btcData?.borrowAmounts[btcData?.borrowAmounts.length-1]+ethData?.borrowAmounts[ethData?.borrowAmounts.length-1]+usdtData?.borrowAmounts[usdtData?.borrowAmounts.length-1]+usdcData?.borrowAmounts[usdcData?.borrowAmounts.length-1]+daiData?.borrowAmounts[daiData?.borrowAmounts.length-1];
  //  //console.log(new Date("2022-01-01").getTime(),"trial chart data")
  const splineColor = ["#804D0F", "#3B48A8", "#136B51", "#1A2683", "#996B22","#0C0C4F"];
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
        daiData?.borrowAmounts &&
        strkData?.borrowAmounts
          ? (newData = [
              {
                name: "wBTC",
                data: btcData?.borrowAmounts,
              },
              {
                name: "wETH",
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
              {
                name: "STRK",
                data: strkData?.borrowAmounts,
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
        weeklyBtcData?.borrowAmounts &&
        weeklyEthData?.borrowAmounts &&
        weeklyUsdcData?.borrowAmounts &&
        weeklyUsdtData?.borrowAmounts &&
        weeklyDaiData?.borrowAmounts &&
        weeklyStrkData?.borrowAmounts
          ? (newData = [
              {
                name: "wBTC",
                data: weeklyBtcData?.borrowAmounts,
              },
              {
                name: "wETH",
                data: weeklyEthData?.borrowAmounts,
              },
              {
                name: "USDT",
                data: weeklyUsdtData?.borrowAmounts,
              },
              {
                name: "USDC",
                data: weeklyUsdcData?.borrowAmounts,
              },
              {
                name: "DAI",
                data: weeklyDaiData?.borrowAmounts,
              },
              {
                name: "STRK",
                data: weeklyStrkData?.borrowAmounts,
              },
            ])
          : (newData = [
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
            ]);
        weeklyBtcData?.dates
          ? (newCategories = weeklyBtcData?.dates)
          : (newCategories = [
              new Date("2023-07-01").getTime(),
              new Date("2023-07-02").getTime(),
              new Date("2023-07-03").getTime(),
              new Date("2023-07-04").getTime(),
              new Date("2023-07-05").getTime(),
              new Date("2023-07-06").getTime(),
              new Date("2023-07-07").getTime(),
            ]);
        break;
      case 2:
        //y data axis
        monthlyBtcData?.borrowAmounts &&
        monthlyEthData?.borrowAmounts &&
        monthlyUsdcData?.borrowAmounts &&
        monthlyUsdtData?.borrowAmounts &&
        monthlyDaiData?.borrowAmounts &&
        monthlyStrkData?.borrowAmounts
          ? (newData = [
              {
                name: "wBTC",
                data: monthlyBtcData?.borrowAmounts,
              },
              {
                name: "wETH",
                data: monthlyEthData?.borrowAmounts,
              },
              {
                name: "USDT",
                data: monthlyUsdtData?.borrowAmounts,
              },
              {
                name: "USDC",
                data: monthlyUsdcData?.borrowAmounts,
              },
              {
                name: "DAI",
                data: monthlyDaiData?.borrowAmounts,
              },
              {
                name: "STRK",
                data: monthlyStrkData?.borrowAmounts,
              },
            ]):
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
        monthlyBtcData?.dates ? newCategories=monthlyBtcData?.dates:
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
        allBtcData?.borrowAmounts &&
        allEthData?.borrowAmounts &&
        allUsdcData?.borrowAmounts &&
        allUsdtData?.borrowAmounts &&
        allDaiData?.borrowAmounts
          ? (newData = [
              {
                name: "wBTC",
                data: allBtcData?.borrowAmounts,
              },
              {
                name: "wETH",
                data: allEthData?.borrowAmounts,
              },
              {
                name: "USDT",
                data: allUsdtData?.borrowAmounts,
              },
              {
                name: "USDC",
                data: allUsdcData?.borrowAmounts,
              },
              {
                name: "DAI",
                data: allDaiData?.borrowAmounts,
              },
            ]):
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
        allBtcData?.dates ? newCategories=allBtcData?.dates:
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
      default:
        break;
    }

    return { newData, newCategories };
  };
  const minValue = Math.min(...chartData.flatMap((series) => series.data));
  // const maxValue = Math.max(...chartData.flatMap((series) => series.data));
  const splineChartData = {
    series: chartData,
    options: {
      chart: {
        // width:"full",
        // height:"100",


       
        toolbar: {
          show: false,
        },
        stacked: true,
      },
      dataLabels: {
        position: "bottom",
        enabled: false,
        style: {
          colors: ["#fff"],
        },
        formatter: function (val: any) {
          return "$" + numberFormatter(val); // Display the data value as the label
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
            return "$" + numberFormatter(value);
          },
          style: {
            colors: "#6E7681", // Set the color of the labels
            fontSize: "12px",
            fontWeight: "400",
          },
        },
        min: minValue - 0.05 * minValue,
        
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
      legend: {
      
        // offsetY:20,
      
        fontSize: "12px",
        fontWeight: "400",
        labels: {
          colors: "#fff",

          // Set the color of the legend texts to white
        },
        // itemMargin: {
           
        //   vertical: 18
        // }
        
      },
      fill: {
        type: "solid",
      },
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
    // stroke: {
    //   ...splineChartData.options.stroke,
    //   curve: "smooth",
    // },
    colors: splineColor,
    // padding:{
    //   top:10,
    //   bottom:10
    // },
    // colors: ["#804D0F", "#3B48A8","#136B5","#1A2683","#996B22"],
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
          <Box mt="auto">Borrow : ${numberFormatter(totalBorrow)}</Box>
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
          type="area"
          height={350}
        />
      </Box>
    </Box>
  );
};

export default BorrowChart;

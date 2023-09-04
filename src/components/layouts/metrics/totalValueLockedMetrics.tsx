import React, { useEffect, useState } from "react";
import { Box, Button, Skeleton } from "@chakra-ui/react";
import AssetUtilizationChart from "../charts/AssetUtilization";
import AssetUtilizationRateChart from "../charts/AssetUtilizationRate";
import SupplyAprChart from "../charts/SupplyApr";
import BorrowAprChart from "../charts/BorrowApr";
import RiskPremiumChart from "../charts/RiskPremium";
import SupplyAPRLiquidityProvider from "../charts/supplyAPRLiquitityProvider";
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
  selectDailyUSDCData,
  selectDailyUSDTData,
  selectHourlyBTCData,
  selectHourlyDAIData,
  selectHourlyETHData,
  selectHourlyUSDCData,
  selectHourlyUSDTData,
  selectMonthlyBTCData,
  selectMonthlyDAIData,
  selectMonthlyETHData,
  selectMonthlyUSDCData,
  selectMonthlyUSDTData,
  selectProtocolReserves,
} from "@/store/slices/readDataSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import UtilisationRateChart from "../charts/utilisationRateChart";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalValueLockedMetrics = () => {
  const protocolReserves = useSelector(selectProtocolReserves);

  const [aprByMarket, setAPRByMarket] = useState(0);
  const [chartData, setChartData] = useState([
    {
      name: "Total Value Locked",
      data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
    },
  ]);
  const [xAxisCategories, setXAxisCategories] = useState([1, 2, 3, 4, 5, 6, 7]);
  const btcData = useSelector(selectHourlyBTCData);
  const ethData = useSelector(selectHourlyETHData);
  const usdtData = useSelector(selectHourlyUSDTData);
  const usdcData = useSelector(selectHourlyUSDCData);
  const daiData = useSelector(selectHourlyDAIData);
  const weeklyBtcData = useSelector(selectDailyBTCData);
  const weeklyEthData = useSelector(selectDailyETHData);
  const weeklyUsdtData = useSelector(selectDailyUSDTData);
  const weeklyUsdcData = useSelector(selectDailyUSDCData);
  const weeklyDaiData = useSelector(selectDailyDAIData);
  const monthlyBtcData = useSelector(selectMonthlyBTCData);
  const monthlyEthData = useSelector(selectMonthlyETHData);
  const monthlyUsdtData = useSelector(selectMonthlyUSDTData);
  const monthlyUsdcData = useSelector(selectMonthlyUSDCData);
  const monthlyDaiData = useSelector(selectMonthlyDAIData);
  const allBtcData = useSelector(selectAllBTCData);
  const allEthData = useSelector(selectAllETHData);
  const allUsdtData = useSelector(selectAllUSDTData);
  const allUsdcData = useSelector(selectAllUSDCData);
  const allDaiData = useSelector(selectAllDAIData);
  // console.log(btcData,"data tvl")
  useEffect(() => {
    // Fetch data based on selected option
    const fetchData = async () => {
      // Simulating API call or data update
      const { newData, newCategories } = await fetchDataBasedOnOption(
        aprByMarket
      );
      setChartData(newData);
      setXAxisCategories(newCategories);
    };

    fetchData();
  }, [aprByMarket]);
  const tvlamounts: any = [];
  const tvlAmountsWeekly: any = [];
  const tvlAmountsMonthly:any=[];
  const alltvlAmount:any=[];
  // console.log(btcData?.tvlAmounts,"data btc")
  // console.log(ethData?.tvlAmounts,"data eth")
  // console.log(usdtData?.tvlAmounts,"data usdt")
  // console.log(usdcData?.tvlAmounts,"data usdc")
  // console.log(daiData?.tvlAmounts,"data dai")
  for (let i = 0; i < btcData?.tvlAmounts?.length; i++) {
    var data =
      btcData?.tvlAmounts[i] +
      ethData?.tvlAmounts[i] +
      usdcData?.tvlAmounts[i] +
      usdtData?.tvlAmounts[i] +
      daiData?.tvlAmounts[i];
    tvlamounts.push(data);
  }
  for (let i = 0; i < weeklyBtcData?.tvlAmounts?.length; i++) {
    var data =
      weeklyBtcData?.tvlAmounts[i] +
      weeklyEthData?.tvlAmounts[i] +
      weeklyUsdcData?.tvlAmounts[i] +
      weeklyUsdtData?.tvlAmounts[i] +
      weeklyDaiData?.tvlAmounts[i];
    tvlAmountsWeekly.push(data);
  }
  for (let i = 0; i < monthlyBtcData?.tvlAmounts?.length; i++) {
    var data =
      monthlyBtcData?.tvlAmounts[i] +
      monthlyEthData?.tvlAmounts[i] +
      monthlyUsdcData?.tvlAmounts[i] +
      monthlyUsdtData?.tvlAmounts[i] +
      monthlyDaiData?.tvlAmounts[i];
    tvlAmountsMonthly.push(data);
  }
  for (let i = 0; i < allBtcData?.tvlAmounts?.length; i++) {
    var data =
      allBtcData?.tvlAmounts[i] +
      allEthData?.tvlAmounts[i] +
      allUsdcData?.tvlAmounts[i] +
      allUsdtData?.tvlAmounts[i] +
      allDaiData?.tvlAmounts[i];
    alltvlAmount.push(data);
  }
  // console.log(tvlamounts,"amounts");
  //   console.log(new Date("2022-01-01").getTime(),"trial chart data")

  const fetchDataBasedOnOption = async (option: number) => {
    // Simulating API call or data update based on option
    // Replace this with your actual implementation
    let newData: any = [];
    let newCategories: any = [];

    switch (aprByMarket) {
      case 0:
        btcData?.tvlAmounts
          ? (newData = [
              {
                name: "Total Value Locked",
                data: tvlamounts,
              },
            ])
          : (newData = [
              {
                name: "Total Value Locked",
                data: [
                  30000, 40000, 35000, 50000, 49000, 60000, 80000, 35000, 50000,
                  49000, 60000, 80000,
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
        weeklyBtcData?.tvlAmounts
          ? (newData = [
              {
                name: "Total Value Locked",
                data: tvlAmountsWeekly,
              },
            ])
          : (newData = [
              {
                name: "Total Value Locked",
                data: [40000, 0, 42000, 39000, 44000, 41000, 43000],
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
        monthlyBtcData?.tvlAmounts ?
        newData=[
          {
            name:"Total Value Locked",
            data:tvlAmountsMonthly
          }
        ]:
        newData = [
          {
            name: "Total Value Locked",
            data: [
              50000, 49000, 52000, 48000, 51000, 48000, 50000, 52000, 48000,
              51000, 48000, 50000, 52000, 48000, 51000, 48000, 50000, 48000,
              51000, 48000, 50000, 52000, 48000, 51000, 48000, 50000, 48000,
              51000, 48000, 30000,
            ],
          },
        ];
        //x axis data
        monthlyBtcData?.dates ? newCategories=monthlyBtcData?.dates :
        newCategories = [
          new Date("2023-06-01").getTime(),
          new Date("2023-06-02").getTime(),
          new Date("2023-06-03").getTime(),
          new Date("2023-06-04").getTime(),
          new Date("2023-06-05").getTime(),
          new Date("2023-06-06").getTime(),
          new Date("2023-06-07").getTime(),
          new Date("2023-06-08").getTime(),
          new Date("2023-06-09").getTime(),
          new Date("2023-06-10").getTime(),
          new Date("2023-06-11").getTime(),
          new Date("2023-06-12").getTime(),
          new Date("2023-06-13").getTime(),
          new Date("2023-06-14").getTime(),
          new Date("2023-06-15").getTime(),
          new Date("2023-06-16").getTime(),
          new Date("2023-06-17").getTime(),
          new Date("2023-06-18").getTime(),
          new Date("2023-06-19").getTime(),
          new Date("2023-06-20").getTime(),
          new Date("2023-06-21").getTime(),
          new Date("2023-06-22").getTime(),
          new Date("2023-06-23").getTime(),
          new Date("2023-06-24").getTime(),
          new Date("2023-06-25").getTime(),
          new Date("2023-06-26").getTime(),
          new Date("2023-06-27").getTime(),
          new Date("2023-06-28").getTime(),
          new Date("2023-06-29").getTime(),
          new Date("2023-06-30").getTime(),
        ];
        break;
      case 3:
        allBtcData?.tvlAmounts ?
        newData=[
          {
            name:"Total Value Locked",
            data:alltvlAmount
          }
        ]:
        newData = [
          {
            name: "Total Value Locked",
            data: [
              50000, 49000, 52000, 48000, 51000, 48000, 50000, 52000, 48000,
              51000, 48000, 50000, 52000, 48000, 51000, 48000, 50000, 48000,
              51000, 48000, 50000, 52000, 48000, 51000, 48000, 50000, 48000,
              51000, 48000, 30000,
            ],
          },
        ];
        //x axis data
        allBtcData?.dates ? newCategories=allBtcData?.dates :
        newCategories = [
          new Date("2023-06-01").getTime(),
          new Date("2023-06-02").getTime(),
          new Date("2023-06-03").getTime(),
          new Date("2023-06-04").getTime(),
          new Date("2023-06-05").getTime(),
          new Date("2023-06-06").getTime(),
          new Date("2023-06-07").getTime(),
          new Date("2023-06-08").getTime(),
          new Date("2023-06-09").getTime(),
          new Date("2023-06-10").getTime(),
          new Date("2023-06-11").getTime(),
          new Date("2023-06-12").getTime(),
          new Date("2023-06-13").getTime(),
          new Date("2023-06-14").getTime(),
          new Date("2023-06-15").getTime(),
          new Date("2023-06-16").getTime(),
          new Date("2023-06-17").getTime(),
          new Date("2023-06-18").getTime(),
          new Date("2023-06-19").getTime(),
          new Date("2023-06-20").getTime(),
          new Date("2023-06-21").getTime(),
          new Date("2023-06-22").getTime(),
          new Date("2023-06-23").getTime(),
          new Date("2023-06-24").getTime(),
          new Date("2023-06-25").getTime(),
          new Date("2023-06-26").getTime(),
          new Date("2023-06-27").getTime(),
          new Date("2023-06-28").getTime(),
          new Date("2023-06-29").getTime(),
          new Date("2023-06-30").getTime(),
        ];
        break;
      case 4:
        newData = [
          {
            name: "Total Value Locked",
            data: [
              60000, 58000, 62000, 59000, 63000, 60000, 62000, 59000, 63000,
              60000, 62000, 70000,
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
        type: "datetime" as const,
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

        categories: xAxisCategories,
      },
      yaxis: {
        labels: {
          formatter: function (value: any) {
            return "$" + numberFormatter(value); // Divide by 1000 and append 'k' for thousands
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
            x: 0,
            strokeDashArray: 0,
            borderColor: "grey",
            borderWidth: 1,
          },
        ],
      },

      stroke: {
        curve: "smooth",
        colors: ["#2BA26F"],
        opacity: 1,
      },
      grid: {
        borderColor: "#2B2F35",
      },
      legend: {
        show: false, // Hide the series buttons when only one series is present
      },
      colors: ["#2BA26F"],
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
    <Box display="flex" gap="30px" w="full">
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
            {!protocolReserves ? (
              <Skeleton
                width="6rem"
                height="1.9rem"
                startColor="#101216"
                endColor="#2B2F35"
                borderRadius="6px"
              />
            ) : (
              <Box mt="auto" display="flex">
                Total Value Locked: $
                {protocolReserves?.totalReserves ? (
                  numberFormatter(protocolReserves?.totalReserves)
                ) : (
                  <Skeleton
                    width="6rem"
                    height="1.4rem"
                    startColor="#101216"
                    endColor="#2B2F35"
                    borderRadius="6px"
                    my={1}
                    mx={2}
                  />
                )}
              </Box>
            )}
            <Box display="flex" gap="2">
              <Button
                color="#2B2F35"
                size="sm"
                border={aprByMarket === 0 ? "none" : "1px solid #2B2F35"}
                variant={aprByMarket === 0 ? "solid" : "outline"}
                onClick={() => {
                  setAPRByMarket(0);
                }}
              >
                1D
              </Button>
              <Button
                color="#2B2F35"
                size="sm"
                border={aprByMarket === 1 ? "none" : "1px solid #2B2F35"}
                variant={aprByMarket === 1 ? "solid" : "outline"}
                onClick={() => {
                  setAPRByMarket(1);
                }}
                isDisabled={true}
                _disabled={{
                  cursor: "pointer",
                  color: "#2B2F35",
                  border: `${aprByMarket === 2 ? "none" : "1px solid #2B2F35"}`,
                }}
              >
                1W
              </Button>
              <Button
                color="#2B2F35"
                size="sm"
                border={aprByMarket === 2 ? "none" : "1px solid #2B2F35"}
                variant={aprByMarket === 2 ? "solid" : "outline"}
                onClick={() => {
                  setAPRByMarket(2);
                }}
                isDisabled={true}
                _disabled={{
                  cursor: "pointer",
                  color: "#2B2F35",
                  border: `${aprByMarket === 2 ? "none" : "1px solid #2B2F35"}`,
                }}
              >
                1M
              </Button>

              <Button
                color="#2B2F35"
                size="sm"
                border={aprByMarket === 3 ? "none" : "1px solid #2B2F35"}
                variant={aprByMarket === 3 ? "solid" : "outline"}
                onClick={() => {
                  setAPRByMarket(3);
                }}
                isDisabled={true}
                _disabled={{
                  cursor: "pointer",
                  color: "#2B2F35",
                  border: `${aprByMarket === 3 ? "none" : "1px solid #2B2F35"}`,
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
      <UtilisationRateChart />
    </Box>
  );
};

export default TotalValueLockedMetrics;

import React, { useEffect, useState } from "react";
import AssetUtilizationChart from "./AssetUtilization";
import { Box, Button } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import { useSelector } from "react-redux";
import { selectHourlyBTCData } from "@/store/slices/readDataSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const ExchangeRatesChart = () => {
  const [liquidityProviderChartPeriod, setLiquidityProviderChartPeriod] =
    useState(0);
  const [chartData, setChartData] = useState([
    {
      name: "Series 1",
      data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
    },
  ]);
  const btcData=useSelector(selectHourlyBTCData);
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

    switch (liquidityProviderChartPeriod) {
      case 0:
        btcData?.exchangeRates ? newData = [
          {
            name: "BTC",
            data: btcData?.exchangeRates,
          },
        ]:newData = [
          {
            name: "BTC",
            data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
          },
        ]
        ;
        btcData?.dates ?
        newCategories = btcData?.dates:newCategories = [
          new Date("2023-07-01").getTime(),
          new Date("2023-07-02").getTime(),
          new Date("2023-07-03").getTime(),
          new Date("2023-07-04").getTime(),
          new Date("2023-07-05").getTime(),
          new Date("2023-07-06").getTime(),
          new Date("2023-07-07").getTime(),
        ];
        break;
      case 1:
        btcData?.exchangeRates ? newData = [
          {
            name: "ETH",
            data: btcData?.exchangeRates,
          },
        ]:newData = [
          {
            name: "ETH",
            data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
          },
        ]
        ;
        btcData?.dates ?
        newCategories = btcData?.dates:newCategories = [
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
            name: "DAI",
            data: [30000, 40000, 35000, 50000, 49000, 60000, 80000, 50000, 49000, 60000, 80000,50000],
          },
        ]
        ;
        btcData?.dates ?
        newCategories = btcData?.dates:newCategories = [
          new Date("2023-07-01").getTime(),
          new Date("2023-07-02").getTime(),
          new Date("2023-07-03").getTime(),
          new Date("2023-07-04").getTime(),
          new Date("2023-07-05").getTime(),
          new Date("2023-07-06").getTime(),
          new Date("2023-07-07").getTime(),
        ];
        break;
      case 3:
        btcData?.exchangeRates ? newData = [
          {
            name: "USDC",
            data: btcData?.exchangeRates,
          },
        ]:newData = [
          {
            name: "USDC",
            data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
          },
        ]
        ;
        btcData?.dates ?
        newCategories = btcData?.dates:newCategories = [
          new Date("2023-07-01").getTime(),
          new Date("2023-07-02").getTime(),
          new Date("2023-07-03").getTime(),
          new Date("2023-07-04").getTime(),
          new Date("2023-07-05").getTime(),
          new Date("2023-07-06").getTime(),
          new Date("2023-07-07").getTime(),
        ];
        break;
      case 4:
        newData = [
          {
            name: "USDT",
            data: [30000, 40000, 35000, 50000, 49000, 60000, 80000, 50000, 49000, 60000, 80000,50000],
          },
        ]
        ;
        btcData?.dates ?
        newCategories = btcData?.dates:newCategories = [
          new Date("2023-07-01").getTime(),
          new Date("2023-07-02").getTime(),
          new Date("2023-07-03").getTime(),
          new Date("2023-07-04").getTime(),
          new Date("2023-07-05").getTime(),
          new Date("2023-07-06").getTime(),
          new Date("2023-07-07").getTime(),
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
        enabled: true,
        style: {
          colors: ["#fff"],
        },
        formatter: function (val: any) {
          return numberFormatter(val); // Display the data value as the label
        },
      },

      xaxis: {
        type:"datetime" as const,
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
      colors: ["#2BA26F"],
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
    <Box display="flex" flexDirection="column" gap="8px" width="100%">
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
          <Box mt="auto">Exchange rates:</Box>
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
              BTC
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
            >
              ETH
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
            >
              DAI
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
            >
              USDC
            </Button>
            <Button
              color="#2B2F35"
              size="sm"
              border={
                liquidityProviderChartPeriod === 4
                  ? "none"
                  : "1px solid #2B2F35"
              }
              variant={liquidityProviderChartPeriod === 4 ? "solid" : "outline"}
              onClick={() => {
                setLiquidityProviderChartPeriod(4);
              }}
            >
              USDT
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
          type="bar"
          height={350}
        />
      </Box>
    </Box>
  );
};

export default ExchangeRatesChart;

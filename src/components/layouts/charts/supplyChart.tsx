import React, { useEffect, useState } from "react";
import AssetUtilizationChart from "./AssetUtilization";
import { Box, Button } from "@chakra-ui/react";
import ApexCharts from "react-apexcharts";
import { useSelector } from "react-redux";
import { selectHourlyBTCData } from "@/store/slices/readDataSlice";
import numberFormatter from "@/utils/functions/numberFormatter";

const SupplyChart = () => {
  const [liquidityProviderChartPeriod, setLiquidityProviderChartPeriod] =
    useState(0);
  const [chartData, setChartData] = useState([
    {
      name: "Series 1",
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
  const btcData=useSelector(selectHourlyBTCData)
  console.log(btcData?.supplyAmounts,"data protocol")
  //   console.log(new Date("2022-01-01").getTime(),"trial chart data")

  const fetchDataBasedOnOption = async (option: number) => {
    // Simulating API call or data update based on option
    // Replace this with your actual implementation
    let newData: any = [];
    let newCategories: any = [];

    switch (liquidityProviderChartPeriod) {
      case 0:
        btcData?.supplyAmounts ? newData = [
          {
            name: "Series 1",
            data: btcData?.supplyAmounts,
          },
        ]:newData=[
          {
            name:"Series 1",
            data:[20000,40000, 38000, 42000, 39000, 44000]
          }
        ];
        btcData?.dates ?
        newCategories = btcData?.dates : newCategories=[
          new Date("2023-06-01").getTime(),
          new Date("2023-06-02").getTime(),
          new Date("2023-06-03").getTime(),
          new Date("2023-06-04").getTime(),
          new Date("2023-06-05").getTime()
        ];
        break;
      case 1:
        newData = [
          {
            name: "Series 1",
            data: [
              40000, 38000, 42000, 39000, 44000, 41000, 43000, 39000, 44000,
              41000, 43000, 39000, 44000, 41000, 43000, 39000, 44000, 41000,
              43000,
            ],
          },
        ];
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
        ];
        break;
      case 2:
        //y data axis
        newData = [
          {
            name: "Series 1",
            data: [50000, 49000, 52000, 48000, 51000, 48000, 50000],
          },
        ];
        //x axis data
        newCategories = [
          new Date("2023-01-01").getTime(),
          new Date("2023-02-01").getTime(),
          new Date("2023-03-01").getTime(),
          new Date("2023-04-01").getTime(),
          new Date("2023-05-01").getTime(),
          new Date("2023-06-01").getTime(),
          new Date("2023-07-01").getTime(),
        ];
        break;
      case 3:
        newData = [
          {
            name: "Series 1",
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
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        position: "bottom",
        enabled: true,
        style: {
          colors: ["#000000"],
        },
        formatter: function (val: any) {
          return numberFormatter(val); // Display the data value as the label
        },
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
          formatter:
          function (value: any) {
                return numberFormatter(value);
              },
          style: {
            colors: "#6E7681",
            fontSize: "12px",
            fontWeight: "400",
          },
        },
        min: 0,
      },
      plotOptions: {
        bar: {
          opacity: 1,
          columnWidth: "70%",
          colors: {
            backgroundBarOpacity: 1,
          },
        },
      },
      colors: ["#846ED4"],
      grid: {
        borderColor: "#2B2F35",
        padding: {
          bottom: 10,
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
          <Box mt="auto">Supply :</Box>
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
            >
              1M
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
              3M
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
          type="bar"
          height={350}
        />
      </Box>
    </Box>
  );
};

export default SupplyChart;

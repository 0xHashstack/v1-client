import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import SupplyAprChart from "./SupplyApr";
import { useSelector } from "react-redux";
import { selectHourlyBTCData } from "@/store/slices/readDataSlice";
import numberFormatter from "@/utils/functions/numberFormatter";

const SupplyChart = () => {
  // const [selectedOption, setSelectedOption] = useState("1week");
  const [supplyAPRChartPeriod, setSupplyAPRChartPeriod] = useState(0);
  const btcData = useSelector(selectHourlyBTCData);
  const [chartData, setChartData] = useState([
    {
      name: "Series 1",
      data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
    },
  ]);
  const [xAxisCategories, setXAxisCategories] = useState([new Date().getTime()]);
  useEffect(() => {
    // Fetch data based on selected option
    const fetchData = async () => {
      // Simulating API call or data update
      const { newData, newCategories } =  fetchDataBasedOnOption(
        supplyAPRChartPeriod
      );
      setChartData(newData);
      setXAxisCategories(newCategories);
    };

    fetchData();
  }, [supplyAPRChartPeriod]);
  //   console.log(new Date("2022-01-01").getTime(),"trial chart data")

  const fetchDataBasedOnOption =  (option: number) => {
    // Simulating API call or data update based on option
    // Replace this with your actual implementation
    let newData: any = [];
    let newCategories: any = [];

    switch (supplyAPRChartPeriod) {
      case 0:
        newData = [
          {
            name: "Series 1",
            data:   btcData?.supplyAmounts,
          },
        ];
        newCategories = btcData?.dates;
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

  const splineChartData1 = {
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
        type: "datetime", // Set x-axis type to datetime
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

  const splineChartData2 = {
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
        formatter: function (val: any) {
          return numberFormatter(val); // Display the data value as the label
        },
        position: "top",
      },
      markers: {
        size: 2,
        colors: ["#fff"],
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
    <Box display="flex" gap="30px" w="full">
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
            <Box mt="auto">Supply:</Box>
            <Box display="flex" gap="2">
              <Button
                color="#2B2F35"
                size="sm"
                border={
                  supplyAPRChartPeriod === 0 ? "none" : "1px solid #2B2F35"
                }
                variant={supplyAPRChartPeriod === 0 ? "solid" : "outline"}
                onClick={() => {
                  setSupplyAPRChartPeriod(0);
                }}
              >
                1D
              </Button>
              <Button
                color="#2B2F35"
                size="sm"
                border={
                  supplyAPRChartPeriod === 1 ? "none" : "1px solid #2B2F35"
                }
                variant={supplyAPRChartPeriod === 1 ? "solid" : "outline"}
                onClick={() => {
                  setSupplyAPRChartPeriod(1);
                }}
              >
                1M
              </Button>
              <Button
                color="#2B2F35"
                size="sm"
                border={
                  supplyAPRChartPeriod === 2 ? "none" : "1px solid #2B2F35"
                }
                variant={supplyAPRChartPeriod === 2 ? "solid" : "outline"}
                onClick={() => {
                  setSupplyAPRChartPeriod(2);
                }}
              >
                3M
              </Button>

              <Button
                color="#2B2F35"
                size="sm"
                border={
                  supplyAPRChartPeriod === 3 ? "none" : "1px solid #2B2F35"
                }
                variant={supplyAPRChartPeriod === 3 ? "solid" : "outline"}
                onClick={() => {
                  setSupplyAPRChartPeriod(3);
                }}
              >
                ALL
              </Button>
            </Box>
          </Box>
        </Box>
        {/* <AssetUtilizationChart
            color={"#846ED4"}
            series={series1[supplyAPRChartPeriod]}
            chartType="bar"
          /> */}
        <Box
          border="1px solid #2B2F35"
          borderRadius="6px"
          padding="16px 24px 40px"
        >
          <ApexCharts
            options={splineChartData1.options}
            series={splineChartData1.series}
            type="bar"
            height={350}
          />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap="8px" width="100%">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          height="72px"
          border="1px solid #2B2F35"
          color="#E6EDF3"
          padding="24px 24px 16px"
          fontSize="20px"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="30px"
          borderRadius="6px"
        >
          Supply APR:{" "}
        </Box>
        <Box
          border="1px solid #2B2F35"
          borderRadius="6px"
          padding="16px 24px 40px"
        >
          <ApexCharts
            options={splineChartData2.options}
            series={splineChartData2.series}
            type="line"
            height={350}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SupplyChart;

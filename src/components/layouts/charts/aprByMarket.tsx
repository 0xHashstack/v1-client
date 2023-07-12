import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import SmallBlueDot from "@/assets/icons/smallBlueDot";
import SmallGreenDot from "@/assets/icons/smallGreenDot";
import { ApexOptions } from "apexcharts";
import dynamic from 'next/dynamic';
import { useSelector } from "react-redux";
import { selectHourlyBTCData } from "@/store/slices/readDataSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const APRByMarketChart = ({ color, curveColor, series }: any) => {
  const [aprByMarket, setAPRByMarket] = useState(0);
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
        aprByMarket
      );
      setChartData(newData);
      setXAxisCategories(newCategories);
    };

    fetchData();
  }, [aprByMarket]);
  //   console.log(new Date("2022-01-01").getTime(),"trial chart data")

  const fetchDataBasedOnOption = async (option: number) => {
    // Simulating API call or data update based on option
    // Replace this with your actual implementation
    let newData: any = [];
    let newCategories: any = [];

    switch (aprByMarket) {
      case 0:
        newData = [
          {
            name: "Series 1",
            data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
          },
          {
            name: "Series 2",
            data: [20000, 30000, 25000, 40000, 39000, 50000, 70000],
          },
          {
            name: "Series 3",
            data: [35000, 45000, 40000, 55000, 54000, 65000, 85000],
          },
          {
            name: "Series 4",
            data: [40000, 50000, 45000, 60000, 59000, 70000, 90000],
          },
          {
            name: "Series 5",
            data: [25000, 35000, 30000, 45000, 44000, 55000, 75000],
          },
        ];
        newCategories = btcData?.dates;
        break;
      case 1:
        newData = [
          {
            name: "Series 1",
            data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
          },
          {
            name: "Series 2",
            data: [20000, 30000, 25000, 40000, 39000, 50000, 70000],
          },
          {
            name: "Series 3",
            data: [35000, 45000, 40000, 55000, 54000, 65000, 85000],
          },
          {
            name: "Series 4",
            data: [40000, 50000, 45000, 60000, 59000, 70000, 90000],
          },
          {
            name: "Series 5",
            data: [25000, 35000, 30000, 45000, 44000, 55000, 75000],
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
            data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
          },
          {
            name: "Series 2",
            data: [20000, 30000, 25000, 40000, 39000, 50000, 70000],
          },
          {
            name: "Series 3",
            data: [35000, 45000, 40000, 55000, 54000, 65000, 85000],
          },
          {
            name: "Series 4",
            data: [40000, 50000, 45000, 60000, 59000, 70000, 90000],
          },
          {
            name: "Series 5",
            data: [25000, 35000, 30000, 45000, 44000, 55000, 75000],
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
            data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
          },
          {
            name: "Series 2",
            data: [20000, 30000, 25000, 40000, 39000, 50000, 70000],
          },
          {
            name: "Series 3",
            data: [35000, 45000, 40000, 55000, 54000, 65000, 85000],
          },
          {
            name: "Series 4",
            data: [40000, 50000, 45000, 60000, 59000, 70000, 90000],
          },
          {
            name: "Series 5",
            data: [25000, 35000, 30000, 45000, 44000, 55000, 75000],
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
      case 4:
        newData = [
          {
            name: "Series 1",
            data: [30000, 40000, 35000, 50000, 49000, 60000, 80000],
          },
          {
            name: "Series 2",
            data: [20000, 30000, 25000, 40000, 39000, 50000, 70000],
          },
          {
            name: "Series 3",
            data: [35000, 45000, 40000, 55000, 54000, 65000, 85000],
          },
          {
            name: "Series 4",
            data: [40000, 50000, 45000, 60000, 59000, 70000, 90000],
          },
          {
            name: "Series 5",
            data: [25000, 35000, 30000, 45000, 44000, 55000, 75000],
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

      annotations: {

      },

      stroke: {
        curve: "smooth",
        colors: ["#0FCA7A", "#00C7F2"],
        opacity: 1,
      },
      grid: {
        borderColor: "#2B2F35",
      },
      legend: {
        show: false, // Hide the series buttons when only one series is present
      },
      colors: ["#0ebc71", "#04aacf"],
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
          <Box mt="auto">APR by market:</Box>
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
          type="line"
          height={350}
        />
      </Box>
    </Box>
  );
};

export default APRByMarketChart;

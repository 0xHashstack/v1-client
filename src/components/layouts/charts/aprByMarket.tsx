import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, Text } from "@chakra-ui/react";
import SmallBlueDot from "@/assets/icons/smallBlueDot";
import SmallGreenDot from "@/assets/icons/smallGreenDot";
import { ApexOptions } from "apexcharts";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const APRByMarketChart = ({ color, curveColor, series }: any) => {
  const [aprByMarket, setAPRByMarket] = useState(0);
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
      case 4:
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
              1M
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
              3M
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
          type="area"
          height={350}
        />
      </Box>
    </Box>
  );
};

export default APRByMarketChart;

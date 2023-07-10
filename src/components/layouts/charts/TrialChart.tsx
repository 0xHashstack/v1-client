import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, Select } from "@chakra-ui/react";
import ApexCharts from "react-apexcharts";

// const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const TrialChart = ({ series, formatter, color, categories }: any) => {
  const [selectedOption, setSelectedOption] = useState("1week");
  const [chartData, setChartData] = useState(series);
  const [xAxisCategories, setXAxisCategories] = useState(categories);

  useEffect(() => {
    // Fetch data based on selected option
    const fetchData = async () => {
      // Simulating API call or data update
      const { newData, newCategories } = await fetchDataBasedOnOption(
        selectedOption
      );
      setChartData(newData);
      setXAxisCategories(newCategories);
    };

    fetchData();
  }, [selectedOption]);

  const fetchDataBasedOnOption = async (option: string) => {
    // Simulating API call or data update based on option
    // Replace this with your actual implementation
    let newData:any = [];
    let newCategories:any = [];

    switch (option) {
      case "1week":
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
      case "1month":
        newData = [
          {
            name: "Series 1",
            data: [40000, 38000, 42000, 39000, 44000, 41000, 43000, 39000, 44000, 41000, 43000, 39000, 44000, 41000, 43000, 39000, 44000, 41000, 43000],
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
      case "6months":
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
      case "1year":
        newData = [
          {
            name: "Series 1",
            data: [60000, 58000, 62000, 59000, 63000, 60000, 62000, 59000, 63000, 60000, 62000,70000],
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

  const handleChangeOption = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = event.target.value;
    setSelectedOption(option);
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
          return val / 1000 + "k"; // Display the data value as the label
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
          formatter: formatter
            ? formatter
            : function (value: any) {
                return value / 1000 + "k";
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
      colors: [`${color ? color : "#0FCA7A"}`],
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
    <Box border="1px solid #2B2F35" borderRadius="6px" padding="16px 24px 40px">
      <Select
        value={selectedOption}
        onChange={handleChangeOption}
        width="200px"
        marginBottom="16px"
      >
        <option value="1week">1 Week</option>
        <option value="1month">1 Month</option>
        <option value="6months">6 Months</option>
        <option value="1year">1 Year</option>
      </Select>
      <ApexCharts
    options={splineChartData.options}
    series={splineChartData.series}
    type="bar"
    height={350}
  />
        </Box>
  )
}
export default TrialChart;

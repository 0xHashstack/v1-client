import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import SmallBlueDot from "@/assets/icons/smallBlueDot";
import SmallGreenDot from "@/assets/icons/smallGreenDot";
import { ApexOptions } from "apexcharts";
import dynamic from 'next/dynamic';
import { useSelector } from "react-redux";
import { selectHourlyBTCData, selectHourlyDAIData, selectHourlyETHData, selectHourlyUSDCData, selectHourlyUSDTData } from "@/store/slices/readDataSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const APRByMarketChart = ({ color, curveColor, series }: any) => {
  const [aprByMarket, setAPRByMarket] = useState(0);
  const [chartData, setChartData] = useState([
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
  ]);

  const btcData = useSelector(selectHourlyBTCData);
  const ethData = useSelector(selectHourlyETHData);
  const usdtData = useSelector(selectHourlyUSDTData);
  const usdcData = useSelector(selectHourlyUSDCData);
  const daiData = useSelector(selectHourlyDAIData);
  const coinsData = [
    usdtData,
    btcData,
    ethData,
    usdcData,
    daiData,
  ];
  // useEffect(()=>{

  // },[])
  const splineColor = ["#804D0F", "#3B48A8", "#136B51", "#1A2683", "#996B22"]
  const [currentSelectedCoin, setCurrentSelectedCoin] = useState(0);
  console.log(btcData, "btc")
  const [xAxisCategories, setXAxisCategories] = useState([1, 2, 3, 4, 5, 6, 7]);
  useEffect(() => {
    // Fetch data based on selected option
    const fetchData = async () => {
      // Simulating API call or data update
      const { newData, newCategories } = await fetchDataBasedOnOption(
        aprByMarket,
        currentSelectedCoin
      );
      setChartData(newData);
      setXAxisCategories(newCategories);
    };

    fetchData();
    // console.log(coinsData[currentSelectedCoin],"coin apr")
  }, [aprByMarket, currentSelectedCoin]);
  //   console.log(new Date("2022-01-01").getTime(),"trial chart data")

  const fetchDataBasedOnOption = async (option: number, option2: number) => {
    // Simulating API call or data update based on option
    // Replace this with your actual implementation
    let newData: any = [];
    let newCategories: any = [];

    switch (aprByMarket) {
      case 0:
        if (currentSelectedCoin == 0) {
          newData = [
            {
              name: "Supply Apr",
              data: [300, 400, 350,500,490,500,370, 350, 500, 490,200,150],
            },
            {
              name: "Borrow Apr",
              data: [200, 300, 250, 400,390,300, 400,250,280,300,400,500],
            },
          ];
          newCategories = [
            1689152545000,
            1689156145000,
            1689159745000,
            1689163345000,
            1689166945000,
            1689170545000,
            1689174145000,
            1689177745000,
            1689181345000,
            1689184945000,
            1689188545000,
            1689192145000
        ];
          return { newData, newCategories }
        } else if (currentSelectedCoin == 1) {
          btcData?.aprs && btcData?.apys ? newData = [
            {
              name: "Supply Apr",
              data: btcData?.aprs,
            },
            {
              name: "Borrow Apr",
              data: btcData?.apys,
            },
          ] :           newData = [
            {
              name: "Supply Apr",
              data: [300, 400, 350,500,490,500,370, 350, 500, 490,200,150],
            },
            {
              name: "Borrow Apr",
              data: [200, 300, 250, 400,390,300, 400,250,280,300,400,500],
            },
          ];
          btcData?.dates ? newCategories = btcData?.dates :           newCategories = [
            1689152545000,
            1689156145000,
            1689159745000,
            1689163345000,
            1689166945000,
            1689170545000,
            1689174145000,
            1689177745000,
            1689181345000,
            1689184945000,
            1689188545000,
            1689192145000
        ];
          return { newData, newCategories }
        }else if(currentSelectedCoin==2){
          newData = [
            {
              name: "Supply Apr",
              data: [300, 400, 350,500,490,500,370, 350, 500, 490,200,150],
            },
            {
              name: "Borrow Apr",
              data: [200, 300, 250, 400,390,300, 400,250,280,300,400,500],
            },
          ];
          newCategories = [
            1689152545000,
            1689156145000,
            1689159745000,
            1689163345000,
            1689166945000,
            1689170545000,
            1689174145000,
            1689177745000,
            1689181345000,
            1689184945000,
            1689188545000,
            1689192145000
        ];
          return { newData, newCategories }
        }else if(currentSelectedCoin==3){
          btcData?.aprs && btcData?.apys ? newData = [
            {
              name: "Supply Apr",
              data: btcData?.aprs,
            },
            {
              name: "Borrow Apr",
              data: btcData?.apys,
            },
          ] :           newData = [
            {
              name: "Supply Apr",
              data: [300, 400, 350,500,490,500,370, 350, 500, 490,200,150],
            },
            {
              name: "Borrow Apr",
              data: [200, 300, 250, 400,390,300, 400,250,280,300,400,500],
            },
          ];
          btcData?.dates ? newCategories = btcData?.dates :           newCategories = [
            1689152545000,
            1689156145000,
            1689159745000,
            1689163345000,
            1689166945000,
            1689170545000,
            1689174145000,
            1689177745000,
            1689181345000,
            1689184945000,
            1689188545000,
            1689192145000
        ];
          return { newData, newCategories }
        }else{
          newData = [
            {
              name: "Supply Apr",
              data: [300, 400, 350,500,490,500,370, 350, 500, 490,200,150],
            },
            {
              name: "Borrow Apr",
              data: [200, 300, 250, 400,390,300, 400,250,280,300,400,500],
            },
          ];
          newCategories = [
            1689152545000,
            1689156145000,
            1689159745000,
            1689163345000,
            1689166945000,
            1689170545000,
            1689174145000,
            1689177745000,
            1689181345000,
            1689184945000,
            1689188545000,
            1689192145000
        ];
          return { newData, newCategories }
        }
        break;


      case 1:
        if(currentSelectedCoin==0){
          newData = [
            {
              name: "Supply APR",
              data: [300, 400, 350, 500, 490, 600, 800],
            },
            {
              name: "Borrow Apr",
              data: [200, 300, 250, 400, 390, 500, 700],
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
          return {newData,newCategories}
        }else if(currentSelectedCoin==1){
          newData = [
            {
              name: "Supply APR",
              data: [200, 300, 250, 400, 390, 500, 700],
            },
            {
              name: "Borrow Apr",
              data: [300, 400, 350, 500, 490, 600, 800],
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
          return {newData,newCategories}
        }else if(currentSelectedCoin==2){
          newData = [
            {
              name: "Supply APR",
              data: [100, 200, 250, 400, 390, 500, 700],
            },
            {
              name: "Borrow Apr",
              data: [700, 400, 250, 600, 490, 400, 800],
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
          return {newData,newCategories}
        }else if(currentSelectedCoin==3){
          newData = [
            {
              name: "Supply APR",
              data: [200, 300, 250, 400, 390, 500, 700],
            },
            {
              name: "Borrow Apr",
              data: [300, 400, 350, 500, 490, 600, 800],
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
          return {newData,newCategories}
        }else if(currentSelectedCoin==4){
          newData = [
            {
              name: "Supply APR",
              data: [100, 400, 250, 300, 390, 500, 800],
            },
            {
              name: "Borrow Apr",
              data: [300, 400, 350, 300, 490, 500, 800],
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
          return {newData,newCategories}
        }
        break;
      case 2:
        //y data axis
        if(currentSelectedCoin==0){
          newData = [
            {
              name: "Supply Apr",
              data: [300, 400, 350, 500, 490, 600, 800, 500, 490, 600, 800],
            },
            {
              name: "Borrow Apr",
              data: [200, 300, 250, 400, 390, 500, 700, 500, 490, 600, 800],
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
          return {newData,newCategories}
        }else if(currentSelectedCoin==1){
          newData = [
            {
              name: "Supply Apr",
              data: [100, 400, 350, 200, 490, 300, 800, 500, 290, 500, 800],
            },
            {
              name: "Borrow Apr",
              data: [100, 300, 250, 200, 390, 400, 700, 500, 490, 700, 800],
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
          return {newData,newCategories}
        }else if(currentSelectedCoin==2){
          newData = [
            {
              name: "Supply Apr",
              data: [200, 400, 350, 200, 490, 300, 800, 500, 290, 200, 800],
            },
            {
              name: "Borrow Apr",
              data: [200, 300, 250, 100, 390, 800, 700, 500, 490, 700, 200],
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
          return {newData,newCategories}
        }else if(currentSelectedCoin==3){
          newData = [
            {
              name: "Supply Apr",
              data: [100, 400, 350, 200, 490, 300, 800, 500, 290, 500, 800],
            },
            {
              name: "Borrow Apr",
              data: [100, 300, 250, 200, 390, 400, 700, 500, 490, 700, 800],
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
          return {newData,newCategories}
        }else if(currentSelectedCoin==4){
          newData = [
            {
              name: "Supply Apr",
              data: [200, 400, 350, 200, 490, 300, 800, 500, 290, 200, 800],
            },
            {
              name: "Borrow Apr",
              data: [200, 300, 250, 100, 390, 800, 700, 500, 490, 700, 200],
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
          return {newData,newCategories}
        }
        break;
      case 3:
        if(currentSelectedCoin==0){
          newData = [
            {
              name: "Supply Apr",
              data: [300, 400, 350, 500, 490, 600, 800, 500, 490, 600, 800, 400],
            },
            {
              name: "Borrow Apr",
              data: [200, 300, 250, 400, 390, 500, 700, 500, 490, 600, 800, 200],
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
          return {newData,newCategories}
        }else if(currentSelectedCoin==1){
          newData = [
            {
              name: "Supply Apr",
              data: [200, 400, 350, 300, 490, 600, 800, 100, 490, 600, 200, 400],
            },
            {
              name: "Borrow Apr",
              data: [100, 300, 250, 400, 290, 500, 700, 500, 190, 600, 100, 200],
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
          return {newData,newCategories}
        }
        else if(currentSelectedCoin==2){
          newData = [
            {
              name: "Supply Apr",
              data: [100, 300, 250, 400, 290, 500, 700, 500, 190, 600, 100, 200],
            },
            {
              name: "Borrow Apr",
              
              data: [200, 400, 350, 300, 490, 600, 800, 100, 490, 600, 200, 400],
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
          return {newData,newCategories}
        }
        else if(currentSelectedCoin==3){
          newData = [
            {
              name: "Supply Apr",
              data: [200, 400, 350, 300, 490, 600, 800, 100, 490, 600, 200, 400],
            },
            {
              name: "Borrow Apr",
              data: [100, 300, 250, 400, 290, 500, 700, 500, 190, 600, 100, 200],
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
          return {newData,newCategories}
        }else if(currentSelectedCoin==4){
          newData = [
            {
              name: "Supply Apr",
              data: [100, 400, 350, 200, 490, 600, 100, 500, 490, 600, 800, 400],
            },
            {
              name: "Borrow Apr",
              data: [200, 300, 250, 100, 390, 500, 100, 500, 490, 600, 800, 200],
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
          return {newData,newCategories}
        }
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
      stroke: {
        curve: "smooth",
        color: splineColor,
        opacity: 1,
      },
      grid: {
        borderColor: "#2B2F35",
      },
      legend: {
        show: true, // Hide the series buttons when only one series is present
      },
      // colors: ["#804D0F", "#3B48A8","#136B5","#1A2683","#996B22"],
      color: splineColor,
    },
  };
  const options: ApexOptions = {
    ...splineChartData.options,
    stroke: {
      ...splineChartData.options.stroke,
      curve: "smooth",
    },
    colors: splineColor
    // colors: ["#804D0F", "#3B48A8","#136B5","#1A2683","#996B22"],
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
        <Box display="flex" gap="4">
          <Box
            display="flex"
            gap="1"
            bg={currentSelectedCoin === 0 ? "#2c2f34" : "inherit"}
            borderRadius="md"
            p="2"
            onClick={() => setCurrentSelectedCoin(0)}
            cursor="pointer"
          >
            <Box p="1">
              <Box
                height="10px"
                width="10px"
                bgColor="#136B51"
                borderRadius="100%"
              ></Box>
            </Box>
            <Text color="white" fontSize="xs">
              USDT
            </Text>
          </Box>
          <Box
            display="flex"
            gap="1"
            bg={currentSelectedCoin === 1 ? "#2c2f34" : "inherit"}
            borderRadius="md"
            p="2"
            onClick={() => setCurrentSelectedCoin(1)}
            cursor="pointer"
          >
            <Box p="1">
              <Box
                height="10px"
                width="10px"
                bgColor="#804D0F"
                borderRadius="100%"
              ></Box>
            </Box>
            <Text color="white" fontSize="xs">
              BTC
            </Text>
          </Box>
          <Box
            display="flex"
            gap="1"
            bg={currentSelectedCoin === 2 ? "#2c2f34" : "inherit"}
            borderRadius="md"
            p="2"
            onClick={() => setCurrentSelectedCoin(2)}
            cursor="pointer"
          >
            <Box p="1">
              <Box
                height="10px"
                width="10px"
                bgColor="#1A2683"
                borderRadius="100%"
              ></Box>
            </Box>
            <Text color="white" fontSize="xs">
              USDC
            </Text>
          </Box>
          <Box
            display="flex"
            gap="1"
            bg={currentSelectedCoin === 3 ? "#2c2f34" : "inherit"}
            borderRadius="md"
            p="2"
            onClick={() => setCurrentSelectedCoin(3)}
            cursor="pointer"
          >
            <Box p="1">
              <Box
                height="10px"
                width="10px"
                bgColor="#3B48A8"
                borderRadius="100%"
              ></Box>
            </Box>
            <Text color="white" fontSize="xs">
              ETH
            </Text>
          </Box>
          <Box
            display="flex"
            gap="1"
            bg={currentSelectedCoin === 4 ? "#2c2f34" : "inherit"}
            borderRadius="md"
            p="2"
            onClick={() => setCurrentSelectedCoin(4)}
            cursor="pointer"
          >
            <Box p="1">
              <Box
                height="10px"
                width="10px"
                bgColor="#996B22"
                borderRadius="100%"
              ></Box>
            </Box>
            <Text color="white" fontSize="xs">
              DAI
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default APRByMarketChart;

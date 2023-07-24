import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import SmallBlueDot from "@/assets/icons/smallBlueDot";
import SmallGreenDot from "@/assets/icons/smallGreenDot";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import {
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
} from "@/store/slices/readDataSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
import { setCoinSelectedExchangeRateRToken } from "@/store/slices/userAccountSlice";
import {
  selectModalDropDowns,
  setModalDropdown,
} from "@/store/slices/dropdownsSlice";
import mixpanel from "mixpanel-browser";
import BTCLogo from "@/assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import ArrowUp from "@/assets/icons/arrowup";
import UsdcDisabled from "@/assets/icons/coins/usdcDisabled";
import UsdtDisabled from "@/assets/icons/coins/usdtDisabled";
import EthDisabled from "@/assets/icons/coins/ethDisabled";
import DaiDisabled from "@/assets/icons/coins/daiDisabled";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const ExchangeRaterToken = ({ color, curveColor, series }: any) => {
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
  const weeklyBtcData = useSelector(selectDailyBTCData);
  const weeklyEthData = useSelector(selectDailyETHData);
  const weeklyUsdtData = useSelector(selectDailyUSDTData);
  const weeklyUsdcData = useSelector(selectDailyUSDCData);
  const weeklyDaiData = useSelector(selectDailyDAIData);
  const coinsData = [usdtData, btcData, ethData, usdcData, daiData];
  // useEffect(()=>{

  // },[])
  const splineColor = ["#804D0F", "#3B48A8", "#136B51", "#1A2683", "#996B22"];
  const [currentSelectedCoin, setCurrentSelectedCoin] = useState(0);
  //   console.log(btcData, "btc")
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
  const minValue = Math.min(...chartData.flatMap((series) => series.data));
  //   console.log(new Date("2022-01-01").getTime(),"trial chart data")

  const fetchDataBasedOnOption = async (option: number, option2: number) => {
    // Simulating API call or data update based on option
    // Replace this with your actual implementation
    let newData: any = [];
    let newCategories: any = [];

    switch (aprByMarket) {
      case 0:
        if (currentSelectedCoin == 0) {
          btcData?.rTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: btcData?.rTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [
                    300, 400, 350, 500, 490, 500, 370, 350, 500, 490, 200, 150,
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 1) {
          usdtData?.rTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: usdtData?.rTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [
                    300, 400, 350, 500, 490, 500, 370, 350, 500, 490, 200, 150,
                  ],
                },
              ]);
          usdtData?.dates
            ? (newCategories = usdtData?.dates)
            : (newCategories = [
                1689152545000, 1689156145000, 1689159745000, 1689163345000,
                1689166945000, 1689170545000, 1689174145000, 1689177745000,
                1689181345000, 1689184945000, 1689188545000, 1689192145000,
              ]);
          return { newData, newCategories };
        } else if (currentSelectedCoin == 2) {
          usdcData?.rTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: usdcData?.rTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [
                    300, 400, 350, 500, 490, 500, 370, 350, 500, 490, 200, 150,
                  ],
                },
              ]);
          usdcData?.dates
            ? (newCategories = usdcData?.dates)
            : (newCategories = [
                1689152545000, 1689156145000, 1689159745000, 1689163345000,
                1689166945000, 1689170545000, 1689174145000, 1689177745000,
                1689181345000, 1689184945000, 1689188545000, 1689192145000,
              ]);
          return { newData, newCategories };
        } else if (currentSelectedCoin == 3) {
          ethData?.rTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: ethData?.rTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [
                    300, 400, 350, 500, 490, 500, 370, 350, 500, 490, 200, 150,
                  ],
                },
              ]);
          ethData?.dates
            ? (newCategories = ethData?.dates)
            : (newCategories = [
                1689152545000, 1689156145000, 1689159745000, 1689163345000,
                1689166945000, 1689170545000, 1689174145000, 1689177745000,
                1689181345000, 1689184945000, 1689188545000, 1689192145000,
              ]);
        } else {
          daiData?.rTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: daiData?.rTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [
                    300, 400, 350, 500, 490, 500, 370, 350, 500, 490, 200, 150,
                  ],
                },
              ]);
          daiData?.dates
            ? (newCategories = daiData?.dates)
            : (newCategories = [
                1689152545000, 1689156145000, 1689159745000, 1689163345000,
                1689166945000, 1689170545000, 1689174145000, 1689177745000,
                1689181345000, 1689184945000, 1689188545000, 1689192145000,
              ]);
        }
        break;

      case 1:
        if (currentSelectedCoin == 0) {
          weeklyBtcData?.rTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: weeklyBtcData?.rTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [300, 400, 350, 500, 490, 600, 800],
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 1) {
          weeklyUsdtData?.rTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: weeklyUsdtData?.rTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [200, 300, 250, 400, 390, 500, 700],
                },
              ]);
          weeklyUsdtData?.dates
            ? (newCategories = weeklyUsdtData?.dates)
            : (newCategories = [
                new Date("2023-07-01").getTime(),
                new Date("2023-07-02").getTime(),
                new Date("2023-07-03").getTime(),
                new Date("2023-07-04").getTime(),
                new Date("2023-07-05").getTime(),
                new Date("2023-07-06").getTime(),
                new Date("2023-07-07").getTime(),
              ]);
          return { newData, newCategories };
        } else if (currentSelectedCoin == 2) {
          weeklyUsdcData?.rTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: weeklyUsdcData?.rTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [100, 200, 250, 400, 390, 500, 700],
                },
              ]);
          weeklyUsdcData?.dates
            ? (newCategories = weeklyUsdcData?.dates)
            : (newCategories = [
                new Date("2023-07-01").getTime(),
                new Date("2023-07-02").getTime(),
                new Date("2023-07-03").getTime(),
                new Date("2023-07-04").getTime(),
                new Date("2023-07-05").getTime(),
                new Date("2023-07-06").getTime(),
                new Date("2023-07-07").getTime(),
              ]);
          return { newData, newCategories };
        } else if (currentSelectedCoin == 3) {
          weeklyEthData?.rTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: weeklyEthData?.rTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [200, 300, 250, 400, 390, 500, 700],
                },
              ]);
          weeklyEthData?.dates
            ? (newCategories = weeklyEthData?.dates)
            : (newCategories = [
                new Date("2023-07-01").getTime(),
                new Date("2023-07-02").getTime(),
                new Date("2023-07-03").getTime(),
                new Date("2023-07-04").getTime(),
                new Date("2023-07-05").getTime(),
                new Date("2023-07-06").getTime(),
                new Date("2023-07-07").getTime(),
              ]);
          return { newData, newCategories };
        } else if (currentSelectedCoin == 4) {
          weeklyDaiData?.rTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: weeklyDaiData?.rTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [100, 400, 250, 300, 390, 500, 800],
                },
              ]);
          weeklyDaiData?.dates
            ? (newCategories = weeklyDaiData?.dates)
            : (newCategories = [
                new Date("2023-07-01").getTime(),
                new Date("2023-07-02").getTime(),
                new Date("2023-07-03").getTime(),
                new Date("2023-07-04").getTime(),
                new Date("2023-07-05").getTime(),
                new Date("2023-07-06").getTime(),
                new Date("2023-07-07").getTime(),
              ]);
          return { newData, newCategories };
        }
        break;
      case 2:
        //y data axis
        if (currentSelectedCoin == 0) {
          newData = [
            {
              name: "Exchange Rate",
              data: [300, 400, 350, 500, 490, 600, 800, 500, 490, 600, 800],
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 1) {
          newData = [
            {
              name: "Exchange Rate",
              data: [100, 400, 350, 200, 490, 300, 800, 500, 290, 500, 800],
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 2) {
          newData = [
            {
              name: "Exchange Rate",
              data: [200, 400, 350, 200, 490, 300, 800, 500, 290, 200, 800],
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 3) {
          newData = [
            {
              name: "Exchange Rate",
              data: [100, 400, 350, 200, 490, 300, 800, 500, 290, 500, 800],
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 4) {
          newData = [
            {
              name: "Exchange Rate",
              data: [200, 400, 350, 200, 490, 300, 800, 500, 290, 200, 800],
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
          return { newData, newCategories };
        }
        break;
      case 3:
        if (currentSelectedCoin == 0) {
          newData = [
            {
              name: "Exchange Rate",
              data: [
                300, 400, 350, 500, 490, 600, 800, 500, 490, 600, 800, 400,
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 1) {
          newData = [
            {
              name: "Exchange Rate",
              data: [
                200, 400, 350, 300, 490, 600, 800, 100, 490, 600, 200, 400,
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 2) {
          newData = [
            {
              name: "Exchange Rate",
              data: [
                100, 300, 250, 400, 290, 500, 700, 500, 190, 600, 100, 200,
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 3) {
          newData = [
            {
              name: "Exchange Rate",
              data: [
                200, 400, 350, 300, 490, 600, 800, 100, 490, 600, 200, 400,
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 4) {
          newData = [
            {
              name: "Exchange Rate",
              data: [
                100, 400, 350, 200, 490, 600, 100, 500, 490, 600, 800, 400,
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
          return { newData, newCategories };
        }
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
      colors: ["#2BA26F"],
      grid: {
        borderColor: "#2B2F35",
        padding: {
          bottom: 10, // Add bottom padding to prevent overlap with x-axis labels
        },
      },
      curve: "smooth",
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
  //   const options: ApexOptions = {
  //     ...splineChartData.options,
  //     stroke: {
  //       ...splineChartData.options.stroke,
  //     },
  //     colors: ["#2BA26F"],
  //     // colors: ["#804D0F", "#3B48A8","#136B5","#1A2683","#996B22"],
  //   };

  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const handleDropdownClick = (dropdownName: any) => {
    // Dispatches an action called setModalDropdown with the dropdownName as the payload
    dispatch(setModalDropdown(dropdownName));
  };
  const dispatch = useDispatch();

  const modalDropdowns = useSelector(selectModalDropDowns);
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });
  const getCoin = (CoinName: number) => {
    switch (CoinName) {
      case 0:
        return <BTCLogo height={"16px"} width={"16px"} />;
        break;
      case 1:
        return <USDTLogo height={"16px"} width={"16px"} />;
        break;
      case 2:
        return <USDCLogo height={"16px"} width={"16px"} />;
        break;
      case 3:
        return <ETHLogo height={"16px"} width={"16px"} />;
        break;
      case 4:
        return <DAILogo height={"16px"} width={"16px"} />;
        break;
      default:
        break;
    }
  };

  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );

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
          <Box mt="auto">Exchange rate: rToken</Box>
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
              isDisabled={false}
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
                border: `${aprByMarket === 2 ? "none" : "1px solid #2B2F35"}`,
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
        {/* <Box
          display="flex"
          border="1px"
          borderColor="#2B2F35"
          justifyContent="space-between"
          w="35%"
          py="2"
          pl="3"
          pr="3"
          mb="1rem"
          mt="0.3rem"
          borderRadius="md"
          className="navbar"
          cursor="pointer"
          onClick={() => {
            handleDropdownClick("coinSelectedExchangeRateRToken");
            // if (transactionStarted) {
            //   return;
            // } else {
            // }
          }}
        >
          <Box display="flex" gap="1">
            <Box p="1">{getCoin(currentSelectedCoin)}</Box>
            <Text color="white">{coins[currentSelectedCoin]}</Text>
          </Box>

          <Box pt="1" className="navbar-button">
            {activeModal ? <ArrowUp /> : <DropdownUp />}
          </Box>
          {modalDropdowns.coinSelectedExchangeRateRToken && (
            <Box
              w="full"
              left="0"
              bg="#03060B"
              py="2"
              className="dropdown-container"
              boxShadow="dark-lg"
            >
              {coins?.map((coin: any, index: number) => {
                return (
                  <Box
                    key={index}
                    as="button"
                    w="full"
                    // display="flex"
                    alignItems="center"
                    gap="1"
                    pr="2"
                    display="flex"
                    onClick={() => {
                      setCurrentSelectedCoin(index);
                      // setAsset(coin);
                      // setCurrentSupplyAPR(
                      //   coinIndex.find(
                      //     (curr: any) => curr?.token === coin
                      //   )?.idx
                      // );
                      // console.log(coin,"coin in supply modal")

                      dispatch(setCoinSelectedExchangeRateRToken(coin));
                    }}
                  >
                    {index === currentSelectedCoin && (
                      <Box
                        w="3px"
                        h="28px"
                        bg="#0C6AD9"
                        borderRightRadius="md"
                      ></Box>
                    )}
                    <Box
                      w="full"
                      display="flex"
                      py="5px"
                      pl={`${index === currentSelectedCoin ? "1" : "5"}`}
                      pr="6px"
                      gap="1"
                      justifyContent="space-between"
                      bg={`${
                        index === currentSelectedCoin ? "#0C6AD9" : "inherit"
                      }`}
                      borderRadius="md"
                    >
                      <Box display="flex">
                        <Box p="1">{getCoin(coins.indexOf(coin))}</Box>
                        <Text color="white">{coin}</Text>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box> */}
        <Box display="flex" gap="4" mb="1.1rem" mt="0.3rem" fontWeight={500}>
          <Box
            display="flex"
            gap="2"
            bg={currentSelectedCoin === 0 ? "inherit" : "#19191C"}
            borderRadius="md"
            border="1px"
            borderColor={currentSelectedCoin === 0 ? "white" : "#2B2F35"}
            // p="1"
            onClick={() => setCurrentSelectedCoin(0)}
            cursor="pointer"
            p="2"
          >
            <Box>
              {currentSelectedCoin === 0 ? getCoin(0) : <DaiDisabled />}
            </Box>
            <Text
              my="auto"
              color="white"
              fontSize="xs"
              fontWeight="bold"
              textColor={currentSelectedCoin === 0 ? "white" : "#2B2F35"}
            >
              BTC
            </Text>
          </Box>
          <Box
            display="flex"
            gap="2"
            bg={currentSelectedCoin === 3 ? "inherit" : "#19191C"}
            borderRadius="md"
            border="1px"
            borderColor={currentSelectedCoin === 3 ? "white" : "#2B2F35"}
            // p="1"
            onClick={() => setCurrentSelectedCoin(3)}
            cursor="pointer"
            p="2"
          >
            <Box>
              {currentSelectedCoin === 3 ? getCoin(3) : <EthDisabled />}
            </Box>
            <Text
              my="auto"
              color="white"
              fontSize="xs"
              textColor={currentSelectedCoin === 3 ? "white" : "#2B2F35"}
            >
              ETH
            </Text>
          </Box>
          <Box
            display="flex"
            gap="2"
            bg={currentSelectedCoin === 1 ? "inherit" : "#19191C"}
            borderRadius="md"
            border="1px"
            borderColor={currentSelectedCoin === 1 ? "white" : "#2B2F35"}
            // p="1"
            onClick={() => setCurrentSelectedCoin(1)}
            cursor="pointer"
            p="2"
          >
            <Box>
              {currentSelectedCoin === 1 ? getCoin(1) : <UsdtDisabled />}
            </Box>
            <Text
              my="auto"
              color="white"
              fontSize="xs"
              textColor={currentSelectedCoin === 1 ? "white" : "#2B2F35"}
            >
              USDT
            </Text>
          </Box>
          <Box
            display="flex"
            gap="2"
            bg={currentSelectedCoin === 2 ? "inherit" : "#19191C"}
            borderRadius="md"
            border="1px"
            borderColor={currentSelectedCoin === 2 ? "white" : "#2B2F35"}
            // p="1"
            onClick={() => setCurrentSelectedCoin(2)}
            cursor="pointer"
            p="2"
          >
            <Box>
              {currentSelectedCoin === 2 ? getCoin(2) : <UsdcDisabled />}
            </Box>
            <Text
              my="auto"
              color="white"
              fontSize="xs"
              textColor={currentSelectedCoin === 2 ? "white" : "#2B2F35"}
            >
              USDC
            </Text>
          </Box>
          <Box
            display="flex"
            gap="2"
            bg={currentSelectedCoin === 4 ? "inherit" : "#19191C"}
            borderRadius="md"
            border="1px"
            borderColor={currentSelectedCoin === 4 ? "white" : "#2B2F35"}
            // p="1"
            onClick={() => setCurrentSelectedCoin(4)}
            cursor="pointer"
            p="2"
          >
            <Box>
              {currentSelectedCoin === 4 ? getCoin(4) : <DaiDisabled />}
            </Box>
            <Text
              my="auto"
              color="white"
              fontSize="xs"
              textColor={currentSelectedCoin === 4 ? "white" : "#2B2F35"}
            >
              DAI
            </Text>
          </Box>
        </Box>
        <ApexCharts
          options={splineChartData.options}
          series={splineChartData.series}
          type="line"
          height={350}
        />
        {/* <Box display="flex" gap="4">
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
        </Box> */}
      </Box>
    </Box>
  );
};

export default ExchangeRaterToken;

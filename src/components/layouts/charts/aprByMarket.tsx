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
import {
  selectMetricsDropdowns,
  selectModalDropDowns,
  setMetricsDropdown,
  setModalDropdown,
} from "@/store/slices/dropdownsSlice";
import mixpanel from "mixpanel-browser";
import BTCLogo from "@/assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import { setCoinSelectedExchangeRateRToken } from "@/store/slices/userAccountSlice";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import ArrowUp from "@/assets/icons/arrowup";
import Image from "next/image";
import EthDisabled from "@/assets/icons/coins/ethDisabled";
import UsdcDisabled from "@/assets/icons/coins/usdcDisabled";
import UsdtDisabled from "@/assets/icons/coins/usdtDisabled";
import DaiDisabled from "@/assets/icons/coins/daiDisabled";
import BtcDisabled from "@/assets/icons/coins/btcDisabled";
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
  const weeklyBtcData = useSelector(selectDailyBTCData);
  const weeklyEthData = useSelector(selectDailyETHData);
  const weeklyUsdtData = useSelector(selectDailyUSDTData);
  const weeklyUsdcData = useSelector(selectDailyUSDCData);
  const weeklyDaiData = useSelector(selectDailyDAIData);
  // console.log(weeklyUsdtData?.aprs,"aprs")
  const coinsData = [usdtData, btcData, ethData, usdcData, daiData];
  // console.log(usdcData,"usdc data")
  // useEffect(()=>{

  // },[])
  const splineColor = ["#00C7F2", "#846ED4", "#136B51", "#1A2683", "#996B22"];
  const [currentSelectedCoin, setCurrentSelectedCoin] = useState(0);
  // console.log(btcData, "btc")
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
          btcData?.aprs && btcData?.apys
            ? (newData = [
                {
                  name: "Supply Apr",
                  data: btcData?.aprs,
                },
                {
                  name: "Borrow Apr",
                  data: btcData?.apys,
                },
              ])
            : (newData = [
                {
                  name: "Supply Apr",
                  data: [
                    300, 400, 350, 500, 490, 500, 370, 350, 500, 490, 200, 150,
                  ],
                },
                {
                  name: "Borrow Apr",
                  data: [
                    200, 300, 250, 400, 390, 300, 400, 250, 280, 300, 400, 500,
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
          usdtData?.aprs && usdtData?.apys
            ? (newData = [
                {
                  name: "Supply Apr",
                  data: usdtData?.aprs,
                },
                {
                  name: "Borrow Apr",
                  data: usdtData?.apys,
                },
              ])
            : (newData = [
                {
                  name: "Supply Apr",
                  data: [
                    300, 400, 350, 500, 490, 500, 370, 350, 500, 490, 200, 150,
                  ],
                },
                {
                  name: "Borrow Apr",
                  data: [
                    200, 300, 250, 400, 390, 300, 400, 250, 280, 300, 400, 500,
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
          usdcData?.aprs && usdcData?.apys
            ? (newData = [
                {
                  name: "Supply Apr",
                  data: usdcData?.aprs,
                },
                {
                  name: "Borrow Apr",
                  data: usdcData?.apys,
                },
              ])
            : (newData = [
                {
                  name: "Supply Apr",
                  data: [
                    300, 400, 350, 500, 490, 500, 370, 350, 500, 490, 200, 150,
                  ],
                },
                {
                  name: "Borrow Apr",
                  data: [
                    200, 300, 250, 400, 390, 300, 400, 250, 280, 300, 400, 500,
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
          ethData?.aprs && ethData?.apys
            ? (newData = [
                {
                  name: "Supply Apr",
                  data: ethData?.aprs,
                },
                {
                  name: "Borrow Apr",
                  data: ethData?.apys,
                },
              ])
            : (newData = [
                {
                  name: "Supply Apr",
                  data: [
                    300, 400, 350, 500, 490, 500, 370, 350, 500, 490, 200, 150,
                  ],
                },
                {
                  name: "Borrow Apr",
                  data: [
                    200, 300, 250, 400, 390, 300, 400, 250, 280, 300, 400, 500,
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
          return { newData, newCategories };
        } else {
          daiData?.aprs && daiData?.apys
            ? (newData = [
                {
                  name: "Supply Apr",
                  data: daiData?.aprs,
                },
                {
                  name: "Borrow Apr",
                  data: daiData?.apys,
                },
              ])
            : (newData = [
                {
                  name: "Supply Apr",
                  data: [
                    300, 400, 350, 500, 490, 500, 370, 350, 500, 490, 200, 150,
                  ],
                },
                {
                  name: "Borrow Apr",
                  data: [
                    200, 300, 250, 400, 390, 300, 400, 250, 280, 300, 400, 500,
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
          return { newData, newCategories };
        }
        break;

      case 1:
        if (currentSelectedCoin == 0) {
          weeklyBtcData?.aprs && weeklyBtcData?.apys
            ? (newData = [
                {
                  name: "Supply Apr",
                  data: weeklyBtcData?.aprs,
                },
                {
                  name: "Borrow Apr",
                  data: weeklyBtcData?.apys,
                },
              ])
            : (newData = [
                {
                  name: "Supply APR",
                  data: [300, 400, 350, 500, 490, 600, 800],
                },
                {
                  name: "Borrow Apr",
                  data: [200, 300, 250, 400, 390, 500, 700],
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
          weeklyUsdtData?.aprs && weeklyUsdtData?.apys
            ? (newData = [
                {
                  name: "Supply Apr",
                  data: weeklyUsdtData?.aprs,
                },
                {
                  name: "Borrow Apr",
                  data: weeklyUsdtData?.apys,
                },
              ])
            : (newData = [
                {
                  name: "Supply APR",
                  data: [100, 200, 250, 400, 390, 500, 700],
                },
                {
                  name: "Borrow Apr",
                  data: [700, 400, 250, 600, 490, 400, 800],
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
          weeklyUsdcData?.aprs && weeklyUsdcData?.apys
            ? (newData = [
                {
                  name: "Supply Apr",
                  data: weeklyUsdcData?.aprs,
                },
                {
                  name: "Borrow Apr",
                  data: weeklyUsdcData?.apys,
                },
              ])
            : (newData = [
                {
                  name: "Supply APR",
                  data: [100, 200, 250, 400, 390, 500, 700],
                },
                {
                  name: "Borrow Apr",
                  data: [700, 400, 250, 600, 490, 400, 800],
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
          weeklyEthData?.aprs && weeklyEthData?.apys
            ? (newData = [
                {
                  name: "Supply Apr",
                  data: weeklyEthData?.aprs,
                },
                {
                  name: "Borrow Apr",
                  data: weeklyEthData?.apys,
                },
              ])
            : (newData = [
                {
                  name: "Supply APR",
                  data: [100, 400, 250, 300, 390, 500, 800],
                },
                {
                  name: "Borrow Apr",
                  data: [300, 400, 350, 300, 490, 500, 800],
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
          weeklyDaiData?.aprs && weeklyDaiData?.apys
            ? (newData = [
                {
                  name: "Supply Apr",
                  data: weeklyDaiData?.aprs,
                },
                {
                  name: "Borrow Apr",
                  data: weeklyDaiData?.apys,
                },
              ])
            : (newData = [
                {
                  name: "Supply APR",
                  data: [100, 400, 250, 300, 390, 500, 800],
                },
                {
                  name: "Borrow Apr",
                  data: [300, 400, 350, 300, 490, 500, 800],
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 1) {
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 2) {
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 3) {
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
          return { newData, newCategories };
        } else if (currentSelectedCoin == 4) {
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
          return { newData, newCategories };
        }
        break;
      case 3:
        if (currentSelectedCoin == 0) {
          newData = [
            {
              name: "Supply Apr",
              data: [
                300, 400, 350, 500, 490, 600, 800, 500, 490, 600, 800, 400,
              ],
            },
            {
              name: "Borrow Apr",
              data: [
                200, 300, 250, 400, 390, 500, 700, 500, 490, 600, 800, 200,
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
              name: "Supply Apr",
              data: [
                200, 400, 350, 300, 490, 600, 800, 100, 490, 600, 200, 400,
              ],
            },
            {
              name: "Borrow Apr",
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
        } else if (currentSelectedCoin == 2) {
          newData = [
            {
              name: "Supply Apr",
              data: [
                100, 300, 250, 400, 290, 500, 700, 500, 190, 600, 100, 200,
              ],
            },
            {
              name: "Borrow Apr",

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
        } else if (currentSelectedCoin == 3) {
          newData = [
            {
              name: "Supply Apr",
              data: [
                200, 400, 350, 300, 490, 600, 800, 100, 490, 600, 200, 400,
              ],
            },
            {
              name: "Borrow Apr",
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
        } else if (currentSelectedCoin == 4) {
          newData = [
            {
              name: "Supply Apr",
              data: [
                100, 400, 350, 200, 490, 600, 100, 500, 490, 600, 800, 400,
              ],
            },
            {
              name: "Borrow Apr",
              data: [
                200, 300, 250, 100, 390, 500, 100, 500, 490, 600, 800, 200,
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
  const minValue = Math.min(...chartData.flatMap((series) => series.data));
  const maxValue = Math.max(...chartData.flatMap((series) => series.data));
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
          return (val / 100)?.toFixed(1) + "%"; // Display the data value as the label
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
            return (value / 100)?.toFixed(1) + "%";
          },
          style: {
            colors: "#6E7681", // Set the color of the labels
            fontSize: "12px",
            fontWeight: "400",
          },
        },
        min: minValue - 0.05 * minValue,
        max: maxValue + 0.05 * maxValue,
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
    colors: splineColor,
    // colors: ["#804D0F", "#3B48A8","#136B5","#1A2683","#996B22"],
  };

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
            handleDropdownClick("coinSelectedAPRByMarket");
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
          {modalDropdowns.coinSelectedAPRByMarket && (
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

        <Box display="flex" gap="4" mb="1.1rem" mt="0.3rem">
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
              {currentSelectedCoin === 0 ? getCoin(0) : <BtcDisabled />}
            </Box>
            <Text
              my="auto"
              color="white"
              fontSize="xs"
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

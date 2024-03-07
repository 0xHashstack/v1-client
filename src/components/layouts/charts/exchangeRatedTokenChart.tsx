import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import SmallBlueDot from "@/assets/icons/smallBlueDot";
import SmallGreenDot from "@/assets/icons/smallGreenDot";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllBTCData,
  selectAllDAIData,
  selectAllETHData,
  selectAllUSDCData,
  selectAllUSDTData,
  selectDailyBTCData,
  selectDailyDAIData,
  selectDailyETHData,
  selectDailySTRKData,
  selectDailyUSDCData,
  selectDailyUSDTData,
  selectHourlyBTCData,
  selectHourlyDAIData,
  selectHourlyETHData,
  selectHourlySTRKData,
  selectHourlyUSDCData,
  selectHourlyUSDTData,
  selectMonthlyBTCData,
  selectMonthlyDAIData,
  selectMonthlyETHData,
  selectMonthlySTRKData,
  selectMonthlyUSDCData,
  selectMonthlyUSDTData,
} from "@/store/slices/readDataSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
import { NativeToken } from "@/Blockchain/interfaces/interfaces";
import {
  selectMetricsDropdowns,
  selectModalDropDowns,
  setModalDropdown,
} from "@/store/slices/dropdownsSlice";
import BTCLogo from "@/assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
// import USDTLogo from "../table/tableIcons/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import mixpanel from "mixpanel-browser";
import ArrowUp from "@/assets/icons/arrowup";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import { setCoinSelectedSupplyModal } from "@/store/slices/userAccountSlice";
import UsdcDisabled from "@/assets/icons/coins/usdcDisabled";
import DaiDisabled from "@/assets/icons/coins/daiDisabled";
import UsdtDisabled from "@/assets/icons/coins/usdtDisabled";
import EthDisabled from "@/assets/icons/coins/ethDisabled";
import BtcDisabled from "@/assets/icons/coins/btcDisabled";
import STRKLogo from "@/assets/icons/coins/strk";
import StrkDisabled from "@/assets/icons/coins/strkDisabled";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
const ExchangeRaterToken = ({ color, curveColor, series }: any) => {
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

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
  const strkData = useSelector(selectHourlySTRKData);
  const weeklyBtcData = useSelector(selectDailyBTCData);
  const weeklyEthData = useSelector(selectDailyETHData);
  const weeklyUsdtData = useSelector(selectDailyUSDTData);
  const weeklyUsdcData = useSelector(selectDailyUSDCData);
  const weeklyDaiData = useSelector(selectDailyDAIData);
  const weeklyStrkData = useSelector(selectDailySTRKData);
  const monthlyBtcData = useSelector(selectMonthlyBTCData);
  const monthlyEthData = useSelector(selectMonthlyETHData);
  const monthlyUsdtData = useSelector(selectMonthlyUSDTData);
  const monthlyUsdcData = useSelector(selectMonthlyUSDCData);
  const monthlyDaiData = useSelector(selectMonthlyDAIData);
  const monthlyStrkData = useSelector(selectMonthlySTRKData);
  const allBtcData = useSelector(selectAllBTCData);
  const allEthData = useSelector(selectAllETHData);
  const allUsdtData = useSelector(selectAllUSDTData);
  const allUsdcData = useSelector(selectAllUSDCData);
  const allDaiData = useSelector(selectAllDAIData);
  const coinsData = [usdtData, btcData, ethData, usdcData, daiData];
  // useEffect(()=>{

  // },[])
  const splineColor = ["#804D0F", "#3B48A8", "#136B51", "#1A2683", "#996B22","#0C0C4F"];
  const [currentSelectedCoin, setCurrentSelectedCoin] = useState(0);
  //  //console.log(btcData, "btc")
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
    ////console.log(coinsData[currentSelectedCoin],"coin apr")
  }, [aprByMarket, currentSelectedCoin]);
  //  //console.log(new Date("2022-01-01").getTime(),"trial chart data")

  const fetchDataBasedOnOption = async (option: number, option2: number) => {
    // Simulating API call or data update based on option
    // Replace this with your actual implementation
    let newData: any = [];
    let newCategories: any = [];

    switch (aprByMarket) {
      case 0:
        if (currentSelectedCoin == 0) {
          btcData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: btcData?.dTokenExchangeRates,
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
          usdtData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: usdtData?.dTokenExchangeRates,
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
          usdcData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: usdcData?.dTokenExchangeRates,
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
          ethData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: ethData?.dTokenExchangeRates,
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
        } else if(currentSelectedCoin==4) {
          daiData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: daiData?.dTokenExchangeRates,
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
        else if(currentSelectedCoin==5) {
          strkData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: strkData?.dTokenExchangeRates,
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
          strkData?.dates
            ? (newCategories = strkData?.dates)
            : (newCategories = [
                1689152545000, 1689156145000, 1689159745000, 1689163345000,
                1689166945000, 1689170545000, 1689174145000, 1689177745000,
                1689181345000, 1689184945000, 1689188545000, 1689192145000,
              ]);
        }
        break;

      case 1:
        if (currentSelectedCoin == 0) {
          weeklyBtcData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: weeklyBtcData?.dTokenExchangeRates,
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
          weeklyUsdtData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: weeklyUsdtData?.dTokenExchangeRates,
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
          weeklyUsdcData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: weeklyUsdcData?.dTokenExchangeRates,
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
          weeklyEthData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: weeklyEthData?.dTokenExchangeRates,
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
          weeklyDaiData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: weeklyDaiData?.dTokenExchangeRates,
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
        }else if (currentSelectedCoin == 5) {
          weeklyStrkData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: weeklyStrkData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [100, 400, 250, 300, 390, 500, 800],
                },
              ]);
          weeklyStrkData?.dates
            ? (newCategories = weeklyStrkData?.dates)
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
          monthlyBtcData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: monthlyBtcData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [300, 400, 350, 500, 490, 600, 800],
                },
              ]);
          monthlyBtcData?.dates
            ? (newCategories = monthlyBtcData?.dates)
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
          monthlyUsdtData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: monthlyUsdtData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [200, 300, 250, 400, 390, 500, 700],
                },
              ]);
          monthlyUsdtData?.dates
            ? (newCategories = monthlyUsdtData?.dates)
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
          monthlyUsdcData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: monthlyUsdcData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [100, 200, 250, 400, 390, 500, 700],
                },
              ]);
          monthlyUsdcData?.dates
            ? (newCategories = monthlyUsdcData?.dates)
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
          monthlyEthData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: monthlyEthData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [200, 300, 250, 400, 390, 500, 700],
                },
              ]);
          monthlyEthData?.dates
            ? (newCategories = monthlyEthData?.dates)
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
          monthlyDaiData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: monthlyDaiData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [100, 400, 250, 300, 390, 500, 800],
                },
              ]);
          monthlyDaiData?.dates
            ? (newCategories = monthlyDaiData?.dates)
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
        }else if (currentSelectedCoin == 5) {
          monthlyStrkData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: monthlyStrkData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [100, 400, 250, 300, 390, 500, 800],
                },
              ]);
          monthlyStrkData?.dates
            ? (newCategories = monthlyStrkData?.dates)
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
      case 3:
        if (currentSelectedCoin == 0) {
          allBtcData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: allBtcData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [300, 400, 350, 500, 490, 600, 800],
                },
              ]);
          allBtcData?.dates
            ? (newCategories = allBtcData?.dates)
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
          allUsdtData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: allUsdtData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [200, 300, 250, 400, 390, 500, 700],
                },
              ]);
          allUsdtData?.dates
            ? (newCategories = allUsdtData?.dates)
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
          allUsdcData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: allUsdcData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [100, 200, 250, 400, 390, 500, 700],
                },
              ]);
          allUsdcData?.dates
            ? (newCategories = allUsdcData?.dates)
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
          allEthData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: allEthData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [200, 300, 250, 400, 390, 500, 700],
                },
              ]);
          allEthData?.dates
            ? (newCategories = allEthData?.dates)
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
          allDaiData?.dTokenExchangeRates
            ? (newData = [
                {
                  name: "Exchange Rate",
                  data: allDaiData?.dTokenExchangeRates,
                },
              ])
            : (newData = [
                {
                  name: "Exchange Rate",
                  data: [100, 400, 250, 300, 390, 500, 800],
                },
              ]);
          allDaiData?.dates
            ? (newCategories = allDaiData?.dates)
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
    }

    return { newData, newCategories };
  };
  const minValue = Math.min(...chartData.flatMap((series) => series.data));
  const maxValue = Math.max(...chartData.flatMap((series) => series.data));
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
        min: minValue - 0.0002 * minValue,
        max: maxValue + 0.0002 * maxValue,
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
      colors: ["#04aacf"],
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
            x: xAxisCategories[0],
            strokeDashArray: 0,
            borderColor: "#292D30",
            borderWidth: 1,
          },
          {
            x: xAxisCategories[xAxisCategories.length - 1], // End position for the box
            strokeDashArray: 0,
            borderColor: "#292D30",
            borderWidth: 1,
          },
        ],
      },
    },
  };
  const options: ApexOptions = {
    ...splineChartData.options,
    stroke: {
      curve: "smooth",
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
  const handleDropdownClick = (dropdownName: any) => {
    // Dispatches an action called setModalDropdown with the dropdownName as the payload
    dispatch(setModalDropdown(dropdownName));
  };
  const dispatch = useDispatch();
  const modalDropdowns = useSelector(selectModalDropDowns);

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
        case 5:
          return <STRKLogo height={"16px"} width={"16px"} />;
          break;
      default:
        break;
    }
  };

  // const activeModal = Object.keys(modalDropdowns).find(
  //   (key) => modalDropdowns[key] === true
  // );
  return (
    <Box display="flex" flexDirection="column" gap="8px" width="100%">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        height="72px"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
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
          <Box mt="auto">Exchange rate: dToken</Box>
          <Box display="flex" gap="2">
            <Button
              color="#3E415C"
              size="sm"
              border={aprByMarket === 0 ? "none" : "1px solid #3E415C"}
              variant={aprByMarket === 0 ? "solid" : "outline"}
              onClick={() => {
                setAPRByMarket(0);
              }}
            >
              1D
            </Button>
            <Button
              color="#3E415C"
              size="sm"
              border={aprByMarket === 1 ? "none" : "1px solid #3E415C"}
              variant={aprByMarket === 1 ? "solid" : "outline"}
              onClick={() => {
                setAPRByMarket(1);
              }}
              isDisabled={false}
              _disabled={{
                cursor: "pointer",
                color: "#3E415C",
                border: `${aprByMarket === 2 ? "none" : "1px solid #3E415C"}`,
              }}
            >
              1W
            </Button>
            <Button
              color="#3E415C"
              size="sm"
              border={aprByMarket === 2 ? "none" : "1px solid #3E415C"}
              variant={aprByMarket === 2 ? "solid" : "outline"}
              onClick={() => {
                setAPRByMarket(2);
              }}
              isDisabled={false}
              _disabled={{
                cursor: "pointer",
                color: "#3E415C",
                border: `${aprByMarket === 2 ? "none" : "1px solid #3E415C"}`,
              }}
            >
              1M
            </Button>

            <Button
              color="#3E415C"
              size="sm"
              border={aprByMarket === 3 ? "none" : "1px solid #3E415C"}
              variant={aprByMarket === 3 ? "solid" : "outline"}
              onClick={() => {
                setAPRByMarket(3);
              }}
              isDisabled={true}
              _disabled={{
                cursor: "pointer",
                color: "#3E415C",
                border: `${aprByMarket === 3 ? "none" : "1px solid #3E415C"}`,
              }}
            >
              ALL
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
        borderRadius="6px"
        padding="16px 24px 40px"
      >
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
            handleDropdownClick("coinSelectedExchangeRateDToken");
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
          {modalDropdowns.coinSelectedExchangeRateDToken && (
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
                      ////console.log(coin,"coin in supply modal")

                      dispatch(setCoinSelectedSupplyModal(coin));
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
            bg={currentSelectedCoin === 0 ? "rgba(103, 109, 154, 0.10)" : "transparent"}
            borderRadius="md"
            border="1px"
            borderColor={currentSelectedCoin === 0 ? "rgba(103, 109, 154, 0.30)" : "#2B2F35"}
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
              fontSize="12px"
              fontWeight="500"
              textColor={currentSelectedCoin === 0 ? "white" : "#3E415C"}
            >
              wBTC
            </Text>
          </Box>
          <Box
            display="flex"
            gap="2"
            bg={currentSelectedCoin === 3 ? "rgba(103, 109, 154, 0.10)" : "transparent"}
            borderRadius="md"
            border="1px"
            borderColor={currentSelectedCoin === 3 ? "rgba(103, 109, 154, 0.30)" : "#2B2F35"}
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
              fontSize="12px"
              fontWeight="500"
              textColor={currentSelectedCoin === 3 ? "white" : "#3E415C"}
            >
              wETH
            </Text>
          </Box>
          <Box
            display="flex"
            gap="2"
            bg={currentSelectedCoin === 1 ? "rgba(103, 109, 154, 0.10)" : "transparent"}
            borderRadius="md"
            border="1px"
            borderColor={currentSelectedCoin === 1 ? "rgba(103, 109, 154, 0.30)" : "#2B2F35"}
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
              fontSize="12px"
              fontWeight="500"
              textColor={currentSelectedCoin === 1 ? "white" : "#3E415C"}
            >
              USDT
            </Text>
          </Box>
          <Box
            display="flex"
            gap="2"
            bg={currentSelectedCoin === 2 ? "rgba(103, 109, 154, 0.10)" : "transparent"}
            borderRadius="md"
            border="1px"
            borderColor={currentSelectedCoin === 2 ? "rgba(103, 109, 154, 0.30)" : "#2B2F35"}
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
              fontSize="12px"
              fontWeight="500"
              textColor={currentSelectedCoin === 2 ? "white" : "#3E415C"}
            >
              USDC
            </Text>
          </Box>
          <Box
            display="flex"
            gap="2"
            bg={currentSelectedCoin === 4 ? "rgba(103, 109, 154, 0.10)" : "transparent"}
            borderRadius="md"
            border="1px"
            borderColor={currentSelectedCoin === 4 ? "rgba(103, 109, 154, 0.30)" : "#2B2F35"}
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
              fontSize="12px"
              fontWeight="500"
              textColor={currentSelectedCoin === 4 ? "white" : "#3E415C"}
            >
              DAI
            </Text>
          </Box>
          <Box
            display="flex"
            gap="2"
            bg={currentSelectedCoin === 5 ? "rgba(103, 109, 154, 0.10)" : "transparent"}
            borderRadius="md"
            border="1px"
            borderColor={currentSelectedCoin === 5 ? "rgba(103, 109, 154, 0.30)" : "#2B2F35"}
            // p="1"
            onClick={() => setCurrentSelectedCoin(5)}
            cursor="pointer"
            p="2"
          >
            <Box>
              {currentSelectedCoin === 5 ? getCoin(5) : <StrkDisabled />}
            </Box>
            <Text
              my="auto"
              color="white"
              fontSize="12px"
              fontWeight="500"
              textColor={currentSelectedCoin === 5 ? "white" : "#3E415C"}
            >
              STRK
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

export default ExchangeRaterToken;

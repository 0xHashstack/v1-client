import {
  IDeposit,
  ILoan,
  IMarketInfo,
} from "@/Blockchain/interfaces/interfaces";
import { getUserDeposits } from "@/Blockchain/scripts/Deposits";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import {
  OraclePrice,
  getOraclePrices,
} from "@/Blockchain/scripts/getOraclePrices";
import {
  getProtocolReserves,
  getProtocolStats,
} from "@/Blockchain/scripts/protocolStats";
import {
  effectivAPRLoan,
  effectiveAprDeposit,
  getNetApr,
  getNetworth,
  getTotalBorrow,
  getTotalSupply,
} from "@/Blockchain/scripts/userStats";
import {
  selectAllDataCount,
  selectAprCount,
  selectAprsAndHealthCount,
  selectAvgBorrowAprCount,
  selectAvgSupplyAprCount,
  selectHealthFactorCount,
  selectHourlyDataCount,
  selectMonthlyDataCount,
  selectNetAprCount,
  selectOraclePricesCount,
  selectProtocolStatsCount,
  selectStakingSharesCount,
  selectTransactionStatus,
  selectUserDepositsCount,
  selectUserInfoCount,
  selectUserLoansCount,
  selectWeeklyDataCount,
  selectYourMetricsBorrowCount,
  selectYourMetricsSupplyCount,
  selectprotocolReservesCount,
  setAllDataCount,
  setAprCount,
  setAprsAndHealthCount,
  setAvgBorrowAPR,
  setAvgBorrowAprCount,
  setAvgSupplyAPR,
  setAvgSupplyAprCount,
  setHealthFactorCount,
  setHourlyDataCount,
  setMonthlyDataCount,
  setNetAprCount,
  setOraclePricesCount,
  setProtocolReservesCount,
  setProtocolStatsCount,
  setStakingSharesCount,
  setUserDepositsCount,
  setUserInfoCount,
  setUserLoansCount,
  setUserUnspentLoans,
  setWeeklyDataCount,
  setYourMetricsBorrowCount,
  setYourMetricsSupplyCount,
} from "@/store/slices/userAccountSlice";
import {
  setOraclePrices,
  selectOraclePrices,
  selectTransactionRefresh,
  selectProtocolReserves,
  setProtocolReserves,
  setAprAndHealthFactor,
  selectAprAndHealthFactor,
  selectEffectiveApr,
  selectHealthFactor,
  setEffectiveAPR,
  setHealthFactor,
  selectHourlyBTCData,
  setHourlyBTCData,
  setHourlyDAIData,
  setHourlyUSDTData,
  setHourlyUSDCData,
  setHourlyETHData,
  setYourMetricsSupply,
  setYourMetricsBorrow,
  setDailyDAIData,
  setDailyBTCData,
  setDailyETHData,
  setDailyUSDCData,
  setDailyUSDTData,
  setStakingShares,
  selectStakingShares,
  setMonthlyDAIData,
  setMonthlyBTCData,
  setMonthlyUSDCData,
  setMonthlyUSDTData,
  setMonthlyETHData,
  setAllBTCData,
  setAllDAIData,
  setAllETHData,
  setAllUSDCData,
  setAllUSDTData,
} from "@/store/slices/readDataSlice";
import {
  setProtocolStats,
  selectProtocolStats,
  setNetWorth,
  setNetAPR,
  selectNetAPR,
  selectNetWorth,
  setYourBorrow,
  selectYourBorrow,
  setYourSupply,
  selectYourSupply,
} from "@/store/slices/readDataSlice";

import {
  setUserDeposits,
  selectUserDeposits,
} from "@/store/slices/readDataSlice";
import { setUserLoans, selectUserLoans } from "@/store/slices/readDataSlice";
import { useAccount } from "@starknet-react/core";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExistingLoanHealth } from "@/Blockchain/scripts/LoanHealth";
import axios from "axios";
import { metrics_api } from "@/utils/keys/metricsApi";
import {
  getMinimumDepositAmount,
  getUserStakingShares,
} from "@/Blockchain/scripts/Rewards";
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "@/Blockchain/utils/addressServices";
import OffchainAPI from "@/services/offchainapi.service";
import { etherToWeiBN } from "@/Blockchain/utils/utils";
const useDataLoader = () => {
  const { address } = useAccount();
  const protocolReserves = useSelector(selectProtocolReserves);
  const dataDeposit = useSelector(selectUserDeposits);
  const protocolStats = useSelector(selectProtocolStats);
  const dataOraclePrices = useSelector(selectOraclePrices);
  const aprsAndHealth = useSelector(selectAprAndHealthFactor);
  //  const dataMarket=useSelector(selectProtocolStats);
  const yourSupply = useSelector(selectYourSupply);
  const userLoans = useSelector(selectUserLoans);
  const yourBorrow = useSelector(selectYourBorrow);
  const netWorth = useSelector(selectNetWorth);
  const netAPR = useSelector(selectNetAPR);
  const [isMounted, setIsMounted] = useState(false);
  const protocolStatsCount = useSelector(selectProtocolStatsCount);
  const protocolReservesCount = useSelector(selectprotocolReservesCount);
  const userDepositsCount = useSelector(selectUserDepositsCount);
  const userLoansCount = useSelector(selectUserLoansCount);
  const oraclePricesCount = useSelector(selectOraclePricesCount);
  const userInfoCount = useSelector(selectUserInfoCount);
  // const aprsAndHealthCount = useSelector(selectAprsAndHealthCount);
  const hourlyDataCount = useSelector(selectHourlyDataCount);
  const transactionRefresh = useSelector(selectTransactionRefresh);
  const oraclePrices = useSelector(selectOraclePrices);
  const effectiveApr = useSelector(selectEffectiveApr);
  const effectiveAprCount = useSelector(selectAprCount);
  const healthFactor = useSelector(selectHealthFactor);
  const healthFactorCount = useSelector(selectHealthFactorCount);
  const hourlyBTCData = useSelector(selectHourlyBTCData);
  const netAprCount = useSelector(selectNetAprCount);
  const avgSupplyAprCount = useSelector(selectAvgSupplyAprCount);
  const avgBorrowAPRCount = useSelector(selectAvgBorrowAprCount);
  const yourMetricsBorrowCount = useSelector(selectYourMetricsBorrowCount);
  const yourMetricsSupplyCount = useSelector(selectYourMetricsSupplyCount);
  const weeklyDataCount = useSelector(selectWeeklyDataCount);
  const monthlyDataCount=useSelector(selectMonthlyDataCount);
  const allDataCount=useSelector(selectAllDataCount);
  // const stakingShares = useSelector(selectStakingShares);
  const stakingSharesCount = useSelector(selectStakingSharesCount);
  const transactionStatus = useSelector(selectTransactionStatus);

  const dispatch = useDispatch();
  const Data: any = [];
  const [avgs, setAvgs] = useState<any>([]);
  const [btcData, setBtcData] = useState<any>();

  const avgsData: any = [];
  // console.log("address", address);
  // useEffect(() => {
  //   console.log("switched to market");
  // }, []);
  const getTransactionCount = () => {
    return transactionRefresh;
  };
  // useEffect(() => {
  //   try {
  //     const fetchData = async () => {
  //       const data = await OffchainAPI.httpGet(
  //         "/api/metrics/apm_platform/daily"
  //       );
  //       const apr = data?.map((val: any, idx: number) => val?.totalPlatformAPR);
  //       const apy = data?.map((val: any, idx: number) => val?.totalPlatformAPY);
  //       const dateTime = data?.map((val: any, idx: number) => val?.Datetime);
  //       const dataArray = {
  //         APR: apr,
  //         APY: apy,
  //         dateTime: dateTime,
  //       };

  //       console.log("dataArray ", data);
  //       setSeriesData(dataArray);
  //     };
  //     fetchData();
  //   } catch (err) {
  //     console.log("error fetching aprByMarket data ", err);
  //   }
  // }, []);
  // useEffect(() => {
  //   console.log("your supply catch transactionStatus ", transactionStatus);
  // }, [transactionStatus]);

  useEffect(() => {
    console.log("fetchHourlyData called ", oraclePrices);
    const fetchHourlyData = async () => {
      try {
        // console.log("HIII")
        // if(hourlyBTCData!=null){
        //   return;
        // }
        const promises = [
          OffchainAPI.httpGet(`/api/metrics/tvl/daily/DAI`),
          OffchainAPI.httpGet(`/api/metrics/tvl/daily/BTC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/daily/USDT`),
          OffchainAPI.httpGet(`/api/metrics/tvl/daily/USDC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/daily/ETH`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/daily/DAI`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/daily/BTC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/daily/USDT`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/daily/USDC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/daily/ETH`),
          OffchainAPI.httpGet(`/api/metrics/urm_platform/daily`),
        ];
        Promise.allSettled([...promises]).then((val) => {
          console.log("backend data ", val);
          val.map((response, idx) => {
            const res = response?.status != "rejected" ? response?.value : "0";
          });
          for (var j = 0; j < 5; j++) {
            // console.log(j,"for loop")
            const responseA = val?.[j] ? val?.[j] : null;
            const responseB = val?.[j + 5] ? val?.[j + 5] : null;
            const responseC = val?.[10] ? val?.[10] : null;
            // if (
            //   val[j]?.status != "rejected" &&
            //   val[j + 5]?.status != "rejected" &&
            //   val[10]?.status != "rejected"
            // ) {
            const responseTotal =
              responseC?.status != "rejected" ? responseC?.value : null;
            const response =
              responseA?.status != "rejected" ? responseA?.value : null;
            const responseApr =
              responseB?.status != "rejected" ? responseB?.value : null;
            // console.log(val, response, "response data", responseApr);
            // if (!response) {
            //   return;
            // }
            // const response2=axios.get('http://127.0.0.1:3010/api/metrics/tvl/hourly/DAI')
            if (response && responseApr && responseTotal) {
              const amounts: any = [];
              const borrowAmounts: any = [];
              const dates: any = [];
              const supplyRates: any = [];
              const borrowRates: any = [];
              const tvlAmounts: any = [];
              const supplyCounts: any = [];
              const borrowCounts: any = [];
              const utilRates: any = [];
              const rTokenExchangeRates: any = [];
              const dTokenExchangeRates: any = [];
              const totalTransactions: any = [];
              const totalAccounts: any = [];
              const aprs: any = [];
              const apys: any = [];
              const totalUrm: any = [];
              for (var i = 0; i < response?.length; i++) {
                // console.log(i,"inside loop")
                const token = response?.[i]?.tokenName;
                const supplyAmount: number =
                  (Number(response?.[i]?.supplyAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price;
                const borrowAmount: number =
                  (Number(response?.[i]?.borrowAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price;
                const tvlAmount: number =
                (Number(response?.[i]?.tvlAmount) /
                Math.pow(10, tokenDecimalsMap[token])) *
              oraclePrices?.find(
                (oraclePrice: OraclePrice) => oraclePrice?.name == token
              )?.price;
                // console.log(supplyAmount,token,response?.[i].supplyAmount,"amount and token")
                // console.log(response?.[i].tokenName)
                // const supplyAmount1=etherToWeiBN(amount,token)
                // console.log(supplyAmount1,"aamount")
                amounts?.push(supplyAmount);
                borrowAmounts?.push(borrowAmount);
                // tvlAmounts?.push(tvlAmount);
                tvlAmounts?.push(supplyAmount);
                // const dateObj = new Date(response?.data[i].Datetime)
                dates?.push(response?.[i].Datetime);
                supplyRates?.push(response?.[i]?.supplyRate / 100);
                borrowRates?.push(response?.[i]?.borrowRate / 100);
                supplyCounts?.push(response?.[i]?.supplyAccounts);
                borrowCounts?.push(response?.[i]?.borrowAccounts);
                utilRates?.push(response?.[i]?.utilRate / 100);
                rTokenExchangeRates?.push(
                  1 / (response?.[i]?.rTokenExchangeRate / 10000)
                );
                dTokenExchangeRates?.push(
                  1 / (response?.[i]?.dTokenExchangeRate / 10000)
                );
                totalTransactions?.push(response?.[i]?.totalTransactions);
                totalAccounts?.push(response?.[i]?.totalAccounts);
                aprs?.push(responseApr?.[i]?.APR);
                apys?.push(responseApr?.[i]?.APY);
                totalUrm?.push(responseTotal?.[i]?.totalPlatformURM / 100);
              }
              // console.log(dates,"Dates")
              const data = {
                dates: dates,
                supplyAmounts: amounts,
                borrowAmounts: borrowAmounts,
                tvlAmounts: tvlAmounts,
                supplyRates: supplyRates,
                borrowRates: borrowRates,
                supplyCounts: supplyCounts,
                borrowCounts: borrowCounts,
                utilRates: utilRates,
                rTokenExchangeRates: rTokenExchangeRates,
                dTokenExchangeRates: dTokenExchangeRates,
                totalTransactions: totalTransactions,
                totalAccounts: totalAccounts,
                aprs: aprs,
                apys: apys,
                totalUrm: totalUrm,
              };
              // console.log(
              //   "backend loop daily - ",
              //   response?.[0]?.tokenName,
              //   data
              // );
              // console.log(data,"data in data loader")
              // console.log(btcData,"Data gone")
              if (j == 0) {
                dispatch(setHourlyDAIData(data));
              } else if (j == 1) {
                dispatch(setHourlyBTCData(data));
              } else if (j == 2) {
                dispatch(setHourlyUSDTData(data));
              } else if (j == 3) {
                dispatch(setHourlyUSDCData(data));
              } else if (j == 4) {
                dispatch(setHourlyETHData(data));
              }
            }
          }
          const count = getTransactionCount();
          dispatch(setHourlyDataCount(count));
          // }
        });
        // const count = getTransactionCount();
        // dispatch(setHourlyDataCount(count));
      } catch (err) {
        console.log(err, "err in hourly data");
      }
    };
    if (hourlyDataCount < transactionRefresh && oraclePrices) {
      fetchHourlyData();
    }
  }, [oraclePrices]);
  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        // console.log("HIII")
        // if(hourlyBTCData!=null){
        //   return;
        // }
        const promises = [
          OffchainAPI.httpGet(`/api/metrics/tvl/weekly/DAI`),
          OffchainAPI.httpGet(`/api/metrics/tvl/weekly/BTC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/weekly/USDT`),
          OffchainAPI.httpGet(`/api/metrics/tvl/weekly/USDC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/weekly/ETH`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/weekly/DAI`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/weekly/BTC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/weekly/USDT`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/weekly/USDC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/weekly/ETH`),
          OffchainAPI.httpGet(`/api/metrics/urm_platform/weekly`),
        ];
        Promise.allSettled([...promises]).then((val) => {
          // console.log("backend data weekly - ", val);
          val.map((response, idx) => {
            const res = response?.status != "rejected" ? response?.value : "0";
          });
          for (var j = 0; j < 5; j++) {
            // console.log(j,"for loop")
            const responseA = val?.[j] ? val?.[j] : null;
            const responseB = val?.[j + 5] ? val?.[j + 5] : null;
            const responseC = val?.[10] ? val?.[10] : null;
            // if (
            //   val[j]?.status != "rejected" &&
            //   val[j + 5]?.status != "rejected" &&
            //   val[10]?.status != "rejected"
            // ) {
            const responseTotal =
              responseC?.status != "rejected" ? responseC?.value : null;
            const response =
              responseA?.status != "rejected" ? responseA?.value : null;
            const responseApr =
              responseB?.status != "rejected" ? responseB?.value : null;
            // console.log(val, response, "response data", responseApr);
            // if (!response) {
            //   return;
            // }
            // const response2=axios.get('http://127.0.0.1:3010/api/metrics/tvl/hourly/DAI')
            if (response && responseApr && responseTotal) {
              const amounts: any = [];
              const borrowAmounts: any = [];
              const dates: any = [];
              const supplyRates: any = [];
              const borrowRates: any = [];
              const tvlAmounts: any = [];
              const supplyCounts: any = [];
              const borrowCounts: any = [];
              const utilRates: any = [];
              const rTokenExchangeRates: any = [];
              const dTokenExchangeRates: any = [];
              const totalTransactions: any = [];
              const totalAccounts: any = [];
              const aprs: any = [];
              const apys: any = [];
              const totalUrm: any = [];
              for (var i = 0; i < response?.length; i++) {
                // console.log(i,"inside loop")
                const token = response?.[i]?.tokenName;
                const supplyAmount: number =
                  (Number(response?.[i]?.supplyAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price;
                const borrowAmount: number =
                  (Number(response?.[i]?.borrowAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price;
                const tvlAmount: number =
                  Number(response?.[i].tvlAmount) /
                  Math.pow(10, tokenDecimalsMap[token]);
                // console.log(supplyAmount,token,response?.[i].supplyAmount,"amount and token")
                // console.log(response?.[i].tokenName)
                // const supplyAmount1=etherToWeiBN(amount,token)
                // console.log(supplyAmount1,"aamount")
                amounts?.push(supplyAmount);
                borrowAmounts?.push(borrowAmount);
                // tvlAmounts?.push(tvlAmount);
                tvlAmounts?.push(supplyAmount);
                // const dateObj = new Date(response?.data[i].Datetime)
                dates?.push(response?.[i].Datetime);
                supplyRates?.push(response?.[i]?.supplyRate / 100);
                borrowRates?.push(response?.[i]?.borrowRate / 100);
                supplyCounts?.push(response?.[i]?.supplyAccounts);
                borrowCounts?.push(response?.[i]?.borrowAccounts);
                utilRates?.push(response?.[i]?.utilRate / 100);
                rTokenExchangeRates?.push(
                  1 / (response?.[i]?.rTokenExchangeRate / 10000)
                );
                dTokenExchangeRates?.push(
                  1 / (response?.[i]?.dTokenExchangeRate / 10000)
                );
                totalTransactions?.push(response?.[i]?.totalTransactions);
                totalAccounts?.push(response?.[i]?.totalAccounts);
                aprs?.push(responseApr?.[i]?.APR);
                apys?.push(responseApr?.[i]?.APY);
                totalUrm?.push(responseTotal?.[i]?.totalPlatformURM / 100);
              }
              // console.log(dates,"Dates")
              const data = {
                dates: dates,
                supplyAmounts: amounts,
                borrowAmounts: borrowAmounts,
                tvlAmounts: tvlAmounts,
                supplyRates: supplyRates,
                borrowRates: borrowRates,
                supplyCounts: supplyCounts,
                borrowCounts: borrowCounts,
                utilRates: utilRates,
                rTokenExchangeRates: rTokenExchangeRates,
                dTokenExchangeRates: dTokenExchangeRates,
                totalTransactions: totalTransactions,
                totalAccounts: totalAccounts,
                aprs: aprs,
                apys: apys,
                totalUrm: totalUrm,
              };
              // console.log("backend looping 2 -", data);
              // console.log(data,"data in data loader")
              // console.log(btcData,"Data gone")
              if (j == 0) {
                dispatch(setDailyDAIData(data));
              } else if (j == 1) {
                dispatch(setDailyBTCData(data));
              } else if (j == 2) {
                dispatch(setDailyUSDTData(data));
              } else if (j == 3) {
                dispatch(setDailyUSDCData(data));
              } else if (j == 4) {
                dispatch(setDailyETHData(data));
              }
            }
          }
          const count = getTransactionCount();
          dispatch(setWeeklyDataCount(count));
          // }
        });
        // const count = getTransactionCount();
        // dispatch(setHourlyDataCount(count));
      } catch (err) {
        console.log(err, "err in hourly data");
      }
    };
    if (weeklyDataCount < transactionRefresh && oraclePrices) {
      fetchDailyData();
    }
  }, [oraclePrices]);
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        // console.log("HIII")
        // if(hourlyBTCData!=null){
        //   return;
        // }
        const promises = [
          OffchainAPI.httpGet(`/api/metrics/tvl/monthly/DAI`),
          OffchainAPI.httpGet(`/api/metrics/tvl/monthly/BTC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/monthly/USDT`),
          OffchainAPI.httpGet(`/api/metrics/tvl/monthly/USDC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/monthly/ETH`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/monthly/DAI`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/monthly/BTC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/monthly/USDT`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/monthly/USDC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/monthly/ETH`),
          OffchainAPI.httpGet(`/api/metrics/urm_platform/monthly`),
        ];
        Promise.allSettled([...promises]).then((val) => {
          // console.log("backend data weekly - ", val);
          val.map((response, idx) => {
            const res = response?.status != "rejected" ? response?.value : "0";
          });
          for (var j = 0; j < 5; j++) {
            // console.log(j,"for loop")
            const responseA = val?.[j] ? val?.[j] : null;
            const responseB = val?.[j + 5] ? val?.[j + 5] : null;
            const responseC = val?.[10] ? val?.[10] : null;
            // if (
            //   val[j]?.status != "rejected" &&
            //   val[j + 5]?.status != "rejected" &&
            //   val[10]?.status != "rejected"
            // ) {
            const responseTotal =
              responseC?.status != "rejected" ? responseC?.value : null;
            const response =
              responseA?.status != "rejected" ? responseA?.value : null;
            const responseApr =
              responseB?.status != "rejected" ? responseB?.value : null;
            // console.log(val, response, "response data", responseApr);
            // if (!response) {
            //   return;
            // }
            // const response2=axios.get('http://127.0.0.1:3010/api/metrics/tvl/hourly/DAI')
            if (response && responseApr && responseTotal) {
              const amounts: any = [];
              const borrowAmounts: any = [];
              const dates: any = [];
              const supplyRates: any = [];
              const borrowRates: any = [];
              const tvlAmounts: any = [];
              const supplyCounts: any = [];
              const borrowCounts: any = [];
              const utilRates: any = [];
              const rTokenExchangeRates: any = [];
              const dTokenExchangeRates: any = [];
              const totalTransactions: any = [];
              const totalAccounts: any = [];
              const aprs: any = [];
              const apys: any = [];
              const totalUrm: any = [];
              for (var i = 0; i < response?.length; i++) {
                // console.log(i,"inside loop")
                const token = response?.[i]?.tokenName;
                const supplyAmount: number =
                  (Number(response?.[i]?.supplyAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price;
                const borrowAmount: number =
                  (Number(response?.[i]?.borrowAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price;
                const tvlAmount: number =
                  Number(response?.[i].tvlAmount) /
                  Math.pow(10, tokenDecimalsMap[token]);
                // console.log(supplyAmount,token,response?.[i].supplyAmount,"amount and token")
                // console.log(response?.[i].tokenName)
                // const supplyAmount1=etherToWeiBN(amount,token)
                // console.log(supplyAmount1,"aamount")
                amounts?.push(supplyAmount);
                borrowAmounts?.push(borrowAmount);
                // tvlAmounts?.push(tvlAmount);
                tvlAmounts?.push(supplyAmount);
                // const dateObj = new Date(response?.data[i].Datetime)
                dates?.push(response?.[i].Datetime);
                supplyRates?.push(response?.[i]?.supplyRate / 100);
                borrowRates?.push(response?.[i]?.borrowRate / 100);
                supplyCounts?.push(response?.[i]?.supplyAccounts);
                borrowCounts?.push(response?.[i]?.borrowAccounts);
                utilRates?.push(response?.[i]?.utilRate / 100);
                rTokenExchangeRates?.push(
                  1 / (response?.[i]?.rTokenExchangeRate / 10000)
                );
                dTokenExchangeRates?.push(
                  1 / (response?.[i]?.dTokenExchangeRate / 10000)
                );
                totalTransactions?.push(response?.[i]?.totalTransactions);
                totalAccounts?.push(response?.[i]?.totalAccounts);
                aprs?.push(responseApr?.[i]?.APR);
                apys?.push(responseApr?.[i]?.APY);
                totalUrm?.push(responseTotal?.[i]?.totalPlatformURM / 100);
              }
              // console.log(dates,"Dates")
              const data = {
                dates: dates,
                supplyAmounts: amounts,
                borrowAmounts: borrowAmounts,
                tvlAmounts: tvlAmounts,
                supplyRates: supplyRates,
                borrowRates: borrowRates,
                supplyCounts: supplyCounts,
                borrowCounts: borrowCounts,
                utilRates: utilRates,
                rTokenExchangeRates: rTokenExchangeRates,
                dTokenExchangeRates: dTokenExchangeRates,
                totalTransactions: totalTransactions,
                totalAccounts: totalAccounts,
                aprs: aprs,
                apys: apys,
                totalUrm: totalUrm,
              };
              // console.log(dates,"monthly dates")
              // console.log("backend looping 2 -", data);
              // console.log(data,"data in data loader")
              // console.log(btcData,"Data gone")
              if (j == 0) {
                dispatch(setMonthlyDAIData(data));
              } else if (j == 1) {
                dispatch(setMonthlyBTCData(data));
              } else if (j == 2) {
                dispatch(setMonthlyUSDTData(data));
              } else if (j == 3) {
                dispatch(setMonthlyUSDCData(data));
              } else if (j == 4) {
                dispatch(setMonthlyETHData(data));
              }
            }
          }
          const count = getTransactionCount();
          dispatch(setMonthlyDataCount(count));
          // }
        });
        // const count = getTransactionCount();
        // dispatch(setHourlyDataCount(count));
      } catch (err) {
        console.log(err, "err in hourly data");
      }
    };
    if (monthlyDataCount < transactionRefresh && oraclePrices) {
      fetchMonthlyData();
    }
  }, [oraclePrices]);
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // console.log("HIII")
        // if(hourlyBTCData!=null){
        //   return;
        // }
        const promises = [
          OffchainAPI.httpGet(`/api/metrics/tvl/all/DAI`),
          OffchainAPI.httpGet(`/api/metrics/tvl/all/BTC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/all/USDT`),
          OffchainAPI.httpGet(`/api/metrics/tvl/all/USDC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/all/ETH`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/all/DAI`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/all/BTC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/all/USDT`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/all/USDC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/all/ETH`),
          OffchainAPI.httpGet(`/api/metrics/urm_platform/all`),
        ];
        Promise.allSettled([...promises]).then((val) => {
          // console.log("backend data weekly - ", val);
          val.map((response, idx) => {
            const res = response?.status != "rejected" ? response?.value : "0";
          });
          for (var j = 0; j < 5; j++) {
            // console.log(j,"for loop")
            const responseA = val?.[j] ? val?.[j] : null;
            const responseB = val?.[j + 5] ? val?.[j + 5] : null;
            const responseC = val?.[10] ? val?.[10] : null;
            // if (
            //   val[j]?.status != "rejected" &&
            //   val[j + 5]?.status != "rejected" &&
            //   val[10]?.status != "rejected"
            // ) {
            const responseTotal =
              responseC?.status != "rejected" ? responseC?.value : null;
            const response =
              responseA?.status != "rejected" ? responseA?.value : null;
            const responseApr =
              responseB?.status != "rejected" ? responseB?.value : null;
            // console.log(val, response, "response data", responseApr);
            // if (!response) {
            //   return;
            // }
            // const response2=axios.get('http://127.0.0.1:3010/api/metrics/tvl/hourly/DAI')
            if (response && responseApr && responseTotal) {
              const amounts: any = [];
              const borrowAmounts: any = [];
              const dates: any = [];
              const supplyRates: any = [];
              const borrowRates: any = [];
              const tvlAmounts: any = [];
              const supplyCounts: any = [];
              const borrowCounts: any = [];
              const utilRates: any = [];
              const rTokenExchangeRates: any = [];
              const dTokenExchangeRates: any = [];
              const totalTransactions: any = [];
              const totalAccounts: any = [];
              const aprs: any = [];
              const apys: any = [];
              const totalUrm: any = [];
              for (var i = 0; i < response?.length; i++) {
                // console.log(i,"inside loop")
                const token = response?.[i]?.tokenName;
                const supplyAmount: number =
                  (Number(response?.[i]?.supplyAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price;
                const borrowAmount: number =
                  (Number(response?.[i]?.borrowAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price;
                const tvlAmount: number =
                  Number(response?.[i].tvlAmount) /
                  Math.pow(10, tokenDecimalsMap[token]);
                // console.log(supplyAmount,token,response?.[i].supplyAmount,"amount and token")
                // console.log(response?.[i].tokenName)
                // const supplyAmount1=etherToWeiBN(amount,token)
                // console.log(supplyAmount1,"aamount")
                amounts?.push(supplyAmount);
                borrowAmounts?.push(borrowAmount);
                // tvlAmounts?.push(tvlAmount);
                tvlAmounts?.push(supplyAmount);
                // const dateObj = new Date(response?.data[i].Datetime)
                dates?.push(response?.[i].Datetime);
                supplyRates?.push(response?.[i]?.supplyRate / 100);
                borrowRates?.push(response?.[i]?.borrowRate / 100);
                supplyCounts?.push(response?.[i]?.supplyAccounts);
                borrowCounts?.push(response?.[i]?.borrowAccounts);
                utilRates?.push(response?.[i]?.utilRate / 100);
                rTokenExchangeRates?.push(
                  1 / (response?.[i]?.rTokenExchangeRate / 10000)
                );
                dTokenExchangeRates?.push(
                  1 / (response?.[i]?.dTokenExchangeRate / 10000)
                );
                totalTransactions?.push(response?.[i]?.totalTransactions);
                totalAccounts?.push(response?.[i]?.totalAccounts);
                aprs?.push(responseApr?.[i]?.APR);
                apys?.push(responseApr?.[i]?.APY);
                totalUrm?.push(responseTotal?.[i]?.totalPlatformURM / 100);
              }
              // console.log(dates,"Dates")
              const data = {
                dates: dates,
                supplyAmounts: amounts,
                borrowAmounts: borrowAmounts,
                tvlAmounts: tvlAmounts,
                supplyRates: supplyRates,
                borrowRates: borrowRates,
                supplyCounts: supplyCounts,
                borrowCounts: borrowCounts,
                utilRates: utilRates,
                rTokenExchangeRates: rTokenExchangeRates,
                dTokenExchangeRates: dTokenExchangeRates,
                totalTransactions: totalTransactions,
                totalAccounts: totalAccounts,
                aprs: aprs,
                apys: apys,
                totalUrm: totalUrm,
              };
              // console.log(dates,"monthly dates")
              // console.log("backend looping 2 -", data);
              console.log(data,"data in data loader")
              // console.log(btcData,"Data gone")
              if (j == 0) {
                dispatch(setAllDAIData(data));
              } else if (j == 1) {
                dispatch(setAllBTCData(data));
              } else if (j == 2) {
                dispatch(setAllUSDTData(data));
              } else if (j == 3) {
                dispatch(setAllUSDCData(data));
              } else if (j == 4) {
                dispatch(setAllETHData(data));
              }
            }
          }
          const count = getTransactionCount();
          dispatch(setAllDataCount(count));
          // }
        });
        // const count = getTransactionCount();
        // dispatch(setHourlyDataCount(count));
      } catch (err) {
        console.log(err, "err in hourly data");
      }
    };
    if (allDataCount < transactionRefresh && oraclePrices) {
      fetchAllData();
    }
  }, [oraclePrices]);
  useEffect(() => {
    try {
      const fetchOraclePrices = async () => {
        console.log("oracle prices - transactionRefresh called");
        let data = await getOraclePrices();
        if (!data || data?.length < 5) {
          return;
        }
        dispatch(setOraclePrices(data));
        dispatch(setOraclePricesCount(0));
        console.log("oracle prices - transactionRefresh done ", data);
      };
      if (oraclePricesCount < 0) {
        fetchOraclePrices();
      }
    } catch (err) {
      console.log("oracle prices - transactionRefresh error ", err);
    }
  }, [address, transactionRefresh]);

  useEffect(() => {
    try {
      const fetchProtocolReserves = async () => {
        console.log("protocol reserves called - transactionRefresh");
        const reserves = await getProtocolReserves();
        // dispatch(
        //   setProtocolReserves({
        //     totalReserves: 123,
        //     availableReserves: 123,
        //     avgAssetUtilisation: 1233,
        //   })
        // );
        dispatch(setProtocolReserves(reserves));
        const count = getTransactionCount();
        dispatch(setProtocolReservesCount(count));
        console.log("protocol reserves - transactionRefresh done", reserves);
      };
      if (protocolReservesCount < transactionRefresh) {
        fetchProtocolReserves();
      }
    } catch (err) {
      console.log("error fetching protocol reserves ", err);
    }
  }, [address, transactionRefresh]);

  useEffect(() => {
    try {
      const fetchProtocolStats = async () => {
        console.log("protocol stats called - transactionRefresh");
        const dataStats = await getProtocolStats();
        console.log("protocol stats - transactionRefresh done", dataStats);
        if (!dataStats || (Array.isArray(dataStats) && dataStats?.length < 5)) {
          return;
        }
        // console.log(dataStats,"data market in pagecard")
        dispatch(setProtocolStats(dataStats));
        const count = getTransactionCount();
        dispatch(setProtocolStatsCount(count));
      };
      if (protocolStatsCount < transactionRefresh) {
        fetchProtocolStats();
      }
    } catch (err) {
      console.log("protocol stats - transactionRefresh error ", err);
    }
  }, [address, transactionRefresh]);

  useEffect(() => {
    try {
      const fetchUserDeposits = async () => {
        if (!address) {
          return;
        }
        console.log("user deposits called - transactionRefresh");
        const data = await getUserDeposits(address);
        console.log("user deposits - transactionRefresh done", data);
        if (!data) {
          return;
        }
        // console.log(data,"data deposit useffect")
        // console.log(data.length,"data length")
        if (data) {
          dispatch(setUserDeposits(data));
          const count = getTransactionCount();
          dispatch(setUserDepositsCount(count));
        }
      };
      if (userDepositsCount < transactionRefresh) {
        fetchUserDeposits();
      }
    } catch (err) {
      console.log("user deposits - transactionRefresh error", err);
    }
  }, [address, transactionRefresh]);

  useEffect(() => {
    try {
      const getStakingShares = async () => {
        if (!address) return;
        const promises = [
          getUserStakingShares(address, "rBTC"),
          getUserStakingShares(address, "rETH"),
          getUserStakingShares(address, "rUSDT"),
          getUserStakingShares(address, "rUSDC"),
          getUserStakingShares(address, "rDAI"),
        ];
        Promise.allSettled([...promises]).then((val) => {
          const data = {
            rBTC: val?.[0]?.status == "fulfilled" ? val?.[0]?.value : null,
            rETH: val?.[1]?.status == "fulfilled" ? val?.[1]?.value : null,
            rUSDT: val?.[2]?.status == "fulfilled" ? val?.[2]?.value : null,
            rUSDC: val?.[3]?.status == "fulfilled" ? val?.[3]?.value : null,
            rDAI: val?.[4]?.status == "fulfilled" ? val?.[4]?.value : null,
          };
          if (data?.rBTC == null) return;
          console.log("shares ", address, val, data);
          dispatch(setStakingShares(data));
          const count = getTransactionCount();
          dispatch(setStakingSharesCount(count));
        });
      };
      if (stakingSharesCount < transactionRefresh) {
        getStakingShares();
      }
    } catch (err) {
      console.log("getStakingShares error ", err);
    }
  }, [address, transactionRefresh]);

  useEffect(() => {
    try {
      const fetchEffectiveApr = async () => {
        const promises = userLoans?.map((val: any) => {
          return effectivAPRLoan(val, protocolStats, dataOraclePrices);
        });
        Promise.all([...promises]).then((val: any) => {
          console.log("fetchEffectiveApr ", val);
          const avgs = val.map((avg: any, idx: number) => {
            return { avg: avg, loanId: userLoans[idx]?.loanId };
          });
          dispatch(setEffectiveAPR(avgs));
          const count = getTransactionCount();
          dispatch(setAprCount(count));
        });
        // console.log("promises",promises)
      };
      if (
        dataOraclePrices &&
        userLoans &&
        protocolStats &&
        userLoansCount == transactionRefresh &&
        protocolStatsCount == transactionRefresh &&
        effectiveAprCount < transactionRefresh
      ) {
        fetchEffectiveApr();
      }
    } catch (err) {
      console.log("fetchEffectiveApr ", err);
    }
  }, [userLoans, protocolStats, oraclePrices, transactionRefresh]);

  useEffect(() => {
    try {
      const fetchHealthFactor = async () => {
        console.log("fetchHealthFactor - transactionRefresh called");
        const promises = userLoans?.map((val: any) => {
          return getExistingLoanHealth(val?.loanId);
        });
        Promise.all([...promises]).then((val: any) => {
          const avgs = val.map((loneHealth: any, idx: number) => {
            return { loanHealth: loneHealth, loanId: userLoans[idx]?.loanId };
          });
          console.log("fetchHealthFactor - transactionRefresh done", avgs);
          dispatch(setHealthFactor(avgs));
          const count = getTransactionCount();
          dispatch(setHealthFactorCount(count));
        });
      };
      if (
        userLoans &&
        userLoansCount == transactionRefresh &&
        healthFactorCount < transactionRefresh
      ) {
        fetchHealthFactor();
      }
    } catch (err) {
      console.log("fetchHealthFactor ", err);
    }
  }, [userLoansCount, transactionRefresh]);

  // useEffect(() => {
  //   const fetchAprsAndHealth = async () => {
  //     try {
  //       if (
  //         dataOraclePrices &&
  //         userLoans?.length > 0 &&
  //         userLoansCount == transactionRefresh &&
  //         protocolStatsCount == transactionRefresh &&
  //         aprsAndHealthCount < transactionRefresh
  //       ) {
  //         for (var i = 0; i < userLoans?.length; i++) {
  //           const avg = await effectivAPRLoan(
  //             userLoans[i],
  //             protocolStats,
  //             dataOraclePrices
  //           );
  //           const healthFactor = await getExistingLoanHealth(
  //             userLoans[i]?.loanId
  //           );

  //           const data = {
  //             loanId: userLoans[i]?.loanId,
  //             avg: avg,
  //             loanHealth: healthFactor,
  //           };
  //           // console.log(data,"data in aprs")
  //           // avgs.push(data)
  //           avgsData?.push(data);
  //           // avgs.push()
  //         }
  //         //cc
  //         // console.log(avgsData,"avgs in Data")
  //         setAvgs(avgsData);
  //         dispatch(setAprAndHealthFactor(avgsData));
  //         dispatch(setAprsAndHealthCount(""));
  //       }
  //     } catch (err) {
  //       console.log(err, "err in aprs and health factor");
  //     }
  //   };
  //   if (aprsAndHealthCount < transactionRefresh) {
  //     fetchAprsAndHealth();
  //   }
  // }, [dataOraclePrices, userLoans, protocolStats, transactionRefresh]);

  useEffect(() => {
    try {
      const fetchUserLoans = async () => {
        console.log(
          "user loans called - transactionRefresh",
          userLoansCount,
          transactionRefresh
        );
        if (!address) {
          return;
        }
        const userLoans = await getUserLoans(address);
        console.log("user loans called - transactionRefresh done ", userLoans);
        if (!userLoans) {
          return;
        }
        if (userLoans) {
          dispatch(
            setUserLoans(
              userLoans?.filter(
                (loan) => loan.loanAmountParsed && loan.loanAmountParsed > 0
              )
            )
          );
          dispatch(
            setUserUnspentLoans(
              userLoans
                ?.filter(
                  (loan) => loan.loanAmountParsed && loan.loanAmountParsed > 0
                )
                .filter((borrow: ILoan) => borrow.spendType === "UNSPENT")
            )
          );
        }
        const count = getTransactionCount();
        console.log("getTransactionCount", count);
        dispatch(setUserLoansCount(count));
      };
      if (userLoansCount < transactionRefresh) {
        fetchUserLoans();
      }
    } catch (err) {
      console.log("user loans called - transactionRefresh error ", err);
    }
  }, [address, transactionRefresh]);
  useEffect(() => {
    try {
      const fetchYourSupply = () => {
        if (
          userDepositsCount == transactionRefresh &&
          dataDeposit &&
          oraclePrices
        ) {
          const data = getTotalSupply(dataDeposit, dataOraclePrices);
          if (data != null) {
            dispatch(setYourSupply(data));
          }
        }
      };
      fetchYourSupply();
    } catch (err) {
      console.log(err, "error in your supply count");
    }
  }, [userDepositsCount, dataOraclePrices]);

  useEffect(() => {
    try {
      const fetchUserSupply = async () => {
        // console.log(getUserDeposits(address),"deposits in pagecard")

        // const dataMarket=await getProtocolStats();
        // const dataOraclePrices=await getOraclePrices();
        // console.log(dataMarket,"data market page")
        console.log("user info called - transactionRefresh");
        console.log(dataDeposit, "dataDeposit is here");
        console.log(dataOraclePrices, "dataOraclePrices is here");
        console.log(userLoans, "userLoans is here");
        console.log(protocolStats, "protocolStats is here");
        console.log(aprsAndHealth, "aprs and health is here");
        console.log(
          "transaction refresh counts",
          userDepositsCount,
          protocolStatsCount,
          userLoansCount,
          dataOraclePrices,
          userInfoCount,
          transactionRefresh
        );
        if (
          dataDeposit &&
          protocolStats &&
          userLoans &&
          userDepositsCount == transactionRefresh &&
          protocolStatsCount == transactionRefresh &&
          userLoansCount == transactionRefresh &&
          dataOraclePrices &&
          userInfoCount < transactionRefresh
        ) {
          console.log("user info called inside - transactionRefresh");
          // const dataNetApr = await getNetApr(
          //   dataDeposit,
          //   userLoans,
          //   dataOraclePrices,
          //   protocolStats
          // );
          // console.log("netApr", dataNetApr);
          // //@ts-ignore
          // if (isNaN(dataNetApr)) {
          //   dispatch(setNetAPR(0));
          // } else {
          //   dispatch(setNetAPR(dataNetApr));
          // }

          const data = getTotalSupply(dataDeposit, dataOraclePrices);
          // if (data != null) {
          //   dispatch(setYourSupply(data));
          // }
          console.log(data, "total supply pagecard");

          const dataBorrow = await getTotalBorrow(
            userLoans,
            dataOraclePrices,
            protocolStats
          );
          const dataTotalBorrow = dataBorrow?.totalBorrow;
          console.log(dataBorrow, "data data borrow");
          dispatch(setYourBorrow(dataTotalBorrow));
          console.log(dataDeposit, "data deposit pagecard");
          const dataNetWorth = await getNetworth(
            data,
            dataTotalBorrow,
            dataBorrow?.totalCurrentAmount
          );
          console.log(dataNetWorth, "networth");
          dispatch(setNetWorth(dataNetWorth));
          const count = getTransactionCount();
          dispatch(setUserInfoCount(count));
        }
      };

      // console.log(userInfoCount, transactionRefresh, "userInfoCount is here");
      if (userInfoCount < transactionRefresh) {
        fetchUserSupply();
      }
    } catch (err) {
      console.log(err, "error in user info");
    }
  }, [
    userDepositsCount,
    protocolStatsCount,
    dataOraclePrices,
    userLoansCount,
    transactionRefresh,
  ]);
  // useEffect(() => {
  //   const fetchMinimumDepositAmount = async () => {
  //     const data = await getMinimumDepositAmount(
  //       tokenAddressMap["rBTC"],
  //       "BTC"
  //     );
  //     console.log("fetchMinimumDepositAmount ", data);
  //   };
  //   fetchMinimumDepositAmount();
  // }, []);

  useEffect(() => {
    try {
      const fetchNetApr = async () => {
        // console.log(getUserDeposits(address),"deposits in pagecard")

        // const dataMarket=await getProtocolStats();
        // const dataOraclePrices=await getOraclePrices();
        // console.log(dataMarket,"data market page")
        // console.log("user info called - transactionRefresh");
        // console.log(dataDeposit, "dataDeposit is here");
        // console.log(dataOraclePrices, "dataOraclePrices is here");
        // console.log(userLoans, "userLoans is here");
        // console.log(protocolStats, "protocolStats is here");
        // console.log(aprsAndHealth, "aprs and health is here");
        if (
          dataDeposit &&
          userLoans &&
          protocolStats &&
          userDepositsCount == transactionRefresh &&
          protocolStatsCount == transactionRefresh &&
          userLoansCount == transactionRefresh &&
          dataOraclePrices &&
          netAprCount < transactionRefresh
        ) {
          console.log("user info called inside - transactionRefresh");
          const dataNetApr = await getNetApr(
            dataDeposit,
            userLoans,
            dataOraclePrices,
            protocolStats
          );
          //@ts-ignore
          if (isNaN(dataNetApr)) {
            // console.log("netApr", dataNetApr);
            dispatch(setNetAPR(0));
          } else {
            dispatch(setNetAPR(dataNetApr));
          }
          const count = getTransactionCount();
          dispatch(setNetAprCount(count));
        }
      };

      // console.log(userInfoCount, transactionRefresh, "userInfoCount is here");
      if (netAprCount < transactionRefresh) {
        fetchNetApr();
      }
    } catch (err) {
      console.log(err, "error in user info");
    }
  }, [
    userDepositsCount,
    userLoansCount,
    dataOraclePrices,
    protocolStatsCount,
    transactionRefresh,
  ]);

  useEffect(() => {
    try {
      const fetchAvgSupplyAPRCount = async () => {
        if (!dataDeposit || !protocolStats) return;
        const aprA =
          dataDeposit?.[0]?.rTokenAmountParsed !== 0 ||
          dataDeposit?.[0]?.rTokenFreeParsed !== 0 ||
          dataDeposit?.[0]?.rTokenLockedParsed !== 0 ||
          dataDeposit?.[0]?.rTokenStakedParsed !== 0
            ? protocolStats?.[0]?.supplyRate
            : 0;
        const aprB =
          dataDeposit?.[1]?.rTokenAmountParsed !== 0 ||
          dataDeposit?.[1]?.rTokenFreeParsed !== 0 ||
          dataDeposit?.[1]?.rTokenLockedParsed !== 0 ||
          dataDeposit?.[1]?.rTokenStakedParsed !== 0
            ? protocolStats?.[1]?.supplyRate
            : 0;
        const aprC =
          dataDeposit?.[2]?.rTokenAmountParsed !== 0 ||
          dataDeposit?.[2]?.rTokenFreeParsed !== 0 ||
          dataDeposit?.[2]?.rTokenLockedParsed !== 0 ||
          dataDeposit?.[2]?.rTokenStakedParsed !== 0
            ? protocolStats?.[2]?.supplyRate
            : 0;
        const aprD =
          dataDeposit?.[3]?.rTokenAmountParsed !== 0 ||
          dataDeposit?.[3]?.rTokenFreeParsed !== 0 ||
          dataDeposit?.[3]?.rTokenLockedParsed !== 0 ||
          dataDeposit?.[3]?.rTokenStakedParsed !== 0
            ? protocolStats?.[3]?.supplyRate
            : 0;
        const aprE =
          dataDeposit?.[4]?.rTokenAmountParsed !== 0 ||
          dataDeposit?.[4]?.rTokenFreeParsed !== 0 ||
          dataDeposit?.[4]?.rTokenLockedParsed !== 0 ||
          dataDeposit?.[4]?.rTokenStakedParsed !== 0
            ? protocolStats?.[4]?.supplyRate
            : 0;
        const avgSupplyApr =
          (aprA + aprB + aprC + aprD + aprE) /
          ((aprA ? 1 : 0) +
          (aprB ? 1 : 0) +
          (aprC ? 1 : 0) +
          (aprD ? 1 : 0) +
          (aprE ? 1 : 0)
            ? (aprA ? 1 : 0) +
              (aprB ? 1 : 0) +
              (aprC ? 1 : 0) +
              (aprD ? 1 : 0) +
              (aprE ? 1 : 0)
            : 1);
        // const avgSupplyApr = await effectiveAprDeposit(
        //   dataDeposit[0],
        //   protocolStats
        // );
        // console.log(
        //   avgSupplyApr,
        //   "data avg supply apr useEffect",
        //   (aprA ? 1 : 0) +
        //     (aprB ? 1 : 0) +
        //     (aprC ? 1 : 0) +
        //     (aprD ? 1 : 0) +
        //     (aprE ? 1 : 0)
        // );
        if (avgSupplyApr != null) {
          dispatch(setAvgSupplyAPR(avgSupplyApr));
          const count = getTransactionCount();
          dispatch(setAvgSupplyAprCount(count));
        }
        // const avgBorrowApr =
        //   (protocolStats?.[0]?.borrowRate +
        //     protocolStats?.[1]?.borrowRate +
        //     protocolStats?.[2]?.borrowRate +
        //     protocolStats?.[3]?.borrowRate +
        //     protocolStats?.[4]?.borrowRate) /
        //   5;
        // // const avgBorrowApr = await effectivAPRLoan(
        // //   userLoans[0],
        // //   protocolStats,
        // //   dataOraclePrices
        // // );
        // console.log(avgBorrowApr, "data avg borrow apr pagecard");

        // dispatch(setAvgBorrowAPR(avgBorrowApr));
        // const count = getTransactionCount();
        // dispatch(setAvgBorrowAprCount(count));
      };

      if (
        avgSupplyAprCount < transactionRefresh &&
        protocolStatsCount == transactionRefresh &&
        userDepositsCount == transactionRefresh &&
        dataDeposit &&
        protocolStats
      ) {
        fetchAvgSupplyAPRCount();
      }
    } catch (err) {
      console.log(err, "error in user info");
    }
  }, [protocolStatsCount, transactionRefresh, userDepositsCount]);
  useEffect(() => {
    try {
      const fetchAvgBorrowAPRCount = async () => {
        if (!userLoans || !protocolStats) return;
        const loans = userLoans;
        const loanCheck = [0, 0, 0, 0, 0];
        loans.forEach((val: any, idx: number) => {
          if (val?.underlyingMarket == "BTC") {
            loanCheck[0] = 1;
          } else if (val?.underlyingMarket == "ETH") {
            loanCheck[1] = 1;
          } else if (val?.underlyingMarket == "USDT") {
            loanCheck[2] = 1;
          } else if (val?.underlyingMarket == "USDC") {
            loanCheck[3] = 1;
          } else if (val?.underlyingMarket == "DAI") {
            loanCheck[4] = 1;
          }
        });
        const avgBorrowApr =
          ((loanCheck[0] ? protocolStats?.[0]?.borrowRate : 0) +
            (loanCheck[1] ? protocolStats?.[1]?.borrowRate : 0) +
            (loanCheck[2] ? protocolStats?.[2]?.borrowRate : 0) +
            (loanCheck[3] ? protocolStats?.[3]?.borrowRate : 0) +
            (loanCheck[4] ? protocolStats?.[4]?.borrowRate : 0)) /
          ((loanCheck[0] ? 1 : 0) +
          (loanCheck[1] ? 1 : 0) +
          (loanCheck[2] ? 1 : 0) +
          (loanCheck[3] ? 1 : 0) +
          (loanCheck[4] ? 1 : 0)
            ? (loanCheck[0] ? 1 : 0) +
              (loanCheck[1] ? 1 : 0) +
              (loanCheck[2] ? 1 : 0) +
              (loanCheck[3] ? 1 : 0) +
              (loanCheck[4] ? 1 : 0)
            : 1);
        // const avgBorrowApr = await effectivAPRLoan(
        //   userLoans[0],
        //   protocolStats,
        //   dataOraclePrices
        // );
        // console.log(avgBorrowApr, "data avg borrow apr useEffect", loanCheck);
        if (avgBorrowApr != null) {
          dispatch(setAvgBorrowAPR(avgBorrowApr));
          const count = getTransactionCount();
          dispatch(setAvgBorrowAprCount(count));
        }
      };

      if (
        avgBorrowAPRCount < transactionRefresh &&
        protocolStats &&
        protocolStatsCount == transactionRefresh &&
        userLoans &&
        userLoansCount == transactionRefresh
      ) {
        fetchAvgBorrowAPRCount();
      }
    } catch (err) {
      console.log(err, "error in user info");
    }
  }, [protocolStatsCount, transactionRefresh, userLoansCount]);

  useEffect(() => {
    try {
      const fetchSupplyData = async () => {
        const data = dataDeposit?.map((deposit: IDeposit, idx: number) => {
          const price = oraclePrices?.find(
            (oraclePrice: any) => oraclePrice?.name == deposit?.token
          )?.price;
          const token_amount = deposit?.underlyingAssetAmountParsed;
          // const token_amount =
          //   deposit?.rTokenAmountParsed + deposit?.rTokenStakedParsed;
          if (price && token_amount) {
            return price * token_amount;
          }
          return 0;
        });
        if (data && data?.length > 0) {
          dispatch(setYourMetricsSupply(data));
          const count = getTransactionCount();
          dispatch(setYourMetricsSupplyCount(count));
        }
        console.log("supplyData", data);
      };
      if (
        dataDeposit &&
        userDepositsCount == transactionRefresh &&
        dataDeposit?.length > 0 &&
        oraclePrices &&
        oraclePrices?.length > 0 &&
        yourMetricsSupplyCount < transactionRefresh
      ) {
        fetchSupplyData();
      }
    } catch (err) {
      console.log("your metrics supply err ", err);
    }
  }, [userDepositsCount, oraclePrices, transactionRefresh]);

  useEffect(() => {
    try {
      const fetchBorrowData = async () => {
        const borrow = { BTC: 0, ETH: 0, USDT: 0, USDC: 0, DAI: 0 };
        for (let loan of userLoans) {
          if (
            loan?.loanState === "REPAID" ||
            loan?.loanState === "LIQUIDATED" ||
            loan?.loanState === null
          )
            continue;

          const oraclePrice = oraclePrices.find(
            (oraclePrice: any) =>
              oraclePrice.address === loan?.underlyingMarketAddress
          );
          let exchangeRate = protocolStats.find(
            (marketInfo: any) =>
              marketInfo.tokenAddress === loan?.underlyingMarketAddress
          )?.exchangeRateDTokenToUnderlying;
          if (oraclePrice && exchangeRate) {
            let loanAmoungUnderlying = loan?.loanAmountParsed * exchangeRate;
            if (loan?.underlyingMarket == "BTC") {
              borrow.BTC += loanAmoungUnderlying * oraclePrice.price;
            } else if (loan?.underlyingMarket == "USDT") {
              borrow.USDT += loanAmoungUnderlying * oraclePrice.price;
            } else if (loan?.underlyingMarket == "USDC") {
              borrow.USDC += loanAmoungUnderlying * oraclePrice.price;
            } else if (loan?.underlyingMarket == "ETH") {
              borrow.ETH += loanAmoungUnderlying * oraclePrice.price;
            } else if (loan?.underlyingMarket == "DAI") {
              borrow.DAI += loanAmoungUnderlying * oraclePrice.price;
            }
          }
        }
        if (borrow) {
          dispatch(setYourMetricsBorrow(borrow));
          const count = getTransactionCount();
          dispatch(setYourMetricsBorrowCount(count));
        }
        console.log("totalBorrow ", borrow);
      };
      if (
        userLoans &&
        userLoansCount == transactionRefresh &&
        protocolStats &&
        protocolStatsCount == transactionRefresh &&
        oraclePrices &&
        yourMetricsBorrowCount < transactionRefresh
      ) {
        fetchBorrowData();
      }
    } catch (err) {
      console.log("err fetchBorrowData ", err);
    }
  }, [userLoansCount, protocolStatsCount, oraclePrices, transactionRefresh]);

  // useEffect(() => {
  //   try {
  //     const fetchNetApr = async () => {
  //       // console.log(getUserDeposits(address),"deposits in pagecard")

  //       // const dataMarket=await getProtocolStats();
  //       // const dataOraclePrices=await getOraclePrices();
  //       // console.log(dataMarket,"data market page")
  //       // console.log("user info called - transactionRefresh");
  //       // console.log(dataDeposit, "dataDeposit is here");
  //       // console.log(dataOraclePrices, "dataOraclePrices is here");
  //       // console.log(userLoans, "userLoans is here");
  //       // console.log(protocolStats, "protocolStats is here");
  //       // console.log(aprsAndHealth, "aprs and health is here");
  //       if (
  //         userDepositsCount == transactionRefresh &&
  //         protocolStatsCount == transactionRefresh &&
  //         userLoansCount == transactionRefresh &&
  //         dataOraclePrices &&
  //         userInfoCount < transactionRefresh
  //       ) {
  //         console.log("user info called inside - transactionRefresh");
  //         const dataNetApr = await getNetApr(
  //           dataDeposit,
  //           userLoans,
  //           dataOraclePrices,
  //           protocolStats
  //         );
  //         console.log("netApr", dataNetApr);
  //         //@ts-ignore
  //         if (isNaN(dataNetApr)) {
  //           dispatch(setNetAPR(0));
  //         } else {
  //           dispatch(setNetAPR(dataNetApr));
  //         }
  //         const count = getTransactionCount();
  //         dispatch(setNetAprCount(count));
  //       }
  //     };

  //     console.log(userInfoCount, transactionRefresh, "userInfoCount is here");
  //     if (netAprCount < transactionRefresh) {
  //       fetchNetApr();
  //     }
  //   } catch (err) {
  //     console.log(err, "error in user info");
  //   }
  // }, [
  //   dataDeposit,
  //   userLoans,
  //   dataOraclePrices,
  //   protocolStats,
  //   transactionRefresh,
  // ]);
  useEffect(() => {
    console.log(
      "transaction refresh counts - ",
      "transactionRefresh,protocolStatsCount,protocolReservesCount,userDepositsCount,userLoansCount,oraclePricesCount,userInfoCount,effectiveAprCount,healthFactorCount,hourlyDataCount,netAprCount,avgBorrowAPRCount,yourMetricsSupplyCount,yourMetricsBorrowCount,stakingSharesCount ",
      transactionRefresh,
      protocolStatsCount,
      protocolReservesCount,
      userDepositsCount,
      userLoansCount,
      oraclePricesCount,
      userInfoCount,
      effectiveAprCount,
      healthFactorCount,
      hourlyDataCount,
      netAprCount,
      avgBorrowAPRCount,
      yourMetricsSupplyCount,
      yourMetricsBorrowCount,
      stakingSharesCount
    );
  }, [
    transactionRefresh,
    protocolStatsCount,
    protocolReservesCount,
    userDepositsCount,
    userLoansCount,
    oraclePricesCount,
    userInfoCount,
    // aprsAndHealthCount
    effectiveAprCount,
    healthFactorCount,
    hourlyDataCount,
    netAprCount,
    avgBorrowAPRCount,
    yourMetricsSupplyCount,
    yourMetricsBorrowCount,
    stakingSharesCount,
  ]);
};

export default useDataLoader;

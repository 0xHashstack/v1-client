import {
  IDeposit,
  ILoan,
  IMarketInfo,
} from '@/Blockchain/interfaces/interfaces'
import { getUserDeposits } from '@/Blockchain/scripts/Deposits'
import { getUserLoans } from '@/Blockchain/scripts/Loans'
import {
  OraclePrice,
  getOraclePrices,
} from '@/Blockchain/scripts/getOraclePrices'
import {
  getProtocolReserves,
  getProtocolStats,
} from '@/Blockchain/scripts/protocolStats'
import {
  effectivAPRLoan,
  effectiveAprDeposit,
  getNetApr,
  getNetAprDeposits,
  getNetAprLoans,
  getNetworth,
  getTotalBorrow,
  getTotalSupply,
} from '@/Blockchain/scripts/userStats'
import {
  selectAprAndHealthFactor,
  selectEffectiveApr,
  selectHealthFactor,
  selectHourlyBTCData,
  selectJediswapPoolAprs,
  selectNetAPR,
  selectNetWorth,
  selectOraclePrices,
  selectProtocolReserves,
  selectProtocolStats,
  selectStakingShares,
  selectTransactionRefresh,
  selectYourBorrow,
  selectYourSupply,
  selectZklendSpends,
  setAllBTCData,
  setAllDAIData,
  setAllETHData,
  setAllUSDCData,
  setAllUSDTData,
  setAprAndHealthFactor,
  setDailyBTCData,
  setDailyDAIData,
  setDailyETHData,
  setDailySTRKData,
  setDailyUSDCData,
  setDailyUSDTData,
  setEffectiveAPR,
  setExisitingLink,
  setFees,
  setHealthFactor,
  setHourlyBTCData,
  setHourlyDAIData,
  setHourlyETHData,
  setHourlySTRKData,
  setHourlyUSDCData,
  setHourlyUSDTData,
  setJediSwapPoolAprs,
  setJediSwapPoolsSupported,
  setMaximumDepositAmounts,
  setMaximumLoanAmounts,
  setMinimumDepositAmounts,
  setMinimumLoanAmounts,
  setMonthlyBTCData,
  setMonthlyDAIData,
  setMonthlyETHData,
  setMonthlySTRKData,
  setMonthlyUSDCData,
  setMonthlyUSDTData,
  setMySwapPoolsSupported,
  setNetAPR,
  setNetAprDeposits,
  setNetAprLoans,
  setNetWorth,
  setNftBalance,
  setNftCurrentAmount,
  setNftMaxAmount,
  setOraclePrices,
  setProtocolReserves,
  setProtocolStats,
  setStakingShares,
  setUserType,
  setUsersFilteredSupply,
  setYourBorrow,
  setYourMetricsBorrow,
  setYourMetricsSupply,
  setYourSupply,
  setZklendSpends,
} from '@/store/slices/readDataSlice'
import {
  selectAllDataCount,
  selectAprCount,
  selectAprsAndHealthCount,
  selectAvgBorrowAprCount,
  selectAvgSupplyAprCount,
  selectBorrowEffectiveAprs,
  selectFeesCount,
  selectHealthFactorCount,
  selectHourlyDataCount,
  selectJediSwapPoolsSupportedCount,
  selectJedistrkTokenAllocation,
  selectJedistrkTokenAllocationCount,
  selectMinMaxDepositCount,
  selectMinMaxLoanCount,
  selectMonthlyDataCount,
  selectMySplit,
  selectMySwapPoolsSupportedCount,
  selectNetAprCount,
  selectOraclePricesCount,
  selectProtocolStatsCount,
  selectSpendBalances,
  selectStakingSharesCount,
  selectStrkAprData,
  selectTransactionStatus,
  selectUserDepositsCount,
  selectUserInfoCount,
  selectUserLoansCount,
  selectWeeklyDataCount,
  selectYourMetricsBorrowCount,
  selectYourMetricsSupplyCount,
  selectnetSpendBalance,
  selectprotocolReservesCount,
  setAllDataCount,
  setAprCount,
  setAprsAndHealthCount,
  setAvgBorrowAPR,
  setAvgBorrowAprCount,
  setAvgSupplyAPR,
  setAvgSupplyAprCount,
  setBorrowEffectiveAprs,
  setFeesCount,
  setHealthFactorCount,
  setHourlyDataCount,
  setJediSwapPoolsSupportedCount,
  setJedistrkTokenAllocation,
  setJedistrkTokenAllocationCount,
  setMinMaxDepositCount,
  setMinMaxLoanCount,
  setMonthlyDataCount,
  setMySplit,
  setMySwapPoolsSupportedCount,
  setNetAprCount,
  setNetSpendBalance,
  setNetStrkBorrow,
  setOraclePricesCount,
  setProtocolReservesCount,
  setProtocolStatsCount,
  setSpendBalances,
  setStakingSharesCount,
  setStrkAprData,
  setUserDepositsCount,
  setUserInfoCount,
  setUserLoansCount,
  setUserUnspentLoans,
  setWeeklyDataCount,
  setYourMetricsBorrowCount,
  setYourMetricsSupplyCount,
} from '@/store/slices/userAccountSlice'

import { getExistingLoanHealth } from '@/Blockchain/scripts/LoanHealth'
import {
  getCurrentNftAmount,
  getFees,
  getMaximumDepositAmount,
  getMaximumLoanAmount,
  getMinimumDepositAmount,
  getMinimumLoanAmount,
  getNFTBalance,
  getNFTMaxAmount,
  getSupportedPools,
  getUserStakingShares,
} from '@/Blockchain/scripts/Rewards'
import { getSpendBalance } from '@/Blockchain/scripts/debt'
import {
  getJediEstimatedLiqALiqBfromLp,
  getMySwapEstimatedLiqALiqBfromLp,
  getZklendusdSpendValue,
} from '@/Blockchain/scripts/l3interaction'
import { processAddress } from '@/Blockchain/stark-constants'
import {
  getTokenFromAddress,
  tokenAddressMap,
  tokenDecimalsMap,
} from '@/Blockchain/utils/addressServices'
import { constants } from '@/Blockchain/utils/constants'
import { etherToWeiBN } from '@/Blockchain/utils/utils'
import OffchainAPI from '@/services/offchainapi.service'
import {
  selectUserDeposits,
  selectUserLoans,
  setUserDeposits,
  setUserLoans,
} from '@/store/slices/readDataSlice'
import { metrics_api } from '@/utils/keys/metricsApi'
import { useAccount } from '@starknet-react/core'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
const useDataLoader = () => {
  const { address } = useAccount()
  const protocolReserves = useSelector(selectProtocolReserves)
  const dataDeposit = useSelector(selectUserDeposits)
  const protocolStats = useSelector(selectProtocolStats)
  const dataOraclePrices = useSelector(selectOraclePrices)
  const aprsAndHealth = useSelector(selectAprAndHealthFactor)
  //  const dataMarket=useSelector(selectProtocolStats);
  const yourSupply = useSelector(selectYourSupply)
  const userLoans = useSelector(selectUserLoans)
  const yourBorrow = useSelector(selectYourBorrow)
  const netWorth = useSelector(selectNetWorth)
  const netAPR = useSelector(selectNetAPR)
  const [isMounted, setIsMounted] = useState(false)
  const protocolStatsCount = useSelector(selectProtocolStatsCount)
  const protocolReservesCount = useSelector(selectprotocolReservesCount)
  const userDepositsCount = useSelector(selectUserDepositsCount)
  const userLoansCount = useSelector(selectUserLoansCount)
  const oraclePricesCount = useSelector(selectOraclePricesCount)
  const userInfoCount = useSelector(selectUserInfoCount)
  // const aprsAndHealthCount = useSelector(selectAprsAndHealthCount);
  const hourlyDataCount = useSelector(selectHourlyDataCount)
  const transactionRefresh = useSelector(selectTransactionRefresh)
  const oraclePrices = useSelector(selectOraclePrices)
  const effectiveApr = useSelector(selectEffectiveApr)
  const effectiveAprCount = useSelector(selectAprCount)
  const healthFactor = useSelector(selectHealthFactor)
  const healthFactorCount = useSelector(selectHealthFactorCount)
  const hourlyBTCData = useSelector(selectHourlyBTCData)
  const netAprCount = useSelector(selectNetAprCount)
  const avgSupplyAprCount = useSelector(selectAvgSupplyAprCount)
  const avgBorrowAPRCount = useSelector(selectAvgBorrowAprCount)
  const yourMetricsBorrowCount = useSelector(selectYourMetricsBorrowCount)
  const yourMetricsSupplyCount = useSelector(selectYourMetricsSupplyCount)
  const weeklyDataCount = useSelector(selectWeeklyDataCount)
  const monthlyDataCount = useSelector(selectMonthlyDataCount)
  const allDataCount = useSelector(selectAllDataCount)
  // const stakingShares = useSelector(selectStakingShares);
  const stakingSharesCount = useSelector(selectStakingSharesCount)
  const feesCount = useSelector(selectFeesCount)
  const jedistrkTokenAllocationCount = useSelector(
    selectJedistrkTokenAllocationCount
  )
  const minMaxCount = useSelector(selectMinMaxDepositCount)
  const minMaxLoanCount = useSelector(selectMinMaxLoanCount)
  const jediSwapPoolsSupportedCount = useSelector(
    selectJediSwapPoolsSupportedCount
  )
  const mySwapPoolsSupportedCount = useSelector(selectMySwapPoolsSupportedCount)
  const transactionStatus = useSelector(selectTransactionStatus)
  const poolAprs = useSelector(selectJediswapPoolAprs)
  const spendBalances = useSelector(selectSpendBalances)
  const strkData = useSelector(selectStrkAprData)
  const allSplit = useSelector(selectMySplit)
  const jedistrkTokenAllocation = useSelector(selectJedistrkTokenAllocation)
  const netSpendBalance = useSelector(selectnetSpendBalance)
  const borrowEffectiveAprs = useSelector(selectBorrowEffectiveAprs)
  const zkLendSpends=useSelector(selectZklendSpends);
  const [poolsPairs, setPoolPairs] = useState<any>([
    {
      address:
        '0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e',
      keyvalue: 'USDC/USDT',
    },
    {
      address:
        '0x4b6e4bef4dd1424b06d599a55c464e94cd9f3cb1a305eaa8a3db923519585f7',
      keyvalue: 'ETH/USDT',
    },
    {
      address:
        '0x129c74ca4274e3dbf7ab83f5916bebf087ce7af7495b3c648f1d2f2ab302330',
      keyvalue: 'ETH/USDC',
    },
    {
      address:
        '0x436fd41efe1872ce981331e2f11a50eca547a67f8e4d2bc476f60dc24dd5884',
      keyvalue: 'DAI/ETH',
    },
    {
      address:
        '0x260e98362e0949fefff8b4de85367c035e44f734c9f8069b6ce2075ae86b45c',
      keyvalue: 'BTC/ETH',
    },
    {
      address:
        '0x393d6cbf933e7ecc819a74cf865fce148b237004954e49c118773cdd0e84ab9',
      keyvalue: 'BTC/USDT',
    },
    {
      address:
        '0x1d26e4dd7e42781721577f5f3615aa9f1c5076776b337e968e3194d8af78ea0',
      keyvalue: 'BTC/USDC',
    },
    {
      address:
        '0x51c32e614dd57eaaeed77c3342dd0da177d7200b6adfd8497647f7a5a71a717',
      keyvalue: 'BTC/DAI',
    },
    {
      address:
        '0x79ac8e9b3ce75f3294d3be2b361ca7ffa481fe56b0dd36500e43f5ce3f47077',
      keyvalue: 'USDT/DAI',
    },
    {
      address:
        '0x3d58a2767ebb27cf36b5fa1d0da6566b6042bd1a9a051c40129bad48edb147b',
      keyvalue: 'USDC/DAI',
    },
    {
      address:
        '0x2ed66297d146ecd91595c3174da61c1397e8b7fcecf25d423b1ba6717b0ece9',
      keyvalue: 'STRK/ETH',
    },
  ])
  const [poolsPairsMainnet, setPoolPairsMainnet] = useState<any>([
    {
      address:
        '0x5801bdad32f343035fb242e98d1e9371ae85bc1543962fedea16c59b35bd19b',
      keyvalue: 'USDC/USDT',
    },
    {
      address:
        '0x45e7131d776dddc137e30bdd490b431c7144677e97bf9369f629ed8d3fb7dd6',
      keyvalue: 'ETH/USDT',
    },
    {
      address:
        '0x260e98362e0949fefff8b4de85367c035e44f734c9f8069b6ce2075ae86b45c',
      keyvalue: 'BTC/ETH',
    },
    {
      address:
        '0x4d0390b777b424e43839cd1e744799f3de6c176c7e32c1812a41dbd9c19db6a',
      keyvalue: 'ETH/USDC',
    },
    {
      address:
        '0x7e2a13b40fc1119ec55e0bcf9428eedaa581ab3c924561ad4e955f95da63138',
      keyvalue: 'DAI/ETH',
    },
    {
      address:
        '0x44d13ad98a46fd2322ef2637e5e4c292ce8822f47b7cb9a1d581176a801c1a0',
      keyvalue: 'BTC/USDT',
    },
    {
      address:
        '0x5a8054e5ca0b277b295a830e53bd71a6a6943b42d0dbb22329437522bc80c8',
      keyvalue: 'BTC/USDC',
    },
    {
      address:
        '0x39c183c8e5a2df130eefa6fbaa3b8aad89b29891f6272cb0c90deaa93ec6315',
      keyvalue: 'BTC/DAI',
    },
    {
      address:
        '0xf0f5b3eed258344152e1f17baf84a2e1b621cd754b625bec169e8595aea767',
      keyvalue: 'USDT/DAI',
    },
    {
      address:
        '0xcfd39f5244f7b617418c018204a8a9f9a7f72e71f0ef38f968eeb2a9ca302b',
      keyvalue: 'USDC/DAI',
    },
    {
      address:
        '0x2ed66297d146ecd91595c3174da61c1397e8b7fcecf25d423b1ba6717b0ece9',
      keyvalue: 'STRK/ETH',
    },
  ])
  const mySwapPoolPairs = [
    {
      address:
        '0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e',
      keyvalue: 'USDC/USDT',
    },
    {
      address:
        '0x4b6e4bef4dd1424b06d599a55c464e94cd9f3cb1a305eaa8a3db923519585f7',
      keyvalue: 'ETH/USDT',
    },
    {
      address:
        '0x129c74ca4274e3dbf7ab83f5916bebf087ce7af7495b3c648f1d2f2ab302330',
      keyvalue: 'ETH/USDC',
    },
    {
      address:
        '0x436fd41efe1872ce981331e2f11a50eca547a67f8e4d2bc476f60dc24dd5884',
      keyvalue: 'DAI/ETH',
    },
    {
      address:
        '0x393d6cbf933e7ecc819a74cf865fce148b237004954e49c118773cdd0e84ab9',
      keyvalue: 'BTC/USDT',
    },
    {
      address:
        '0x1d26e4dd7e42781721577f5f3615aa9f1c5076776b337e968e3194d8af78ea0',
      keyvalue: 'BTC/USDC',
    },
    {
      address:
        '0x51c32e614dd57eaaeed77c3342dd0da177d7200b6adfd8497647f7a5a71a717',
      keyvalue: 'BTC/DAI',
    },
    {
      address:
        '0x79ac8e9b3ce75f3294d3be2b361ca7ffa481fe56b0dd36500e43f5ce3f47077',
      keyvalue: 'USDT/DAI',
    },
    {
      address:
        '0x3d58a2767ebb27cf36b5fa1d0da6566b6042bd1a9a051c40129bad48edb147b',
      keyvalue: 'USDC/DAI',
    },
  ]
  const mySwapPoolPairsMainnet = [
    {
      address:
        '0x1ea237607b7d9d2e9997aa373795929807552503683e35d8739f4dc46652de1',
      keyvalue: 'USDC/USDT',
    },
    {
      address:
        '0x41f9a1e9a4d924273f5a5c0c138d52d66d2e6a8bee17412c6b0f48fe059ae04',
      keyvalue: 'ETH/USDT',
    },
    {
      address:
        '0x22b05f9396d2c48183f6deaf138a57522bcc8b35b67dee919f76403d1783136',
      keyvalue: 'ETH/USDC',
    },
    {
      address:
        '0x7c662b10f409d7a0a69c8da79b397fd91187ca5f6230ed30effef2dceddc5b3',
      keyvalue: 'DAI/ETH',
    },
    {
      address:
        '0x393d6cbf933e7ecc819a74cf865fce148b237004954e49c118773cdd0e84ab9',
      keyvalue: 'BTC/USDT',
    },
    {
      address:
        '0x25b392609604c75d62dde3d6ae98e124a31b49123b8366d7ce0066ccb94f6967',
      keyvalue: 'BTC/USDC',
    },
    {
      address:
        '0x51c32e614dd57eaaeed77c3342dd0da177d7200b6adfd8497647f7a5a71a717',
      keyvalue: 'BTC/DAI',
    },
    {
      address:
        '0x79ac8e9b3ce75f3294d3be2b361ca7ffa481fe56b0dd36500e43f5ce3f47077',
      keyvalue: 'USDT/DAI',
    },
    {
      address:
        '0x611e8f4f3badf1737b9e8f0ca77dd2f6b46a1d33ce4eed951c6b18ac497d505',
      keyvalue: 'USDC/DAI',
    },
  ]
  const dispatch = useDispatch()
  const Data: any = []
  const [avgs, setAvgs] = useState<any>([])
  const [btcData, setBtcData] = useState<any>()

  const avgsData: any = []
  ////console.log("address", address);
  // useEffect(() => {
  //  //console.log("switched to market");
  // }, []);
  const getTransactionCount = () => {
    return transactionRefresh
  }
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

  //      //console.log("dataArray ", data);
  //       setSeriesData(dataArray);
  //     };
  //     fetchData();
  //   } catch (err) {
  //    //console.log("error fetching aprByMarket data ", err);
  //   }
  // }, []);
  // useEffect(() => {
  //  //console.log("your supply catch transactionStatus ", transactionStatus);
  // }, [transactionStatus]);

  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        ////console.log("HIII")
        // if(hourlyBTCData!=null){
        //   return;
        // }
        const promises = [
          OffchainAPI.httpGet(`/api/metrics/tvl/daily/DAI`),
          OffchainAPI.httpGet(`/api/metrics/tvl/daily/BTC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/daily/USDT`),
          OffchainAPI.httpGet(`/api/metrics/tvl/daily/USDC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/daily/ETH`),
          OffchainAPI.httpGet(`/api/metrics/tvl/daily/STRK`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/daily/DAI`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/daily/BTC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/daily/USDT`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/daily/USDC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/daily/ETH`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/daily/STRK`),
          OffchainAPI.httpGet(`/api/metrics/urm_platform/daily`),
        ]
        Promise.allSettled([...promises]).then((val) => {
          val.map((response, idx) => {
            const res = response?.status != 'rejected' ? response?.value : '0'
          })
          for (var j = 0; j < 6; j++) {
            ////console.log(j,"for loop")
            const responseA = val?.[j] ? val?.[j] : null
            const responseB = val?.[j + 6] ? val?.[j + 6] : null
            const responseC = val?.[12] ? val?.[12] : null
            // if (
            //   val[j]?.status != "rejected" &&
            //   val[j + 5]?.status != "rejected" &&
            //   val[10]?.status != "rejected"
            // ) {
            const responseTotal =
              responseC?.status != 'rejected' ? responseC?.value : null
            const response =
              responseA?.status != 'rejected' ? responseA?.value : null
            const responseApr =
              responseB?.status != 'rejected' ? responseB?.value : null
            ////console.log(val, response, "response data", responseApr);
            // if (!response) {
            //   return;
            // }
            // const response2=axios.get('http://127.0.0.1:3010/api/metrics/tvl/hourly/DAI')
            if (response && responseApr && responseTotal) {
              const amounts: any = []
              const borrowAmounts: any = []
              const dates: any = []
              const supplyRates: any = []
              const borrowRates: any = []
              const tvlAmounts: any = []
              const supplyCounts: any = []
              const borrowCounts: any = []
              const utilRates: any = []
              const rTokenExchangeRates: any = []
              const dTokenExchangeRates: any = []
              const totalTransactions: any = []
              const totalAccounts: any = []
              const aprs: any = []
              const apys: any = []
              const totalUrm: any = []
              for (var i = 0; i < response?.length; i++) {
                ////console.log(i,"inside loop")
                const token = response?.[i]?.tokenName
                const supplyAmount: number =
                  (Number(response?.[i]?.supplyAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price
                const borrowAmount: number =
                  (Number(response?.[i]?.borrowAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price
                const tvlAmount: number =
                  (Number(response?.[i]?.tvlAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price
                ////console.log(supplyAmount,token,response?.[i].supplyAmount,"amount and token")
                ////console.log(response?.[i].tokenName)
                // const supplyAmount1=etherToWeiBN(amount,token)
                ////console.log(supplyAmount1,"aamount")
                amounts?.push(supplyAmount)
                borrowAmounts?.push(borrowAmount)
                // tvlAmounts?.push(tvlAmount);
                tvlAmounts?.push(supplyAmount)
                // const dateObj = new Date(response?.data[i].Datetime)
                dates?.push(response?.[i].Datetime)
                supplyRates?.push(response?.[i]?.supplyRate / 100)
                borrowRates?.push(response?.[i]?.borrowRate / 100)
                supplyCounts?.push(response?.[i]?.supplyAccounts)
                borrowCounts?.push(response?.[i]?.borrowAccounts)
                utilRates?.push(response?.[i]?.utilRate / 100)
                rTokenExchangeRates?.push(
                  1 / (response?.[i]?.rTokenExchangeRate / 10000)
                )
                dTokenExchangeRates?.push(
                  1 / (response?.[i]?.dTokenExchangeRate / 10000)
                )
                totalTransactions?.push(response?.[i]?.totalTransactions)
                totalAccounts?.push(response?.[i]?.totalAccounts)
                aprs?.push(responseApr?.[i]?.APY)
                apys?.push(responseApr?.[i]?.APR)
                totalUrm?.push(responseTotal?.[i]?.totalPlatformURM / 100)
              }
              ////console.log(dates,"Dates")
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
              }
              ////console.log(
              //   "backend loop daily - ",
              //   response?.[0]?.tokenName,
              //   data
              // );
              ////console.log(data,"data in data loader")
              ////console.log(btcData,"Data gone")
              if (j == 0) {
                dispatch(setHourlyDAIData(data))
              } else if (j == 1) {
                dispatch(setHourlyBTCData(data))
              } else if (j == 2) {
                dispatch(setHourlyUSDTData(data))
              } else if (j == 3) {
                dispatch(setHourlyUSDCData(data))
              } else if (j == 4) {
                dispatch(setHourlyETHData(data))
              } else if (j == 5) {
                dispatch(setHourlySTRKData(data))
              }
            }
          }
          const count = getTransactionCount()
          dispatch(setHourlyDataCount(count))
          // }
        })
        // const count = getTransactionCount();
        // dispatch(setHourlyDataCount(count));
      } catch (err) {
        //console.log(err, "err in hourly data");
      }
    }
    if (hourlyDataCount < transactionRefresh && oraclePrices) {
      fetchHourlyData()
    }
  }, [oraclePrices])
  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        ////console.log("HIII")
        // if(hourlyBTCData!=null){
        //   return;
        // }
        const promises = [
          OffchainAPI.httpGet(`/api/metrics/tvl/weekly/DAI`),
          OffchainAPI.httpGet(`/api/metrics/tvl/weekly/BTC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/weekly/USDT`),
          OffchainAPI.httpGet(`/api/metrics/tvl/weekly/USDC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/weekly/ETH`),
          OffchainAPI.httpGet(`/api/metrics/tvl/weekly/STRK`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/weekly/DAI`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/weekly/BTC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/weekly/USDT`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/weekly/USDC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/weekly/ETH`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/weekly/STRK`),
          OffchainAPI.httpGet(`/api/metrics/urm_platform/weekly`),
        ]
        Promise.allSettled([...promises]).then((val) => {
          ////console.log("backend data weekly - ", val);
          val.map((response, idx) => {
            const res = response?.status != 'rejected' ? response?.value : '0'
          })
          for (var j = 0; j < 6; j++) {
            ////console.log(j,"for loop")
            const responseA = val?.[j] ? val?.[j] : null
            const responseB = val?.[j + 6] ? val?.[j + 6] : null
            const responseC = val?.[12] ? val?.[12] : null
            // if (
            //   val[j]?.status != "rejected" &&
            //   val[j + 5]?.status != "rejected" &&
            //   val[10]?.status != "rejected"
            // ) {
            const responseTotal =
              responseC?.status != 'rejected' ? responseC?.value : null
            const response =
              responseA?.status != 'rejected' ? responseA?.value : null
            const responseApr =
              responseB?.status != 'rejected' ? responseB?.value : null
            ////console.log(val, response, "response data", responseApr);
            // if (!response) {
            //   return;
            // }
            // const response2=axios.get('http://127.0.0.1:3010/api/metrics/tvl/hourly/DAI')
            if (response && responseApr && responseTotal) {
              const amounts: any = []
              const borrowAmounts: any = []
              const dates: any = []
              const supplyRates: any = []
              const borrowRates: any = []
              const tvlAmounts: any = []
              const supplyCounts: any = []
              const borrowCounts: any = []
              const utilRates: any = []
              const rTokenExchangeRates: any = []
              const dTokenExchangeRates: any = []
              const totalTransactions: any = []
              const totalAccounts: any = []
              const aprs: any = []
              const apys: any = []
              const totalUrm: any = []
              for (var i = 0; i < response?.length; i++) {
                ////console.log(i,"inside loop")
                const token = response?.[i]?.tokenName
                const supplyAmount: number =
                  (Number(response?.[i]?.supplyAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price
                const borrowAmount: number =
                  (Number(response?.[i]?.borrowAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price
                const tvlAmount: number =
                  Number(response?.[i].tvlAmount) /
                  Math.pow(10, tokenDecimalsMap[token])
                ////console.log(supplyAmount,token,response?.[i].supplyAmount,"amount and token")
                ////console.log(response?.[i].tokenName)
                // const supplyAmount1=etherToWeiBN(amount,token)
                ////console.log(supplyAmount1,"aamount")
                amounts?.push(supplyAmount)
                borrowAmounts?.push(borrowAmount)
                // tvlAmounts?.push(tvlAmount);
                tvlAmounts?.push(supplyAmount)
                // const dateObj = new Date(response?.data[i].Datetime)
                dates?.push(response?.[i].Datetime)
                supplyRates?.push(response?.[i]?.supplyRate / 100)
                borrowRates?.push(response?.[i]?.borrowRate / 100)
                supplyCounts?.push(response?.[i]?.supplyAccounts)
                borrowCounts?.push(response?.[i]?.borrowAccounts)
                utilRates?.push(response?.[i]?.utilRate / 100)
                rTokenExchangeRates?.push(
                  1 / (response?.[i]?.rTokenExchangeRate / 10000)
                )
                dTokenExchangeRates?.push(
                  1 / (response?.[i]?.dTokenExchangeRate / 10000)
                )
                totalTransactions?.push(response?.[i]?.totalTransactions)
                totalAccounts?.push(response?.[i]?.totalAccounts)
                aprs?.push(responseApr?.[i]?.APY)
                apys?.push(responseApr?.[i]?.APR)
                totalUrm?.push(responseTotal?.[i]?.totalPlatformURM / 100)
              }
              ////console.log(dates,"Dates")
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
              }
              ////console.log("backend looping 2 -", data);
              ////console.log(data,"data in data loader")
              ////console.log(btcData,"Data gone")
              if (j == 0) {
                dispatch(setDailyDAIData(data))
              } else if (j == 1) {
                dispatch(setDailyBTCData(data))
              } else if (j == 2) {
                dispatch(setDailyUSDTData(data))
              } else if (j == 3) {
                dispatch(setDailyUSDCData(data))
              } else if (j == 4) {
                dispatch(setDailyETHData(data))
              } else if (j == 5) {
                dispatch(setDailySTRKData(data))
              }
            }
          }
          const count = getTransactionCount()
          dispatch(setWeeklyDataCount(count))
          // }
        })
        // const count = getTransactionCount();
        // dispatch(setHourlyDataCount(count));
      } catch (err) {
        //console.log(err, "err in hourly data");
      }
    }
    if (weeklyDataCount < transactionRefresh && oraclePrices) {
      fetchDailyData()
    }
  }, [oraclePrices])
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        ////console.log("HIII")
        // if(hourlyBTCData!=null){
        //   return;
        // }
        const promises = [
          OffchainAPI.httpGet(`/api/metrics/tvl/monthly/DAI`),
          OffchainAPI.httpGet(`/api/metrics/tvl/monthly/BTC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/monthly/USDT`),
          OffchainAPI.httpGet(`/api/metrics/tvl/monthly/USDC`),
          OffchainAPI.httpGet(`/api/metrics/tvl/monthly/ETH`),
          OffchainAPI.httpGet(`/api/metrics/tvl/monthly/STRK`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/monthly/DAI`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/monthly/BTC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/monthly/USDT`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/monthly/USDC`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/monthly/ETH`),
          OffchainAPI.httpGet(`/api/metrics/apm_market/monthly/STRK`),
          OffchainAPI.httpGet(`/api/metrics/urm_platform/monthly`),
        ]
        Promise.allSettled([...promises]).then((val) => {
          ////console.log("backend data weekly - ", val);
          val.map((response, idx) => {
            const res = response?.status != 'rejected' ? response?.value : '0'
          })
          for (var j = 0; j < 6; j++) {
            ////console.log(j,"for loop")
            const responseA = val?.[j] ? val?.[j] : null
            const responseB = val?.[j + 6] ? val?.[j + 6] : null
            const responseC = val?.[12] ? val?.[12] : null
            // if (
            //   val[j]?.status != "rejected" &&
            //   val[j + 5]?.status != "rejected" &&
            //   val[10]?.status != "rejected"
            // ) {
            const responseTotal =
              responseC?.status != 'rejected' ? responseC?.value : null
            const response =
              responseA?.status != 'rejected' ? responseA?.value : null
            const responseApr =
              responseB?.status != 'rejected' ? responseB?.value : null
            ////console.log(val, response, "response data", responseApr);
            // if (!response) {
            //   return;
            // }
            // const response2=axios.get('http://127.0.0.1:3010/api/metrics/tvl/hourly/DAI')
            if (response && responseApr && responseTotal) {
              const amounts: any = []
              const borrowAmounts: any = []
              const dates: any = []
              const supplyRates: any = []
              const borrowRates: any = []
              const tvlAmounts: any = []
              const supplyCounts: any = []
              const borrowCounts: any = []
              const utilRates: any = []
              const rTokenExchangeRates: any = []
              const dTokenExchangeRates: any = []
              const totalTransactions: any = []
              const totalAccounts: any = []
              const aprs: any = []
              const apys: any = []
              const totalUrm: any = []
              for (var i = 0; i < response?.length; i++) {
                ////console.log(i,"inside loop")
                const token = response?.[i]?.tokenName
                const supplyAmount: number =
                  (Number(response?.[i]?.supplyAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price
                const borrowAmount: number =
                  (Number(response?.[i]?.borrowAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price
                const tvlAmount: number =
                  Number(response?.[i].tvlAmount) /
                  Math.pow(10, tokenDecimalsMap[token])
                ////console.log(supplyAmount,token,response?.[i].supplyAmount,"amount and token")
                ////console.log(response?.[i].tokenName)
                // const supplyAmount1=etherToWeiBN(amount,token)
                ////console.log(supplyAmount1,"aamount")
                amounts?.push(supplyAmount)
                borrowAmounts?.push(borrowAmount)
                // tvlAmounts?.push(tvlAmount);
                tvlAmounts?.push(supplyAmount)
                // const dateObj = new Date(response?.data[i].Datetime)
                dates?.push(response?.[i].Datetime)
                supplyRates?.push(response?.[i]?.supplyRate / 100)
                borrowRates?.push(response?.[i]?.borrowRate / 100)
                supplyCounts?.push(response?.[i]?.supplyAccounts)
                borrowCounts?.push(response?.[i]?.borrowAccounts)
                utilRates?.push(response?.[i]?.utilRate / 100)
                rTokenExchangeRates?.push(
                  1 / (response?.[i]?.rTokenExchangeRate / 10000)
                )
                dTokenExchangeRates?.push(
                  1 / (response?.[i]?.dTokenExchangeRate / 10000)
                )
                totalTransactions?.push(response?.[i]?.totalTransactions)
                totalAccounts?.push(response?.[i]?.totalAccounts)
                aprs?.push(responseApr?.[i]?.APY)
                apys?.push(responseApr?.[i]?.APR)
                totalUrm?.push(responseTotal?.[i]?.totalPlatformURM / 100)
              }
              ////console.log(dates,"Dates")
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
              }
              ////console.log(dates,"monthly dates")
              ////console.log("backend looping 2 -", data);
              ////console.log(data,"data in data loader")
              ////console.log(btcData,"Data gone")
              if (j == 0) {
                dispatch(setMonthlyDAIData(data))
              } else if (j == 1) {
                dispatch(setMonthlyBTCData(data))
              } else if (j == 2) {
                dispatch(setMonthlyUSDTData(data))
              } else if (j == 3) {
                dispatch(setMonthlyUSDCData(data))
              } else if (j == 4) {
                dispatch(setMonthlyETHData(data))
              } else if (j == 5) {
                dispatch(setMonthlySTRKData(data))
              }
            }
          }
          const count = getTransactionCount()
          dispatch(setMonthlyDataCount(count))
          // }
        })
        // const count = getTransactionCount();
        // dispatch(setHourlyDataCount(count));
      } catch (err) {
        //console.log(err, "err in hourly data");
      }
    }
    if (monthlyDataCount < transactionRefresh && oraclePrices) {
      fetchMonthlyData()
    }
  }, [oraclePrices])
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        ////console.log("HIII")
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
        ]
        Promise.allSettled([...promises]).then((val) => {
          ////console.log("backend data weekly - ", val);
          val.map((response, idx) => {
            const res = response?.status != 'rejected' ? response?.value : '0'
          })
          for (var j = 0; j < 5; j++) {
            ////console.log(j,"for loop")
            const responseA = val?.[j] ? val?.[j] : null
            const responseB = val?.[j + 5] ? val?.[j + 5] : null
            const responseC = val?.[10] ? val?.[10] : null
            // if (
            //   val[j]?.status != "rejected" &&
            //   val[j + 5]?.status != "rejected" &&
            //   val[10]?.status != "rejected"
            // ) {
            const responseTotal =
              responseC?.status != 'rejected' ? responseC?.value : null
            const response =
              responseA?.status != 'rejected' ? responseA?.value : null
            const responseApr =
              responseB?.status != 'rejected' ? responseB?.value : null
            ////console.log(val, response, "response data", responseApr);
            // if (!response) {
            //   return;
            // }
            // const response2=axios.get('http://127.0.0.1:3010/api/metrics/tvl/hourly/DAI')
            if (response && responseApr && responseTotal) {
              const amounts: any = []
              const borrowAmounts: any = []
              const dates: any = []
              const supplyRates: any = []
              const borrowRates: any = []
              const tvlAmounts: any = []
              const supplyCounts: any = []
              const borrowCounts: any = []
              const utilRates: any = []
              const rTokenExchangeRates: any = []
              const dTokenExchangeRates: any = []
              const totalTransactions: any = []
              const totalAccounts: any = []
              const aprs: any = []
              const apys: any = []
              const totalUrm: any = []
              for (var i = 0; i < response?.length; i++) {
                ////console.log(i,"inside loop")
                const token = response?.[i]?.tokenName
                const supplyAmount: number =
                  (Number(response?.[i]?.supplyAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price
                const borrowAmount: number =
                  (Number(response?.[i]?.borrowAmount) /
                    Math.pow(10, tokenDecimalsMap[token])) *
                  oraclePrices?.find(
                    (oraclePrice: OraclePrice) => oraclePrice?.name == token
                  )?.price
                const tvlAmount: number =
                  Number(response?.[i].tvlAmount) /
                  Math.pow(10, tokenDecimalsMap[token])
                ////console.log(supplyAmount,token,response?.[i].supplyAmount,"amount and token")
                ////console.log(response?.[i].tokenName)
                // const supplyAmount1=etherToWeiBN(amount,token)
                ////console.log(supplyAmount1,"aamount")
                amounts?.push(supplyAmount)
                borrowAmounts?.push(borrowAmount)
                // tvlAmounts?.push(tvlAmount);
                tvlAmounts?.push(supplyAmount)
                // const dateObj = new Date(response?.data[i].Datetime)
                dates?.push(response?.[i].Datetime)
                supplyRates?.push(response?.[i]?.supplyRate / 100)
                borrowRates?.push(response?.[i]?.borrowRate / 100)
                supplyCounts?.push(response?.[i]?.supplyAccounts)
                borrowCounts?.push(response?.[i]?.borrowAccounts)
                utilRates?.push(response?.[i]?.utilRate / 100)
                rTokenExchangeRates?.push(
                  1 / (response?.[i]?.rTokenExchangeRate / 10000)
                )
                dTokenExchangeRates?.push(
                  1 / (response?.[i]?.dTokenExchangeRate / 10000)
                )
                totalTransactions?.push(response?.[i]?.totalTransactions)
                totalAccounts?.push(response?.[i]?.totalAccounts)
                aprs?.push(responseApr?.[i]?.APY)
                apys?.push(responseApr?.[i]?.APR)
                totalUrm?.push(responseTotal?.[i]?.totalPlatformURM / 100)
              }
              ////console.log(dates,"Dates")
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
              }
              ////console.log(dates,"monthly dates")
              ////console.log("backend looping 2 -", data);
              ////console.log(btcData,"Data gone")
              if (j == 0) {
                dispatch(setAllDAIData(data))
              } else if (j == 1) {
                dispatch(setAllBTCData(data))
              } else if (j == 2) {
                dispatch(setAllUSDTData(data))
              } else if (j == 3) {
                dispatch(setAllUSDCData(data))
              } else if (j == 4) {
                dispatch(setAllETHData(data))
              }
            }
          }
          const count = getTransactionCount()
          dispatch(setAllDataCount(count))
          // }
        })
        // const count = getTransactionCount();
        // dispatch(setHourlyDataCount(count));
      } catch (err) {
        //console.log(err, "err in hourly data");
      }
    }
    if (allDataCount < transactionRefresh && oraclePrices) {
      fetchAllData()
    }
  }, [oraclePrices])
  useEffect(() => {
    try {
      const fetchOraclePrices = async () => {
        let data = await getOraclePrices()
        if (!data || data?.length < 6) {
          return
        }
        dispatch(setOraclePrices(data))
        dispatch(setOraclePricesCount(0))
        //console.log("oracle prices - transactionRefresh done ", data);
      }
      if (oraclePricesCount < 0) {
        fetchOraclePrices()
      }
    } catch (err) {
      //console.log("oracle prices - transactionRefresh error ", err);
    }
  }, [address, transactionRefresh])

  useEffect(() => {
    try {
      const fetchProtocolReserves = async () => {
        const reserves = await getProtocolReserves()
        // dispatch(
        //   setProtocolReserves({
        //     totalReserves: 123,
        //     availableReserves: 123,
        //     avgAssetUtilisation: 1233,
        //   })
        // );
        dispatch(setProtocolReserves(reserves))
        const count = getTransactionCount()
        dispatch(setProtocolReservesCount(count))
      }
      if (protocolReservesCount < transactionRefresh) {
        fetchProtocolReserves()
      }
    } catch (err) {
      //console.log("error fetching protocol reserves ", err);
    }
  }, [address, transactionRefresh])

  useEffect(() => {
    try {
      const fetchFees = async () => {
        if (!address) {
          return
        }
        const promises = [
          getFees('get_deposit_request_fee'),
          getFees('get_staking_fee'),
          getFees('get_unstaking_fee'),
          getFees('get_withdraw_deposit_fee'),
          getFees('get_loan_request_fee'),
          getFees('get_l3_interaction_fee'),
          getFees('get_loan_repay_fee'),
          getNFTBalance(address || ''),
          getNFTMaxAmount(),
          getCurrentNftAmount(),
        ]
        Promise.allSettled([...promises]).then((val) => {
          const data = {
            supply: val?.[0]?.status == 'fulfilled' ? val?.[0]?.value : null,
            stake: val?.[1]?.status == 'fulfilled' ? val?.[1]?.value : 0,
            unstake: val?.[2]?.status == 'fulfilled' ? val?.[2]?.value : 0,
            withdrawSupply:
              val?.[3]?.status == 'fulfilled' ? val?.[3]?.value : 0,
            borrow: val?.[4]?.status == 'fulfilled' ? val?.[4]?.value : 0,
            borrowTrade: 0.1,
            l3interaction:
              val?.[5]?.status == 'fulfilled' ? val?.[5]?.value : 0,
            repayLoan: val?.[6]?.status == 'fulfilled' ? val?.[6]?.value : 0,
          }
          const nft = val?.[7]?.status == 'fulfilled' ? val?.[7]?.value : 0
          const nftMaxAmount =
            val[8]?.status == 'fulfilled' ? val?.[8]?.value : 0
          const nftCurrentAmount =
            val[9]?.status == 'fulfilled' ? val?.[9]?.value : 0
          if (data?.supply == null) {
            return
          }
          dispatch(setNftCurrentAmount(nftCurrentAmount))
          dispatch(setNftBalance(nft))
          dispatch(setFees(data))
          dispatch(setNftMaxAmount(nftMaxAmount))
          const count = getTransactionCount()
          dispatch(setFeesCount(count))
        })
        if (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet') {
          const dataUserType = await axios.get(
            `https://hstk.fi/get-user-type/${address}`
          )
          const dataExisitingLink = await axios.get(
            `https://hstk.fi/get-ref-link/${address}`
          )
          if (dataUserType) {
            dispatch(setUserType(dataUserType?.data?.user_type))
          }
          if (dataExisitingLink) {
            dispatch(setExisitingLink(dataExisitingLink?.data?.ref))
          }
        }
      }
      if (feesCount < transactionRefresh) {
        fetchFees()
      }
    } catch (err) {
      //console.log(err, "err in fetchFees")
    }
  }, [transactionRefresh, address])
  useEffect(() => {
    try {
      const fetchProtocolStats = async () => {
        const dataStats = await getProtocolStats()
        if (!dataStats || (Array.isArray(dataStats) && dataStats?.length < 6)) {
          return
        }
        ////console.log(dataStats,"data market in pagecard")
        dispatch(setProtocolStats(dataStats))
        const count = getTransactionCount()
        dispatch(setProtocolStatsCount(count))
      }
      const fetchSpends = async () => {
        const dataSpends = await getSpendBalance()
        if (
          !dataSpends ||
          (Array.isArray(dataSpends) && dataSpends?.length < 6)
        ) {
          return
        }
        dispatch(setSpendBalances(dataSpends))
      }
      if (protocolStatsCount < transactionRefresh) {
        fetchProtocolStats()
        fetchSpends()
      }
    } catch (err) {
      //console.log("protocol stats - transactionRefresh error ", err);
    }
  }, [address, transactionRefresh])

  useEffect(() => {
    try {
      const fetchUserDeposits = async () => {
        if (!address) {
          return
        }
        const data = await getUserDeposits(address)
        if (!data) {
          return
        }

        if (data) {
          dispatch(setUserDeposits(data))
          const count = getTransactionCount()
          dispatch(setUserDepositsCount(count))

          const supply: any = data
          if (!supply) return
          let indexes: any = [5, 2, 3, 1, 0, 4]
          let supplyCount = 0

          indexes.forEach((index: number) => {
            if (
              supply?.[index]?.rTokenAmountParsed !== 0 ||
              supply?.[index]?.rTokenFreeParsed !== 0 ||
              supply?.[index]?.rTokenLockedParsed !== 0 ||
              supply?.[index]?.rTokenStakedParsed !== 0
            ) {
              if (index == 2 || index == 3) {
                if (
                  supply?.[index]?.rTokenAmountParsed > 0.000001 ||
                  supply?.[index]?.rTokenFreeParsed > 0.000001 ||
                  supply?.[index]?.rTokenLockedParsed > 0.000001 ||
                  supply?.[index]?.rTokenStakedParsed > 0.000001
                ) {
                  supplyCount++
                }
              } else {
                supplyCount++
              }
            }
          })
          dispatch(setUsersFilteredSupply(supplyCount))
        }
      }
      if (userDepositsCount < transactionRefresh) {
        fetchUserDeposits()
      }
    } catch (err) {}
  }, [address, transactionRefresh])

  useEffect(() => {
    try {
      const fetchPools = async () => {
        const promises = [
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? poolsPairs[0]?.address
              : poolsPairsMainnet[0]?.address,
            constants?.JEDI_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? poolsPairs[1]?.address
              : poolsPairsMainnet[1]?.address,
            constants?.JEDI_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? poolsPairs[2]?.address
              : poolsPairsMainnet[2]?.address,
            constants?.JEDI_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? poolsPairs[3]?.address
              : poolsPairsMainnet[3]?.address,
            constants?.JEDI_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? poolsPairs[4]?.address
              : poolsPairsMainnet[4]?.address,
            constants?.JEDI_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? poolsPairs[5]?.address
              : poolsPairsMainnet[5]?.address,
            constants?.JEDI_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? poolsPairs[6]?.address
              : poolsPairsMainnet[6]?.address,
            constants?.JEDI_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? poolsPairs[7]?.address
              : poolsPairsMainnet[7]?.address,
            constants?.JEDI_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? poolsPairs[8]?.address
              : poolsPairsMainnet[8]?.address,
            constants?.JEDI_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? poolsPairs[9]?.address
              : poolsPairsMainnet[9]?.address,
            constants?.JEDI_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? poolsPairs[10]?.address
              : poolsPairsMainnet[10]?.address,
            constants?.JEDI_SWAP
          ),
        ]
        const Poolsdata: any = []
        let data: any
        Promise.allSettled([...promises]).then((val) => {
          val.map((response, idx) => {
            const res = response?.status != 'rejected' ? response?.value : '0'
            if (res == 1) {
              data =
                process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                  ? poolsPairs[idx]
                  : poolsPairsMainnet[idx]
            } else {
              data = {
                address:
                  process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                    ? poolsPairs[idx]?.address
                    : poolsPairsMainnet[idx],
                keyvalue: 'null',
              }
            }
            Poolsdata.push(data)
          })
          //console.log(Poolsdata, "val")
          dispatch(setJediSwapPoolsSupported(Poolsdata))
          const count = getTransactionCount()
          dispatch(setJediSwapPoolsSupportedCount(count))
        })
        try {
          const res2 = await axios.get(
            'https://kx58j6x5me.execute-api.us-east-1.amazonaws.com/starknet/fetchFile?file=prod-api/lending/lending_strk_grant.json'
          )
          if (res2?.data && res2.data.Hashstack) {
            const hashstackWithoutDAI = { ...res2.data.Hashstack };
            delete hashstackWithoutDAI.DAI;
            dispatch(setStrkAprData(hashstackWithoutDAI));
          }
          const res=await axios.get(`https://metricsapimainnet.hashstack.finance/api/amm-aprs`);
          if (res?.data) {
            dispatch(setJediSwapPoolAprs(res?.data))
          }
        } catch (err) {
          console.log(err, 'err in pool aprs')
        }

        // if (data === 0) {
        //   // Create a copy of the poolsPairs array
        //   const updatedPoolsPairs = [...poolsPairs];

        //   // Find the poolToUpdate in the copy
        //   const poolToUpdate = updatedPoolsPairs.find((pool) => pool.address === poolAddress);

        //   if (poolToUpdate) {
        //     // Update the keyvalue property
        //     poolToUpdate.keyvalue = "null";

        //     // Update the state with the updated array
        //     setPoolPairs(updatedPoolsPairs);
        //   }
        // }
        ////console.log(data, "data");
      }
      if (jediSwapPoolsSupportedCount < transactionRefresh) {
        fetchPools()
      }
    } catch (err) {
      //console.log(err);
    }
    // fetchPools("0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e")
    // fetchPools("0x129c74ca4274e3dbf7ab83f5916bebf087ce7af7495b3c648f1d2f2ab302330")
    // poolsPairs.forEach((pool:any) => {
    //   fetchPools(pool.address);
    // });
  }, [transactionRefresh])
  useEffect(() => {
    try {
      const fetchMySwapPools = async () => {
        //console.log(process.env.NEXT_PUBLIC_NODE_ENV == "testnet" ? mySwapPoolPairs[4]?.address : mySwapPoolPairsMainnet[4]?.address, "address passed")
        const promises = [
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? mySwapPoolPairs[0]?.address
              : mySwapPoolPairsMainnet[0]?.address,
            constants?.MY_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? mySwapPoolPairs[1]?.address
              : mySwapPoolPairsMainnet[1]?.address,
            constants?.MY_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? mySwapPoolPairs[2]?.address
              : mySwapPoolPairsMainnet[2]?.address,
            constants?.MY_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? mySwapPoolPairs[3]?.address
              : mySwapPoolPairsMainnet[3]?.address,
            constants?.MY_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? mySwapPoolPairs[4]?.address
              : mySwapPoolPairsMainnet[4]?.address,
            constants?.MY_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? mySwapPoolPairs[5]?.address
              : mySwapPoolPairsMainnet[5]?.address,
            constants?.MY_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? mySwapPoolPairs[6]?.address
              : mySwapPoolPairsMainnet[6]?.address,
            constants?.MY_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? mySwapPoolPairs[7]?.address
              : mySwapPoolPairsMainnet[7]?.address,
            constants?.MY_SWAP
          ),
          getSupportedPools(
            process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? mySwapPoolPairs[8]?.address
              : mySwapPoolPairsMainnet[8]?.address,
            constants?.MY_SWAP
          ),
        ]
        const Poolsdata: any = []
        let data: any
        Promise.allSettled([...promises]).then((val) => {
          val.map((response, idx) => {
            const res = response?.status != 'rejected' ? response?.value : '0'

            if (res == 1) {
              data =
                process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                  ? mySwapPoolPairs[idx]
                  : mySwapPoolPairsMainnet[idx]
            } else {
              data = {
                address:
                  process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                    ? mySwapPoolPairs[idx]?.address
                    : mySwapPoolPairsMainnet[idx]?.address,
                keyvalue: 'null',
              }
            }
            Poolsdata.push(data)
          })
          //console.log(Poolsdata, "myswap val")
          dispatch(setMySwapPoolsSupported(Poolsdata))
          const count = getTransactionCount()
          dispatch(setMySwapPoolsSupportedCount(count))
        })
      }
      if (mySwapPoolsSupportedCount < transactionRefresh) {
        fetchMySwapPools()
      }
    } catch (err) {
      //console.log(err);
    }
  }, [transactionRefresh])
  useEffect(() => {
    try {
      const getStakingShares = async () => {
        if (!address) return
        const promises = [
          getUserStakingShares(address, 'rBTC'),
          getUserStakingShares(address, 'rETH'),
          getUserStakingShares(address, 'rUSDT'),
          getUserStakingShares(address, 'rUSDC'),
          getUserStakingShares(address, 'rDAI'),
          getUserStakingShares(address, 'rSTRK'),
        ]
        Promise.allSettled([...promises]).then((val) => {
          const data = {
            rBTC: val?.[0]?.status == 'fulfilled' ? val?.[0]?.value : null,
            rETH: val?.[1]?.status == 'fulfilled' ? val?.[1]?.value : null,
            rUSDT: val?.[2]?.status == 'fulfilled' ? val?.[2]?.value : null,
            rUSDC: val?.[3]?.status == 'fulfilled' ? val?.[3]?.value : null,
            rDAI: val?.[4]?.status == 'fulfilled' ? val?.[4]?.value : null,
            rSTRK: val?.[5]?.status == 'fulfilled' ? val?.[5]?.value : null,
          }
          if (data?.rBTC == null) return
          dispatch(setStakingShares(data))
          const count = getTransactionCount()
          dispatch(setStakingSharesCount(count))
        })
      }
      if (stakingSharesCount < transactionRefresh) {
        getStakingShares()
      }
    } catch (err) {
      //console.log("getStakingShares error ", err);
    }
  }, [address, transactionRefresh])

  useEffect(() => {
    const getSplit = async () => {
      let temp: any = []
      const promises = []

      for (let i = 0; i < userLoans?.length; i++) {
        if (userLoans[i]?.spendType === 'LIQUIDITY') {
          if (userLoans[i]?.l3App == 'JEDI_SWAP') {
            const data = getJediEstimatedLiqALiqBfromLp(
              userLoans[i]?.currentLoanAmount,
              userLoans[i]?.loanId,
              userLoans[i]?.currentLoanMarketAddress,
              userLoans[i]?.loanMarket
            )
            promises.push(data)
          } else if (userLoans[i]?.l3App == 'MY_SWAP') {
            const data = getMySwapEstimatedLiqALiqBfromLp(
              userLoans[i]?.currentLoanAmount,
              userLoans[i]?.loanId,
              userLoans[i]?.currentLoanMarketAddress,
              userLoans[i]?.loanMarket
            )
            promises.push(data)
          }else if(userLoans[i]?.l3App == 'ZKLEND') {
            
          }
        } else {
          promises.push(Promise.resolve(null))
        }
      }

      Promise.allSettled([...promises]).then((val) => {
        temp = val.map((data, i) => {
          if (data && data?.status == 'fulfilled' && data?.value) {
            return {
              ...data?.value,
              tokenA: getTokenFromAddress(
                processAddress(data?.value?.tokenAAddress)
              )?.name,
              tokenB: getTokenFromAddress(
                processAddress(data?.value?.tokenBAddress)
              )?.name,
              loanId: userLoans[i]?.loanId,
            }
          } else {
            return 'empty'
          }
        })
        dispatch(setMySplit(temp))
      })
    }

    if (userLoans) getSplit()
  }, [userLoans, transactionRefresh])

  useEffect(() => {
    try {
      const getMinDeposit = async () => {
        const promises = [
          getMinimumDepositAmount('rBTC'),
          getMinimumDepositAmount('rETH'),
          getMinimumDepositAmount('rUSDT'),
          getMinimumDepositAmount('rUSDC'),
          getMinimumDepositAmount('rDAI'),
          getMinimumDepositAmount('rSTRK'),
          getMaximumDepositAmount('rBTC'),
          getMaximumDepositAmount('rETH'),
          getMaximumDepositAmount('rUSDT'),
          getMaximumDepositAmount('rUSDC'),
          getMaximumDepositAmount('rDAI'),
          getMaximumDepositAmount('rSTRK'),
        ]
        Promise.allSettled([...promises]).then((val) => {
          const data = {
            rBTC: val?.[0]?.status == 'fulfilled' ? val?.[0]?.value : 0.00037,
            rETH: val?.[1]?.status == 'fulfilled' ? val?.[1]?.value : 0.006,
            rUSDT: val?.[2]?.status == 'fulfilled' ? val?.[2]?.value : 10,
            rUSDC: val?.[3]?.status == 'fulfilled' ? val?.[3]?.value : 10,
            rDAI: val?.[4]?.status == 'fulfilled' ? val?.[4]?.value : 10,
            rSTRK: val?.[5]?.status == 'fulfilled' ? val?.[5]?.value : 10,
          }
          const maxdata = {
            rBTC: val?.[6]?.status == 'fulfilled' ? val?.[6]?.value : 0.00074,
            rETH: val?.[7]?.status == 'fulfilled' ? val?.[7]?.value : 0.012,
            rUSDT: val?.[8]?.status == 'fulfilled' ? val?.[8]?.value : 20,
            rUSDC: val?.[9]?.status == 'fulfilled' ? val?.[9]?.value : 20,
            rDAI: val?.[10]?.status == 'fulfilled' ? val?.[10]?.value : 20,
            rSTRK: val?.[11]?.status == 'fulfilled' ? val?.[11]?.value : 20,
          }

          if (data?.rBTC == null) return
          if (maxdata?.rBTC == null) return
          dispatch(setMinimumDepositAmounts(data))
          dispatch(setMaximumDepositAmounts(maxdata))
          const count = getTransactionCount()
          dispatch(setMinMaxDepositCount(count))
        })
      }
      if (minMaxCount < transactionRefresh) {
        getMinDeposit()
      }
    } catch (err) {
      //console.log(err, "err in get min max deposits");
    }
  }, [transactionRefresh])
  useEffect(() => {
    try {
      const getMinDeposit = async () => {
        const promises = [
          getMinimumLoanAmount('dBTC'),
          getMinimumLoanAmount('dETH'),
          getMinimumLoanAmount('dUSDT'),
          getMinimumLoanAmount('dUSDC'),
          getMinimumLoanAmount('dDAI'),
          getMinimumLoanAmount('dSTRK'),
          getMaximumLoanAmount('dBTC'),
          getMaximumLoanAmount('dETH'),
          getMaximumLoanAmount('dUSDT'),
          getMaximumLoanAmount('dUSDC'),
          getMaximumLoanAmount('dDAI'),
          getMaximumLoanAmount('dSTRK'),
        ]
        Promise.allSettled([...promises]).then((val) => {
          const data = {
            dBTC: val?.[0]?.status == 'fulfilled' ? val?.[0]?.value : 0.001,
            dETH: val?.[1]?.status == 'fulfilled' ? val?.[1]?.value : 0.018,
            dUSDT: val?.[2]?.status == 'fulfilled' ? val?.[2]?.value : 30,
            dUSDC: val?.[3]?.status == 'fulfilled' ? val?.[3]?.value : 30,
            dDAI: val?.[4]?.status == 'fulfilled' ? val?.[4]?.value : 30,
            dSTRK: val?.[5]?.status == 'fulfilled' ? val?.[5]?.value : 30,
          }
          const maxdata = {
            dBTC: val?.[6]?.status == 'fulfilled' ? val?.[6]?.value : 0.00148,
            dETH: val?.[7]?.status == 'fulfilled' ? val?.[7]?.value : 0.024,
            dUSDT: val?.[8]?.status == 'fulfilled' ? val?.[8]?.value : 40,
            dUSDC: val?.[9]?.status == 'fulfilled' ? val?.[9]?.value : 40,
            dDAI: val?.[10]?.status == 'fulfilled' ? val?.[10]?.value : 40,
            dSTRK: val?.[11]?.status == 'fulfilled' ? val?.[11]?.value : 40,
          }
          if (data?.dBTC == null) return
          if (maxdata?.dBTC == null) return
          dispatch(setMinimumLoanAmounts(data))
          dispatch(setMaximumLoanAmounts(maxdata))
          const count = getTransactionCount()
          dispatch(setMinMaxLoanCount(count))
        })
      }
      if (minMaxLoanCount < transactionRefresh) {
        getMinDeposit()
      }
    } catch (err) {
      //console.log(err, "err in get min max deposits");
    }
  }, [transactionRefresh])
  useEffect(() => {
    try {
      const fetchEffectiveApr = async () => {
        const promises = userLoans?.map((val: any) => {
          return effectivAPRLoan(val, protocolStats, dataOraclePrices)
        })
        Promise.all([...promises]).then((val: any) => {
          const avgs = val.map((avg: any, idx: number) => {
            return { avg: avg, loanId: userLoans[idx]?.loanId }
          })
          dispatch(setEffectiveAPR(avgs))
          const count = getTransactionCount()
          dispatch(setAprCount(count))
        })

        ////console.log("promises",promises)
      }
      if (
        dataOraclePrices &&
        userLoans &&
        protocolStats &&
        userLoansCount == transactionRefresh &&
        protocolStatsCount == transactionRefresh &&
        effectiveAprCount < transactionRefresh
      ) {
        fetchEffectiveApr()
      }
    } catch (err) {
      //console.log("fetchEffectiveApr ", err);
    }
  }, [userLoans, protocolStats, oraclePrices, transactionRefresh])

  useEffect(() => {
    try {
      const fetchHealthFactor = async () => {
        const promises = userLoans?.map((val: any) => {
          return getExistingLoanHealth(val?.loanId)
        })
        Promise.all([...promises]).then((val: any) => {
          const avgs = val.map((loneHealth: any, idx: number) => {
            return { loanHealth: loneHealth, loanId: userLoans[idx]?.loanId }
          })
          dispatch(setHealthFactor(avgs))
          const count = getTransactionCount()
          dispatch(setHealthFactorCount(count))
        })
      }
      if (
        userLoans &&
        userLoansCount == transactionRefresh &&
        healthFactorCount < transactionRefresh
      ) {
        fetchHealthFactor()
      }
    } catch (err) {
      //console.log("fetchHealthFactor ", err);
    }
  }, [userLoansCount, transactionRefresh])

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
  //           ////console.log(data,"data in aprs")
  //           // avgs.push(data)
  //           avgsData?.push(data);
  //           // avgs.push()
  //         }
  //         //cc
  //         ////console.log(avgsData,"avgs in Data")
  //         setAvgs(avgsData);
  //         dispatch(setAprAndHealthFactor(avgsData));
  //         dispatch(setAprsAndHealthCount(""));
  //       }
  //     } catch (err) {
  //      //console.log(err, "err in aprs and health factor");
  //     }
  //   };
  //   if (aprsAndHealthCount < transactionRefresh) {
  //     fetchAprsAndHealth();
  //   }
  // }, [dataOraclePrices, userLoans, protocolStats, transactionRefresh]);

  useEffect(() => {
    try {
      const fetchUserLoans = async () => {
        if (!address) {
          return
        }
        const userLoans = await getUserLoans(address)
        if (!userLoans) {
          return
        }
        if (userLoans) {
          dispatch(
            setUserLoans(
              userLoans?.filter(
                (loan) => loan.loanAmountParsed && loan.loanAmountParsed > 0
              )
            )
          )
          dispatch(
            setUserUnspentLoans(
              userLoans
                ?.filter(
                  (loan) => loan.loanAmountParsed && loan.loanAmountParsed > 0
                )
                .filter((borrow: ILoan) => borrow.spendType === 'UNSPENT')
            )
          )
        }
        const count = getTransactionCount()
        //console.log("getTransactionCount", count);
        dispatch(setUserLoansCount(count))
      }
      if (userLoansCount < transactionRefresh) {
        fetchUserLoans()
      }
    } catch (err) {
      //console.log("user loans called - transactionRefresh error ", err);
    }
  }, [address, transactionRefresh])
  useEffect(() => {
    try {
      const fetchYourSupply = () => {
        if (
          userDepositsCount == transactionRefresh &&
          dataDeposit &&
          oraclePrices
        ) {
          const data = getTotalSupply(dataDeposit, dataOraclePrices)
          if (data != null) {
            dispatch(setYourSupply(data))
          }
        }
      }
      fetchYourSupply()
    } catch (err) {
      //console.log(err, "error in your supply count");
    }
  }, [userDepositsCount, dataOraclePrices])

  useEffect(() => {
    try {
      const fetchUserSupply = async () => {
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
          // const dataNetApr = await getNetApr(
          //   dataDeposit,
          //   userLoans,
          //   dataOraclePrices,
          //   protocolStats
          // );
          ////console.log("netApr", dataNetApr);
          // //@ts-ignore
          // if (isNaN(dataNetApr)) {
          //   dispatch(setNetAPR(0));
          // } else {
          //   dispatch(setNetAPR(dataNetApr));
          // }

          const data = getTotalSupply(dataDeposit, dataOraclePrices)
          // if (data != null) {
          //   dispatch(setYourSupply(data));
          // }
          const dataBorrow = await getTotalBorrow(
            userLoans,
            dataOraclePrices,
            protocolStats
          )
          const dataTotalBorrow = dataBorrow?.totalBorrow
          //console.log(dataBorrow, "data data borrow");
          dispatch(setYourBorrow(dataTotalBorrow))
          //console.log(dataDeposit, "data deposit pagecard");
          const dataNetWorth = await getNetworth(
            data,
            dataTotalBorrow,
            dataBorrow?.totalCurrentAmount
          )
          dispatch(setNetWorth(dataNetWorth))
          const count = getTransactionCount()
          dispatch(setUserInfoCount(count))
        }
      }

      ////console.log(userInfoCount, transactionRefresh, "userInfoCount is here");
      if (userInfoCount < transactionRefresh) {
        fetchUserSupply()
      }
    } catch (err) {
      //console.log(err, "error in user info");
    }
  }, [
    userDepositsCount,
    protocolStatsCount,
    dataOraclePrices,
    userLoansCount,
    transactionRefresh,
  ])
  // useEffect(() => {
  //   const fetchMinimumDepositAmount = async () => {
  //     const data = await getMinimumDepositAmount(
  //       tokenAddressMap["rBTC"],
  //       "BTC"
  //     );
  //    //console.log("fetchMinimumDepositAmount ", data);
  //   };
  //   fetchMinimumDepositAmount();
  // }, []);

  useEffect(() => {
    try {
      const fetchNetApr = async () => {
        ////console.log(getUserDeposits(address),"deposits in pagecard")
        // const res = await axios.get(
        //   "https://kx58j6x5me.execute-api.us-east-1.amazonaws.com//starknet/fetchFile?file=qa_strk_grant.json"
        // );
        // const dataMarket=await getProtocolStats();
        // const dataOraclePrices=await getOraclePrices();
        ////console.log(dataMarket,"data market page")
        ////console.log("user info called - transactionRefresh");
        ////console.log(dataDeposit, "dataDeposit is here");
        ////console.log(dataOraclePrices, "dataOraclePrices is here");
        ////console.log(userLoans, "userLoans is here");
        ////console.log(protocolStats, "protocolStats is here");
        ////console.log(aprsAndHealth, "aprs and health is here");
        if (
          dataDeposit &&
          userLoans &&
          protocolStats &&
          userDepositsCount == transactionRefresh &&
          protocolStatsCount == transactionRefresh &&
          userLoansCount == transactionRefresh &&
          dataOraclePrices &&
          netAprCount < transactionRefresh &&
          effectiveApr &&
          strkData &&
          poolAprs.length>0 &&
          zkLendSpends&&
          // allSplit &&
          netSpendBalance
        ) {
          //console.log("user info called inside - transactionRefresh");
          const dataNetAprDeposit = await getNetAprDeposits(
            dataDeposit,
            dataOraclePrices,
            protocolStats,
            strkData
          )

          const dataNetAprLoans = await getNetAprLoans(
            userLoans,
            dataOraclePrices,
            protocolStats,
            effectiveApr,
            strkData,
            poolAprs,
            allSplit,
            jedistrkTokenAllocation,
            netSpendBalance,
            zkLendSpends,
            // res?.data?.Jediswap_v1,
          )

          //@ts-ignore
          if (isNaN(dataNetAprLoans?.netApr)) {
            ////console.log("netApr", dataNetApr);
            dispatch(setNetAprLoans(0))
            dispatch(setBorrowEffectiveAprs(dataNetAprLoans?.effectiveAprs))
            if (dataNetAprLoans?.effectiveAprs) {
              const dataNetApr = await getNetApr(
                dataDeposit,
                userLoans,
                dataOraclePrices,
                protocolStats,
                strkData,
                dataNetAprLoans?.effectiveAprs
              )
              //@ts-ignore
              if (isNaN(dataNetApr)) {
                ////console.log("netApr", dataNetApr);
                dispatch(setNetAPR(0))
              } else {
                dispatch(setNetAPR(dataNetApr))
              }
            }
          } else {
            dispatch(setBorrowEffectiveAprs(dataNetAprLoans?.effectiveAprs))
            dispatch(setNetAprLoans(dataNetAprLoans?.netApr))
            if (dataNetAprLoans?.effectiveAprs) {
              const dataNetApr = await getNetApr(
                dataDeposit,
                userLoans,
                dataOraclePrices,
                protocolStats,
                strkData,
                dataNetAprLoans?.effectiveAprs
              )
              //@ts-ignore
              if (isNaN(dataNetApr)) {
                ////console.log("netApr", dataNetApr);
                dispatch(setNetAPR(0))
              } else {
                dispatch(setNetAPR(dataNetApr))
              }
            }
          }
          //@ts-ignore
          if (isNaN(dataNetAprDeposit)) {
            ////console.log("netApr", dataNetApr);
            dispatch(setNetAprDeposits(0))
          } else {
            dispatch(setNetAprDeposits(dataNetAprDeposit))
          }

          const count = getTransactionCount()
          dispatch(setNetAprCount(count))
        }
      }

      ////console.log(userInfoCount, transactionRefresh, "userInfoCount is here");
      if (netAprCount < transactionRefresh) {
        fetchNetApr()
      }
    } catch (err) {
      //console.log(err, "error in user info");
    }
  }, [
    userDepositsCount,
    userLoansCount,
    dataOraclePrices,
    protocolStatsCount,
    transactionRefresh,
    poolAprs,
    effectiveApr,
    strkData,
    allSplit,
    jedistrkTokenAllocation,
    netSpendBalance,
    jedistrkTokenAllocation,
    borrowEffectiveAprs,
    zkLendSpends
  ])

  useEffect(() => {
    try {
      const fetchAvgSupplyAPRCount = async () => {
        if (!dataDeposit || !protocolStats) return
        const aprA =
          dataDeposit?.[0]?.rTokenAmountParsed !== 0 ||
          dataDeposit?.[0]?.rTokenFreeParsed !== 0 ||
          dataDeposit?.[0]?.rTokenLockedParsed !== 0 ||
          dataDeposit?.[0]?.rTokenStakedParsed !== 0
            ? protocolStats?.[0]?.supplyRate
            : 0
        const aprB =
          dataDeposit?.[1]?.rTokenAmountParsed !== 0 ||
          dataDeposit?.[1]?.rTokenFreeParsed !== 0 ||
          dataDeposit?.[1]?.rTokenLockedParsed !== 0 ||
          dataDeposit?.[1]?.rTokenStakedParsed !== 0
            ? protocolStats?.[1]?.supplyRate
            : 0
        const aprC =
          dataDeposit?.[2]?.rTokenAmountParsed !== 0 ||
          dataDeposit?.[2]?.rTokenFreeParsed !== 0 ||
          dataDeposit?.[2]?.rTokenLockedParsed !== 0 ||
          dataDeposit?.[2]?.rTokenStakedParsed !== 0
            ? protocolStats?.[2]?.supplyRate
            : 0
        const aprD =
          dataDeposit?.[3]?.rTokenAmountParsed !== 0 ||
          dataDeposit?.[3]?.rTokenFreeParsed !== 0 ||
          dataDeposit?.[3]?.rTokenLockedParsed !== 0 ||
          dataDeposit?.[3]?.rTokenStakedParsed !== 0
            ? protocolStats?.[3]?.supplyRate
            : 0
        const aprE =
          dataDeposit?.[4]?.rTokenAmountParsed !== 0 ||
          dataDeposit?.[4]?.rTokenFreeParsed !== 0 ||
          dataDeposit?.[4]?.rTokenLockedParsed !== 0 ||
          dataDeposit?.[4]?.rTokenStakedParsed !== 0
            ? protocolStats?.[4]?.supplyRate
            : 0
        const aprF =
          dataDeposit?.[5]?.rTokenAmountParsed !== 0 ||
          dataDeposit?.[5]?.rTokenFreeParsed !== 0 ||
          dataDeposit?.[5]?.rTokenLockedParsed !== 0 ||
          dataDeposit?.[5]?.rTokenStakedParsed !== 0
            ? protocolStats?.[5]?.supplyRate
            : 0
        const avgSupplyApr =
          (aprA + aprB + aprC + aprD + aprE + aprF) /
          ((aprA ? 1 : 0) +
          (aprB ? 1 : 0) +
          (aprC ? 1 : 0) +
          (aprD ? 1 : 0) +
          (aprE ? 1 : 0) +
          (aprF ? 1 : 0)
            ? (aprA ? 1 : 0) +
              (aprB ? 1 : 0) +
              (aprC ? 1 : 0) +
              (aprD ? 1 : 0) +
              (aprE ? 1 : 0) +
              (aprF ? 1 : 0)
            : 1)
        // const avgSupplyApr = await effectiveAprDeposit(
        //   dataDeposit[0],
        //   protocolStats
        // );
        ////console.log(
        //   avgSupplyApr,
        //   "data avg supply apr useEffect",
        //   (aprA ? 1 : 0) +
        //     (aprB ? 1 : 0) +
        //     (aprC ? 1 : 0) +
        //     (aprD ? 1 : 0) +
        //     (aprE ? 1 : 0)
        // );
        if (avgSupplyApr != null) {
          dispatch(setAvgSupplyAPR(avgSupplyApr))
          const count = getTransactionCount()
          dispatch(setAvgSupplyAprCount(count))
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
        ////console.log(avgBorrowApr, "data avg borrow apr pagecard");

        // dispatch(setAvgBorrowAPR(avgBorrowApr));
        // const count = getTransactionCount();
        // dispatch(setAvgBorrowAprCount(count));
      }

      if (
        avgSupplyAprCount < transactionRefresh &&
        protocolStatsCount == transactionRefresh &&
        userDepositsCount == transactionRefresh &&
        dataDeposit &&
        protocolStats
      ) {
        fetchAvgSupplyAPRCount()
      }
    } catch (err) {
      //console.log(err, "error in user info");
    }
  }, [protocolStatsCount, transactionRefresh, userDepositsCount])
  useEffect(() => {
    try {
      const fetchAvgBorrowAPRCount = async () => {
        if (!userLoans || !protocolStats) return
        const loans = userLoans
        const loanCheck = [0, 0, 0, 0, 0, 0]
        loans.forEach((val: any, idx: number) => {
          if (val?.underlyingMarket == 'BTC') {
            loanCheck[0] = 1
          } else if (val?.underlyingMarket == 'ETH') {
            loanCheck[1] = 1
          } else if (val?.underlyingMarket == 'USDT') {
            loanCheck[2] = 1
          } else if (val?.underlyingMarket == 'USDC') {
            loanCheck[3] = 1
          } else if (val?.underlyingMarket == 'DAI') {
            loanCheck[4] = 1
          } else if (val?.underlyingMarket == 'STRK') {
            loanCheck[5] = 1
          }
        })
        const avgBorrowApr =
          ((loanCheck[0] ? protocolStats?.[0]?.borrowRate : 0) +
            (loanCheck[1] ? protocolStats?.[1]?.borrowRate : 0) +
            (loanCheck[2] ? protocolStats?.[2]?.borrowRate : 0) +
            (loanCheck[3] ? protocolStats?.[3]?.borrowRate : 0) +
            (loanCheck[4] ? protocolStats?.[4]?.borrowRate : 0) +
            (loanCheck[5] ? protocolStats?.[5]?.borrowRate : 0)) /
          ((loanCheck[0] ? 1 : 0) +
          (loanCheck[1] ? 1 : 0) +
          (loanCheck[2] ? 1 : 0) +
          (loanCheck[3] ? 1 : 0) +
          (loanCheck[4] ? 1 : 0) +
          (loanCheck[5] ? 1 : 0)
            ? (loanCheck[0] ? 1 : 0) +
              (loanCheck[1] ? 1 : 0) +
              (loanCheck[2] ? 1 : 0) +
              (loanCheck[3] ? 1 : 0) +
              (loanCheck[4] ? 1 : 0) +
              (loanCheck[5] ? 1 : 0)
            : 1)
        // const avgBorrowApr = await effectivAPRLoan(
        //   userLoans[0],
        //   protocolStats,
        //   dataOraclePrices
        // );
        ////console.log(avgBorrowApr, "data avg borrow apr useEffect", loanCheck);
        if (avgBorrowApr != null) {
          dispatch(setAvgBorrowAPR(avgBorrowApr))
          const count = getTransactionCount()
          dispatch(setAvgBorrowAprCount(count))
        }
      }

      if (
        avgBorrowAPRCount < transactionRefresh &&
        protocolStats &&
        protocolStatsCount == transactionRefresh &&
        userLoans &&
        userLoansCount == transactionRefresh
      ) {
        fetchAvgBorrowAPRCount()
      }
    } catch (err) {
      //console.log(err, "error in user info");
    }
  }, [protocolStatsCount, transactionRefresh, userLoansCount])

  useEffect(() => {
    try {
      const fetchSupplyData = async () => {
        const data = dataDeposit?.map((deposit: IDeposit, idx: number) => {
          const price = oraclePrices?.find(
            (oraclePrice: any) => oraclePrice?.name == deposit?.token
          )?.price
          const token_amount = deposit?.underlyingAssetAmountParsed
          // const token_amount =
          //   deposit?.rTokenAmountParsed + deposit?.rTokenStakedParsed;
          if (price && token_amount) {
            return price * token_amount
          }
          return 0
        })
        if (data && data?.length > 0) {
          dispatch(setYourMetricsSupply(data))
          const count = getTransactionCount()
          dispatch(setYourMetricsSupplyCount(count))
        }
        //console.log("supplyData", data);
      }
      if (
        dataDeposit &&
        userDepositsCount == transactionRefresh &&
        dataDeposit?.length > 0 &&
        oraclePrices &&
        oraclePrices?.length > 0 &&
        yourMetricsSupplyCount < transactionRefresh
      ) {
        fetchSupplyData()
      }
    } catch (err) {
      //console.log("your metrics supply err ", err);
    }
  }, [userDepositsCount, oraclePrices, transactionRefresh])

  useEffect(() => {
    try {
      const fetchBorrowData = async () => {
        const borrow = { BTC: 0, ETH: 0, USDT: 0, USDC: 0, DAI: 0, STRK: 0 }
        for (let loan of userLoans) {
          if (
            loan?.loanState === 'REPAID' ||
            loan?.loanState === 'LIQUIDATED' ||
            loan?.loanState === null
          )
            continue

          const oraclePrice = oraclePrices.find(
            (oraclePrice: any) =>
              oraclePrice.address === loan?.underlyingMarketAddress
          )
          let exchangeRate = protocolStats.find(
            (marketInfo: any) =>
              marketInfo.tokenAddress === loan?.underlyingMarketAddress
          )?.exchangeRateDTokenToUnderlying
          if (oraclePrice && exchangeRate) {
            let loanAmoungUnderlying = loan?.loanAmountParsed * exchangeRate
            if (loan?.underlyingMarket == 'BTC') {
              borrow.BTC += loanAmoungUnderlying * oraclePrice.price
            } else if (loan?.underlyingMarket == 'USDT') {
              borrow.USDT += loanAmoungUnderlying * oraclePrice.price
            } else if (loan?.underlyingMarket == 'USDC') {
              borrow.USDC += loanAmoungUnderlying * oraclePrice.price
            } else if (loan?.underlyingMarket == 'ETH') {
              borrow.ETH += loanAmoungUnderlying * oraclePrice.price
            } else if (loan?.underlyingMarket == 'DAI') {
              borrow.DAI += loanAmoungUnderlying * oraclePrice.price
            } else if (loan?.underlyingMarket == 'STRK') {
              borrow.STRK += loanAmoungUnderlying * oraclePrice.price
            }
          }
        }
        if (borrow) {
          dispatch(setYourMetricsBorrow(borrow))
          const count = getTransactionCount()
          dispatch(setYourMetricsBorrowCount(count))
        }
        //console.log("totalBorrow ", borrow);
      }
      if (
        userLoans &&
        userLoansCount == transactionRefresh &&
        protocolStats &&
        protocolStatsCount == transactionRefresh &&
        oraclePrices &&
        yourMetricsBorrowCount < transactionRefresh
      ) {
        fetchBorrowData()
      }
    } catch (err) {
      //console.log("err fetchBorrowData ", err);
    }
  }, [userLoansCount, protocolStatsCount, oraclePrices, transactionRefresh])

  useEffect(() => {
    try {
      const fetchnetSpendBalance = () => {
        let netbalance = 0
        if (oraclePrices && spendBalances && protocolStats) {
          for (var i = 0; i < spendBalances?.length; i++) {
            if (
              spendBalances[i].token == 'BTC' ||
              spendBalances[i].token == 'DAI'
            ) {
              let value = 0
              netbalance += value
            } else {
              let value =
                (protocolStats[i]?.totalBorrow - spendBalances[i]?.balance) *
                oraclePrices[i].price
              netbalance += value
            }
          }
          if (netbalance > 0) {
            dispatch(setNetSpendBalance(netbalance))
          }
        }
      }
      fetchnetSpendBalance()
    } catch (err) {
      console.log(err, 'err in net spend balance')
    }
  }, [transactionRefresh, spendBalances, protocolStats, oraclePrices])

  useEffect(() => {
    try {
      const fetchData = async () => {
        const res: any = await axios.get(
          'https://kx58j6x5me.execute-api.us-east-1.amazonaws.com/starknet/fetchFile?file=strk_grant.json'
        )
        if (res?.data) {
          const count = getTransactionCount()
          dispatch(setJedistrkTokenAllocation(res?.data?.Jediswap_v1))
          dispatch(setJedistrkTokenAllocationCount(count))
        }
      }
      if (jedistrkTokenAllocationCount < transactionRefresh) {
        fetchData()
      }
    } catch (err) {
      console.log(err, 'err inf fetching jedi strk')
    }
  }, [transactionRefresh])

  useEffect(() => {
    const fetch = async () => {
        let arr:any = [];
        await Promise.all(userLoans.map(async (Borrow:any, idx:number) => {
            if (Borrow?.l3App === "ZKLEND") {
                const usdspend = await getZklendusdSpendValue(Borrow?.loanId, Borrow?.loanMarket);
                const val = {
                    BorrowId: Borrow?.loanId,
                    SpendValue: usdspend
                };
                arr.push(val);
            }
        }));
        dispatch(setZklendSpends(arr));
    };
    if (userLoans) {
        fetch();
    }
}, [userLoans]);

}

export default useDataLoader

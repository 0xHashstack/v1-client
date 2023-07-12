import { ILoan } from "@/Blockchain/interfaces/interfaces";
import { getUserDeposits } from "@/Blockchain/scripts/Deposits";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import { getOraclePrices } from "@/Blockchain/scripts/getOraclePrices";
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
  selectAprCount,
  selectAprsAndHealthCount,
  selectHealthFactorCount,
  selectHourlyDataCount,
  selectOraclePricesCount,
  selectProtocolStatsCount,
  selectUserDepositsCount,
  selectUserInfoCount,
  selectUserLoansCount,
  selectprotocolReservesCount,
  setAprCount,
  setAprsAndHealthCount,
  setAvgBorrowAPR,
  setAvgSupplyAPR,
  setHealthFactorCount,
  setHourlyDataCount,
  setOraclePricesCount,
  setProtocolReservesCount,
  setProtocolStatsCount,
  setUserDepositsCount,
  setUserInfoCount,
  setUserLoansCount,
  setUserUnspentLoans,
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

  const dispatch = useDispatch();
  const Data: any = [];
  const [avgs, setAvgs] = useState<any>([]);
  const [btcData, setBtcData] = useState<any>();
  const avgsData: any = [];
  console.log("address", address);
  // useEffect(() => {
  //   console.log("switched to market");
  // }, []);
  const getTransactionCount = () => {
    return transactionRefresh;
  };
  useEffect(() => {
    const fetchHourlyBTCData = async () => {
      try {
        // console.log("HIII")
        // if(hourlyBTCData!=null){
        //   return;
        // }

        const response = await axios.get(
          `${metrics_api}/api/metrics/tvl/daily/DAI`
        );
        console.log(response, "response data");
        if (!response) {
          return;
        }
        // const response2=axios.get('http://127.0.0.1:3010/api/metrics/tvl/hourly/DAI')
        if (response?.data) {
          const amounts: any = [];
          const borrowAmounts: any = [];
          const dates: any = [];
          const supplyRates: any = [];
          const borrowRates: any = [];
          const tvlAmounts: any = [];
          const supplyCounts: any = [];
          const borrowCounts: any = [];
          for (var i = 0; i < response?.data?.length; i++) {
            amounts?.push(response?.data[i].supplyAmount);
            borrowAmounts?.push(response?.data[i].borrowAmount);
            tvlAmounts?.push(response?.data[i].tvlAmount);
            // const dateObj = new Date(response?.data[i].Datetime)
            dates?.push(response?.data[i].Datetime);
            supplyRates?.push(response?.data[i].supplyRate);
            borrowRates?.push(response?.data[i].borrowRate);
            supplyCounts?.push(response?.data[i].supplyCount);
            borrowCounts?.push(response?.data[i].borrowCount);
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
          };
          // console.log(btcData,"Data gone")
          dispatch(setHourlyBTCData(data));
          const count = getTransactionCount();
          dispatch(setHourlyDataCount(count));
          console.log(response?.data, "Data response");
          console.log(btcData, "data in BTC");
        }
      } catch (err) {
        console.log(err, "err in hourly data");
      }
    };
    if (hourlyDataCount < transactionRefresh) {
      fetchHourlyBTCData();
    }
  }, [address, transactionRefresh]);
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
        if (!dataStats || dataStats?.length < 5) {
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
        userLoans?.length > 0 &&
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
        userLoans?.length > 0 &&
        userLoansCount == transactionRefresh &&
        healthFactorCount < transactionRefresh
      ) {
        fetchHealthFactor();
      }
    } catch (err) {
      console.log("fetchHealthFactor ", err);
    }
  }, [userLoans, transactionRefresh]);

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
          userDepositsCount == transactionRefresh &&
          protocolStatsCount == transactionRefresh &&
          userLoansCount == transactionRefresh &&
          dataOraclePrices &&
          userInfoCount < transactionRefresh
        ) {
          console.log("user info called inside - transactionRefresh");
          const dataNetApr = await getNetApr(
            dataDeposit,
            userLoans,
            dataOraclePrices,
            protocolStats
          );
          console.log("netApr", dataNetApr);
          //@ts-ignore
          if (isNaN(dataNetApr)) {
            dispatch(setNetAPR(0));
          } else {
            dispatch(setNetAPR(dataNetApr));
          }
          const avgSupplyApr = await effectiveAprDeposit(
            dataDeposit[0],
            protocolStats
          );
          console.log(avgSupplyApr, "data avg supply apr pagecard");
          const avgBorrowApr = await effectivAPRLoan(
            userLoans[0],
            protocolStats,
            dataOraclePrices
          );
          console.log(avgBorrowApr, "data avg borrow apr pagecard");

          dispatch(setAvgBorrowAPR(avgBorrowApr));
          dispatch(setAvgSupplyAPR(avgSupplyApr));

          const dataBorrow = await getTotalBorrow(
            userLoans,
            dataOraclePrices,
            protocolStats
          );
          const dataTotalBorrow = dataBorrow?.totalBorrow;
          console.log(dataBorrow, "data data borrow");
          dispatch(setYourBorrow(dataTotalBorrow));
          console.log(dataDeposit, "data deposit pagecard");
          const data = getTotalSupply(dataDeposit, dataOraclePrices);
          if (data != null) {
            dispatch(setYourSupply(data));
          }
          console.log(data, "total supply pagecard");
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

      console.log(userInfoCount, transactionRefresh, "userInfoCount is here");
      if (userInfoCount < transactionRefresh) {
        fetchUserSupply();
      }
    } catch (err) {
      console.log(err, "error in user info");
    }
  }, [
    dataDeposit,
    protocolStats,
    dataOraclePrices,
    userLoans,
    transactionRefresh,
  ]);
  // useEffect(() => {
  //   try {
  //     const fetchUserSupply = async () => {
  //       // console.log(getUserDeposits(address),"deposits in pagecard")

  //       // const dataMarket=await getProtocolStats();
  //       // const dataOraclePrices=await getOraclePrices();
  //       // console.log(dataMarket,"data market page")
  //       console.log("user info called - transactionRefresh");
  //       console.log(dataDeposit, "dataDeposit is here");
  //       console.log(dataOraclePrices, "dataOraclePrices is here");
  //       console.log(userLoans, "userLoans is here");
  //       console.log(protocolStats, "protocolStats is here");
  //       console.log(aprsAndHealth, "aprs and health is here");
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
  //       }
  //     };

  //     console.log(userInfoCount, transactionRefresh, "userInfoCount is here");
  //     if (userInfoCount < transactionRefresh) {
  //       fetchUserSupply();
  //     }
  //   } catch (err) {
  //     console.log(err, "error in user info");
  //   }
  // }, [
  //   dataDeposit,
  //   protocolStats,
  //   dataOraclePrices,
  //   userLoans,
  //   transactionRefresh,
  // ]);
  useEffect(() => {
    console.log(
      "transaction refresh counts - ",
      transactionRefresh,
      protocolStatsCount,
      protocolReservesCount,
      userDepositsCount,
      userLoansCount,
      oraclePricesCount,
      userInfoCount,
      // aprsAndHealthCount,
      effectiveAprCount,
      healthFactorCount,
      hourlyDataCount
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
  ]);
};

export default useDataLoader;

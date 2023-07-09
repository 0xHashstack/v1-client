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
  selectOraclePricesCount,
  selectProtocolStatsCount,
  selectUserDepositsCount,
  selectUserInfoCount,
  selectUserLoansCount,
  selectprotocolReservesCount,
  setAprsAndHealthCount,
  setAvgBorrowAPR,
  setAvgSupplyAPR,
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
  const aprsAndHealthCount = useSelector(selectAprsAndHealthCount);
  const transactionRefresh = useSelector(selectTransactionRefresh);
  const oraclePrices = useSelector(selectOraclePrices);
  const effectiveApr = useSelector(selectEffectiveApr);
  const effectiveAprCount = useSelector(selectAprCount);
  const healthFactor = useSelector(selectHealthFactor);
  const healthFactorCount = useSelector(selectHealthFactorCount);

  const dispatch = useDispatch();
  const Data: any = [];
  const [avgs, setAvgs] = useState<any>([]);
  const avgsData: any = [];
  // useEffect(() => {
  //   console.log("switched to market");
  // }, []);
  useEffect(() => {
    try {
      const fetchOraclePrices = async () => {
        console.log("oracle prices - transactionRefresh called");
        let data = await getOraclePrices();
        if (data) {
          dispatch(setOraclePrices(data));
        }
        dispatch(setOraclePricesCount(""));
        console.log("oracle prices - transactionRefresh done ", data);
      };
      if (oraclePricesCount < transactionRefresh) {
        fetchOraclePrices();
      }
    } catch (err) {
      console.log("oracle prices - transactionRefresh error ", err);
    }
  }, [transactionRefresh]);

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
        dispatch(setProtocolReservesCount(""));
        console.log("protocol reserves - transactionRefresh done", reserves);
      };
      if (protocolReservesCount < transactionRefresh) {
        fetchProtocolReserves();
      }
    } catch (err) {
      console.log("error fetching protocol reserves ", err);
    }
  }, [transactionRefresh]);

  useEffect(() => {
    try {
      const fetchProtocolStats = async () => {
        console.log("protocol stats called - transactionRefresh");
        const dataStats = await getProtocolStats();
        console.log("protocol stats - transactionRefresh done", dataStats);
        if (!dataStats) {
          return;
        }
        // console.log(dataStats,"data market in pagecard")
        dispatch(setProtocolStats(dataStats));
        dispatch(setProtocolStatsCount(""));
      };
      if (protocolStatsCount < transactionRefresh) {
        fetchProtocolStats();
      }
    } catch (err) {
      console.log("protocol stats - transactionRefresh error ", err);
    }
  }, [transactionRefresh]);

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
          dispatch(setUserDepositsCount(""));
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
            return { avg: avg, loanId: val[idx]?.loanId };
          });
          dispatch(setEffectiveAPR(avgs));
        });
      };
      if (
        dataOraclePrices &&
        userLoans?.length > 0 &&
        protocolStats &&
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
            return { loanHealth: loneHealth, loanId: val[idx]?.loanId };
          });
          console.log("fetchHealthFactor - transactionRefresh done", avgs);
          dispatch(setHealthFactor(avgs));
        });
      };
      if (userLoans?.length > 0 && healthFactorCount < transactionRefresh) {
        fetchHealthFactor();
      }
    } catch (err) {
      console.log("fetchHealthFactor ", err);
    }
  }, [userLoans, transactionRefresh]);

  useEffect(() => {
    const fetchAprsAndHealth = async () => {
      try {
        if (
          dataOraclePrices &&
          userLoans?.length > 0 &&
          protocolStats &&
          aprsAndHealthCount < transactionRefresh
        ) {
          for (var i = 0; i < userLoans?.length; i++) {
            const avg = await effectivAPRLoan(
              userLoans[i],
              protocolStats,
              dataOraclePrices
            );
            const healthFactor = await getExistingLoanHealth(
              userLoans[i]?.loanId
            );

            const data = {
              loanId: userLoans[i]?.loanId,
              avg: avg,
              loanHealth: healthFactor,
            };
            // console.log(data,"data in aprs")
            // avgs.push(data)
            avgsData?.push(data);
            // avgs.push()
          }
          //cc
          // console.log(avgsData,"avgs in Data")
          setAvgs(avgsData);
          dispatch(setAprAndHealthFactor(avgsData));
          dispatch(setAprsAndHealthCount(""));
        }
      } catch (err) {
        console.log(err, "err in aprs and health factor");
      }
    };
    if (aprsAndHealthCount < transactionRefresh) {
      fetchAprsAndHealth();
    }
  }, [dataOraclePrices, userLoans, protocolStats, transactionRefresh]);

  useEffect(() => {
    try {
      const fetchUserLoans = async () => {
        console.log("user loans called - transactionRefresh");
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
        dispatch(setUserLoansCount(""));
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
        if (
          dataDeposit &&
          protocolStats &&
          userLoans &&
          userInfoCount < transactionRefresh
        ) {
          console.log("user info called inside - transactionRefresh");
          const dataNetApr = await getNetApr(
            dataDeposit,
            userLoans,
            dataOraclePrices,
            protocolStats
          );
          dispatch(setNetAPR(dataNetApr));
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

          // dispatch(setAvgBorrowAPR(avgBorrowApr));
          // dispatch(setAvgSupplyAPR(avgSupplyApr));

          const dataBorrow = await getTotalBorrow(
            userLoans,
            dataOraclePrices,
            protocolStats
          );
          const dataTotalBorrow = dataBorrow?.totalBorrow;
          dispatch(setYourBorrow(dataTotalBorrow));
          console.log(dataDeposit, "data deposit pagecard");
          const data = getTotalSupply(dataDeposit, dataOraclePrices);
          if (data) {
            dispatch(setYourSupply(data));
          }
          console.log(data, "total supply pagecard");
          const dataNetWorth = await getNetworth(
            data,
            dataTotalBorrow,
            dataBorrow?.totalCurrentAmount
          );
          dispatch(setNetWorth(dataNetWorth));
          dispatch(setUserInfoCount(""));
        }
      };

      console.log(userInfoCount, transactionRefresh, "userInfoCount is here");
      if (userInfoCount < transactionRefresh) {
        fetchUserSupply();
      }
    } catch (err) {
      console.log(err);
    }
  }, [
    dataDeposit,
    protocolStats,
    dataOraclePrices,
    userLoans,
    transactionRefresh,
  ]);
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
      aprsAndHealthCount,
      effectiveAprCount,
      healthFactorCount
    );
  }, [
    transactionRefresh,
    protocolStatsCount,
    protocolReservesCount,
    userDepositsCount,
    userLoansCount,
    oraclePricesCount,
    userInfoCount,
    aprsAndHealthCount,
    effectiveAprCount,
    healthFactorCount,
  ]);
};

export default useDataLoader;

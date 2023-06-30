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
  selectNetAPR,
  selectNetWorth,
  selectOraclePrices,
  selectProtocolReserves,
  selectProtocolStats,
  selectUserDeposits,
  selectUserLoans,
  selectYourBorrow,
  selectYourSupply,
  setAvgBorrowAPR,
  setAvgSupplyAPR,
  setNetAPR,
  setNetWorth,
  setOraclePrices,
  setProtocolReserves,
  setProtocolStats,
  setUserDeposits,
  setUserLoans,
  setYourBorrow,
  setYourSupply,
} from "@/store/slices/userAccountSlice";
import { useAccount } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useDataLoader = () => {
  const { address } = useAccount();
  const protocolReserves = useSelector(selectProtocolReserves);
  const dataDeposit = useSelector(selectUserDeposits);
  const protocolStats = useSelector(selectProtocolStats);
  const dataOraclePrices = useSelector(selectOraclePrices);
  //  const dataMarket=useSelector(selectProtocolStats);
  const yourSupply = useSelector(selectYourSupply);
  const userLoans = useSelector(selectUserLoans);
  const yourBorrow = useSelector(selectYourBorrow);
  const netWorth = useSelector(selectNetWorth);
  const netAPR = useSelector(selectNetAPR);
  const [isMounted, setIsMounted] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    console.log("switched to market");
  }, []);
  useEffect(() => {
    const fetchOraclePrices = async () => {
      try {
        const data = await getOraclePrices();
        console.log(data, "data oracle prices");
        if (data) {
          dispatch(setOraclePrices(data));
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (dataOraclePrices?.length == 0) {
      fetchOraclePrices();
    }
  }, []);

  useEffect(() => {
    try {
      const fetchProtocolStats = async () => {
        const reserves = await getProtocolReserves();
        dispatch(
          setProtocolReserves({
            totalReserves: 123,
            availableReserves: 123,
            avgAssetUtilisation: 1233,
          })
        );
        dispatch(setProtocolReserves(reserves));
        console.log("protocol reserves called ");
      };
      if (
        protocolReserves &&
        (protocolReserves.totalReserves == null ||
          protocolReserves.availableReserves == null ||
          protocolReserves.avgAssetUtilisation == null)
      ) {
        fetchProtocolStats();
      }
    } catch (err) {
      console.log("error fetching protocol reserves ", err);
    }
  }, []);

  useEffect(() => {
    const fetchProtocolStats = async () => {
      try {
        const dataStats = await getProtocolStats();
        console.log(dataStats, "data stats in pagecard");
        // console.log(dataStats,"data market in pagecard")
        if (dataStats?.length > 0) {
          dispatch(setProtocolStats(dataStats));
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (protocolStats?.length == 0) {
      fetchProtocolStats();
    }
  }, []);

  useEffect(() => {
    const fetchUserDeposits = async () => {
      if (!address) {
        return;
      }
      const data = await getUserDeposits(address);
      console.log(data, "data deposit in useEffect");
      // console.log(data,"data deposit useffect")
      // console.log(data.length,"data length")
      if (data && data?.length > 0) {
        dispatch(setUserDeposits(data));
      }
    };
    if (dataDeposit.length == 0) {
      fetchUserDeposits();
    }
  }, [address]);

  useEffect(() => {
    const fetchUserLoans = async () => {
      if (!address) {
        return;
      }
      const userLoans = await getUserLoans(address);
      if (userLoans && userLoans?.length > 0) {
        dispatch(
          setUserLoans(
            userLoans?.filter(
              (loan) => loan.loanAmountParsed && loan.loanAmountParsed > 0
            )
          )
        );
      }
    };
    if (userLoans?.length == 0) {
      fetchUserLoans();
    }
  }, [address]);

  useEffect(() => {
    try {
      const fetchUserSupply = async () => {
        // console.log(getUserDeposits(address),"deposits in pagecard")

        // const dataMarket=await getProtocolStats();
        // const dataOraclePrices=await getOraclePrices();
        // console.log(dataMarket,"data market page")
        console.log(dataDeposit, "deposit array");
        console.log(dataOraclePrices, "data oracle page");
        console.log(userLoans, "data userLoans");
        console.log(protocolStats, "data protocol stats");
        if (
          dataDeposit.length != 0 &&
          protocolStats.length != 0 &&
          userLoans.length != 0
        ) {
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
          dispatch(setAvgBorrowAPR(avgBorrowApr));
          dispatch(setAvgSupplyAPR(avgSupplyApr));

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
        }
      };
      fetchUserSupply();
    } catch (err) {
      console.log(err);
    }
  }, [dataDeposit, protocolStats, dataOraclePrices, userLoans]);
};

export default useDataLoader;

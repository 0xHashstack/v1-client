import { getUserLoans } from "@/Blockchain/scripts/Loans";
import { getProtocolStats } from "@/Blockchain/scripts/protocolStats";
import { selectTransactionRefresh } from "@/store/slices/readDataSlice";
import { useAccount } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useTransactionRefresh = () => {
  const dispatch = useDispatch();
  const [protocolStats, setProtocolStats]: any = useState([]);
  const transactionRefresh = useSelector(selectTransactionRefresh);
  const { address } = useAccount();
  // useEffect(() => {
  //   const fetchUserLoans = async () => {
  //     console.log("fetch called");
  //     if (!address) {
  //       return;
  //     }
  //     const userLoans = await getUserLoans(address);
  //     console.log("user loan is - ", userLoans);
  //   };
  //   fetchUserLoans();
  // }, [address]);
  useEffect(() => {
    if (transactionRefresh != -1) {
      console.log("transactionRefresh");
    }
  }, [transactionRefresh]);
};

export default useTransactionRefresh;

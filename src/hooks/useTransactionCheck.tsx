import { selectTransactionCheck } from "@/store/slices/userAccountSlice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const useTransactionCheck = () => {
  const transactionCheck = useSelector(selectTransactionCheck);
  let data: any = [];
  useEffect(() => {
    data = transactionCheck;
  }, [transactionCheck]);

  return transactionCheck;
};

export default useTransactionCheck;

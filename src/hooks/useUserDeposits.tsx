import { getUserDeposits } from "@/Blockchain/scripts/Deposits";
import { selectUserDeposits } from "@/store/slices/readDataSlice";
import { setUserDeposits } from "@/store/slices/readDataSlice";
import { useAccount } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useUserDeposits = () => {
  const { address } = useAccount();
  const dataDeposit = useSelector(selectUserDeposits);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserDeposits = async () => {
      if (!address) {
        return;
      }
      const data = await getUserDeposits(address);
      console.log(data, "data deposit in useEffect");
      if (data && Array.isArray(data) && data?.length > 0) {
        dispatch(setUserDeposits(data));
      }
    };
    fetchUserDeposits();
  }, [address]);
};

export default useUserDeposits;

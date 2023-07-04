import {
  selectActiveTransactions,
  setActiveTransactions,
  setTransactionStatus,
} from "@/store/slices/userAccountSlice";
import { setTransactionRefresh } from "@/store/slices/readDataSlice";
import { Text } from "@chakra-ui/react";
import { UseTransactionResult, useTransactions } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const useTransactionHandler = () => {
  let activeTransactions = useSelector(selectActiveTransactions);
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch();
  const toastHash = [""];
  useEffect(() => {
    // console.log("trans activeTransactions useEffect called");
    if (activeTransactions) {
      const data = activeTransactions.map(
        (transaction: any) => transaction.transaction_hash
      );
      setTransactions(data);
    }
  }, [activeTransactions]);

  // const results = useTransactions({
  //   hashes: [...transactions],
  //   watch: true,
  // });
  // const { hashes, addTransaction } = useTransactionManager();
  const results = useTransactions({
    hashes: [...transactions],
    watch: true,
  });
  // // const data = useTransaction()
  // console.log("trans toastHash", toastHash);
  // console.log("transaction results - ", results);
  useEffect(() => {
    // console.log("transaction active transactions ", activeTransactions);
    // console.log("transaction transactions ", transactions);
    // console.log("transaction results ", results);
    let transactionData = results?.filter(
      (transaction: UseTransactionResult, idx) => {
        transaction.refetch();
        const transaction_hash =
          //@ts-ignore
          transaction?.data?.transaction?.transaction_hash;
        //@ts-ignore
        const transaction_status = transaction?.data?.status;
        //@ts-ignore
        const transaction_error = transaction?.data?.error;
        if (
          transaction_hash == "" ||
          activeTransactions.transaction_hash == ""
        ) {
          return false;
        }
        const transaction_hxh = activeTransactions[idx]?.transaction_hash;
        if (
          transaction_status == "PENDING" ||
          transaction_status == "ACCEPTED_ON_L2"
        ) {
          if (!toastHash.includes(transaction_hxh)) {
            dispatch(setTransactionStatus("success"));
            dispatch(setTransactionRefresh(""));
            activeTransactions[idx].setCurrentTransactionStatus("success");
            toast.success(
              activeTransactions?.[idx]?.message ||
                `Your transaction is complete`,
              {
                position: toast.POSITION.BOTTOM_RIGHT,
              }
            );
            dispatch(setTransactionRefresh(""));
          }
          toastHash.push(transaction_hxh);
          toastHash.push(activeTransactions[idx]?.transaction_hash);
          toastHash.push(transaction_hash);
        } else if (transaction_status == "REJECTED") {
          console.log("treans rejected", transaction_error);
          const toastContent = (
            <div>
              Transaction failed{" "}
              <CopyToClipboard
                text={"Transaction failed : " + transaction_error}
              >
                <Text as="u">copy error!</Text>
              </CopyToClipboard>
            </div>
          );
          // setFailureToastDisplayed(true);
          if (!toastHash.includes(transaction_hxh)) {
            dispatch(setTransactionStatus("failed"));
            activeTransactions[idx].setCurrentTransactionStatus("failed");
            toast.error(toastContent, {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: false,
            });
          }
          toastHash.push(transaction_hxh);
          toastHash.push(activeTransactions?.transaction_hash);
          toastHash.push(transaction_hash);
        }
        if (
          transaction_status == "PENDING" ||
          transaction_status == "ACCEPTED_ON_L2" ||
          transaction_status == "ACCEPTED_ON_L1" ||
          transaction_status == "REJECTED"
        ) {
          if (activeTransactions[idx].transaction_hash == "") {
            return false;
          }
          toastHash.push(transaction_hxh);
          toastHash.push(activeTransactions?.transaction_hash);
          toastHash.push(transaction_hash);
          const newData = [...activeTransactions]; // Create a new array with the same values
          newData[idx] = {
            ...newData[idx],
            transaction_hash: "", // Modify the specific property with the new value
          };
          toast.dismiss(activeTransactions?.[idx]?.toastId);
          dispatch(setActiveTransactions(newData));
          return false;
        } else {
          return true;
        }
      }
    );
    // if (transactionData?.length != activeTransactions?.length) {
    //   dispatch(setActiveTransactions(transactionData));
    // }
  }, [results]);
};

export default useTransactionHandler;

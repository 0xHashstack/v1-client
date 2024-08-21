import {
  selectActiveTransactions,
  setActiveTransactions,
  setTransactionStatus,
} from "@/store/slices/userAccountSlice";
import {  selectProtocolNetworkSelected, setTransactionRefresh } from "@/store/slices/readDataSlice";
import { Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useWaitForTransaction } from "@starknet-react/core";
import useTransactions from "./useTransactions";
import useTransactionStatus from "./useTransactionStatus";

const useTransactionHandler = () => {
  let activeTransactions = useSelector(selectActiveTransactions);
  const [transactions, setTransactions] = useState([]);
  const protocolNetwork=useSelector(selectProtocolNetworkSelected)
  const dispatch = useDispatch();
  const toastHash = [""];
  // console.log(transactionsData,"redux")
  useEffect(() => {
    ////console.log("trans activeTransactions useEffect called");
    if (activeTransactions) {
      const data = activeTransactions.map(
        (transaction: any) => transaction?.transaction_hash
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
  });

  // useEffect(()=>{
  //   if(transactions.length>0){
  //     const data=useTransactionStatus(transactions[0])
  //     console.log(data,"called data")
  //   }
  // },[transactions.length])
  
  // const results:any=[]
  // // const data = useTransaction()
  ////console.log("trans toastHash", toastHash);
  ////console.log("transaction results - ", results);
  useEffect(() => {
    ////console.log("transaction active transactions ", activeTransactions);
    ////console.log("transaction transactions ", transactions);
    ////console.log("transaction results ", results);
    let data = localStorage.getItem("transactionCheck");
    data = data ? JSON.parse(data) : [];
    
    results?.forEach((transaction: any, idx) => {
      // transaction.refetch();
      const transaction_hash =
        //@ts-ignore
        protocolNetwork==='Starknet'? transaction?.data?.transaction?.transaction_hash:transaction?.data?.transaction?.transactionHash;
      //@ts-ignore
      const transaction_status =protocolNetwork==='Starknet'? transaction?.data?.finality_status:transaction?.data?.status;
      //@ts-ignore
      const transaction_error = transaction?.error;
      if (transaction_hash == "" || activeTransactions.transaction_hash == "") {
        return false;
      }
      const transaction_hxh = activeTransactions[transactions.length-1]?.transaction_hash;
      if (
        transaction_status == "ACCEPTED_ON_L2" || transaction_status==='success'
      ) {
        if (!toastHash.includes(transaction_hxh)) {
          if (data && data.includes(activeTransactions[transactions.length-1]?.uniqueID)) {
            dispatch(setTransactionStatus("success"));
            activeTransactions[transactions.length-1].setCurrentTransactionStatus("success");
          }
          dispatch(setTransactionRefresh(""));
          toast.success(
            activeTransactions?.[transactions.length-1]?.message ||
              `Your transaction is complete`,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
            }
          );
        }
        toastHash.push(transaction_hxh);
        toastHash.push(activeTransactions[transactions.length-1]?.transaction_hash);
        toastHash.push(transaction_hash);
      } else if (transaction_status == "REJECTED") {
       //console.log("treans rejected", transaction_error);
        const toastContent = (
          <div>
            Transaction failed{" "}
            <CopyToClipboard text={"Transaction failed : " + transaction_error}>
              <Text as="u">copy error!</Text>
            </CopyToClipboard>
          </div>
        );
        // setFailureToastDisplayed(true);
        if (!toastHash.includes(transaction_hxh)) {
          if (data && data.includes(activeTransactions[transactions.length-1]?.uniqueID)) {
            dispatch(setTransactionStatus("failed"));
            activeTransactions[transactions.length-1].setCurrentTransactionStatus("failed");
          }
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
        transaction_status == "ACCEPTED_ON_L2" ||
        transaction_status == "ACCEPTED_ON_L1" ||
        transaction_status == "REJECTED" || 
        transaction_status == 'success'
      ) {
        if (activeTransactions[transactions.length-1].transaction_hash == "") {
          return false;
        }
        toastHash.push(transaction_hxh);
        toastHash.push(activeTransactions?.transaction_hash);
        toastHash.push(transaction_hash);
        const newData = [...activeTransactions]; // Create a new array with the same values
        newData[transactions.length-1] = {
          ...newData[transactions.length-1],
          transaction_hash: "", // Modify the specific property with the new value
        };
        toast.dismiss(activeTransactions?.[transactions.length-1]?.toastId);
        dispatch(setActiveTransactions(newData));
        return false;
      } else {
        return true;
      }
    });
    // if (transactionData?.length != activeTransactions?.length) {
    //   dispatch(setActiveTransactions(transactionData));
    // }
  }, [results]);
};

export default useTransactionHandler;

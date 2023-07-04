import { setTransactionStatus } from "@/store/slices/userAccountSlice";
import { Text } from "@chakra-ui/react";
import { useWaitForTransaction } from "@starknet-react/core";
// import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export const useToastHandler = (transaction: any) => {
  // const dispatch = useDispatch();
  const data = useWaitForTransaction({
    hash: transaction?.transaction_hash,
    watch: true,
    onReceived: () => {
      console.log("trans received");
    },
    onPending: () => {
      // setCurrentTransactionStatus(true);
      toast.dismiss(transaction?.toastId);
      console.log("trans pending");
      // if (isToastDisplayed == false) {
      // toast.success(transaction?.message || `You have successfully supplied`, {
      toast.success(transaction?.message || `You have successfully supplied`, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      //   setToastDisplayed(true);
      // }
    },
    onRejected(transaction: any) {
      toast.dismiss(transaction?.toastId);
      // if (!failureToastDisplayed) {
      console.log("treans rejected", transaction);
      // dispatch(setTransactionStatus("failed"));
      const toastContent = (
        <div>
          Transaction failed{" "}
          <CopyToClipboard text={"Transaction failed"}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      );
      // setFailureToastDisplayed(true);
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
    },
    onAcceptedOnL1: (result: any) => {
      // setCurrentTransactionStatus(true);
      console.log("trans onAcceptedOnL1");
    },
    onAcceptedOnL2(result: any) {
      toast.dismiss(transaction?.toastId);
      // setCurrentTransactionStatus(true);
      // if (!isToastDisplayed) {
      toast.success(transaction?.message || `You have successfully supplied`, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      // setToastDisplayed(true);
      // }
      console.log("trans onAcceptedOnL2 - ", result);
    },
  });
  return data;
};

export default useToastHandler;

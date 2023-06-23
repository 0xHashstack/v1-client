import {
  UseWaitForTransactionArgs,
  useWaitForTransaction,
} from "@starknet-react/core";
import React from "react";
export const useFetchToastStatus = ({
  hash,
  // watch,
  onAcceptedOnL1,
  onAcceptedOnL2,
  // onNotReceived,
  onPending,
  onReceived,
  onRejected,
}: any) => {
  // useState
  useWaitForTransaction({
    hash,
    watch: true,
    onReceived,
    onPending,
    // onNotReceived,
    onRejected,
    onAcceptedOnL1,
    onAcceptedOnL2,
  });
  return <></>;
};

export default useFetchToastStatus;

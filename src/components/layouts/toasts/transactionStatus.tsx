import {
  UseWaitForTransactionArgs,
  useWaitForTransaction,
} from "@starknet-react/core";
import React from "react";

const fetchToastStatus = (
  hash: any,
  onReceived: any,
  onPending: any,
  onRejected: any,
  onAcceptedOnL1: any,
  onAcceptedOnL2: any
) => {
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
  return 0;
};

export default fetchToastStatus;

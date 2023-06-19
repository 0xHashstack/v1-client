import {
  AddressFromStarkNameArgs,
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Abi, uint256 } from "starknet";
import { ERC20Abi, diamondAddress } from "../../stark-constants";
// import { TxToastManager } from "../../tx-ToastManager";
import { etherToWeiBN, weiToEtherNumber } from "../../utils/utils";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { NativeToken, RToken } from "@/Blockchain/interfaces/interfaces";

const useLoanRequest = () => {
  const { address: account } = useAccount();

  // Native token Market
  const [market, setMarket] = useState<NativeToken>("BTC");
  const [amount, setAmount] = useState<number>(0);

  // Collateral - rToken
  const [rToken, setRToken] = useState<RToken>("rBTC");
  const [rTokenAmount, setRTokenAmount] = useState<number>(0);

  // Collateral - native token Market
  const [collateralMarket, setCollateralMarket] = useState<NativeToken>("BTC");
  const [collateralAmount, setCollateralAmount] = useState<number>(0);

  const [transLoanRequestHash, setIsLoanRequestHash] = useState("");
  const loanRequestTransactionReceipt = useWaitForTransaction({
    hash: transLoanRequestHash,
    watch: true,
  });
//   console.log(
//     "useLoanRequest - ",
//     market,
//     amount,
//     rToken,
//     rTokenAmount,
//     "toto",
//     collateralMarket,
//     collateralAmount,
//     transLoanRequestHash,
//     "hey"
//   );
  const {
    data: dataLoanRequest,
    error: errorLoanRequest,
    reset: resetLoanRequest,
    write: writeLoanRequest,
    writeAsync: writeAsyncLoanRequest,
    isError: isErrorLoanRequest,
    isIdle: isIdleLoanRequest,
    isLoading: isLoadingLoanRequest,
    isSuccess: isSuccessLoanRequest,
    status: statusLoanRequest,
  } = useContractWrite({
    calls: [
      {
        contractAddress: tokenAddressMap[collateralMarket] || "",
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          etherToWeiBN(collateralAmount, collateralMarket).toString(),
          "0",
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "loan_request",
        calldata: [
          tokenAddressMap[market] || "",
          etherToWeiBN(amount as number, market).toString(),
          0,
          tokenAddressMap[collateralMarket] || "",
          etherToWeiBN(collateralAmount as number, collateralMarket).toString(),
          0,
          account,
        ],
      },
    ],
  });

  const {
    data: dataLoanRequestrToken,
    error: errorLoanRequestrToken,
    reset: resetLoanRequestrToken,
    write: writeLoanRequestrToken,
    writeAsync: writeAsyncLoanRequestrToken,
    isError: isErrorLoanRequestrToken,
    isIdle: isIdleLoanRequestrToken,
    isLoading: isLoadingLoanRequestrToken,
    isSuccess: isSuccessLoanRequestrToken,
    status: statusLoanRequestrToken,
  } = useContractWrite({
    calls: [
      {
        contractAddress: diamondAddress,
        entrypoint: "loan_request_with_rToken",
        calldata: [
          tokenAddressMap[market] || "",
          etherToWeiBN(amount, market).toString(),
          0,
          tokenAddressMap[rToken] || "",
          etherToWeiBN(rTokenAmount, rToken).toString(),
          0,
          account,
        ],
      },
    ],
  });

  return {
    market,
    setMarket,
    amount,
    setAmount,

    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount,

    collateralMarket,
    setCollateralMarket,
    collateralAmount,
    setCollateralAmount,
    transLoanRequestHash,
    setIsLoanRequestHash,

    dataLoanRequestrToken,
    errorLoanRequestrToken,
    resetLoanRequestrToken,
    writeLoanRequestrToken,
    writeAsyncLoanRequestrToken,
    isErrorLoanRequestrToken,
    isIdleLoanRequestrToken,
    isLoadingLoanRequestrToken,
    statusLoanRequestrToken,

    dataLoanRequest,
    errorLoanRequest,
    resetLoanRequest,
    writeLoanRequest,
    writeAsyncLoanRequest,
    isErrorLoanRequest,
    isIdleLoanRequest,
    isLoadingLoanRequest,
    statusLoanRequest,
  };
};

export default useLoanRequest;

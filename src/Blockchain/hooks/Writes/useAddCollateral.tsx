import {
  
  useContractWrite,

} from "@starknet-react/core";
import {  useState } from "react";
import {   } from "starknet";
import { diamondAddress } from "../../stark-constants";
import { etherToWeiBN } from "../../utils/utils";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { NativeToken, RToken } from "@/Blockchain/interfaces/interfaces";

const useAddCollateral = () => {
  const [loanId, setLoanId] = useState("");
  const [collateralAsset, setCollateralAsset] = useState<NativeToken>("USDT");
  const [collateralAmount, setCollateralAmount] = useState<number>(0);

  const [rToken, setRToken] = useState<RToken>("rUSDT");
  const [rTokenAmount, setRTokenAmount] = useState<number>(0);

  //     data: dataLoanRequest,
  //     error: errorLoanRequest,
  //     reset: resetLoanRequest,
  //     write: writeLoanRequest,
  //     writeAsync: writeAsyncLoanRequest,
  //     isError: isErrorLoanRequest,
  //     isIdle: isIdleLoanRequest,
  //     isLoading: isLoadingLoanRequest,
  //     isSuccess: isSuccessLoanRequest,
  //     status: statusLoanRequest,

  ////console.log(
  //   "addCollateral",
  //   loanId,
  //   collateralAsset,
  //   collateralAmount,
  //   rToken,
  //   rTokenAmount
  // );
  const {
    data: dataAddCollateral,
    error: errorAddCollateral,
    reset: resetAddCollateral,
    write: writeAddCollateral,
    writeAsync: writeAsyncAddCollateral,
    isError: isErrorAddCollateral,
    isIdle: isIdleAddCollateral,
    isSuccess: isSuccessAddCollateral,
    status: statusAddCollateral,
  } = useContractWrite({
    calls: [
      {
        contractAddress: tokenAddressMap[collateralAsset] || "",
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          etherToWeiBN(collateralAmount as number, collateralAsset).toString(),
          "0",
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "add_collateral",
        calldata: [
          loanId,
          tokenAddressMap[collateralAsset],
          etherToWeiBN(collateralAmount as number, collateralAsset).toString(),
          "0",
        ],
      },
    ],
  });

  const {
    data: dataAddCollateralRToken,
    error: errorAddCollateralRToken,
    reset: resetAddCollateralRToken,
    write: writeAddCollateralRToken,
    writeAsync: writeAsyncAddCollateralRToken,
    isError: isErrorAddCollateralRToken,
    isIdle: isIdleAddCollateralRToken,
    isSuccess: isSuccessAddCollateralRToken,
    status: statusAddCollateralRToken,
  } = useContractWrite({
    calls: [
      {
        contractAddress: diamondAddress,
        entrypoint: "add_rToken_collateral",
        calldata: [
          loanId,
          tokenAddressMap[rToken],
          etherToWeiBN(rTokenAmount as number, collateralAsset).toString(),
          "0",
        ],
      },
    ],
  });

  return {
    loanId,
    setLoanId,
    collateralAsset,
    setCollateralAsset,
    collateralAmount,
    setCollateralAmount,

    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount,

    dataAddCollateral,
    errorAddCollateral,
    resetAddCollateral,
    writeAddCollateral,
    writeAsyncAddCollateral,
    isErrorAddCollateral,
    isIdleAddCollateral,
    isSuccessAddCollateral,
    statusAddCollateral,

    dataAddCollateralRToken,
    errorAddCollateralRToken,
    resetAddCollateralRToken,
    writeAddCollateralRToken,
    writeAsyncAddCollateralRToken,
    isErrorAddCollateralRToken,
    isIdleAddCollateralRToken,
    isSuccessAddCollateralRToken,
    statusAddCollateralRToken,
  };
};

export default useAddCollateral;

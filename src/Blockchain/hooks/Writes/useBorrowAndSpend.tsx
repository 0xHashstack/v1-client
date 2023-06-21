import {
  useAccount,
  useContractWrite,
} from "@starknet-react/core";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { Method, NativeToken, RToken, Token } from "@/Blockchain/interfaces/interfaces";
import { useState } from "react";
import { diamondAddress } from "@/Blockchain/stark-constants";
import { etherToWeiBN } from "@/Blockchain/utils/utils";
import { L3App } from "../../interfaces/interfaces";
import { constants } from "@/Blockchain/utils/constants";

const useBorrowAndSpend = () => {

  const [loanMarket, setLoanMarket] = useState<NativeToken>("USDT"); // asset
  const [loanAmount, setLoanAmount] = useState<number>(0); // amount

  const [rToken, setRToken] = useState<RToken>("rBTC");
  const [rTokenAmount, setRTokenAmount] = useState<number>(0);

  const [collateralMarket, setCollateralMarket] = useState<NativeToken>("USDC"); // collateral_asset
  const [collateralAmount, setCollateralAmount] = useState<number>(0);

  const { address: recipient } = useAccount();

  const [l3App, setL3App] = useState<L3App>("JEDI_SWAP");  // integration
  const [method, setMethod] = useState<Method>("SWAP");  // calldata[1]

  const [toMarketSwap, setToMarketSwap] = useState<NativeToken>("BTC");

  const [toMarketLiqA, setToMarketLiqA] = useState<NativeToken>("BTC");
  const [toMarketLiqB, setToMarketLiqB] = useState<NativeToken>("DAI");

  // -------------------------- Types --------------------------- //

  type SwapCalldata = [
    typeof constants.JEDI_SWAP | typeof constants.MY_SWAP,
    "3",
    typeof constants.SWAP,
    NativeToken
  ];

  type AddLiquidityCalldata = [
    typeof constants.JEDI_SWAP | typeof constants.MY_SWAP,
    "4",
    typeof constants.ADD_LIQUIDITY,
    NativeToken,
    NativeToken
  ];

  type L3Calldata = SwapCalldata | AddLiquidityCalldata;

  const generateCalldata = (): L3Calldata => {
    let calldata: L3Calldata;

    let integration: typeof constants.JEDI_SWAP | typeof constants.MY_SWAP;
    integration = l3App === "JEDI_SWAP" ? constants.JEDI_SWAP : constants.MY_SWAP;

    if (method === "ADD_LIQUIDITY") {
      calldata = [
        integration,
        "4",
        constants.ADD_LIQUIDITY,
        tokenAddressMap[toMarketLiqA],
        tokenAddressMap[toMarketLiqB]
      ];
    } else if (method === "SWAP") {
      calldata = [
        integration,
        "3", 
        constants.SWAP, 
        tokenAddressMap[toMarketSwap]
      ];
    } else {
      // Handle the case when the method is neither "ADD_LIQUIDITY" nor "SWAP"
      throw new Error("Invalid method");
    }

    return calldata;
  }

  const {
    data: dataBorrowAndSpend,
    error: errorBorrowAndSpend,
    reset: resetBorrowAndSpend,
    writeAsync: writeAsyncBorrowAndSpend,
    isError: isErrorBorrowAndSpend,
    isIdle: isIdleBorrowAndSpend,
    isLoading: isLoadingBorrowAndSpend,
    isSuccess: isSuccessBorrowAndSpend,
    status: statusBorrowAndSpend,
  } = useContractWrite({
    calls: [
      {
        contractAddress: tokenAddressMap[collateralMarket],
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          etherToWeiBN(collateralAmount, collateralMarket).toString(),
          "0",
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "borrow_and_spend",
        calldata: [
          tokenAddressMap[loanMarket],
          etherToWeiBN(loanAmount, loanMarket).toString(),
          "0",

          tokenAddressMap[collateralMarket],
          etherToWeiBN(collateralAmount, collateralMarket).toString(),
          "0",

          recipient,
          ...generateCalldata()
        ]
      }
    ]
  });

  const {
    data: dataBorrowAndSpendRToken,
    error: errorBorrowAndSpendRToken,
    reset: resetBorrowAndSpendRToken,
    writeAsync: writeAsyncBorrowAndSpendRToken,
    isError: isErrorBorrowAndSpendRToken,
    isIdle: isIdleBorrowAndSpendRToken,
    isLoading: isLoadingBorrowAndSpendRToken,
    isSuccess: isSuccessBorrowAndSpendRToken,
    status: statusBorrowAndSpendRToken,
  } = useContractWrite({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "borrow_and_spend_with_rToken",
      calldata: [
        tokenAddressMap[loanMarket],
        etherToWeiBN(loanAmount, loanMarket).toString(),
        "0",

        tokenAddressMap[rToken],
        etherToWeiBN(rTokenAmount, rToken).toString(),
        "0",
        recipient,
        ...generateCalldata()
      ]
    }
  })

  return {
    loanMarket,
    setLoanMarket,
    loanAmount,
    setLoanAmount,
    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount,
    collateralMarket,
    setCollateralMarket,
    collateralAmount,
    setCollateralAmount,

    l3App,
    setL3App,
    method,
    setMethod,
    toMarketSwap,
    setToMarketSwap,

    toMarketLiqA,
    setToMarketLiqA,
    toMarketLiqB,
    setToMarketLiqB,

    dataBorrowAndSpend,
    errorBorrowAndSpend,
    resetBorrowAndSpend,
    writeAsyncBorrowAndSpend,
    isErrorBorrowAndSpend,
    isIdleBorrowAndSpend,
    isLoadingBorrowAndSpend,
    isSuccessBorrowAndSpend,
    statusBorrowAndSpend,

    dataBorrowAndSpendRToken,
    errorBorrowAndSpendRToken,
    resetBorrowAndSpendRToken,
    writeAsyncBorrowAndSpendRToken,
    isErrorBorrowAndSpendRToken,
    isIdleBorrowAndSpendRToken,
    isLoadingBorrowAndSpendRToken,
    isSuccessBorrowAndSpendRToken,
    statusBorrowAndSpendRToken,
  };
};

export default useBorrowAndSpend;

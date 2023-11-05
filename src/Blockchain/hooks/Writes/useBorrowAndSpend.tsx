import { useAccount, useContractWrite } from "@starknet-react/core";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import {
  Method,
  NativeToken,
  RToken,
  
} from "@/Blockchain/interfaces/interfaces";
import { useState } from "react";
import { diamondAddress,nftAddress } from "@/Blockchain/stark-constants";
import { etherToWeiBN } from "@/Blockchain/utils/utils";
import { L3App } from "../../interfaces/interfaces";
import { constants } from "@/Blockchain/utils/constants";
import { useSelector } from "react-redux";
import { selectMessageHash, selectNftBalance, selectNftCurrentAmount, selectNftMaxAmount, selectSignature, selectUserType, selectYourBorrow, selectYourSupply } from "@/store/slices/readDataSlice";

const useBorrowAndSpend = () => {
  const [loanMarket, setLoanMarket] = useState<NativeToken>("USDT"); // asset
  const [loanAmount, setLoanAmount] = useState<number>(0); // amount

  const [rToken, setRToken] = useState<RToken>("rBTC");
  const [rTokenAmount, setRTokenAmount] = useState<number>(0);

  const [collateralMarket, setCollateralMarket] = useState<NativeToken>("USDC"); // collateral_asset
  const [collateralAmount, setCollateralAmount] = useState<number>(0);

  const { address: recipient } = useAccount();

  const [l3App, setL3App] = useState<L3App>("JEDI_SWAP"); // integration
  const [method, setMethod] = useState<Method>("ADD_LIQUIDITY"); // calldata[1]

  const [toMarketSwap, setToMarketSwap] = useState<NativeToken>("BTC");

  const [toMarketLiqA, setToMarketLiqA] = useState<NativeToken>("BTC");
  const [toMarketLiqB, setToMarketLiqB] = useState<NativeToken>("DAI");
  const balance=useSelector(selectNftBalance);
  const user=useSelector(selectUserType)
  const messagehash=useSelector(selectMessageHash)
  const signature=useSelector(selectSignature)
  const totalSupply=useSelector(selectYourSupply)
  const totalBorrow=useSelector(selectYourBorrow)
  const nftMaxAmount=useSelector(selectNftMaxAmount);
  const nftCurrentAmount=useSelector(selectNftCurrentAmount);

  // -------------------------- Types --------------------------- //

  type SwapCalldata = [
    typeof constants.JEDI_SWAP | typeof constants.MY_SWAP,
    "2",
    typeof constants.SWAP,
    NativeToken
  ];

  type AddLiquidityCalldata = [
    typeof constants.JEDI_SWAP | typeof constants.MY_SWAP,
    "3",
    typeof constants.ADD_LIQUIDITY,
    NativeToken,
    NativeToken
  ];

  type L3Calldata = SwapCalldata | AddLiquidityCalldata;

  const generateCalldata = (): L3Calldata => {
    let calldata: L3Calldata;

    let integration: typeof constants.JEDI_SWAP | typeof constants.MY_SWAP;
    integration =
      l3App === "JEDI_SWAP" ? constants.JEDI_SWAP : constants.MY_SWAP;

    if (method === "ADD_LIQUIDITY") {
      calldata = [
        integration,
        "3",
        constants.ADD_LIQUIDITY,
        tokenAddressMap[toMarketLiqA],
        tokenAddressMap[toMarketLiqB],
      ];
    } else if (method === "SWAP") {
      calldata = [
        integration,
        "2",
        constants.SWAP,
        tokenAddressMap[toMarketSwap],
      ];
    } else {
      // Handle the case when the method is neither "ADD_LIQUIDITY" nor "SWAP"
      throw new Error("Invalid method");
    }

    return calldata;
  };

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
    calls:process.env.NEXT_PUBLIC_NODE_ENV=="testnet" && balance==0 &&user=="U1" && ( loanAmount>50) && nftCurrentAmount<nftMaxAmount ? [
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
          ...generateCalldata(),
        ],
      },
      {
        contractAddress: nftAddress,
        entrypoint: "claim_nft",
        calldata: [
          messagehash,
          "2",
          signature?.[0],
          signature?.[1],
          0
        ],
      },
    ]:[
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
          ...generateCalldata(),
        ],
      },
    ],
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
    calls:process.env.NEXT_PUBLIC_NODE_ENV=="testnet" && balance==0 && user=="U1"&& ( loanAmount>50) && nftCurrentAmount<nftMaxAmount ?[ {
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
        ...generateCalldata(),
      ],
    },
    {
      contractAddress: nftAddress,
      entrypoint: "claim_nft",
      calldata: [
        messagehash,
        "2",
        signature?.[0],
        signature?.[1],
        0
      ],
    },]:[
      {
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
          ...generateCalldata(),
        ],
      }
    ]
  });

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

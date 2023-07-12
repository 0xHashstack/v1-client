import {
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
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "@/Blockchain/utils/addressServices";
import { ILoan, Token } from "@/Blockchain/interfaces/interfaces";
import mixpanel from "mixpanel-browser";
import { selectActiveTransactions, setActiveTransactions, setTransactionStatus } from "@/store/slices/userAccountSlice";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Text } from "@chakra-ui/react";
const useRepay = (loanParam: any) => {
  const [repayAmount, setRepayAmount] = useState<number>(0);
  const [loan, setLoan] = useState<ILoan>(loanParam);
  const [allowanceVal, setAllowance] = useState(0);
  // console.log(repayAmount, "loan here", loanParam);
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY|| "", { debug: true, track_pageview: true, persistence: 'localStorage' });

  const [transApprove, setTransApprove] = useState("");
  const [transRepayHash, setTransRepayHash] = useState("");
  const dispatch=useDispatch();
  const [transSelfLiquidateHash, setIsSelfLiquidateHash] = useState("");

  // const repayTransactionReceipt = useWaitForTransaction({
  //   hash: transRepayHash,
  //   watch: true,
  // });

  // const selfLiquidateTransactionReceipt = useWaitForTransaction({
  //   hash: transSelfLiquidateHash,
  //   watch: true,
  // });

  // useEffect(() => {
  //   TxToastManager.handleTxToast(
  //     repayTransactionReceipt,
  //     `Repay Loan ID ${loan?.loanId}`
  //   );
  // }, [repayTransactionReceipt]);

  // useEffect(() => {
  //   TxToastManager.handleTxToast(
  //     selfLiquidateTransactionReceipt,
  //     `Liquidate Loan ID ${loan?.loanId}`
  //   );
  // }, [selfLiquidateTransactionReceipt]);

  const {
    data: dataRepay,
    error: errorRepay,
    reset: resetRepay,
    write: writeRepay,
    writeAsync: writeAsyncRepay,
    isError: isErrorRepay,
    isIdle: isIdleRepay,
    isLoading: isLoadingRepay,
    isSuccess: isSuccessRepay,
    status: statusRepay,
  } = useContractWrite({
    calls: [
      {
        contractAddress: loan?.underlyingMarketAddress as string,
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          etherToWeiBN(
            repayAmount as number,
            loan?.underlyingMarket as Token
          ).toString(),
          0,
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "repay_loan",
        calldata: [
          loan?.loanId,
          etherToWeiBN(
            repayAmount as number,
            loan?.underlyingMarket as Token
          ).toString(),
          0,
        ],
      },
    ],
  });

  const {
    data: dataSelfLiquidate,
    error: errorSelfLiquidate,
    reset: resetSelfLiquidate,
    write: writeSelfLiquidate,
    writeAsync: writeAsyncSelfLiquidate,
    isError: isErrorSelfLiquidate,
    isIdle: isIdleSelfLiquidate,
    isLoading: isLoadingSelfLiquidate,
    isSuccess: isSuccessSelfLiquidate,
    status: statusSelfLiquidate,
  } = useContractWrite({
    calls: [
      {
        contractAddress: diamondAddress,
        entrypoint: "repay_loan",
        calldata: [loan?.loanId, 0, 0],
      },
    ],
  });
  const [toastId, setToastId] = useState<any>();
  let activeTransactions = useSelector(selectActiveTransactions);
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState("");
  const handleRepayBorrow = async () => {
    if (!repayAmount && loan?.loanId! && !diamondAddress) {
      return;
    }
    // if (!repayAmount || repayAmount < 0) {
    if (!repayAmount || repayAmount < 0) {
      return;
    }
    try {
      const val = await writeAsyncRepay();
      setTransRepayHash(val?.transaction_hash);
      if(val?.transaction_hash){
        const toastid = toast.info(
          `Transaction pending `,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
          }
        );
        setToastId(toastid);
        if (!activeTransactions) {
          activeTransactions = []; // Initialize activeTransactions as an empty array if it's not defined
        } else if (
          Object.isFrozen(activeTransactions) ||
          Object.isSealed(activeTransactions)
        ) {
          // Check if activeTransactions is frozen or sealed
          activeTransactions = activeTransactions.slice(); // Create a shallow copy of the frozen/sealed array
        }
        const trans_data = {
          transaction_hash: val?.transaction_hash.toString(),
          message: `You have successfully repaid`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
        };
        // addTransaction({ hash: deposit?.transaction_hash });
        activeTransactions?.push(trans_data);
        mixpanel.track("Zero Repay Status", {
          Status: "Success",
          "Loan ID": loan?.loanId,

        });

        dispatch(setActiveTransactions(activeTransactions));
        dispatch(setTransactionStatus("success"));
      }

    } catch (err:any) {
      console.log(err, "err repay");
      dispatch(setTransactionStatus("failed"));
      const toastContent = (
        <div>
          Transaction failed{" "}
          <CopyToClipboard text={err}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      );
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
      mixpanel.track('Repay Borrow Status',{
        "Status":"Failure"
      })
      // const toastParamValue = {
      //   success: false,
      //   heading: "Repay Transaction Failed",
      //   desc: "Copy the error",
      //   textToCopy: err,
      // };
      return;
    }
  };

  return {
    repayAmount,
    setRepayAmount,
    // handleApprove,
    writeAsyncRepay,
    transRepayHash,
    setTransRepayHash,
    // repayTransactionReceipt,
    isLoadingRepay,
    errorRepay,
    handleRepayBorrow,

    //SelfLiquidate - Repay with 0 amount
    writeAsyncSelfLiquidate,
    isLoadingSelfLiquidate,
    errorSelfLiquidate,
    // selfLiquidateTransactionReceipt,
    setIsSelfLiquidateHash,
  };
};

export default useRepay;


import {
  useAccount,
  useContract,
  useStarknet,
  useStarknetCall,
  useStarknetExecute,
  useTransactionReceipt,
} from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Col, Button, Form, Input, Spinner } from "reactstrap";
import { Abi, uint256 } from "starknet";
import { MinimumAmount } from "../../../blockchain/constants";
import {
  diamondAddress,
  ERC20Abi,
  getTokenFromAddress,
  isTransactionLoading,
  tokenAddressMap,
  tokenDecimalsMap,
} from "../../../blockchain/stark-constants";
import { TxToastManager } from "../../../blockchain/txToastManager";
import { BNtoNum, GetErrorText, NumToBN } from "../../../blockchain/utils";
import MySpinner from "../../mySpinner";

const Repay = ({
  depositRequestSel,
  asset,
  setRepayTransactionReceipt,
}: {
  depositRequestSel: any;
  asset: any;
  setRepayTransactionReceipt: any;
}) => {
  //   const [loanMarket, setLoanMarket] = useState<string>("");
  const [inputVal, setInputVal] = useState<number>(0);
  const [commitmentPeriod, setCommitmentPeriod] = useState();
  const [loanId, setLoanId] = useState<number>();

  const [allowanceVal, setAllowance] = useState(0);
  const [isAllowed, setAllowed] = useState(false);
  const [shouldApprove, setShouldApprove] = useState(false);

  const { address: account } = useAccount();
  const [transApprove, setTransApprove] = useState("");
  const [transRepay, setTransRepay] = useState("");

  const approveTransactionReceipt = useTransactionReceipt({
    hash: transApprove,
    watch: true,
  });
  const repayTransactionReceipt = useTransactionReceipt({
    hash: transRepay,
    watch: true,
  });

  useEffect(() => {
    console.log(
      "approve tx receipt",
      approveTransactionReceipt.data?.transaction_hash,
      approveTransactionReceipt
    );
    TxToastManager.handleTxToast(
      approveTransactionReceipt,
      `Repay: Approve ${asset.loanMarket}`,
      true
    );
  }, [approveTransactionReceipt]);

  useEffect(() => {
    console.log(
      "repay tx receipt",
      repayTransactionReceipt.data?.transaction_hash,
      repayTransactionReceipt
    );
    TxToastManager.handleTxToast(
      repayTransactionReceipt,
      `Repay ${asset.loanMarket} Loan`
    );
    setRepayTransactionReceipt(repayTransactionReceipt);
  }, [repayTransactionReceipt]);

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[asset.loanMarket] as string,
  });

  const {
    data: dataAllowance,
    loading: loadingAllowance,
    error: errorAllowance,
    refresh: refreshAllowance,
  } = useStarknetCall({
    contract: contract,
    method: "allowance",
    args: [account, diamondAddress],
    options: {
      watch: true,
    },
  });

  const {
    data: dataApprove,
    loading: loadingApprove,
    error: errorApprove,
    reset: resetApprove,
    execute: executeApprove,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[asset.loanMarket] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, NumToBN(inputVal as number, tokenDecimalsMap[asset.loanMarket]), 0],
    },
  });

  const {
    data: dataRepay,
    loading: loadingRepay,
    error: errorRepay,
    reset: resetRepay,
    execute: executeRepay,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "loan_repay",
      calldata: [
        tokenAddressMap[asset.loanMarket],
        asset.commitmentIndex,
        NumToBN(inputVal as number, tokenDecimalsMap[asset.loanMarket]),
        0,
      ],
    },
  });

  useEffect(() => {
    console.log("check allownace", {
      dataAllowance,
      errorAllowance,
      refreshAllowance,
      loadingAllowance,
    });
    if (dataAllowance) {
      console.log("yo", Number(BNtoNum(dataAllowance[0]?.low, 18)));
    }
    if (!loadingAllowance) {
      if (dataAllowance) {
        let data: any = dataAllowance;
        let _allowance = uint256.uint256ToBN(data.remaining);
        // console.log({ _allowance: _allowance.toString(), depositAmount });
        setAllowance(Number(BNtoNum(dataAllowance[0]?.low, 18)));
        if (allowanceVal > (inputVal as number)) {
          setAllowed(true);
          setShouldApprove(false);
        } else {
          setShouldApprove(true);
          setAllowed(false);
        }
      } else if (errorAllowance) {
        // handleToast(true, "Check allowance", errorAllowance)
      }
    }
  }, [dataAllowance, errorAllowance, refreshAllowance, loadingAllowance]);

  const handleApprove = async (asset: string) => {
    try {
      const val = await executeApprove();
      setTransApprove(val.transaction_hash);
    } catch (err) {
      console.log(err, "err approve token repay");
    }
  };

  const handleRepay = async () => {
    if (!inputVal && loanId! && !diamondAddress && !asset.commitmentIndex) {
      toast.error(`${GetErrorText(`Invalid request`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
    if (!tokenAddressMap[asset.loanMarket] && !inputVal && !diamondAddress) {
      toast.error(`${GetErrorText(`Invalid request`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    if (inputVal < 0) {
      // approve the transfer
      toast.error(
        `${GetErrorText(`Can't deposit < 0 of ${asset.loanMarket}`)}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        }
      );
      return;
    }
    console.log(diamondAddress, inputVal);
    // await handleApprove();
    // run deposit function

    // console.log("allowance", BNtoNum(dataAllowance[0]?.low, 18).toString());
    // console.log("amountin -: ", inputVal);

    // setAllowance(Number(BNtoNum(dataAllowance[0]?.low, 18)));

    try {
      const val = await executeRepay();
      setTransRepay(val.transaction_hash);
    } catch (err) {
      console.log(err, "err repay");
    }
  };

  return (
    <Form>
      <div className="row mb-3">
        <Col sm={12}>
          <Input
            type="text"
            className="form-control"
            id="horizontal-password-Input"
            min={0}
            placeholder={"Loan amount to pay separately"}
            onChange={(event) => {
              setInputVal(Number(event.target.value));
              setLoanId(asset.loanId);
            }}
          />
        </Col>
      </div>

      <div className="d-grid gap-2">
        {allowanceVal < (inputVal as number) ? (
          <Button
            color="primary"
            className="w-md"
            disabled={
              loanId == null ||
              loadingApprove ||
              loadingRepay ||
              (inputVal as number) < 0
            }
            onClick={(e) => handleApprove(asset.loanMarket)}
          >
            {/* setApproveStatus(transactions[0]?.status); */}
            {!(
              loadingApprove || isTransactionLoading(approveTransactionReceipt)
            ) ? (
              "Approve"
            ) : (
              <MySpinner text="Approving token" />
            )}
          </Button>
        ) : (
          <Button
            color="primary"
            className="w-md"
            disabled={
              loanId == null ||
              loadingApprove ||
              loadingRepay ||
              (inputVal as number) < 0
            }
            onClick={(e) => handleRepay()}
          >
            {!(
              loadingApprove || isTransactionLoading(repayTransactionReceipt)
            ) ? (
              "Repay"
            ) : (
              <MySpinner text="Repaying Loan" />
            )}
          </Button>
        )}
      </div>
    </Form>
  );
};

export default Repay;

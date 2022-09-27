import {
  useContract,
  useStarknet,
  useStarknetCall,
  useStarknetExecute,
  useStarknetTransactionManager,
} from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Col, Button, Form, Input, Spinner } from "reactstrap";
import { Abi, uint256 } from "starknet";
import { MinimumAmount } from "../../../../blockchain/constants";
import {
  diamondAddress,
  ERC20Abi,
  tokenAddressMap,
} from "../../../../blockchain/stark-constants";
import { BNtoNum, GetErrorText, NumToBN } from "../../../../blockchain/utils";

const Repay = ({
  depositRequestSel,
  asset,
}: {
  depositRequestSel: any;
  asset: any;
}) => {
  //   const [loanMarket, setLoanMarket] = useState<string>("");
  const [inputVal, setInputVal] = useState<number>(0);
  const [commitmentPeriod, setCommitmentPeriod] = useState();
  const [loanId, setLoanId] = useState<number>();

  const [allowanceVal, setAllowance] = useState(0);
  const [isAllowed, setAllowed] = useState(false);
  const [shouldApprove, setShouldApprove] = useState(false);

  const { account } = useStarknet();
  const { transactions } = useStarknetTransactionManager();

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
      calldata: [diamondAddress, NumToBN(inputVal as number, 18), 0],
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
        NumToBN(inputVal as number, 18),
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
    let val = await executeApprove();
    if (errorApprove) {
      toast.error(`${GetErrorText(`Approve for token ${asset} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
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
    if (inputVal === 0) {
      // approve the transfer
      toast.error(`${GetErrorText(`Can't deposit 0 of ${asset.loanMarket}`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    console.log(diamondAddress, inputVal);
    // await handleApprove();
    // run deposit function

    // console.log("allowance", BNtoNum(dataAllowance[0]?.low, 18).toString());
    // console.log("amountin -: ", inputVal);

    // setAllowance(Number(BNtoNum(dataAllowance[0]?.low, 18)));
    await executeRepay();
    if (errorRepay) {
      toast.error(`${GetErrorText(`Deposit for ${asset.loanMarket} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
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
            placeholder={
              depositRequestSel
                ? `Minimum amount =  ${MinimumAmount[depositRequestSel]}`
                : "Amount"
            }
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
              (inputVal as number) === 0
            }
            onClick={(e) => handleApprove(asset.loanMarket)}
          >
            {/* setApproveStatus(transactions[0]?.status); */}
            {!(
              loadingApprove ||
              (transactions.length > 0 &&
                transactions[0]?.status !== "ACCEPTED_ON_L2")
            ) ? (
              "Approve"
            ) : (
              <Spinner>Loading...</Spinner>
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
              (inputVal as number) == 0
            }
            onClick={(e) => handleRepay()}
          >
            {!(
              loadingApprove ||
              (transactions.length > 0 &&
                transactions[0]?.status !== "ACCEPTED_ON_L2")
            ) ? (
              "Repay"
            ) : (
              <Spinner>Loading...</Spinner>
            )}
          </Button>
        )}
      </div>
    </Form>
  );
};

export default Repay;

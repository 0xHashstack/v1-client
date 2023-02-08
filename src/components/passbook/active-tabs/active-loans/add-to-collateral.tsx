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
import { MinimumAmount } from "../../../../blockchain/constants";
import {
  diamondAddress,
  ERC20Abi,
  getTokenFromName,
  isTransactionLoading,
  tokenAddressMap,
} from "../../../../blockchain/stark-constants";
import { TxToastManager } from "../../../../blockchain/txToastManager";
import { BNtoNum, GetErrorText, NumToBN } from "../../../../blockchain/utils";
import MySpinner from "../../../mySpinner";

const AddToCollateral = ({
  asset,
  depositRequestSel,
  setAddCollateralTransactionReceipt,
}: {
  asset: any;
  depositRequestSel: any;
  setAddCollateralTransactionReceipt: any;
}) => {
  const [marketToAddCollateral, setMarketToAddCollateral] =
    useState<string>("");
  const [inputVal, setInputVal] = useState<number>(0);
  const [loanId, setLoanId] = useState<number>();

  const [allowanceVal, setAllowance] = useState(0);
  const [isAllowed, setAllowed] = useState(false);
  const [shouldApprove, setShouldApprove] = useState(false);

  const { address: account } = useAccount();

  const [transApprove, setTransApprove] = useState("");
  const [transAddcollateral, setTransAddcollateral] = useState("");

  const approveTransactionReceipt = useTransactionReceipt({
    hash: transApprove,
    watch: true,
  });
  const addCollateralTransactionReceipt = useTransactionReceipt({
    hash: transAddcollateral,
    watch: true,
  });

  useEffect(() => {
    // console.log(
    //   "approve tx receipt",
    //   approveTransactionReceipt.data?.transaction_hash,
    //   approveTransactionReceipt
    // );
    TxToastManager.handleTxToast(
      approveTransactionReceipt,
      `Add Collateral: Approve ${asset.collateralMarket}`,
      true
    );
  }, [approveTransactionReceipt]);

  useEffect(() => {
    // console.log(
    //   "add col tx receipt",
    //   addCollateralTransactionReceipt.data?.transaction_hash,
    //   addCollateralTransactionReceipt
    // );
    TxToastManager.handleTxToast(
      addCollateralTransactionReceipt,
      `Add ${asset.collateralMarket} Collateral to Loan`
    );
    setAddCollateralTransactionReceipt(addCollateralTransactionReceipt);
  }, [addCollateralTransactionReceipt]);

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[marketToAddCollateral] as string,
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
      contractAddress: marketToAddCollateral as string,
      entrypoint: "approve",
      calldata: [diamondAddress, NumToBN(inputVal as number, 18), 0],
    },
  });

  const {
    data: dataAddCollateral,
    loading: loadingAddCollateral,
    error: errorAddCollateral,
    reset: resetAddCollateral,
    execute: executeAddCollateral,
  } = useStarknetExecute({
    calls: [
      {
        contractAddress: marketToAddCollateral as string,
        entrypoint: "approve",
        calldata: [diamondAddress, NumToBN(inputVal as number, 18), 0],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "add_collateral",
        calldata: [loanId, NumToBN(inputVal as number, 18), 0],
      },
    ]
  });

  useEffect(() => {
    // console.log("check allownace", {
    //   dataAllowance,
    //   errorAllowance,
    //   refreshAllowance,
    //   loadingAllowance,
    // });
    if (dataAllowance) {
      console.log("yo", Number(BNtoNum(dataAllowance[0]?.low, 18)), inputVal);
    }
    if (!loadingAllowance) {
      if (dataAllowance) {
        let data: any = dataAllowance;
        let _allowance = uint256.uint256ToBN(data.remaining);
        console.log(Number(BNtoNum(dataAllowance[0]?.low, 18)));
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
		} catch(err) {
			console.log(err, 'err approve token add collateral')
		}
  };

  const handleAddCollateral = async (asset: string) => {
    if (!tokenAddressMap[asset] && !inputVal && !diamondAddress) {
      toast.error(`${GetErrorText(`Invalid request`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    if (inputVal === 0) {
      // approve the transfer
      toast.error(`${GetErrorText(`Can't deposit 0 of ${asset}`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    // console.log(diamondAddress, inputVal);
    // await handleApprove();
    // run deposit function

    // console.log("allowance", BNtoNum(dataAllowance[0]?.low, 18).toString());
    // console.log("amountin -: ", inputVal);

    // setAllowance(Number(BNtoNum(dataAllowance[0]?.low, 18)));
    try {
      const val = await executeAddCollateral();
      setTransAddcollateral(val.transaction_hash);
    } catch(err) {
      console.log(err, 'err add collateral')
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
              setInputVal(parseFloat(event.target.value));
              console.log(parseFloat(event.target.value));
              console.log(allowanceVal);

              setMarketToAddCollateral(
                getTokenFromName(asset.collateralMarket as string).address
              );
              setLoanId(asset.loanId);
            }}
          />
        </Col>
      </div>

      <div className="d-grid gap-2">
        {/* {dataAllowance &&
        Number(BNtoNum(dataAllowance[0]?.low, 18)) < (inputVal as number) ? (
          <Button
            color="primary"
            className="w-md"
            disabled={
              loanId == null ||
              loadingApprove ||
              loadingAddCollateral ||
              (inputVal as number) < MinimumAmount[asset]
            }
            onClick={(e) => handleApprove(asset)}
          >
            {/* setApproveStatus(transactions[0]?.status); *}
            {!(
              loadingApprove || isTransactionLoading(approveTransactionReceipt)
            ) ? (
              "Approve"
            ) : (
              <MySpinner text="Approving Token" />
            )}
          </Button>
        ) : (  */}
          <Button
            color="primary"
            className="w-md"
            disabled={
              loanId == null ||
              loadingApprove ||
              loadingAddCollateral ||
              (inputVal as number) < MinimumAmount[asset]
            }
            onClick={(e) => handleAddCollateral(asset)}
          >
            {!(
              loadingApprove ||
              isTransactionLoading(addCollateralTransactionReceipt)
            ) ? (
              "Approve & Add Collateral"
            ) : (
              <MySpinner text="Adding Collateral" />
            )}
          </Button>
        {/* )} */}
      </div>
    </Form>
  );
};

export default AddToCollateral;

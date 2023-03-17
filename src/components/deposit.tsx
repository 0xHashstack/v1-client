import { useState, useContext, useEffect, useCallback } from "react";
import { NavLink } from "reactstrap";

import DepositAbi from "../../ABIs/deposit_abi.json";
import { MinimumAmount } from "../blockchain/constants";
import BigNumber, { ethers } from "ethers";

import {
  diamondAddress,
  ERC20Abi,
  getTokenFromName,
  tokenAddressMap,
  tokenDecimalsMap,
} from "../blockchain/stark-constants";

import { etherToWeiBN, GetErrorText } from "../blockchain/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

import {
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
  useTransactionReceipt,
} from "@starknet-react/core";
import { Abi, Contract, uint256 } from "starknet";

import { TxToastManager } from "../blockchain/txToastManager";
import classnames from "classnames";
import OffchainAPI from "../services/offchainapi.service";
import Downarrow from "../assets/images/ArrowDownDark.svg";
import UpArrow from "../assets/images/ArrowUpDark.svg";
import SupplyModal from "./modals/supplyModal";
import { Coins } from "./dashboard/dashboard-body";

interface ICoin {
  name: string;
  icon: string;
}

let Deposit: any = ({
  reserves,
  asset: assetParam,
  depositLoanRates: depositLoanRatesParam,
  assetSymbol: assetSymbolParam,
}: {
  reserves: any;
  asset: string;
  depositLoanRates: any;
}) => {

  const [asset, setAsset] = useState(assetParam);
  const [value, setValue] = useState<any>(0);
  const [tokenName, setTokenName] = useState(assetParam);
  const [tokenSymbol, setTokenSymbol] = useState(assetSymbolParam);

  const [token, setToken] = useState(getTokenFromName(asset));
  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(Downarrow);

  const [depositLoanRates, setDepositLoanRates] = useState(
    depositLoanRatesParam
  );

  const [commitmentValue, setCommitmentValue] = useState("Flexible");
  const [commitmentDropDown, setCommitmentDropDown] = useState(false);
  const [commitmentArrow, setCommitmentArrow] = useState(Downarrow);

  const [modal_deposit, setmodal_deposit] = useState(false);

  const [depositAmount, setDepositAmount] = useState<any>();
  const [commitPeriod, setCommitPeriod] = useState(0);

  const [allowanceVal, setAllowance] = useState(0);

  const { account, address: accountAddress, status } = useAccount();
  const [transDeposit, setTransDeposit] = useState("");
  const [toastParam, setToastParam] = useState({});
  const [isToastOpen, setIsToastOpen] = useState(false);

  const requestDepositTransactionReceipt = useTransactionReceipt({
    hash: transDeposit,
    watch: true,
  });

  useEffect(() => {
    setToken(getTokenFromName(asset));
  }, [asset]);

  useEffect(() => {
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      // console.log("deposit rates in supply", val);
      setDepositLoanRates(val);
    });
  }, [asset]);

  useEffect(() => {
    TxToastManager.handleTxToast(
      requestDepositTransactionReceipt,
      `Deposit ${token?.name}`
    );
  }, [requestDepositTransactionReceipt]);

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[asset] as string,
  });

  const {
    data: dataBalance,
    loading: loadingBalance,
    error: errorBalance,
    refresh: refreshBalance,
  } = useStarknetCall({
    contract: contract,
    method: "balanceOf",
    args: [accountAddress],
    options: {
      watch: true,
    },
  });

  const [customActiveTab, setCustomActiveTab] = useState("9");

  const {
    data: dataUSDC,
    loading: loadingUSDC,
    error: errorUSDC,
    reset: resetUSDC,
    execute: USDC,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[asset] as string,
      entrypoint: "approve",
      calldata: [
        diamondAddress,
        etherToWeiBN(depositAmount, tokenAddressMap[asset] || "").toString(),
        0,
      ],
    },
  });

  // Deposit Hook
  const {
    data: dataDeposit,
    loading: loadingDeposit,
    error: errorDeposit,
    reset: resetDeposit,
    execute: executeDeposit,
  } = useStarknetExecute({
    calls: [
      {
        contractAddress: tokenAddressMap[asset] as string,
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          etherToWeiBN(depositAmount, tokenAddressMap[asset] || "").toString(),
          0,
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "deposit_request",
        calldata: [
          tokenAddressMap[asset],
          commitPeriod,
          // NumToBN(depositAmount, 18),
          etherToWeiBN(depositAmount, tokenAddressMap[asset] || "").toString(),
          0,
        ],
      },
    ],
  });

  const returnTransactionParameters = () => {
    let data, loading, reset, error;
    [data, loading, reset, error] = [
      dataUSDC,
      loadingUSDC,
      resetUSDC,
      errorUSDC,
    ];
    return { data, loading, reset, error };
  };

  const {
    data: dataAllowance,
    loading: loadingAllowance,
    error: errorAllowance,
    refresh: refreshAllowance,
  } = useStarknetCall({
    contract: contract,
    method: "allowance",
    args: [accountAddress, diamondAddress],
    options: {
      watch: true,
    },
  });

  const {
    data: dataApprove,
    loading: loadingApprove,
    reset: resetApprove,
    error: errorApprove,
  } = returnTransactionParameters();

  const tog_center = async () => {
    setmodal_deposit(!modal_deposit);
    removeBodyCss();
  };

  const handleCommitChange = (e: any) => {
    setCommitPeriod(e);
  };

  const handleDepositAmountChange = (e: any) => {
    setDepositAmount(e.target.value);
    const balance =
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
      10 ** (tokenDecimalsMap[asset] || 18);
    if (!balance) return;
    // calculate percentage of collateral of balance
    var percentage = (e.target.value / balance) * 100;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setValue("Greater than 100");
      return;
    }
    // Round off percentage to 2 decimal places
    percentage = Math.round(percentage * 100) / 100;
    setValue(percentage);
  };

  const handleBalanceChange = async () => {
    const allow = await refreshAllowance();
    const bal = await refreshBalance();
    // console.log("updated on toggle", allow, bal, asset);
  };

  const handleMax = async () => {
    setDepositAmount(
      (
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** (tokenDecimalsMap[asset] || 18)
      ).toFixed(4)
    );
    setValue(100);
  };

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const toggleDropdown = async () => {
    setDropDown(!dropDown);
    setDropDownArrow(dropDown ? Downarrow : UpArrow);
  };

  const { account: userAccount } = useAccount();
  const { contract: depositContract } = useContract({
    abi: DepositAbi as Abi,
    address: diamondAddress,
  });

  const depositContract2: any = new Contract(
    DepositAbi as Abi,
    diamondAddress,
    depositContract2?.providerOrAccount
  );

  const getGas = async () => {
    try {
      // console.log(
      //   "gas tokenAddressMap[asset]",
      //   tokenAddressMap[asset],
      //   diamondAddress,
      //   commitPeriod,
      //   depositAmount,
      //   depositContract
      // );
      // console.log("provider", depositContract?.providerOrAccount, userAccount);

      let call = depositContract?.populate("deposit_request", [
        tokenAddressMap[asset],
        commitPeriod,
        [
          etherToWeiBN(depositAmount, tokenAddressMap[asset] || "").toString(),
          0,
        ],
      ]);
      if (!call) {
        throw new Error("call undefined");
      } else {
        let gas = await userAccount?.estimateFee([call]);
        // console.log("gas for deposit", gas);
      }
    } catch (error) {
      // console.log("query gas error", diamondAddress, error);
    }
  };

  const handleDeposit = async (asset: string) => {
    if (
      !tokenAddressMap[asset] &&
      !depositAmount &&
      !diamondAddress &&
      !commitPeriod
    ) {
      toast.error(`${GetErrorText(`Invalid request`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    if (depositAmount === 0) {
      // approve the transfer
      toast.error(`${GetErrorText(`Can't deposit 0 of ${asset}`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    try {
      let val = await executeDeposit();
      setTransDeposit(val.transaction_hash);
      const toastParamValue = {
        success: true,
        heading: "Success",
        desc: "Copy the Transaction Hash",
        textToCopy: val.transaction_hash,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
    } catch (err) {
      // console.log(err, "err deposit");
      const toastParamValue = {
        success: false,
        heading: "Deposit Transaction Failed",
        desc: "Copy the error",
        textToCopy: err,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
      toast.error(`${GetErrorText(`Deposit for ${asset} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
  };

  useEffect(() => {
    if (!loadingAllowance) {
      if (dataAllowance) {
        let data: any = dataAllowance;
        let _allowanceBN = uint256.uint256ToBN(data.remaining);
        const _allowance = ethers.utils.formatEther(_allowanceBN.toString());
        // // console.log('deposit allowance', token?.name, _allowance, depositAmount)
        setAllowance(Number(_allowance));
      } else if (errorAllowance) {
        // handleToast(true, "Check allowance", errorAllowance)
      }
    }
  }, [dataAllowance, errorAllowance, refreshAllowance, loadingAllowance]);

  function isInvalid() {
    if (!depositAmount) return true;
    return (
      depositAmount < MinimumAmount[asset] ||
      depositAmount >
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
          10 ** (tokenDecimalsMap[asset] || 18)
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <NavLink
          type="button"
          // className="btn btn-dark btn-sm w-xs"
          onClick={tog_center}
          style={{
            backgroundColor: "#393D4F",
            color: "white",
            padding: "10px 18px",
            borderRadius: "5px",
            border: "none",
            fontSize: "11px",
            width: "75px",
          }}
          className={classnames({
            active: customActiveTab === "2",
          })}
        >
          Supply
        </NavLink>
      </div>
      <SupplyModal
        modal_deposit={modal_deposit}
        accountAddress={accountAddress}
        toggleDropdown={toggleDropdown}
        tokenName={tokenName}
        setTokenName={setTokenName}
        tokenSymbol={tokenSymbol}
        setTokenSymbol={setTokenSymbol}
        setmodal_deposit={setmodal_deposit}
        tog_center={tog_center}
        setCommitmentDropDown={setCommitmentDropDown}
        commitmentDropDown={commitmentDropDown}
        setCommitmentArrow={setCommitmentArrow}
        commitmentValue={commitmentValue}
        dropDown={dropDown}
        Coins={Coins}
        setDropDown={setDropDown}
        setDropDownArrow={setDropDownArrow}
        setAsset={setAsset}
        handleBalanceChange={handleBalanceChange}
        handleCommitChange={handleCommitChange}
        setCommitmentValue={setCommitmentValue}
        handleMax={handleMax}
        setDepositAmount={setDepositAmount}
        handleDepositAmountChange={handleDepositAmountChange}
        depositAmount={depositAmount}
        Downarrow={Downarrow}
        asset={asset}
        isInvalid={isInvalid}
        dataBalance={dataBalance}
        value={value}
        setValue={setValue}
        commitmentArrow={commitmentArrow}
        depositLoanRates={depositLoanRates}
        commitPeriod={commitPeriod}
        reserves={reserves}
        loadingApprove={loadingApprove}
        loadingDeposit={loadingDeposit}
        handleDeposit={handleDeposit}
        requestDepositTransactionReceipt={requestDepositTransactionReceipt}
        isToastOpen={isToastOpen}
        setIsToastOpen={setIsToastOpen}
        toastParam={toastParam}
      />
    </div>
  );
};

export default Deposit = React.memo(Deposit);

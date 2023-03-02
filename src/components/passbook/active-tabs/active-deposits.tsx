import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  Modal,
  Nav,
  NavItem,
  NavLink,
  Row,
  Table,
  UncontrolledAccordion,
} from "reactstrap";

import Slider from "react-custom-slider";
import arrowDown from "../../../assets/images/ArrowDownDark.svg";
import arrowUp from "../../../assets/images/ArrowUpDark.svg";

import {
  diamondAddress,
  ERC20Abi,
  tokenAddressMap,
  isTransactionLoading,
  tokenDecimalsMap,
  getTokenFromName,
} from "../../../blockchain/stark-constants";
import TxHistoryTable from "../../dashboard/tx-history-table";
import useAddDeposit from "../../../blockchain/hooks/active-deposits/useAddDeposit";
import useWithdrawDeposit from "../../../blockchain/hooks/active-deposits/useWithdrawDeposit";
import ActiveDeposit from "./active-deposts/active-deposit";
import OffchainAPI from "../../../services/offchainapi.service";
import Image from "next/image";
import {
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
  useTransactionReceipt,
} from "@starknet-react/core";
import { Abi, uint256 } from "starknet";
import { ICoin } from "../../dashboard/dashboard-body";
import { MinimumAmount } from "../../../blockchain/constants";
import MySpinner from "../../mySpinner";
import { GetErrorText, NumToBN, etherToWeiBN } from "../../../blockchain/utils";
import { toast } from "react-toastify";
import classnames from "classnames";
import ToastModal from "../../toastModals/customToastModal";
import SupplyModal from "../../modals/supplyModal";

const ActiveDepositsTab = ({
  reserves,
  activeDepositsData,
  modal_add_active_deposit,
  tog_add_active_deposit,
  modal_withdraw_active_deposit,
  tog_withdraw_active_deposit,
  depositRequestSel,
  setInputVal1,
  handleDepositTransactionDone,
  withdrawDepositTransactionDone,
  isTransactionDone,
  inputVal1,
}: {
  reserves: any;
  activeDepositsData: any;
  modal_add_active_deposit: any;
  tog_add_active_deposit: any;
  modal_withdraw_active_deposit: any;
  tog_withdraw_active_deposit: any;
  depositRequestSel: any;
  setInputVal1: any;
  handleDepositTransactionDone: any;
  withdrawDepositTransactionDone: any;
  isTransactionDone: any;
  inputVal1: any;
}) => {
  const Coins: ICoin[] = [
    { name: "USDT", icon: "mdi-bitcoin" },
    { name: "USDC", icon: "mdi-ethereum" },
    { name: "BTC", icon: "mdi-bitcoin" },
    { name: "ETH", icon: "mdi-ethereum" },
    { name: "DAI", icon: "mdi-dai" },
  ];
  const [asset, setAsset] = useState<any>();
  const [historicalAPRs, setHistoricalAPRs] = useState();
  const [tokenName, setTokenName] = useState("BTC");
  const [customActiveTab, setCustomActiveTab] = useState("1");
  const [modal_deposit, setmodal_deposit] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);
  const [depositAmount, setDepositAmount] = useState<number>();
  const [value, setValue] = useState(0);
  const { address: account } = useAccount();
  const [commitPeriod, setCommitPeriod] = useState(0);
  const [transDeposit, setTransDeposit] = useState("");
  const [commitmentDropDown, setCommitmentDropDown] = useState(false);
  const [commitmentArrow, setCommitmentArrow] = useState(arrowDown);
  const [commitmentValue, setCommitmentValue] = useState("Flexible");
  const [depositLoanRates, setDepositLoanRates] = useState<any>();
  const [toastParam, setToastParam] = useState({});
  const [isToastOpen, setIsToastOpen] = useState(false);

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[tokenName] as string,
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
    data: dataBalance,
    loading: loadingBalance,
    error: errorBalance,
    refresh: refreshBalance,
  } = useStarknetCall({
    contract: contract,
    method: "balanceOf",
    args: [account],
    options: {
      watch: true,
    },
  });

  const {
    data: dataUSDC,
    loading: loadingUSDC,
    error: errorUSDC,
    reset: resetUSDC,
    execute: USDC,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[tokenName] as string,
      entrypoint: "approve",
      calldata: [
        diamondAddress,
        etherToWeiBN(
          depositAmount as number,
          tokenAddressMap[tokenName] || ""
        ).toString(),
        0,
      ],
    },
  });

  const {
    data: dataDeposit,
    loading: loadingDeposit,
    error: errorDeposit,
    reset: resetDeposit,
    execute: executeDeposit,
  } = useStarknetExecute({
    calls: [
      {
        contractAddress: tokenAddressMap[tokenName] as string,
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          etherToWeiBN(
            depositAmount as number,
            tokenAddressMap[tokenName] || ""
          ).toString(),
          0,
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "deposit_request",
        calldata: [
          tokenAddressMap[tokenName],
          commitPeriod,
          etherToWeiBN(
            depositAmount as number,
            tokenAddressMap[tokenName] || ""
          ).toString(),
          0,
        ],
      },
    ],
  });

  const requestDepositTransactionReceipt = useTransactionReceipt({
    hash: transDeposit,
    watch: true,
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

  useEffect(() => {
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      console.log("got them", val);
      setDepositLoanRates(val);
    });
  }, []);

  const tog_center = async () => {
    setmodal_deposit(!modal_deposit);
    // removeBodyCss();
  };

  const handleCommitChange = (e: any) => {
    setCommitPeriod(e);
  };

  const toggleDropdown = () => {
    setDropDown(!dropDown);
    setDropDownArrow(dropDown ? arrowDown : arrowUp);
    // disconnectEvent(), connect(connector);
  };

  const handleBalanceChange = async () => {
    await refreshAllowance();
    await refreshBalance();
  };

  const handleDepositAmountChange = (e: any) => {
    setDepositAmount(e.target.value);
    const balance =
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
      10 ** (tokenDecimalsMap[tokenName] || 18);
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

  function isInvalid() {
    return (
      depositAmount < MinimumAmount[tokenName] ||
      depositAmount >
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
          10 ** (tokenDecimalsMap[tokenName] || 18)
    );
  }

  const handleMax = async () => {
    setDepositAmount(
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** (tokenDecimalsMap[asset] || 18)
    );
    setValue(100);
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
    } catch (err) {
      console.log(err, "err deposit");
    }
    if (errorDeposit) {
      toast.error(`${GetErrorText(`Deposit for ${asset} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
  };

  const {
    data: dataApprove,
    loading: loadingApprove,
    reset: resetApprove,
    error: errorApprove,
  } = returnTransactionParameters();

  useEffect(() => {
    OffchainAPI.getHistoricalDepositRates().then((val) => {
      setHistoricalAPRs(val);
    });
  }, []);
  return (
    // Active Deposits
    <div style={{ borderTop: "5px" }}>
      <UncontrolledAccordion
        defaultOpen="0"
        open="false"
        style={{
          margin: "10px",
          textAlign: "left",
          marginLeft: "20px",
        }}
      >
        {Array.isArray(activeDepositsData) && activeDepositsData.length > 0 ? (
          <>
            <Table>
              <Row
                style={{
                  marginLeft: "40px",
                  borderStyle: "hidden",
                  color: "rgb(140, 140, 140)",
                  fontWeight: "300",
                  alignItems: "center",
                  gap: "30px",
                  fontSize: "14px",
                }}
              >
                <Col
                  style={{
                    width: "10px",
                    padding: "20px 10px",
                  }}
                >
                  Supply ID
                </Col>
                <Col
                  style={{
                    width: "100px",
                    padding: "20px 10px",
                  }}
                >
                  Market
                </Col>
                <Col style={{ width: "100px", padding: "20px 10px" }}>
                  Supply Amount
                </Col>
                <Col
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  APR
                </Col>
                <Col
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  MCP
                </Col>
                <Col
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  Status
                </Col>

                <Col
                  scope="col"
                  style={{ width: "100px", padding: "20px 20px" }}
                >
                  Actions
                </Col>
              </Row>
            </Table>

            {activeDepositsData.map((asset, key, allAssets) => {
              return (
                <ActiveDeposit
                  reserves={reserves}
                  key={key}
                  asset={asset}
                  historicalAPRs={historicalAPRs}
                  allAssets={allAssets}
                />
              );
            })}
          </>
        ) : (
          <>
            <div
              style={{
                textAlign: "center",
                margin: "200px auto",
                color: "white",
              }}
            >
              <div>Your Wallet is empty. </div>
              <div
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  setmodal_deposit(true);
                }}
              >
                <u>Purchase or Supply assets.</u>
              </div>
            </div>

            <SupplyModal
              modal_deposit={modal_deposit}
              accountAddress={account}
              toggleDropdown={toggleDropdown}
              tokenName={tokenName}
              setmodal_deposit={setmodal_deposit}
              tog_center={tog_center}
              setCommitmentDropDown={setCommitmentDropDown}
              commitmentDropDown={commitmentDropDown}
              setCommitmentArrow={setCommitmentArrow}
              commitmentValue={commitmentValue}
              dropDown={dropDown}
              Coins={Coins}
              setTokenName={setTokenName}
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
              Downarrow={arrowDown}
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
              requestDepositTransactionReceipt={
                requestDepositTransactionReceipt
              }
              isToastOpen={isToastOpen}
              setIsToastOpen={setIsToastOpen}
              toastParam={toastParam}
            />
          </>
        )}
      </UncontrolledAccordion>
    </div>
  );
};

export default ActiveDepositsTab;

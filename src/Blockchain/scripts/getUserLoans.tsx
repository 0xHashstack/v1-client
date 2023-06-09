import { Contract, Provider, number, shortString } from "starknet";
import { contractsEnv, diamondAddress, getProvider } from "../stark-constants";
import routerAbi from "@/Blockchain/abis/router_abi.json";
import { get } from "http";
import { useAccount } from "@starknet-react/core";
import { useEffect } from "react";

interface ILoans {
  loanMarket: string | undefined;
  loanMarketAddress: string | undefined;
  loanAmount: number;
  commitment: string | null;
  commitmentIndex: number | null;
  collateralMarket: string | undefined;
  collateralAmount: number;
  loanInterest: number;
  interestRate: number;
  account: string | undefined;
  cdr: number;
  debtCategory: number | undefined;
  loanId: number;
  isSwapped: boolean;
  state: string;
  stateType: number;
  currentLoanMarket: string | undefined;
  currentLoanAmount: number;
}

export async function get_user_loans(account: string) {
  const provider = getProvider();
  console.log("user loans", diamondAddress, account)
  const routerContract = new Contract(routerAbi, diamondAddress, provider);
  const res = await routerContract.call("get_user_loans", [account], {
    blockIdentifier: "pending",
  });
  console.log(res, "res")
  // parseLoansData(
  //   res?.loan_records_arr,
  //   res?.collateral_records_arr,
  //   res?.interest_records_arr
  // );
}

import { Contract, number, uint256 } from "starknet";
import { diamondAddress, getProvider, getTokenFromAddress } from "../stark-constants";
import routerAbi from "@/Blockchain/abis/router_abi.json";
import { BNtoNum } from "../utils/utils";
import { getDTokenFromAddress, getRTokenFromAddress } from "../utils/addressServices";
import { ILoan } from "../interfaces/interfaces";

function parseLoansData(
  loansData: any,
  collateralsData: any,
): ILoan[] {
  const loans: ILoan[] = [];
  for (let i = 0; i < loansData?.length; ++i) {
    let loanData = loansData[i];
    let collateralData = collateralsData[i];
    let loan: ILoan  = {
      loanId: Number(BNtoNum(loanData?.id, 0)),
      borrower: number.toHex(loanData?.borrower),

      loanMarket: getDTokenFromAddress(number.toHex(loanData?.market))?.name,
      loanMarketAddress: number.toHex(loanData?.market),
      underlyingMarket: getTokenFromAddress(getDTokenFromAddress(number.toHex(loanData?.market))?.underlying_asset || "")?.name || "",
      underlyingMarketAddress: getDTokenFromAddress(number.toHex(loanData?.market))?.underlying_asset,
      currentLoanMarket: getTokenFromAddress(
        number.toHex(loanData?.current_market)
      )?.name, // Borrow market(current)
      currentLoanMarketAddress: number.toHex(loanData?.current_market),
      collateralMarket: getRTokenFromAddress(
        number.toHex(collateralData?.collateral_token)
      )?.name, //  Collateral Market
      collateralMarketAddress: number.toHex(collateralData?.collateral_token),

      loanAmount: uint256.uint256ToBN(loanData?.amount).toString(), //  Amount
      currentLoanAmount: uint256.uint256ToBN(loanData?.current_amount).toString(), //  Amount
      collateralAmount: uint256
        .uint256ToBN(collateralData?.amount)
        .toString(), // 5 Collateral Amount

      createdAt: new Date(Number(loanData?.created_at)),
  
      state:
        Number(BNtoNum(loanData?.state, 0)) === 1
          ? "OPEN"
          : Number(BNtoNum(loanData?.state, 0)) === 2
          ? "SWAPPED"
          : Number(BNtoNum(loanData?.state, 0)) === 3
          ? "REPAID"
          : Number(BNtoNum(loanData?.state, 0)) === 4
          ? "LIQUIDATED"
          : null,

      l3App:
        number.toBN(loanData?.l3_integration).toString() ===
          "1962660952167394271600"
          ? "jediSwap"
          : number.toBN(loanData?.l3_integration, 0).toString() ===
            "30814223327519088"
            ? "mySwap"
            : null,
      l3_integration: number.toBN(loanData?.l3_integration).toString(),
      l3_category: number.toBN(loanData?.l3_category).toString(),
    };
    loans.push(JSON.parse(JSON.stringify(loan)));
  }
  return loans;
}

export async function getUserLoans(account: string) {
  const provider = getProvider();
  console.log("user loans", diamondAddress, account)
  const routerContract = new Contract(routerAbi, diamondAddress, provider);
  const res = await routerContract.call("get_user_loans", [account], {
    blockIdentifier: "pending",
  });
  console.log(res, "res")
  return parseLoansData(
    res?.loan_records_arr,
    res?.collateral_records_arr,
  );
}

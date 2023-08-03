import { Contract } from "starknet";
import {
  diamondAddress,
  getProvider,
  getRTokenFromAddress,
} from "../stark-constants";
// import routerAbi from "@/Blockchain/abis/router_abi.json";
// import routerAbi from "@/Blockchain/abi_new/router_abi.json";
import routerAbi from "@/Blockchain/abis_upgrade/router_abi.json";
import { BNtoNum, parseAmount } from "../utils/utils";
import { IMarketInfo, NativeToken, RToken } from "../interfaces/interfaces";
import { OraclePrice } from "./getOraclePrices";
import { tokenAddressMap } from "../utils/addressServices";

// Health Factor = (Total Collateral Value in USD + Total Current Loan value in USD) / Total Borrow Value in USD
// In case of taking of a new loan,
// the current loan value == borrowed value of the new loan
// so the formula becomes:
// Health Factor = (Total Collateral Value in USD + Total Borrow Value in USD ) / Total Borrow Value in USD

export async function getExistingLoanHealth(loanId: string) {
  const provider = getProvider();
  try {
    const routerContract = new Contract(routerAbi, diamondAddress, provider);
    const res = await routerContract.call("get_health_factor", [loanId], {
      blockIdentifier: "pending",
    });
    // console.log(
    //   "health factor for loanId",
    //   loanId,
    //   "is",
    //   parseAmount(res?.factor, 5)
    // );
    // console.log(BNtoNum())
    return BNtoNum(res?.factor, 6);
  } catch (error) {
    console.log("health factor error: ", error);
  }
}

export async function getLoanHealth_NativeCollateral(
  loanAmount: number,
  loanMarket: NativeToken,
  collateralAmount: number,
  collateralMarket: NativeToken,
  oraclePrices: OraclePrice[]
) {
  let loanMarketAddress = tokenAddressMap[loanMarket];
  let collateralMarketAddress = tokenAddressMap[collateralMarket];

  const oraclePriceLoanMarket = oraclePrices?.find(
    (oraclePrice) => oraclePrice.address === loanMarketAddress
  );
  const oraclePriceCollateralMarket = oraclePrices?.find(
    (oraclePrice) => oraclePrice.address === collateralMarketAddress
  );

  if (oraclePriceCollateralMarket && oraclePriceLoanMarket) {
    const loanAmountUsd = loanAmount * oraclePriceLoanMarket?.price;
    const collateralAmountUsd =
      collateralAmount * oraclePriceCollateralMarket?.price;

    return (loanAmountUsd + collateralAmountUsd) / loanAmountUsd;
  }
}

export async function getLoanHealth_RTokenCollateral(
  loanAmount: number,
  loanMarket: NativeToken,
  rTokenAmount: number,
  rToken: RToken,
  oraclePrices: OraclePrice[],
  marketInfos: IMarketInfo[]
) {
  let loanMarketAddress = tokenAddressMap[loanMarket];

  const collateralMarketAddress: RToken = getRTokenFromAddress(
    tokenAddressMap[rToken]
  )?.underlying_asset as RToken;
  // console.log(collateralMarket,"market in loan")
  // let collateralMarketAddress = tokenAddressMap[collateralMarket];

  const oraclePriceLoanMarket = oraclePrices.find(
    (oraclePrice) => oraclePrice.address === loanMarketAddress
  );
  const oraclePriceCollateralMarket = oraclePrices.find(
    (oraclePrice) => oraclePrice.address === collateralMarketAddress
  );
  const marketInfoCollateralMarket = marketInfos.find(
    (marketInfo) => marketInfo.tokenAddress === collateralMarketAddress
  );

  // console.log(oraclePriceCollateralMarket,"data loan health")

  if (
    oraclePriceCollateralMarket &&
    oraclePriceLoanMarket &&
    marketInfoCollateralMarket
  ) {
    let collateralAmount =
      rTokenAmount * marketInfoCollateralMarket?.exchangeRateRtokenToUnderlying;
    const loanAmountUsd = loanAmount * oraclePriceLoanMarket?.price;
    const collateralAmountUsd =
      collateralAmount * oraclePriceCollateralMarket?.price;

    return (loanAmountUsd + collateralAmountUsd) / loanAmountUsd;
  }
}

import { Contract } from "starknet";
import { diamondAddress, getProvider, getRTokenFromAddress } from "../stark-constants";
import routerAbi from "@/Blockchain/abis/router_abi.json";
import { BNtoNum } from "../utils/utils";
import { IMarketInfo, NativeToken, RToken } from "../interfaces/interfaces";
import { OraclePrice } from "./getOraclePrices";
import { tokenAddressMap } from "../utils/addressServices";

export async function getExistingLoanHealth(loanId: string) {
  const provider = getProvider();
  try {
    const routerContract = new Contract(routerAbi, diamondAddress, provider);
    const res = await routerContract.call("get_health_factor", [loanId], {
      blockIdentifier: "pending",
    });
    console.log("health factor: ", res, res?.factor)
    return BNtoNum(res?.factor, 6);
  }
  catch (error) {
    console.log(error);
  }
}


export async function getLoanHealth_NativeCollateral(
  loanAmount:number, 
  loanMarket: NativeToken, 
  collateralAmount: number,   
  collateralMarket: NativeToken, 
  oraclePrices: OraclePrice[], 
) {
  let loanMarketAddress = tokenAddressMap[loanMarket];
  let collateralMarketAddress = tokenAddressMap[collateralMarket];

  const oraclePriceLoanMarket = oraclePrices.find(oraclePrice => oraclePrice.address === loanMarketAddress);
  const oraclePriceCollateralMarket = oraclePrices.find(oraclePrice => oraclePrice.address === collateralMarketAddress);

  if(oraclePriceCollateralMarket && oraclePriceLoanMarket) {
    const loanAmountUsd = loanAmount * oraclePriceLoanMarket?.price;
    const collateralAmountUsd = collateralAmount * oraclePriceCollateralMarket?.price;

    return loanAmountUsd/collateralAmountUsd;
  }
}

export async function getLoanHealth_RTokenCollateral(
  loanAmount:number, 
  loanMarket: NativeToken, 
  rTokenAmount: number, 
  rToken: RToken, 
  oraclePrices: OraclePrice[], 
  marketInfos: IMarketInfo[]
) {
  let loanMarketAddress = tokenAddressMap[loanMarket];

  const collateralMarket: NativeToken = getRTokenFromAddress(tokenAddressMap[rToken])?.underlying_asset as NativeToken;
  let collateralMarketAddress = tokenAddressMap[collateralMarket];

  const oraclePriceLoanMarket = oraclePrices.find(oraclePrice => oraclePrice.address === loanMarketAddress);
  const oraclePriceCollateralMarket = oraclePrices.find(oraclePrice => oraclePrice.address === collateralMarketAddress);
  const marketInfoCollateralMarket = marketInfos.find(marketInfo => marketInfo.tokenAddress === collateralMarketAddress);
  
  
  if(oraclePriceCollateralMarket && oraclePriceLoanMarket && marketInfoCollateralMarket) {
    let collateralAmount = rTokenAmount * marketInfoCollateralMarket?.exchangeRateRtokenToUnderlying;
    const loanAmountUsd = loanAmount * oraclePriceLoanMarket?.price;
    const collateralAmountUsd = collateralAmount * oraclePriceCollateralMarket?.price;

    return loanAmountUsd/collateralAmountUsd;
  }
}
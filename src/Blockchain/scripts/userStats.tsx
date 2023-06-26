import { Contract, uint256 } from "starknet";
import { IDeposit, ILoan, IMarketInfo, IUserStats } from "../interfaces/interfaces";
import metricsAbi from "../abis/metrics_abi.json";
import borrowTokenAbi from "../abis/dToken_abi.json"
import { getProvider, metricsContractAddress } from "../stark-constants";
import { parseAmount, weiToEtherNumber } from "../utils/utils";
import { OraclePrice, getOraclePrices } from "./getOraclePrices";

// function parseUserStats(
//   userStatsData: any,
// ): IUserStats {
//   let userStats: IUserStats = {
//     netWorth: parseAmount(uint256.uint256ToBN(userStatsData?.net_worth).toString(), 8),
//     yourSupply: parseAmount(uint256.uint256ToBN(userStatsData?.your_supply).toString(), 8),
//     yourBorrow: parseAmount(uint256.uint256ToBN(userStatsData?.your_borrow).toString(), 8),
//     netSupplyAPR: parseAmount(uint256.uint256ToBN(userStatsData?.net_supply_apr).toString(), 10),
//     netBorrowAPR: parseAmount(uint256.uint256ToBN(userStatsData?.net_borrow_apr).toString(), 10),
//   };
//   return userStats;
// }

// export async function getUserReserves(accountAddress: string) {
//   const provider = getProvider();
//   const metricsContract = new Contract(metricsAbi, metricsContractAddress, provider);
//   const res = await metricsContract.call("get_user_stats", [accountAddress], {
//     blockIdentifier: "pending",
//   });
//   return parseUserStats(
//     res?.protocol_reserves,
//   );
// }

export function getTotalSupply(deposits: IDeposit[], oraclePrices: OraclePrice[]): number {
  let totalSupply = 0;
  for (let deposit of deposits) {
    const oraclePrice = oraclePrices.find(oraclePrice => oraclePrice.address === deposit.tokenAddress);
    if (oraclePrice) {
      totalSupply += deposit.underlyingAssetAmountParsed * oraclePrice.price;
    }
  }
  return totalSupply;
}


export async function getTotalBorrow(loans: ILoan[], oraclePrices: OraclePrice[], marketInfos: IMarketInfo[]) {
  let totalBorrow = 0;
  let totalCurrentAmount = 0;
  for (let loan of loans) {

    if(loan.loanState === "REPAID" || loan.loanState === "LIQUIDATED" || loan.loanState === null) continue;

    const oraclePrice = oraclePrices.find(oraclePrice => oraclePrice.address === loan.underlyingMarketAddress);
    let exchangeRate = marketInfos.find(marketInfo => marketInfo.tokenAddress === loan.underlyingMarketAddress)?.exchangeRateDTokenToUnderlying;
    if (oraclePrice && exchangeRate) {
      let loanAmoungUnderlying = loan.loanAmountParsed * exchangeRate;
      totalBorrow += loanAmoungUnderlying * oraclePrice.price;

      if(loan.loanState === "ACTIVE") {
        totalCurrentAmount += loan.currentLoanAmountParsed * oraclePrice.price;
      }
      else if(loan.loanState === "SPENT") {
        try {
          let l3UsdtValue = await getL3USDTValue(loan.loanId, loan.loanMarketAddress as string);
          totalCurrentAmount += l3UsdtValue;
        }
        catch(e) {
          console.log("error getting l3 usdt value: ", e);
        }
      }
    }
  }
  return {totalBorrow, totalCurrentAmount};
}

export async function getL3USDTValue(loanId: number, loanMarketAddress: string) {

  console.log("calling getL3USDTValue with: ", loanId, loanMarketAddress)

  const provider = getProvider();
  const borrowToken = new Contract(borrowTokenAbi, loanMarketAddress, provider);
  const res = await borrowToken.call("get_l3_usdt_value", [loanId], {
    blockIdentifier: "pending",
  });
  console.log("l3 usdt value: ", res, res?.value);
  let usdValue = parseAmount(uint256.uint256ToBN(res?.value).toString(), 6);
  return usdValue;
}

export async function getNetworth(totalSupply: number, totalBorrow: number, totalCurrentAmount: number) {
  const netWorth = totalSupply + totalCurrentAmount - totalBorrow;
  return netWorth;
}


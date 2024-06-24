import { Contract, uint256 } from "starknet";
import {
  IDeposit,
  ILoan,
  IMarketInfo,
  IUserStats,
} from "../interfaces/interfaces";
// import borrowTokenAbi from "../abis/dToken_abi.json";
// import borrowTokenAbi from "../abi_new/dToken_abi.json";
// import borrowTokenAbi from "../abis_upgrade/dToken_abi.json";
import borrowTokenAbi from "../abis_mainnet/dToken_abi.json";
import {
  getProvider,
  getRTokenFromAddress,
  getTokenFromAddress,
  metricsContractAddress,
} from "../stark-constants";
import { parseAmount, weiToEtherNumber } from "../utils/utils";
import { OraclePrice, getOraclePrices } from "./getOraclePrices";
import dollarConvertor from "@/utils/functions/dollarConvertor";
import { useState } from "react";

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

export function getTotalSupply(
  deposits: IDeposit[],
  oraclePrices: OraclePrice[]
): number {
  let totalSupply = 0;
  for (let deposit of deposits) {
    const oraclePrice = oraclePrices.find(
      (oraclePrice) => oraclePrice.address === deposit.tokenAddress
    );
    if (oraclePrice) {
      totalSupply += deposit.underlyingAssetAmountParsed * oraclePrice.price;
    }
  }
  return totalSupply;
}

export async function getTotalBorrow(
  loans: ILoan[],
  oraclePrices: OraclePrice[],
  marketInfos: IMarketInfo[]
) {
  let totalBorrow = 0;
  let totalCurrentAmount = 0;
  for (let loan of loans) {
    if (
      loan.loanState === "REPAID" ||
      loan.loanState === "LIQUIDATED" ||
      loan.loanState === null
    )
      continue;

    const oraclePrice = oraclePrices.find(
      (oraclePrice) => oraclePrice.address === loan.underlyingMarketAddress
    );
    let exchangeRate = marketInfos.find(
      (marketInfo) => marketInfo.tokenAddress === loan.underlyingMarketAddress
    )?.exchangeRateDTokenToUnderlying;
    if (oraclePrice && exchangeRate) {
      let loanAmoungUnderlying = loan.loanAmountParsed * exchangeRate;
      totalBorrow += loanAmoungUnderlying * oraclePrice.price;
      ////console.log(
      //   "total borrow loan ID ",
      //   loan?.loanId,
      //   " is ",
      //   loanAmoungUnderlying * oraclePrice.price,
      //   totalBorrow
      // );
      if (loan.loanState === "ACTIVE") {
        totalCurrentAmount += loan.currentLoanAmountParsed * oraclePrice.price;
      } else if (loan.loanState === "SPENT") {
        try {
          let l3UsdtValue = await getL3USDTValue(
            loan.loanId,
            loan.loanMarketAddress as string
          );
          totalCurrentAmount += l3UsdtValue;
        } catch (e) {
         //console.log("error getting l3 usdt value: ", e);
        }
      }
    }
  }
  return { totalBorrow, totalCurrentAmount };
}

// All borrow token are separate contracts
// all supply vaults(rTokens) are sepaarate contracts
// staking is a separate contract

export async function getL3USDTValue(
  loanId: number,
  loanMarketAddress: string
) {
  ////console.log("calling getL3USDTValue with: ", loanId, loanMarketAddress);

  const provider = getProvider();
  const borrowToken = new Contract(borrowTokenAbi, loanMarketAddress, provider);
  const res:any = await borrowToken.call("get_l3_usdt_value", [loanId], {
    blockIdentifier: "pending",
  });
  ////console.log("l3 usdt value: ", res, res?.value);
  let usdValue = parseAmount(uint256.uint256ToBN(res?.value).toString(), 6);
  return usdValue;
}

export async function getNetworth(
  totalSupply: number,
  totalBorrow: number,
  totalCurrentAmount: number
) {
  ////console.log(
  //   "getNetworth calling",
  //   totalSupply,
  //   totalBorrow,
  //   totalCurrentAmount
  // );

  const netWorth = totalSupply + totalCurrentAmount - totalBorrow;

  return netWorth;
}
export const getBoostedAprSupply = (coin: string,strkData:any,oraclePrices:any) => {
  if (strkData == null) {
    return 0;
  } else {
    if (strkData?.[coin]) {
      if (oraclePrices == null) {
        return 0;
      } else {
        let value = strkData?.[coin]
          ? (365 *
              100 *
              strkData?.[coin][strkData[coin]?.length - 1]?.allocation *
              0.7 *
              oraclePrices?.find((curr: any) => curr.name === "STRK")
                ?.price) /
            strkData?.[coin][strkData[coin].length - 1]?.supply_usd
          : 0;
        return value;
      }
    } else {
      return 0;
    }
  }
};
export const getBoostedApr = (coin: any,strkData:any,oraclePrices:any,netSpendBalance:any) => {
  let netStrkBorrow=0
  if (strkData != null) {
    let netallocation = 0;
    for (let token in strkData) {
      if (strkData.hasOwnProperty(token)) {
        const array = strkData[token];
        const lastObject = array[array.length - 1];
        netallocation += 0.3 * lastObject.allocation;
      }
    }
    netStrkBorrow=netallocation;
  } else {
    netStrkBorrow=0;
  }
  if (strkData == null) {
    return 0;
  } else {
    if (strkData?.[coin]) {
      if (oraclePrices == null) {
        return 0;
      } else {
        if (netStrkBorrow != 0) {
          if (netSpendBalance) {
            let value =
              (365 *
                100 *
                netStrkBorrow *
                oraclePrices?.find((curr: any) => curr.name === "STRK")
                  ?.price) /
              netSpendBalance;
            return value;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      }
    } else {
      return 0;
    }
  }
};
export const getAprByPool = (dataArray: any[], pool: string, l3App: string) => {
  const matchedObject = dataArray.find((item) => {
    if (item.name === "USDT/USDC") {
      return item.amm === "jedi" && "USDC/USDT" === pool;
    } else if (item.name == "ETH/STRK") {
      return item.amm === "jedi" && "STRK/ETH" === pool;
    } else if (item.name === "ETH/DAI") {
      return item.amm === "jedi" && "DAI/ETH" === pool;
    } else {
      return (
        item.name === pool &&
        item.amm === (l3App == 'JEDI_SWAP' ? 'jedi' : l3App=='ZKLEND' ?'zklend': 'myswap')
      );
    }
  });
  return matchedObject ? matchedObject.apr * 100 : 0;
};
export const getStrkAlloaction = (pool: any,strkTokenAlloactionData:any) => {
  try {
    if (strkTokenAlloactionData[pool]) {
      return strkTokenAlloactionData[pool][
        strkTokenAlloactionData[pool].length - 1
      ]?.allocation;
    } else {
      return 0;
    }
  } catch (err) {
    return 0;
  }
};
export const getTvlByPool = (dataArray: any[], pool: string, l3App: string) => {
  const matchedObject = dataArray.find((item) => {
    if (item.name === "USDT/USDC") {
      return item.amm === "jedi" && "USDC/USDT" === pool;
    } else if (item.name == "ETH/STRK") {
      return item.amm === "jedi" && "STRK/ETH" === pool;
    } else if (item.name === "ETH/DAI") {
      return item.amm === "jedi" && "DAI/ETH" === pool;
    } else {
      return (
        item.name === pool &&
        item.amm === (l3App == 'JEDI_SWAP' ? 'jedi' : l3App=='ZKLEND' ?'zklend': 'myswap')
      );
    }
  });
  return matchedObject ? matchedObject.tvl : 0;
};
export async function getNetAprDeposits(
  deposits: IDeposit[],
  oraclePrices: OraclePrice[],
  marketInfos: IMarketInfo[],
  strkData: any
) {
  let totalSupply = 0,
    netSupplyInterest = 0;
  for (let deposit of deposits) {
    const oraclePrice = oraclePrices?.find(
      (oraclePrice) => oraclePrice?.address === deposit?.tokenAddress
    );
    let market_info = marketInfos.find(
      (market_info) => market_info?.tokenAddress === deposit?.tokenAddress
    );
    if (oraclePrice && market_info && strkData) {
      let depositAmountUsd =
        deposit.underlyingAssetAmountParsed * oraclePrice.price;
      totalSupply += depositAmountUsd;
      netSupplyInterest += depositAmountUsd * (market_info.supplyRate+getBoostedAprSupply(deposit?.token,strkData,oraclePrices));
    }
  }

  let netApr =
    (netSupplyInterest != 0 && totalSupply != 0
      ? netSupplyInterest / totalSupply
      : 0) 


  return netApr.toFixed(2);
}
export async function getNetAprLoans(
  loans: any[],
  oraclePrices: OraclePrice[],
  marketInfos: any,
  avgs:any,
  strkData:any,
  poolAprs:any,
  allSplit:any,
  strkAllocationData:any,
  netSpendBalance:any,
  zkLendSpends:any,
) { 

  let totalBorrowCollateral = 0,
    netBorrowInterest = 0;
    let netApr: number = 0;
    let netaprs=[];
    let effectiveaprs=[{}];
  for (let loan of loans) {
    if (
      loan.loanState === "REPAID" ||
      loan.loanState === null
    )
      continue;

    const oraclePrice = oraclePrices.find(
      (oraclePrice) => oraclePrice.address === loan.underlyingMarketAddress
    );
    let market_info = marketInfos.find(
      (marketInfo:any) => marketInfo.tokenAddress === loan.underlyingMarketAddress
    );
    let avgs_info = avgs?.find(
      (avgs:any) => avgs?.loanId === loan.loanId
    );
    let split_info=allSplit?.find(
      (splits:any)=>splits.loanId === loan.loanId
    )
    let strk_price=oraclePrices?.find((curr: any) => curr.name === "STRK")?.price
    // return 0;
    let loanMarket=loan.loanMarket
    if (oraclePrice && market_info && strkData && poolAprs) {
      totalBorrowCollateral+=((dollarConvertor(
        loan?.collateralAmountParsed,
        loan?.collateralMarket.slice(1),
        oraclePrices
      )) *
      marketInfos?.find(
        (val: any) => val?.token == loan?.collateralMarket.slice(1)
      )?.exchangeRateRtokenToUnderlying);
      let aprs =
      loan?.spendType == "LIQUIDITY"
        ? Number(
            avgs?.find((item: any) => item?.loanId == loan?.loanId)?.avg
          ) +
          getBoostedAprSupply(loan?.collateralMarket.slice(1),strkData,oraclePrices) +
          ( ((getBoostedApr(loan?.loanMarket.slice(1),strkData,oraclePrices,netSpendBalance)*dollarConvertor(
            loan?.loanAmountParsed,
            loan?.loanMarket.slice(1),
            oraclePrices
          )) *
          market_info?.exchangeRateDTokenToUnderlying/dollarConvertor(
            loan?.collateralAmountParsed,
            loan?.collateralMarket.slice(1),
            oraclePrices
          )) *
          marketInfos?.find(
            (val: any) => val?.token == loan?.collateralMarket.slice(1)
          )?.exchangeRateRtokenToUnderlying)+
          (((getAprByPool(
            poolAprs,
            loan?.l3App=="ZKLEND" ?loan.loanMarket.slice(1): split_info?.tokenA +
              "/" +
              split_info?.tokenB,
            loan?.l3App
          ) +
            
            (100 *
              365 *
              (strk_price ? strk_price:0) *
              getStrkAlloaction(
                split_info?.tokenA +
                  "/" +
                  split_info?.tokenB
              ,strkAllocationData)) /
              getTvlByPool(
                poolAprs,
                loan?.l3App=="ZKLEND" ?loan.loanMarket.slice(1):split_info?.tokenA +
                  "/" +
                  split_info?.tokenB,
                loan?.l3App
              )) *
            (loan?.l3App=="ZKLEND"?zkLendSpends?.find(
              (val: any) =>
                val?.BorrowId ==
                loan?.loanId
            )?.SpendValue:(dollarConvertor(
              split_info?.amountA,
              split_info?.tokenA,
              oraclePrices
            ) +
              dollarConvertor(
                split_info?.amountB,
                split_info?.tokenB,
                oraclePrices
              )))) /
            dollarConvertor(
              loan?.collateralAmountParsed,
              loan?.collateralMarket.slice(1),
              oraclePrices
            )) *
            marketInfos?.find(
              (val: any) => val?.token == loan?.collateralMarket.slice(1)
            )?.exchangeRateRtokenToUnderlying
        : loan?.spendType == "UNSPENT"
        ? Number(
            avgs?.find((item: any) => item?.loanId == loan?.loanId)?.avg
          ) + ((getBoostedAprSupply(loan?.collateralMarket.slice(1),strkData,oraclePrices)))
        : loan?.spendType == "SWAP" ? Number(
            avgs?.find((item: any) => item?.loanId == loan?.loanId)?.avg
          ) +
          ((getBoostedAprSupply(loan?.collateralMarket.slice(1),strkData,oraclePrices))) +
          (((getBoostedApr(loan?.loanMarket.slice(1),strkData,oraclePrices,netSpendBalance)*dollarConvertor(
            loan?.loanAmountParsed,
            loan?.loanMarket.slice(1),
            oraclePrices
          )) *
          market_info?.exchangeRateDTokenToUnderlying/dollarConvertor(
            loan?.collateralAmountParsed,
            loan?.collateralMarket.slice(1),
            oraclePrices
          )) *
          marketInfos?.find(
            (val: any) => val?.token == loan?.collateralMarket.slice(1)
          )?.exchangeRateRtokenToUnderlying):0;
          let data={
            loanId:loan?.loanId,
            apr:aprs
          }
          effectiveaprs.push(data)
          netApr = netApr + ((aprs*dollarConvertor(
            loan?.collateralAmountParsed,
            loan?.collateralMarket.slice(1),
            oraclePrices
          )) *
          marketInfos?.find(
            (val: any) => val?.token == loan?.collateralMarket.slice(1)
          )?.exchangeRateRtokenToUnderlying);
        }
      }
  return {
    netApr:(netApr/totalBorrowCollateral).toFixed(2),
    effectiveAprs:effectiveaprs
  };
}
export async function getNetApr(
  deposits: IDeposit[],
  loans: ILoan[],
  oraclePrices: OraclePrice[],
  marketInfos: IMarketInfo[],
  strkData:any,
  borrowEffectiveAprs:any
) {
  let totalSupply = 0,
    netSupplyInterest = 0;
  for (let deposit of deposits) {
    const oraclePrice = oraclePrices?.find(
      (oraclePrice) => oraclePrice?.address === deposit?.tokenAddress
    );
    let market_info = marketInfos.find(
      (market_info) => market_info?.tokenAddress === deposit?.tokenAddress
    );
    if (oraclePrice && market_info && strkData) {
      let depositAmountNotLockedUsd =
        (deposit.rTokenFreeParsed+deposit.rTokenStakedParsed) * oraclePrice.price;
      totalSupply += depositAmountNotLockedUsd;
      netSupplyInterest += depositAmountNotLockedUsd * (market_info.supplyRate+getBoostedAprSupply(deposit?.token,strkData,oraclePrices));
    }
  }

  let totalBorrow = 0,
    netBorrowInterest = 0,
    totalBorrowCollateral=0;
  for (let loan of loans) {
    if (
      loan.loanState === "REPAID" ||
      loan.loanState === null
      )
      continue;
    const oraclePrice = oraclePrices.find(
      (oraclePrice) => oraclePrice.name ===   (loan.collateralMarket ?loan.collateralMarket.slice(1):loan.collateralMarket)
    );
    let market_info = marketInfos.find(
      (marketInfo) => marketInfo.token=== (loan.collateralMarket ?loan.collateralMarket.slice(1):loan.collateralMarket)
    );
    let effectiveaprinfo=borrowEffectiveAprs.find(
      (apr: any)=>apr.loanId===loan.loanId
    )
    if (oraclePrice && market_info) {
      let loanAmountUnderlying =
        loan.loanAmountParsed * market_info.exchangeRateDTokenToUnderlying;
      let loanAmountUsd = loanAmountUnderlying * oraclePrice.price;
      let collateralAmountUnderlying=loan.collateralAmountParsed *market_info.exchangeRateRtokenToUnderlying;
      let collateralAmountUsd=collateralAmountUnderlying* oraclePrice.price;


      totalBorrowCollateral+=collateralAmountUsd;
      totalBorrow += loanAmountUsd;
      netBorrowInterest += (collateralAmountUsd * effectiveaprinfo.apr);
    }
  }
  let netApr =
    (((netSupplyInterest != 0 
      ? netSupplyInterest 
      : 0) +
    (netBorrowInterest != 0 
      ? netBorrowInterest 
      : 0))/(totalSupply+totalBorrowCollateral));


  return netApr.toFixed(2);
}

export async function effectivAPRLoan(
  loan: ILoan,
  marketInfos: IMarketInfo[],
  oraclePrices: OraclePrice[]
) {
  if (
    loan?.loanState === "REPAID" ||
    loan?.loanState === "LIQUIDATED" ||
    loan?.loanState === null
  )
    return 0;
  const oraclePriceLoanMarket = oraclePrices?.find(
    (oraclePrice) => oraclePrice?.address === loan?.underlyingMarketAddress
  );
  const marketInfoLoanMarket = marketInfos?.find(
    (marketInfo) => marketInfo?.tokenAddress === loan?.underlyingMarketAddress
  );

  const collateralMarket = getRTokenFromAddress(
    loan?.collateralMarketAddress as string
  )?.underlying_asset;
  const oraclePriceCollateralMarket = oraclePrices?.find(
    (oraclePrice) => oraclePrice?.address === collateralMarket
  );
  const marketInfoCollateralMarket = marketInfos.find(
    (marketInfo) => marketInfo?.tokenAddress === collateralMarket
  );

  if (
    oraclePriceLoanMarket &&
    marketInfoLoanMarket &&
    oraclePriceCollateralMarket &&
    marketInfoCollateralMarket
  ) {
    let loanAmountUnderlying =
      loan.loanAmountParsed *
      marketInfoLoanMarket?.exchangeRateDTokenToUnderlying;
    let loanAmountUsd = loanAmountUnderlying * oraclePriceLoanMarket?.price;
    let borrowInterest = loanAmountUsd * marketInfoLoanMarket?.borrowRate;

    let collateralAmountUsd =
      loan.collateralAmountParsed *
      marketInfoCollateralMarket?.exchangeRateRtokenToUnderlying *
      oraclePriceCollateralMarket?.price;
    let collateralInterest =
      collateralAmountUsd * marketInfoCollateralMarket?.supplyRate;

    let effectiveAPR = (-borrowInterest + collateralInterest) / collateralAmountUsd;
    let effectiveAprPool=(-borrowInterest+collateralInterest)/collateralAmountUsd;
    if(loan?.spendType=="LIQUIDITY"){
      return effectiveAprPool?.toFixed(2);
    }
    return effectiveAPR?.toFixed(2);
  }
}

export async function effectiveAprDeposit(
  deposit: IDeposit,
  marketInfos: IMarketInfo[]
) {
  const marketInfo = marketInfos?.find(
    (marketInfo) => marketInfo?.tokenAddress === deposit?.tokenAddress
  );
  if (marketInfo) {
    let rTokenInterest = deposit?.rTokenAmountParsed * marketInfo?.supplyRate;
    let stakingInterest = deposit?.rTokenStakedParsed * marketInfo?.stakingRate;
    let rTokenTotal = deposit?.rTokenAmountParsed + deposit?.rTokenStakedParsed;

    return (rTokenInterest + stakingInterest) / rTokenTotal;
  }
}

//!Data Oracle

//!Data Deposit

import { Contract, number, uint256 } from "starknet";
import { getProvider, getTokenFromAddress, metricsContractAddress } from "../stark-constants";
import metricsAbi from "../abis/metrics_abi.json";
import { IMarketInfo, IProtocolReserves, NativeToken } from "../interfaces/interfaces";
import { parseAmount, weiToEtherNumber } from "../utils/utils";

function parseProtocolStats(market_infos: any): IMarketInfo[] {
  const marketStats: IMarketInfo[] = [];
  for (let i = 0; i < market_infos?.length; ++i) {
    let marketData = market_infos[i];
    let marketInfo: IMarketInfo = {
      borrowRate: parseAmount(uint256.uint256ToBN(marketData?.borrow_rate).toString(), 2),
      supplyRate: parseAmount(uint256.uint256ToBN(marketData?.supply_rate).toString(), 2),
      stakingRate: parseAmount(uint256.uint256ToBN(marketData?.staking_rate).toString(), 2),

      totalSupply: uint256.uint256ToBN(marketData?.total_supply).toString(),
      lentAssets: uint256.uint256ToBN(marketData?.lent_assets).toString(),
      totalBorrow: uint256.uint256ToBN(marketData?.total_borrow).toString(),
      utilisationPerMarket: uint256
        .uint256ToBN(marketData?.utilisation_per_market)
        .toString(),

      exchangeRateRtokenToUnderlying: parseAmount(
        uint256
          .uint256ToBN(marketData?.exchange_rate_rToken_to_asset)
          .toString(),
        18
      ),
      exchangeRateDTokenToUnderlying: parseAmount(
        uint256
          .uint256ToBN(marketData?.exchange_rate_dToken_to_asset)
          .toString(),
        18
      ),
      exchangeRateUnderlyingToRtoken: parseAmount(
        uint256
         .uint256ToBN(marketData?.exchange_rate_asset_to_rToken)
         .toString(),
        18
      ),
      exchangeRateUnderlyingToDtoken: parseAmount(
        uint256
          .uint256ToBN(marketData?.exchange_rate_asset_to_dToken)
          .toString(),
        18
      ),

      tokenAddress: number.toHex(marketData?.token_address),
      token: getTokenFromAddress(number.toHex(marketData?.token_address))?.name as NativeToken,
    };
    marketStats.push(JSON.parse(JSON.stringify(marketInfo)));
  }
  console.log("all market stats", marketStats);
  return marketStats;
}

export async function getProtocolStats() {
  const provider = getProvider();
  const metricsContract = new Contract(
    metricsAbi,
    metricsContractAddress,
    provider
  );
  const res = await metricsContract.call("get_protocol_stats", [], {
    blockIdentifier: "pending",
  });
  return parseProtocolStats(res?.market_infos);
}

function parseProtocolReserves(protocolReservesData: any): IProtocolReserves {
  let protocolReserves: IProtocolReserves = {
    totalReserves: uint256
      .uint256ToBN(protocolReservesData?.total_reserves)
      .toString(),
    availableReserves: uint256
      .uint256ToBN(protocolReservesData?.available_reserves)
      .toString(),
    avgAssetUtilisation: uint256
      .uint256ToBN(protocolReservesData?.avg_asset_utilisation)
      .toString(),
  };
  return protocolReserves;
}

export async function getProtocolReserves() {
  const provider = getProvider();
  const metricsContract = new Contract(
    metricsAbi,
    metricsContractAddress,
    provider
  );
  const res = await metricsContract.call("get_protocol_reserves", [], {
    blockIdentifier: "pending",
  });
  return parseProtocolReserves(res?.protocol_reserves);
}

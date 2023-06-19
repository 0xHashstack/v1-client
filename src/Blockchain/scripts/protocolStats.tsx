import { Contract, number, uint256 } from "starknet";
import { getProvider, getTokenFromAddress, metricsContractAddress } from "../stark-constants";
import metricsAbi from "../abis/metrics_abi.json";
import { IMarketInfo, IProtocolReserves, NativeToken } from "../interfaces/interfaces";

function parseProtocolStats(market_infos: any): IMarketInfo[] {
  const marketStats: IMarketInfo[] = [];
  for (let i = 0; i < market_infos?.length; ++i) {
    let marketData = market_infos[i];
    let marketInfo: IMarketInfo = {
      borrowRate: uint256.uint256ToBN(marketData?.borrow_rate).toString(),
      supplyRate: uint256.uint256ToBN(marketData?.supply_rate).toString(),
      stakingRate: uint256.uint256ToBN(marketData?.staking_rate).toString(),

      totalSupply: uint256.uint256ToBN(marketData?.total_supply).toString(),
      lentAssets: uint256.uint256ToBN(marketData?.lent_assets).toString(),
      totalBorrow: uint256.uint256ToBN(marketData?.total_borrow).toString(),
      utilisationPerMarket: uint256
        .uint256ToBN(marketData?.utilisation_per_market)
        .toString(),

      exchangeRateRtokenToUnderlying: uint256
        .uint256ToBN(marketData?.exchange_rate_rToken_to_asset)
        .toString(),
      exchangeRateDTokenToUnderlying: uint256
        .uint256ToBN(marketData?.exchange_rate_dToken_to_asset)
        .toString(),
      exchangeRateUnderlyingToRtoken: uint256
        .uint256ToBN(marketData?.exchange_rate_asset_to_rToken)
        .toString(),
      exchangeRateUnderlyingToDtoken: uint256
        .uint256ToBN(marketData?.exchange_rate_asset_to_dToken)
        .toString(),

      tokenAddress: number.toHex(marketData?.token_address),
      token: getTokenFromAddress(number.toHex(marketData?.token_address))?.name as NativeToken,
    };
    marketStats.push(JSON.parse(JSON.stringify(marketInfo)));
  }
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

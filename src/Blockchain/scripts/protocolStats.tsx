import { Contract, number, uint256 } from "starknet";
import { contractsEnv, getProvider, getTokenFromAddress, metricsContractAddress } from "../stark-constants";
import metricsAbi from "../abis/metrics_abi.json";
import { IMarketInfo, IProtocolReserves, NativeToken, Token } from "../interfaces/interfaces";
import { parseAmount, weiToEtherNumber } from "../utils/utils";

function parseProtocolStat(marketData: any): IMarketInfo {
  let marketInfo: IMarketInfo = {
    borrowRate: parseAmount(uint256.uint256ToBN(marketData?.borrow_rate).toString(), 2),
    supplyRate: parseAmount(uint256.uint256ToBN(marketData?.supply_rate).toString(), 2),
    stakingRate: parseAmount(uint256.uint256ToBN(marketData?.staking_rate).toString(), 2),

    totalSupply: weiToEtherNumber(
      uint256.uint256ToBN(marketData?.total_supply).toString(),
      getTokenFromAddress(number.toHex(marketData?.token_address))?.name as Token
    ),
    lentAssets: weiToEtherNumber(
      uint256.uint256ToBN(marketData?.lent_assets).toString(),
      getTokenFromAddress(number.toHex(marketData?.token_address))?.name as Token
    ),
    totalBorrow: weiToEtherNumber(
      uint256.uint256ToBN(marketData?.total_borrow).toString(),
      getTokenFromAddress(number.toHex(marketData?.token_address))?.name as Token
    ),
    availableReserves: weiToEtherNumber(
      uint256.uint256ToBN(marketData?.total_supply).sub(
        uint256.uint256ToBN(marketData?.total_borrow)
      ).toString(),
      getTokenFromAddress(number.toHex(marketData?.token_address))?.name as Token
    ),
    utilisationPerMarket: parseAmount(uint256
      .uint256ToBN(marketData?.utilisation_per_market)
      .toString(),
      2
    ),

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
  return marketInfo;
}

export async function getProtocolStats() {
  const marketStats: IMarketInfo[] = [];
  const provider = getProvider();
  const metricsContract = new Contract(
    metricsAbi,
    metricsContractAddress,
    provider
  );
  for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
    const token = contractsEnv.TOKENS[i];

    console.log('get_protocol_stat for token: ', token.name);
    const res = await metricsContract.call("get_protocol_stat", [token.address], {
      blockIdentifier: "pending",
    });
    console.log("get_protocol_stat finished for token: ", token.name, res?.market_info);
    const market_info = parseProtocolStat(res?.market_info);
    marketStats.push(market_info);
  }
  return marketStats;
}


function parseProtocolReserves(protocolReservesData: any): IProtocolReserves {
  let protocolReserves: IProtocolReserves = {
    totalReserves: parseAmount(uint256
      .uint256ToBN(protocolReservesData?.total_reserves)
      .toString(),
      26
    ),
    availableReserves: parseAmount(uint256
      .uint256ToBN(protocolReservesData?.available_reserves)
      .toString(),
      26
    ),
    avgAssetUtilisation: parseAmount(uint256
      .uint256ToBN(protocolReservesData?.avg_asset_utilisation)
      .toString(),
      2
    )
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




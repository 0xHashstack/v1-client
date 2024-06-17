import { Contract, number, uint256 } from "starknet";
import {
  contractsEnv,
  diamondAddress,
  getProvider,
  getTokenFromAddress,
  metricsContractAddress,
} from "../stark-constants";
// import metricsAbi from "../abis_upgrade/metrics_abi.json";
// import metricsAbi from "../abi_new/metrics_abi.json";
import metricsAbi from "../abis_mainnet/metrics_abi.json";
import {
  IMarketInfo,
  IProtocolReserves,
  NativeToken,
  Token,
} from "../interfaces/interfaces";
import { parseAmount, weiToEtherNumber } from "../utils/utils";
import BigNumber from "bignumber.js";
import { Address, Metrics, Spend, getMainnetConfig, getSepoliaConfig } from "@hashstackdev/itachi-sdk";

function parseProtocolStat(marketData: any, decimal: number): IMarketInfo {
  let marketInfo: IMarketInfo = {
    borrowRate: Number(marketData?.borrow_rate)*100,
    supplyRate: Number(marketData?.supply_rate)*100,
    stakingRate:Number(marketData?.staking_rate)*100,
    totalSupply: Number(marketData?.total_supply),
    lentAssets: Number(marketData?.lent_assets),
    totalBorrow: Number(marketData?.total_borrow),
    availableReserves: 
      Number(new BigNumber(Number((marketData?.total_supply)))
    .minus(new BigNumber(Number((marketData?.total_borrow))))),
    utilisationPerMarket: 
      Number(marketData?.utilisation_per_market) ?Number(marketData?.utilisation_per_market):0 ,

    exchangeRateRtokenToUnderlying: 
      Number(marketData?.exchange_rate_rToken_to_asset),
    exchangeRateDTokenToUnderlying: 
      Number(marketData?.exchange_rate_dToken_to_asset),
    exchangeRateUnderlyingToRtoken: 
      Number(marketData?.exchange_rate_asset_to_rToken),
    exchangeRateUnderlyingToDtoken: 
      Number(marketData?.exchange_rate_asset_to_dToken),

    tokenAddress: marketData?.token_address?.address,
    token: getTokenFromAddress(marketData?.token_address?.address)
      ?.name as NativeToken,
  };
  return marketInfo;
}

export async function getProtocolStats() {
  const marketStats: IMarketInfo[] = [];
  const config = getMainnetConfig(
    './target/dev',
    'https://starknet-mainnet.infura.io/v3/82802c15c3d242d2846e464a66238198'
);
  const metricsContract = new Metrics(
    config,
    new Address(contractsEnv?.DIALER_CONTRACT_ADDRESS),
    new Address(contractsEnv?.peripherals?.STAKING_ADDRESS),
    new Address(contractsEnv?.EMPIRIC_PROXY_ADDRESS),
    new Address(contractsEnv?.DIAMOND_ADDRESS),
    contractsEnv.TOKENS
  );
  try {
    const promises: any = [];
    for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
      const token = contractsEnv.TOKENS[i];

      const res =metricsContract.get_protocol_stats(new Address(token.address))
      promises.push(res);
    }
    return new Promise((resolve, reject) => {
      Promise.allSettled([...promises]).then((val) => {
      //  console.log("protocol stats result - ", val);
        const results = val.map((stat, idx) => {
          if (
            stat?.status == "fulfilled" &&
            stat?.value 
          )
            return parseProtocolStat(
              stat?.value,
              contractsEnv?.TOKENS[idx]?.decimals
            );
          else return marketStats;
        });
       //console.log("protocol stats result: ", results);
        resolve(results);
      });
    });
    ////console.log(marketStats,"market Stats in protocol stats")
  } catch (e) {
   //console.log("get_protocol_stat failed for token: ", e);
    return marketStats;
  }
}

function parseProtocolReserves(protocolReservesData: any): IProtocolReserves {
  try {
    let protocolReserves: IProtocolReserves = {
      totalReserves: 
        Number(protocolReservesData?.total_reserves),

      availableReserves: Number(protocolReservesData?.available_reserves),
      avgAssetUtilisation: Number(protocolReservesData?.avg_asset_utilisation),
    };
    return protocolReserves;
  } catch (error) {
    console.warn("getProtocol reserves: ", error);
    throw "get protocol stat error";
  }
}

export async function getProtocolReserves() {
  const provider = getProvider();
  try {
    const config = getMainnetConfig(
      './target/dev',
      'https://starknet-mainnet.infura.io/v3/82802c15c3d242d2846e464a66238198'
  );
    const metricsContract = new Metrics(
      config,
      new Address(contractsEnv?.DIALER_CONTRACT_ADDRESS),
      new Address(contractsEnv?.peripherals?.STAKING_ADDRESS),
      new Address(contractsEnv?.EMPIRIC_PROXY_ADDRESS),
      new Address(contractsEnv?.DIAMOND_ADDRESS),
      contractsEnv.TOKENS
    );
    const res:any = await metricsContract.get_protocol_reserves();
    const protocolReserves = parseProtocolReserves(res);
    return protocolReserves;
  } catch (e) {
   //console.log("get_protocol_reserves failed: ", e);
    return parseProtocolReserves({});
  }
}

import { Contract, Provider, number, shortString,num } from "starknet";
import { contractsEnv, getProvider } from "../stark-constants";
// import EmpiricAbi from "../abis/mockups/empiric_proxy.cairo/empiric_proxy.json";
// import EmpiricAbi from "../abis_upgrade/empiric_proxy.json";
import EmpiricAbi from "../abis_mainnet/empiric_proxy.json";
import BigNumber from "bignumber.js";
import strkTokens from '../../../contract_addresses_2.json'
export interface OraclePrice {
  name: string;
  address: string;
  price: number;
  lastUpdated: Date;
}

export async function getOraclePrices(): Promise<OraclePrice[]> {
  const MEDIAN_AGGREGATION_MODE = shortString.encodeShortString("MEDIAN");
  ////console.log('Using aggregation mode:', MEDIAN_AGGREGATION_MODE);
  const prices: OraclePrice[] = [];
  const provider = getProvider();
  try {
    const empiricContract = new Contract(
      EmpiricAbi.abi,
      strkTokens?.mainnet?.EMPIRIC_PROXY_ADDRESS,
      provider
    );
    for (let i = 0; i < strkTokens?.mainnet?.TOKENS.length; ++i) {
      const token = strkTokens?.mainnet?.TOKENS[i];
      const result:any = await empiricContract.call("get_spot", [
        token.pontis_key,
        MEDIAN_AGGREGATION_MODE,
      ]);
      const price = num.toBigInt(result.price.toString());
      const decimals = num.toBigInt(result.decimals.toString());
      const last_updated_timestamp = num.toBigInt(
        result.last_updated_timestamp.toString()
      );
      const lastUpdated = new Date(Number(last_updated_timestamp) * 1000);
      const oraclePrice: OraclePrice = {
        name: token.name,
        address: token.address,
        price:
          (Number(price)
            *(100)/(Math.pow(10,Number(decimals))))/100,
            // .div(new BigNumber(10).exponentiatedBy(decimals))
            // .toNumber() / 100,
        lastUpdated,
      };
      // if (now.getTime() - lastUpdated.getTime() > MAX_ORACLE_LATENCY_MS) {
      //   Global.warning(`Oracle price for ${token.name} is too old: ${lastUpdated}`);
      // }
      prices.push(oraclePrice);
    }
    return prices;
  } catch (e) {
    ////console.log("getOraclePrices failed: ", e);
    return prices;
  }
}

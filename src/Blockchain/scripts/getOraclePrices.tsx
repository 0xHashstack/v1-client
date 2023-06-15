import { Contract, Provider, number, shortString } from "starknet";
import { contractsEnv, getProvider } from "../stark-constants";
import EmpiricAbi from "../abis/mockups/empiric_proxy.cairo/empiric_proxy.json"

export interface OraclePrice {
  name: string;
  address: string;
  price: number;
  lastUpdated: Date;
}

export async function getOraclePrices(): Promise<OraclePrice[]> {
  const MEDIAN_AGGREGATION_MODE = shortString.encodeShortString('MEDIAN');
  // console.log('Using aggregation mode:', MEDIAN_AGGREGATION_MODE);
  const prices: OraclePrice[] = [];
  const now = new Date();
  const provider = getProvider();
  const empiricContract = new Contract(EmpiricAbi.abi, contractsEnv.EMPIRIC_PROXY_ADDRESS, provider);
  const promises: Promise<any>[] = [];
  for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
    const token = contractsEnv.TOKENS[i];
    const result = await empiricContract.call('get_spot', [token.pontis_key, MEDIAN_AGGREGATION_MODE]);
    const price = number.toBN(result.price.toString());
    const decimals = number.toBN(result.decimals.toString());
    const last_updated_timestamp = number.toBN(result.last_updated_timestamp.toString());
    const lastUpdated = new Date(last_updated_timestamp.toNumber() * 1000);
    const oraclePrice: OraclePrice = {
      name: token.name,
      address: token.address,
      price: price.mul(number.toBN('100')).div(number.toBN('10').pow(decimals)).toNumber() / 100,
      lastUpdated,
    };
    // if (now.getTime() - lastUpdated.getTime() > MAX_ORACLE_LATENCY_MS) {
    //   Global.warning(`Oracle price for ${token.name} is too old: ${lastUpdated}`);
    // }
    prices.push(oraclePrice);
  }
  await Promise.all(promises);
  return prices;
}
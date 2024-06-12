import { Contract, Provider, number, shortString,num } from "starknet";
import { contractsEnv, getProvider } from "../stark-constants";
// import EmpiricAbi from "../abis/mockups/empiric_proxy.cairo/empiric_proxy.json";
// import EmpiricAbi from "../abis_upgrade/empiric_proxy.json";
import EmpiricAbi from "../abis_mainnet/empiric_proxy.json";
import BigNumber from "bignumber.js";
export interface OraclePrice {
  name: string;
  address: string;
  price: number;
}

export async function getPrice() {
  
}

export async function getOraclePrices() {
  ////console.log('Using aggregation mode:', MEDIAN_AGGREGATION_MODE);
  const prices: OraclePrice[] = [];
  const provider = getProvider();
  try {
    const empiricContract = new Contract(
      EmpiricAbi.abi,
      contractsEnv.EMPIRIC_PROXY_ADDRESS,
      provider
    );
    for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
      const token = contractsEnv.TOKENS[i];
      const result:any = await empiricContract.call('get_asset_usd_price', [
        token.address,
      ]);
      const price = result[0];
      const decimals = result[1];
      const oraclePrice: OraclePrice = {
        name: token.name,
        address: token.address,
        price:
          (Number(price)
            *(100)/(Math.pow(10,Number(decimals))))/100,
            // .div(new BigNumber(10).exponentiatedBy(decimals))
            // .toNumber() / 100,
      };
      // if (now.getTime() - lastUpdated.getTime() > MAX_ORACLE_LATENCY_MS) {
      //   Global.warning(`Oracle price for ${token.name} is too old: ${lastUpdated}`);
      // }
      prices.push(oraclePrice);
    }
    return prices;
  } catch (e) {
    console.log(e,"rpice")
    ////console.log("getOraclePrices failed: ", e);
    return prices;
  }
}

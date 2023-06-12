import { Contract, number, uint256 } from "starknet";
import { getProvider, metricsContractAddress } from "../stark-constants";
import metricsAbi from "../abis/metrics_abi.json";
import { IDeposit } from "../interfaces/interfaces";

function parseDeposits(
  deposits: any,
): IDeposit[] {
  const parsedDeposits: IDeposit[] = [];
  for (let i = 0; i < deposits?.length; ++i) {
    let depositData = deposits[i];
    let deposit: IDeposit  = {
      tokenAddress: number.toHex(depositData?.asset_addr),
      rTokenAmount: uint256.uint256ToBN(depositData?.rToken_amount),
      underlyingAssetAmount: uint256.uint256ToBN(depositData?.underlying_asset_amount),
    };
    parsedDeposits.push(JSON.parse(JSON.stringify(deposit)));
  }
  return parsedDeposits;
}

export async function getUserDeposits(account: string) {
  const provider = getProvider();
  const metricsContract = new Contract(metricsAbi, metricsContractAddress, provider);
  const res = await metricsContract.call("get_user_deposits", [], {
    blockIdentifier: "pending",
  });
  return parseDeposits(
    res?.deposits,
  );
}

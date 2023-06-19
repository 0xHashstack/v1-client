import { Contract, number, uint256 } from "starknet";
import { getProvider, getRTokenFromAddress, getTokenFromAddress, metricsContractAddress } from "../stark-constants";
import metricsAbi from "../abis/metrics_abi.json";
import { IDeposit, NativeToken, RToken, Token } from "../interfaces/interfaces";
import { weiToEtherNumber } from "../utils/utils";
 
function parseDeposits(
  deposits: any,
): IDeposit[] {
  const parsedDeposits: IDeposit[] = [];
  for (let i = 0; i < deposits?.length; ++i) {
    let depositData = deposits[i];
    let deposit: IDeposit  = {
      tokenAddress: number.toHex(depositData?.asset_addr),
      token: getTokenFromAddress(number.toHex(depositData?.asset_addr))?.name as NativeToken,

      rTokenAddress: getTokenFromAddress(number.toHex(depositData?.asset_addr))?.rToken || "",
      rToken: getRTokenFromAddress(getTokenFromAddress(number.toHex(depositData?.asset_addr))?.rToken || "")?.name as RToken,
      rTokenAmount: uint256.uint256ToBN(depositData?.rToken_amount),
      rTokenAmountParsed: weiToEtherNumber(
        uint256.uint256ToBN(depositData?.rToken_amount).toString(),
        getTokenFromAddress(number.toHex(depositData?.asset_addr))?.name as NativeToken
      ),

      underlyingAssetAmount: uint256.uint256ToBN(depositData?.underlying_asset_amount),
      underlyingAssetAmountParsed: weiToEtherNumber(
        uint256.uint256ToBN(depositData?.underlying_asset_amount).toString(),
        getTokenFromAddress(number.toHex(depositData?.asset_addr))?.name as NativeToken
      ),
    };
    parsedDeposits.push(JSON.parse(JSON.stringify(deposit)));
  }
  console.log("all deposits", parsedDeposits)
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

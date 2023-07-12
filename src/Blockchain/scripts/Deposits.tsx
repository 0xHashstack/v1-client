import { Contract, number, uint256 } from "starknet";
import {
  getProvider,
  getRTokenFromAddress,
  getTokenFromAddress,
  metricsContractAddress,
} from "../stark-constants";
import metricsAbi from "../abis/metrics_abi.json";
// import metricsAbi from "../abi_new/metrics_abi.json";
import { IDeposit, NativeToken, RToken, Token } from "../interfaces/interfaces";
import { weiToEtherNumber } from "../utils/utils";

function parseDeposits(deposits: any): IDeposit[] {
  const parsedDeposits: IDeposit[] = [];
  // console.log("deposits - ", deposits);
  for (let i = 0; i < deposits?.length; ++i) {
    let depositData = deposits[i];

    let tokenAddress = number.toHex(depositData?.asset_addr);
    let token = getTokenFromAddress(tokenAddress)?.name as NativeToken;

    let rTokenFreeParsed = weiToEtherNumber(
      uint256.uint256ToBN(depositData?.rToken_free).toString(),
      token
    );

    let rTokenLockedParsed = weiToEtherNumber(
      uint256.uint256ToBN(depositData?.rToken_locked).toString(),
      token
    );

    let rTokenStakedParsed = weiToEtherNumber(
      uint256.uint256ToBN(depositData?.rToken_staked).toString(),
      token
    );

    let deposit: IDeposit = {
      tokenAddress,
      token,
      rTokenAddress: getTokenFromAddress(tokenAddress)?.rToken || "",
      rToken: getRTokenFromAddress(
        getTokenFromAddress(number.toHex(depositData?.asset_addr))?.rToken || ""
      )?.name as RToken,
      rTokenFreeParsed,
      rTokenLockedParsed,
      rTokenStakedParsed,
      rTokenAmountParsed: rTokenFreeParsed + rTokenLockedParsed,
      underlyingAssetAmount: uint256.uint256ToBN(
        depositData?.underlying_asset_amount
      ),
      underlyingAssetAmountParsed: weiToEtherNumber(
        uint256.uint256ToBN(depositData?.underlying_asset_amount).toString(),
        getTokenFromAddress(number.toHex(depositData?.asset_addr))
          ?.name as NativeToken
      ),
    };
    parsedDeposits.push(JSON.parse(JSON.stringify(deposit)));
  }
  console.log("supplies parsed: ", parsedDeposits);
  return parsedDeposits;
}

export async function getUserDeposits(account: string) {
  const provider = getProvider();
  const metricsContract = new Contract(
    metricsAbi,
    metricsContractAddress,
    provider
  );
  if (!account) return;
  console.log(
    "supplies callling with:",
    account,
    "on address: ",
    metricsContract
  );
  try {
    const res = await metricsContract.call("get_user_deposits", [account], {
      blockIdentifier: "pending",
    });
    console.log("supplies res: ", res);
    return parseDeposits(res?.deposits);
  } catch (error) {
    console.error("supplies fails: ", error);
  }
}

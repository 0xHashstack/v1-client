import { Contract, number, uint256 } from "starknet";
import {
  contractsEnv,
  getProvider,
  getRTokenFromAddress,
  getTokenFromAddress,
  metricsContractAddress,
} from "../stark-constants";
// import metricsAbi from "../abis_upgrade/metrics_abi.json";
import metricsAbi from "../abis_mainnet/metrics_abi.json"
// import metricsAbi from "../abi_new/metrics_abi.json";
import { IDeposit, NativeToken, RToken, Token } from "../interfaces/interfaces";
import { weiToEtherNumber } from "../utils/utils";

function parseDeposits(deposits: any): IDeposit[] {
  const parsedDeposits: IDeposit[] = [];
  ////console.log("deposits - ", deposits);
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
  ////console.log("supplies parsed: ", parsedDeposits);
  return parsedDeposits;
}

const parseDeposit = (deposit: any) => {
  let depositData = deposit;

  let tokenAddress = number.toHex(depositData?.asset_address);
  ////console.log("supplies deposit token ", tokenAddress);
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

  let deposit_data: IDeposit = {
    tokenAddress,
    token,
    rTokenAddress: getTokenFromAddress(tokenAddress)?.rToken || "",
    rToken: getRTokenFromAddress(
      getTokenFromAddress(number.toHex(depositData?.asset_address))?.rToken ||
        ""
    )?.name as RToken,
    rTokenFreeParsed,
    rTokenLockedParsed,
    rTokenStakedParsed,
    rTokenAmountParsed: weiToEtherNumber(
      uint256.uint256ToBN(depositData?.rToken_amount).toString(),
      token
    ),
    underlyingAssetAmount: uint256
      .uint256ToBN(depositData?.supply_asset_amount)
      .toString(),
    underlyingAssetAmountParsed: weiToEtherNumber(
      uint256.uint256ToBN(depositData?.supply_asset_amount).toString(),
      getTokenFromAddress(number.toHex(depositData?.asset_address))
        ?.name as NativeToken
    ),
  };
  return deposit_data;
};

export async function getUserDeposits(account: string) {
  const provider = getProvider();
  const metricsContract = new Contract(
    metricsAbi,
    metricsContractAddress,
    provider
  );
  if (!account) return;
  ////console.log(
  //   "supplies callling with:",
  //   account,
  //   "on address: ",
  //   metricsContract
  // );
  try {
    const tokens = contractsEnv?.TOKENS;
    const promises: any = [];
    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i];
      const res = metricsContract.call(
        "get_user_deposit",
        [token?.rToken, account],
        {
          blockIdentifier: "pending",
        }
      );
      promises.push(res);
    }
    // });
    // return promises;
    return new Promise((resolve, reject) => {
      Promise.allSettled([...promises]).then((val) => {
        const results = val
          .filter((deposit, idx) => {
            return deposit?.status == "fulfilled" && deposit?.value;
          })
          .map((deposit, idx) => {
            if (deposit?.status == "fulfilled" && deposit?.value)
              return parseDeposit(deposit?.value?.deposit);
            else return {};
          });
       //console.log("supplies result: ", results);
        resolve(results);
      });
    });
  } catch (error) {
    console.error("supplies fails: ", error);
  }
}

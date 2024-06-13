import { Contract, num,  uint256 } from "starknet";
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
import { Address, Metrics, getSepoliaConfig } from "@hashstackdev/itachi-sdk";

function parseDeposits(deposits: any): IDeposit[] {
  const parsedDeposits: IDeposit[] = [];
  ////console.log("deposits - ", deposits);
  for (let i = 0; i < deposits?.length; ++i) {
    let depositData = deposits[i];

    let tokenAddress = num.toHex(depositData?.asset_addr);
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
        getTokenFromAddress(num.toHex(depositData?.asset_addr))?.rToken || ""
      )?.name as RToken,
      rTokenFreeParsed,
      rTokenLockedParsed,
      rTokenStakedParsed,
      rTokenAmountParsed: rTokenFreeParsed + rTokenLockedParsed,
      underlyingAssetAmount:Number (uint256.uint256ToBN(
        depositData?.underlying_asset_amount
      )),
      underlyingAssetAmountParsed: weiToEtherNumber(
        uint256.uint256ToBN(depositData?.underlying_asset_amount).toString(),
        getTokenFromAddress(num.toHex(depositData?.asset_addr))
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

  let tokenAddress = depositData?.asset?.address;
  ////console.log("supplies deposit token ", tokenAddress);
  let token = getTokenFromAddress(tokenAddress)?.name as NativeToken;

  let rTokenFreeParsed = 
    Number(depositData?.rToken_free)
  ;

  let rTokenLockedParsed = Number(depositData?.rToken_locked);

  let rTokenStakedParsed = Number(depositData?.rTokens?.staked);
  let deposit_data: IDeposit = {
    tokenAddress,
    token,
    rTokenAddress: getTokenFromAddress(tokenAddress)?.rToken || "",
    rToken: getRTokenFromAddress(
      getTokenFromAddress(tokenAddress)?.rToken ||
        ""
    )?.name as RToken,
    rTokenFreeParsed,
    rTokenLockedParsed,
    rTokenStakedParsed,
    rTokenAmountParsed: Number(depositData?.rTokens?.net),
    underlyingAssetAmount:Number( (depositData?.underlying?.net)),
    underlyingAssetAmountParsed: Number( (depositData?.underlying?.net)),
    
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
    const config = getSepoliaConfig(
      './target/dev',
      'https://starknet-sepolia.public.blastapi.io/rpc/v0_6'
  );
    const metricsContract = new Metrics(
      config,
      new Address('0x6da033fdb9257dd035a4a4f80269ecd8c5045ef81cd756dad7a5d2553f0d30d'),
      new Address('0x177975265a7f166ef856f168df5f61bc0e921d441c6144c7dc0922f6c6f0a9d'),
      new Address('0x4f9ea82707356d663d80d4064bb292db60108ac1022e7a15c341128dc647b42'),
      new Address('0x66bab31e89d426fbdfaa021be5bc71e785c13f9e9a6a10c89eaa8e1e0a9008f'),
      contractsEnv.TOKENS
    );
    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i];
      const res = metricsContract.get_user_deposit(new Address(token?.rToken),new Address(account))
      promises.push(res);
    }
    // });
    // return promises;
    return new Promise((resolve, reject) => {
      Promise.allSettled([...promises]).then((val) => {
        console.log(val,'value')
        const results = val
          .filter((deposit, idx) => {
            return deposit?.status == "fulfilled" && deposit?.value;
          })
          .map((deposit, idx) => {
            if (deposit?.status == "fulfilled" && deposit?.value)
              return parseDeposit(deposit?.value);
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

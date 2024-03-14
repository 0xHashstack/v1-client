import { Contract, uint256 } from "starknet";

import { ERC20Abi, contractsEnv, getProvider } from "../stark-constants";
import { parseAmount } from "../utils/utils";

export function getSpendBalance() {
  const marketStats: any = [];
  const provider = getProvider();

  try {
    const promises: any = [];
    for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
      const token = contractsEnv.TOKENS[i];
      const contract = new Contract(ERC20Abi, token?.address, provider);

      const res: any = contract.call("balanceOf", [token?.dToken], {
        blockIdentifier: "pending",
      });

      promises.push(res);
    }

    return new Promise((resolve, _) => {
      Promise.allSettled([...promises]).then((val) => {
        const results = val.map((stat: any, idx) => {
          if (
            stat?.status == "fulfilled" &&
            stat?.value &&
            stat?.value?.balance
          ) {
            return {
              token: contractsEnv.TOKENS[idx]?.name,
              balance: parseAmount(
                uint256.uint256ToBN(stat?.value?.balance).toString(),
                contractsEnv?.TOKENS[idx]?.decimals
              ),
            };
          } else return marketStats;
        });
        resolve(results);
      });
    });
  } catch (e) {
    return marketStats;
  }
}

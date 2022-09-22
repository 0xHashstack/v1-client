import * as DeployDetails from "../../../zkOpen/contract_addresses.json";
import ERC20Abi from "../../starknet-artifacts/contracts/mockups/erc20.cairo/erc20_abi.json";
import ComptrollerAbi from "../../../zkOpen/starknet-artifacts/contracts/modules/comptroller.cairo/comptroller_abi.json";
interface ItokenAddressMap {
  [key: string]: string | undefined;
}

export const tokenAddressMap: ItokenAddressMap = {
  BTC:
    process.env.NODE_ENV === "development"
      ? DeployDetails.devnet.TOKENS[0].address
      : process.env.NEXT_PUBLIC_T_BTC,
  USDT:
    process.env.NODE_ENV === "development"
      ? DeployDetails.devnet.TOKENS[2].address
      : process.env.NEXT_PUBLIC_T_USDT,
  USDC:
    process.env.NODE_ENV === "development"
      ? DeployDetails.devnet.TOKENS[1].address
      : process.env.NEXT_PUBLIC_T_USDC,
  BNB:
    process.env.NODE_ENV === "development"
      ? DeployDetails.devnet.TOKENS[3].address
      : process.env.NEXT_PUBLIC_T_BNB,
};

export const diamondAddress: string = DeployDetails.devnet.DIAMOND_ADDRESS;

export const getTokenFromAddress = (address: string) => {
  if (process.env.NODE_ENV === "development") {
    let index = DeployDetails.devnet.TOKENS.map((item) => item.address).indexOf(
      address
    );
    return DeployDetails.devnet.TOKENS[index];
  }
  return null;
};
// export const getCommitmentNameFromIndex = (index: string) => {
//   if (index == "0") {
//     return 0;
//   }
//   return 1;
// };

export const getTokenFromName = (name: string) => {
  if (process.env.NODE_ENV === "development") {
    let index = DeployDetails.devnet.TOKENS.map((item) => item.name).indexOf(
      name
    );
    return DeployDetails.devnet.TOKENS[index];
  }
  return null;
};

export const getCommitmentNameFromIndex = (index: string) => {
  if (index === "0") {
    return "NONE";
  } else if (index === "1") {
    return "TWO WEEKS";
  } else if (index === "2") {
    return "ONE MONTH";
  } else if (index === "3") {
    return "THREE MONTHS";
  }

  return null;
};
// <option value={"NONE"}>None</option>
// <option value={"TWOWEEKS"}>Two Weeks</option>
// <option value={"ONEMONTH"}>One Month</option>
// <option value={"THREEMONTHS"}>Three Month</option>

export const getCommitmentIndexStringFromName = (name: string) => {
  if (name === "NONE") {
    return "0";
  } else if (name === "TWOWEEKS") {
    return "1";
  } else if (name === "ONEMONTH") {
    return "2";
  } else if (name === "THREEMONTHS") {
    return "3";
  }
};

export const getCommitmentIndex = (index: string) => {
  if (index === "0") {
    return 0;
  }
  if (index === "1") {
    return 1;
  }
  if (index === "2") {
    return 2;
  }
  if (index === "3") {
    return 3;
  }
};
export { ERC20Abi, ComptrollerAbi };

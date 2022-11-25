import * as DeployDetailsDev from "../../contracts_addresses_dev.json";
import * as DeployDetailsProd from "../../contracts_addresses_prod_goerli2.json";
// import * as DeployDetails from "../../../zkOpen/contract_addresses.json";
import ERC20Abi from "../../ABIs/erc20_abi.json";
import ComptrollerAbi from "../../ABIs/comptroller_abi.json";
import { number } from "starknet";
import {
  UseTransactionReceiptResult,
  UseTransactionResult,
} from "@starknet-react/core";
interface ItokenAddressMap {
  [key: string]: string | undefined;
}

export function processAddress(address: string) {
  return number.toHex(number.toBN(number.toFelt(address)));
}

// let contractsEnv =
//   process.env.NODE_ENV === "development"
//     ? DeployDetailsDev.devnet
//     : DeployDetailsProd.goerli_2;
let contractsEnv = DeployDetailsProd.goerli_2;
contractsEnv.DIAMOND_ADDRESS = processAddress(contractsEnv.DIAMOND_ADDRESS);
for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
  contractsEnv.TOKENS[i].address = processAddress(
    contractsEnv.TOKENS[i].address
  );
}

export const getTokenFromName = (name: string) => {
  let something = contractsEnv.TOKENS.map((item) => item.name);
  console.log(something);
  let index = contractsEnv.TOKENS.map((item) => item.name).indexOf(name);
  return contractsEnv.TOKENS[index];
  //   if (process.env.NODE_ENV === "development") {
  //     let index = contractsEnv.TOKENS.map((item) => item.name).indexOf(name);
  //     return contractsEnv.TOKENS[index];
  //   } else {
  //     let index = contractsEnv.TOKENS.map((item) => item.name).indexOf(name);
  //     return contractsEnv.TOKENS[index];
  //   }
};

export const tokenAddressMap: ItokenAddressMap = {
  BTC: getTokenFromName("BTC")?.address,
  USDT: getTokenFromName("USDT")?.address,
  USDC: getTokenFromName("USDC")?.address,
  BNB: getTokenFromName("BNB")?.address,
};

export function isTransactionLoading(receipt: UseTransactionReceiptResult) {
  // if(receipt.loading)
  // 	return true
  if (receipt.data?.status == "RECEIVED" || receipt.data?.status == "PENDING")
    return true;
}

export function handleTransactionToast(receipt: UseTransactionReceiptResult) {}
// export const tokenAddressMap: ItokenAddressMap = {
//   BTC: DeployDetails.devnet.TOKENS[0].address,
//   USDT: DeployDetails.devnet.TOKENS[2].address,
//   USDC: DeployDetails.devnet.TOKENS[1].address,
//   BNB: DeployDetails.devnet.TOKENS[3].address,
// };

// export const tokenAddressMap: ItokenAddressMap = {
//   BTC:
//     process.env.NODE_ENV === "development"
//       ? DeployDetails.devnet.TOKENS[0].address
//       : process.env.NEXT_PUBLIC_T_BTC,
//   USDT:
//     process.env.NODE_ENV === "development"
//       ? DeployDetails.devnet.TOKENS[2].address
//       : process.env.NEXT_PUBLIC_T_USDT,
//   USDC:
//     process.env.NODE_ENV === "development"
//       ? DeployDetails.devnet.TOKENS[1].address
//       : process.env.NEXT_PUBLIC_T_USDC,
//   BNB:
//     process.env.NODE_ENV === "development"
//       ? DeployDetails.devnet.TOKENS[3].address
//       : process.env.NEXT_PUBLIC_T_BNB,
// };

export const diamondAddress: string = contractsEnv.DIAMOND_ADDRESS;

export const getTokenFromAddress = (address: string) => {
  let index = contractsEnv.TOKENS.map((item) => item.address).indexOf(address);
  let token = contractsEnv.TOKENS[index];
  console.log("getTokenFromAddress", address, token);
  return token;
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

export const getCommitmentIndexStringFromNameDeposit = (name: string) => {
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

export const getCommitmentIndexStringFromNameLoan = (name: string) => {
  if (name === "NONE") {
    return "0";
  } else if (name === "ONEMONTH") {
    return "1";
  }
};

export const getCommitmentIndex = (index: string) => {
  return parseInt(index);
};
export { ERC20Abi, ComptrollerAbi, contractsEnv };

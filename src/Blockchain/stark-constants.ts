import DeployDetailsProd from "../../contract_addresses.json";
import ERC20Abi from "./abis/erc20_abi.json";
import { Provider, number } from "starknet";
import {
  UseWaitForTransactionResult,
} from "@starknet-react/core";

export function processAddress(address: string) {
  return number.toHex(number.toBN(number.toFelt(address)));
}

// let contractsEnv =
//   process.env.NODE_ENV === "development"
//     ? DeployDetailsDev.devn\et
//     : DeployDetailsProd.goerli_2;
let contractsEnv = DeployDetailsProd.goerli;
contractsEnv.DIAMOND_ADDRESS = processAddress(contractsEnv.DIAMOND_ADDRESS);
for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
  contractsEnv.TOKENS[i].address = processAddress(
    contractsEnv.TOKENS[i].address
  );
}

export const getProvider = () => {
  if (contractsEnv == DeployDetailsProd.goerli) {
    const provider = new Provider({
      sequencer: {
        baseUrl: "https://alpha4.starknet.io",
        feederGatewayUrl: "feeder_gateway",
        gatewayUrl: "gateway",
      },
    });
    return provider;
  } else if(contractsEnv == DeployDetailsProd.goerli_2){
    const provider = new Provider({
      sequencer: {
        baseUrl: "https://alpha4-2.starknet.io",
        feederGatewayUrl: "feeder_gateway",
        gatewayUrl: "gateway",
      },
    });
    return provider;
  } else {
    const provider = new Provider({
      sequencer: {
        baseUrl: "https://alpha-mainnet.starknet.io",
        feederGatewayUrl: "feeder_gateway",
        gatewayUrl: "gateway",
      },
    });
    return provider;
  }
}

export function isTransactionLoading(receipt: UseWaitForTransactionResult) {
  // if(receipt.loading)
  // 	return true
  if (receipt.data?.status == "RECEIVED") return true;
}

export function handleTransactionToast(receipt: UseWaitForTransactionResult) { }

export const diamondAddress: string = contractsEnv.DIAMOND_ADDRESS;

export const metricsContractAddress: string = contractsEnv.METRICS_CONTRACT_ADDRESS;

export const l3DiamondAddress: string = contractsEnv.L3_DIAMOND_ADDRESS;

export const getTokenFromAddress = (address: string) => {
  let index = contractsEnv.TOKENS.map((item) => item.address).indexOf(address);
  let token = contractsEnv.TOKENS[index];
  // console.log("getTokenFromAddress", address, token);
  return token;
};

export { ERC20Abi, contractsEnv };

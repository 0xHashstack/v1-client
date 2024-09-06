// import DeployDetailsProd from "../../contract_addresses.json";
// import DeployDetailsProd from "../../contract_addresses_new.json";
import DeployDetailsProd from "../../contract_addresses_2.json";
// import ERC20Abi from "./abis/erc20_abi.json";
// import ERC20Abi from "./abi_new/erc20_abi.json";
// import ERC20Abi from "./abis_upgrade/erc20_abi.json";
import ERC20Abi from "./abis_mainnet/erc20_abi.json";
import { RpcProvider,num } from "starknet";
import { UseWaitForTransactionResult } from "@starknet-react/core";

export function processAddress(address: string) {
  return num.toHex(num.toBigInt(address));
}
// let contractsEnv =
//   process.env.NODE_ENV === "development"
//     ? DeployDetailsDev.devn\et
//     : DeployDetailsProd.goerli_2;
let walletConnected: string | null = null;

if (typeof window !== "undefined") {
  walletConnected = localStorage.getItem("networkConnected");
}
let contractsEnv:any = process.env.NEXT_PUBLIC_NODE_ENV=="testnet" ? walletConnected==='Base'? DeployDetailsProd.sepolia_base: DeployDetailsProd.sepolia:walletConnected==='MetaMask'? DeployDetailsProd.sepolia_base: DeployDetailsProd.mainnet;
contractsEnv.DIAMOND_ADDRESS = contractsEnv.DIAMOND_ADDRESS;
for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
  contractsEnv.TOKENS[i].address = processAddress(
    contractsEnv.TOKENS[i].address
  );
}
export const getProvider = () => {
  const rpctestnetUrl=String(process.env.NEXT_PUBLIC_INFURA_TESTNET);
  const rpcUrl=String(process.env.NEXT_PUBLIC_INFURA_MAINNET);
  if (contractsEnv == DeployDetailsProd.sepolia) {
    const provider = new RpcProvider({ nodeUrl: rpctestnetUrl});
    return provider;
  }
  else {
    const provider = new RpcProvider({ nodeUrl: rpcUrl});
    return provider;

  }
}

// export const getProvider = () => {
//   if (contractsEnv == DeployDetailsProd.goerli) {
//     const provider = new Provider({
//       sequencer: {
//         baseUrl: "https://alpha4.starknet.io",
//         // baseUrl: "http://127.0.0.1:5050/",
//         feederGatewayUrl: "feeder_gateway",
//         gatewayUrl: "gateway",
//         blockIdentifier: "pending",
//       },
//     });
//     return provider;
//   } else if (contractsEnv == DeployDetailsProd.goerli_2) {
//     const provider = new Provider({
//       sequencer: {
//         baseUrl: "https://alpha4-2.starknet.io",
//         feederGatewayUrl: "feeder_gateway",
//         gatewayUrl: "gateway",
//         blockIdentifier: "pending",
//       },
//     });
//     return provider;
//   } else {
//     const provider = new Provider({
//       sequencer: {
//         baseUrl: "https://alpha-mainnet.starknet.io",
//         feederGatewayUrl: "feeder_gateway",
//         gatewayUrl: "gateway",
//         blockIdentifier: "pending",
//       },
//     });
//     return provider;
//   }
// };

export function isTransactionLoading(receipt: UseWaitForTransactionResult) {
  // if(receipt.loading)
  // 	return true
  if (receipt.data?.status == "RECEIVED") return true;
}

export function handleTransactionToast(receipt: UseWaitForTransactionResult) {}

export const diamondAddress: string = contractsEnv.DIAMOND_ADDRESS;

export const metricsContractAddress: string =
  contractsEnv.METRICS_CONTRACT_ADDRESS;

export const stakingContractAddress: string =
  contractsEnv.peripherals.STAKING_ADDRESS;

export const l3DiamondAddress: string = contractsEnv.L3_DIAMOND_ADDRESS;

export const faucetAddress: string =  contractsEnv.FAUCET_ADDRESS;

export const nftAddress:string=contractsEnv.NFT_CONTRACT_ADDRESS;

export const getTokenFromAddress = (address: string) => {
  return contractsEnv.TOKENS.find((item:any) => item?.address === address);
};

export const getRTokenFromAddress = (address: string) => {
  return contractsEnv.rTOKENS.find((item:any) => item?.address === address);
};

export const getDTokenFromAddress = (address: string) => {
  return contractsEnv.dTOKENS.find((item:any) => item?.address === address);
};

export { ERC20Abi, contractsEnv };

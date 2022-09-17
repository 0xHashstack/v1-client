import * as DeployDetails from "../../../zkOpen/contract_addresses.json";
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

export const getTokenFromAddress = (address: string) => {
  if(process.env.NODE_ENV === "development") {
    let index = DeployDetails.devnet.TOKENS.map(item => item.address).indexOf(address)
    return DeployDetails.devnet.TOKENS[index]
  }
  return null
}

export const getCommitmentNameFromIndex = (index: string) => {
  if(index == '0') {
    return 'None'
  }
  return null
}
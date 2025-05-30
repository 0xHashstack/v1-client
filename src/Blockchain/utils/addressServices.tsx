import { ItokenAddressMap, ItokenDecimalsMap } from "../interfaces/interfaces";
import { contractsEnv } from "../stark-constants";

export const getTokenFromName = (name: string) => {
  return contractsEnv.TOKENS.find((Token:any) => Token.name == name);
};

export const getRTokenFromName = (name: string) => {
  return contractsEnv.rTOKENS.find((rToken:any) => rToken.name == name);
};

export const getDTokenFromName = (name: string) => {
  return contractsEnv.dTOKENS.find((dToken:any) => dToken.name == name);
};
export const getTokenFromAddress = (address: string) => {
  return contractsEnv?.TOKENS?.find((val: any) => val?.address == address);
};

export const tokenAddressMap: ItokenAddressMap | any = {
  BTC: getTokenFromName("BTC")?.address,
  USDT: getTokenFromName("USDT")?.address,
  USDC: getTokenFromName("USDC")?.address,
  ETH: getTokenFromName("ETH")?.address,
  DAI: getTokenFromName("DAI")?.address,
  STRK:getTokenFromName("STRK")?.address,

  rBTC: getRTokenFromName("rBTC")?.address,
  rUSDT: getRTokenFromName("rUSDT")?.address,
  rUSDC: getRTokenFromName("rUSDC")?.address,
  rETH: getRTokenFromName("rETH")?.address,
  rDAI: getRTokenFromName("rDAI")?.address,
  rSTRK:getRTokenFromName("rSTRK")?.address,

  dBTC: getDTokenFromName("dBTC")?.address,
  dUSDT: getDTokenFromName("dUSDT")?.address,
  dUSDC: getDTokenFromName("dUSDC")?.address,
  dETH: getDTokenFromName("dETH")?.address,
  dDAI: getDTokenFromName("dDAI")?.address,
  dSTRK: getDTokenFromName("dSTRK")?.address,
};

export const tokenDecimalsMap: ItokenDecimalsMap | any = {
  BTC: getTokenFromName("BTC")?.decimals,
  USDT: getTokenFromName("USDT")?.decimals,
  USDC: getTokenFromName("USDC")?.decimals,
  ETH: getTokenFromName("ETH")?.decimals,
  DAI: getTokenFromName("DAI")?.decimals,
  STRK:getTokenFromName("STRK")?.decimals,

  rBTC: getRTokenFromName("rBTC")?.decimals,
  rUSDT: getRTokenFromName("rUSDT")?.decimals,
  rUSDC: getRTokenFromName("rUSDC")?.decimals,
  rETH: getRTokenFromName("rETH")?.decimals,
  rDAI: getRTokenFromName("rDAI")?.decimals,
  rSTRK: getRTokenFromName("rSTRK")?.decimals,

  dBTC: getDTokenFromName("dBTC")?.decimals,
  dUSDT: getDTokenFromName("dUSDT")?.decimals,
  dUSDC: getDTokenFromName("dUSDC")?.decimals,
  dETH: getDTokenFromName("dETH")?.decimals,
  dDAI: getDTokenFromName("dDAI")?.decimals,
  dSTRK: getDTokenFromName("dSTRK")?.decimals,
};

import { ItokenAddressMap, ItokenDecimalsMap } from "../interfaces/interfaces";
import { contractsEnv } from "../stark-constants";

export const getTokenFromName = (name: string) => {
  return contractsEnv.TOKENS.find((Token) => Token.name == name);
};

export const getRTokenFromName = (name: string) => {
  return contractsEnv.rTOKENS.find((rToken) => rToken.name == name);
};

export const getDTokenFromName = (name: string) => {
  return contractsEnv.dTOKENS.find((dToken) => dToken.name == name);
};

export const tokenAddressMap: ItokenAddressMap | any = {
  BTC: getTokenFromName("BTC")?.address,
  USDT: getTokenFromName("USDT")?.address,
  USDC: getTokenFromName("USDC")?.address,
  ETH: getTokenFromName("ETH")?.address,
  DAI: getTokenFromName("DAI")?.address,

  rBTC: getRTokenFromName("rBTC")?.address,
  rUSDT: getRTokenFromName("rUSDT")?.address,
  rUSDC: getRTokenFromName("rUSDC")?.address,
  rETH: getRTokenFromName("rETH")?.address,
  rDAI: getRTokenFromName("rDAI")?.address,

  dBTC: getDTokenFromName("dBTC")?.address,
  dUSDT: getDTokenFromName("dUSDT")?.address,
  dUSDC: getDTokenFromName("dUSDC")?.address,
  dETH: getDTokenFromName("dETH")?.address,
  dDAI: getDTokenFromName("dDAI")?.address,
};

export const tokenDecimalsMap: ItokenDecimalsMap | any = {
  BTC: getTokenFromName("BTC")?.decimals,
  USDT: getTokenFromName("USDT")?.decimals,
  USDC: getTokenFromName("USDC")?.decimals,
  ETH: getTokenFromName("ETH")?.decimals,
  DAI: getTokenFromName("DAI")?.decimals,

  rBTC: getRTokenFromName("rBTC")?.decimals,
  rUSDT: getRTokenFromName("rUSDT")?.decimals,
  rUSDC: getRTokenFromName("rUSDC")?.decimals,
  rETH: getRTokenFromName("rETH")?.decimals,
  rDAI: getRTokenFromName("rDAI")?.decimals,

  dBTC: getDTokenFromName("dBTC")?.decimals,
  dUSDT: getDTokenFromName("dUSDT")?.decimals,
  dUSDC: getDTokenFromName("dUSDC")?.decimals,
  dETH: getDTokenFromName("dETH")?.decimals,
  dDAI: getDTokenFromName("dDAI")?.decimals,
};

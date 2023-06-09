import { ItokenAddressMap, ItokenDecimalsMap } from "../interfaces/interfaces";
import { contractsEnv } from "../stark-constants";

export const getTokenFromName = (name: string) => {
  return contractsEnv.TOKENS.find((Token) => Token.name == name)
};

export const getRTokenFromAddress = (name: string) => {
  return contractsEnv.rTOKENS.find((rToken) => rToken.name == name)
}

export const getDTokenFromAddress = (name: string) => {
  return contractsEnv.dTOKENS.find((dToken) => dToken.name == name)
}

export const tokenAddressMap: ItokenAddressMap = {
  BTC: getTokenFromName("BTC")?.address,
  USDT: getTokenFromName("USDT")?.address,
  USDC: getTokenFromName("USDC")?.address,
  ETH: getTokenFromName("ETH")?.address,
  DAI: getTokenFromName("DAI")?.address,

  rBTC: getRTokenFromAddress("rBTC")?.address,
  rUSDT: getRTokenFromAddress("rUSDT")?.address,
  rUSDC: getRTokenFromAddress("rUSDC")?.address,
  rETH: getRTokenFromAddress("rETH")?.address,
  rDAI: getRTokenFromAddress("rDAI")?.address,

  dBTC: getDTokenFromAddress("dBTC")?.address,
  dUSDT: getDTokenFromAddress("dUSDT")?.address,
  dUSDC: getDTokenFromAddress("dUSDC")?.address,
  dETH: getDTokenFromAddress("dETH")?.address,
  dDAI: getDTokenFromAddress("dDAI")?.address,
};

export const tokenDecimalsMap: ItokenDecimalsMap = {
  BTC: getTokenFromName("BTC")?.decimals,
  rBTC: getRTokenFromAddress("rBTC")?.decimals,
  dBTC: getDTokenFromAddress("dBTC")?.decimals,
  
  USDT: getTokenFromName("USDT")?.decimals,
  rUSDT: getRTokenFromAddress("rUSDT")?.decimals,
  dUSDT: getDTokenFromAddress("dUSDT")?.decimals,
  
  USDC: getTokenFromName("USDC")?.decimals,
  rUSDC: getRTokenFromAddress("rUSDC")?.decimals,
  dUSDC: getDTokenFromAddress("dUSDC")?.decimals,

  ETH: getTokenFromName("ETH")?.decimals,
  rETH: getRTokenFromAddress("rETH")?.decimals,
  dETH: getDTokenFromAddress("dETH")?.decimals,

  DAI: getTokenFromName("DAI")?.decimals,
  rDAI: getRTokenFromAddress("rDAI")?.decimals,
  dDAI: getDTokenFromAddress("dDAI")?.decimals,
};


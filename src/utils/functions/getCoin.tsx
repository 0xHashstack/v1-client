import BTCLogo from "@/assets/icons/coins/btc";
import DAILogo from "@/assets/icons/coins/dai";
import ETHLogo from "@/assets/icons/coins/eth";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";

const getCoin = (CoinName: string, height: string, width: string) => {
  switch (CoinName) {
    case "BTC":
      return <BTCLogo height={height} width={width} />;
      break;
    case "USDC":
      return <USDCLogo height={height} width={width} />;
      break;
    case "USDT":
      return <USDTLogo height={height} width={width} />;
      break;
    case "ETH":
      return <ETHLogo height={height} width={width} />;
      break;
    case "DAI":
      return <DAILogo height={height} width={width} />;
      break;
    default:
      break;
  }
};
export default getCoin;

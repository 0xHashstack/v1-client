import BTCLogo from "@/assets/icons/coins/btc";
import DAILogo from "@/assets/icons/coins/dai";
import ETHLogo from "@/assets/icons/coins/eth";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";

const getCoin = (CoinName: string) => {
  switch (CoinName) {
    case "BTC":
      return <BTCLogo />;
      break;
    case "USDC":
      return <USDCLogo />;
      break;
    case "USDT":
      return <USDTLogo />;
      break;
    case "ETH":
      return <ETHLogo />;
      break;
    case "DAI":
      return <DAILogo />;
      break;
    default:
      break;
  }
};
export default getCoin;

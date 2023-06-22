import { Contract, uint256 } from "starknet";
import { IUserStats } from "../interfaces/interfaces";
import metricsAbi from "../abis/metrics_abi.json";
import { getProvider, metricsContractAddress } from "../stark-constants";
import { parseAmount } from "../utils/utils";

function parseUserStats(
  userStatsData: any,
): IUserStats {
  let userStats: IUserStats = {
    netWorth: parseAmount(uint256.uint256ToBN(userStatsData?.net_worth).toString(), 8),
    yourSupply: parseAmount(uint256.uint256ToBN(userStatsData?.your_supply).toString(), 8),
    yourBorrow: parseAmount(uint256.uint256ToBN(userStatsData?.your_borrow).toString(), 8),
    netSupplyAPR: parseAmount(uint256.uint256ToBN(userStatsData?.net_supply_apr).toString(), 10),
    netBorrowAPR: parseAmount(uint256.uint256ToBN(userStatsData?.net_borrow_apr).toString(), 10),
  };
  return userStats;
}

export async function getUserReserves(accountAddress: string) {
  const provider = getProvider();
  const metricsContract = new Contract(metricsAbi, metricsContractAddress, provider);
  const res = await metricsContract.call("get_user_stats", [accountAddress], {
    blockIdentifier: "pending",
  });
  return parseUserStats(
    res?.protocol_reserves,
  );
}
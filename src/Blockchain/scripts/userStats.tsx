import { Contract, uint256 } from "starknet";
import { IUserStats } from "../interfaces/interfaces";
import metricsAbi from "../abis/metrics_abi.json";
import { getProvider, metricsContractAddress } from "../stark-constants";

function parseUserStats(
  userStatsData: any,
): IUserStats {
  let userStats: IUserStats = {
    netWorth: uint256.uint256ToBN(userStatsData?.net_worth).toString(),
    yourSupply: uint256.uint256ToBN(userStatsData?.your_supply).toString(),
    yourBorrow: uint256.uint256ToBN(userStatsData?.your_borrow).toString(),
    netSupplyAPR: uint256.uint256ToBN(userStatsData?.net_supply_apr).toString(),
    netBorrowAPR: uint256.uint256ToBN(userStatsData?.net_borrow_apr).toString(),
  };
  return userStats;
}

export async function getProtocolReserves() {
  const provider = getProvider();
  const metricsContract = new Contract(metricsAbi, metricsContractAddress, provider);
  const res = await metricsContract.call("get_user_stats", [], {
    blockIdentifier: "pending",
  });
  return parseUserStats(
    res?.protocol_reserves,
  );
}
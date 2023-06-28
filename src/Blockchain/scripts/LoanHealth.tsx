import { Contract } from "starknet";
import { diamondAddress, getProvider } from "../stark-constants";
import routerAbi from "@/Blockchain/abis/router_abi.json";
import { BNtoNum } from "../utils/utils";

export async function getExistingLoanHealth(loanId: string) {
  const provider = getProvider();
  try {
    const routerContract = new Contract(routerAbi, diamondAddress, provider);
    const res = await routerContract.call("get_health_factor", [loanId], {
      blockIdentifier: "pending",
    });
    console.log("health factor: ", res, res?.factor)
    return BNtoNum(res?.factor, 0);
  }
  catch (error) {
    console.log(error);
  }
}


export async function getLoanHealth() {
  
}
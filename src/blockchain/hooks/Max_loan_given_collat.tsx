import { useContract, useStarknetCall } from "@starknet-react/core";
import { Abi } from "starknet";
import { diamondAddress, tokenAddressMap } from "../stark-constants";
import loanAbi from "../../../starknet-artifacts/contracts/modules/loan.cairo/loan_abi.json";
import { BNtoNum } from "../utils";

const useMaxloan = (
  market: string,
  collateral_market: string,
  collateral_amount: string
) => {
  const { contract } = useContract({
    abi: loanAbi as Abi,
    address: diamondAddress,
  });

  console.log("useMaxLoan", market, collateral_market, collateral_amount);
  const {
    data: dataMaxLoan,
    error: errorMaxLoan,
    loading: loadingMaxLoan,
    refresh: refreshMaxLoan,
  } = useStarknetCall({
    contract,
    method: "get_max_loan_amount",
    args: [
      tokenAddressMap[market],
      tokenAddressMap[collateral_market],
      [collateral_amount, 0],
    ],
  });

  return { dataMaxLoan, errorMaxLoan, loadingMaxLoan, refreshMaxLoan };
};
export default useMaxloan;

import { Contract } from "starknet";
import jediSwapAbi from "../abis/jedi_swap_abi.json";
import mySwapAbi from "../abis/my_swap_abi.json";
import { getProvider, l3DiamondAddress } from "../stark-constants";
import { tokenAddressMap } from "../utils/addressServices";

// before interaction
export async function getJediEstimateLiquiditySplit(loanId, tokenA, tokenB) {
  let tokenAAddress = tokenAddressMap[tokenA];
  let tokenBAddress = tokenAddressMap[tokenB];
  const provider = getProvider();
  const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
  const res = await l3Contract.call(
    "get_jedi_estimate_liquidity_split",
    [loanId, tokenAAddress, tokenBAddress],
    {
      blockIdentifier: "pending",
    }
  );
  // console.log(
  //   "estimated liquidity split for loanId: ", loanId, " is: ", res
  // )
}

// before interaction
export async function getJediEstimatedLpAmountOut(loanId, tokenA, tokenB) {
  let tokenAAddress = tokenAddressMap[tokenA];
  let tokenBAddress = tokenAddressMap[tokenB];
  const provider = getProvider();
  const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
  const res = await l3Contract.call(
    "get_jedi_estimated_lp_amount_out",
    [loanId, tokenAAddress, tokenBAddress],
    {
      blockIdentifier: "pending",
    }
  );
  // console.log(
  //   "estimated lp amount out for loanId: ", loanId, " is: ", res
  // )
}

// after interaction, in borrow screen, after getting getUserLoans
export async function getJediEstimatedLiqALiqBfromLp(liquidity, pairAddress) { // currentMarketAmount, currentMarketAddress
  const provider = getProvider();
  const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
  const res = await l3Contract.call(
    "get_jedi_estimated_liqA_liqB_from_lp",
    [liquidity, pairAddress],
    {
      blockIdentifier: "pending",
    }
  );
  // console.log(
  //   "estimated liquidity A, B for liquidity: ", liquidity, " is: ", res
  // )
}

export async function getSupportedPoolsJediSwap() {
  const provider = getProvider();
  const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
  const res = await l3Contract.call("get_supported_pools_jedi_swap", [], {
    blockIdentifier: "pending",
  });
  console.log("supported pools for Jediswap: ", liquidity, " is: ", res);
}

export async function getSupportedPoolsMyswap() {
  const provider = getProvider();
  const l3Contract = new Contract(mySwapAbi, l3DiamondAddress, provider);
  const res = await l3Contract.call("get_supported_pools_my_swap", [], {
    blockIdentifier: "pending",
  });
  console.log("supported pools for Myswap is: ", res);
}

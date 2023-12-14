import { Contract, number, uint256 } from "starknet";
// import jediSwapAbi from "../abis_upgrade/l3_jedi_swap_abi.json";
// import pricerAbi from "../abis_upgrade/pricer_abi.json";
// import mySwapAbi from "../abis_upgrade/l3_my_swap_abi.json";
import jediSwapAbi from "../abis_mainnet/l3_jedi_swap_abi.json";
import pricerAbi from "../abis_mainnet/pricer_abi.json";
import mySwapAbi from "../abis_mainnet/l3_my_swap_abi.json";
import {
  diamondAddress,
  getProvider,
  getTokenFromAddress,
  l3DiamondAddress,
  processAddress,
} from "../stark-constants";
import { tokenAddressMap, tokenDecimalsMap } from "../utils/addressServices";
import { etherToWeiBN, parseAmount, weiToEtherNumber } from "../utils/utils";
import { NativeToken, Token } from "../interfaces/interfaces";

type LiquiditySplit = {
  amountA: number;
  tokenAAddress: string;
  tokenA: NativeToken;

  amountB: number;
  tokenBAddress: string;
  tokenB: NativeToken;
};

export async function getUSDValue(market: string, amount: number) {
  ////console.log("amount = ", amount * Math.pow(10, tokenDecimalsMap[market]));
  ////console.log("get_asset_usd_value", market, amount);
  // amount = parseFloat(amount);
  const provider = getProvider();
  try {
    const pricerContract = new Contract(pricerAbi, diamondAddress, provider);
    const res = await pricerContract.call(
      "get_asset_usd_value",
      [
        tokenAddressMap[market],
        [amount * Math.pow(10, tokenDecimalsMap[market]), 0],
      ],
      {
        blockIdentifier: "pending",
      }
    );
    ////console.log("tokendecimal", tokenDecimalsMap[market]);
    // ////console.log("res", res?.decimals?.words[0]);
    ////console.log("res", uint256.uint256ToBN(res?.usd_value).toString());

    ////console.log(
    //   "estimated usd value: ",
    //   parseAmount(
    //     uint256.uint256ToBN(res?.usd_value).toString(),
    //     res?.decimals?.words[0] + tokenDecimalsMap[market]
    //   )
    // );
    return parseAmount(
      uint256.uint256ToBN(res?.usd_value).toString(),
      res?.decimals?.words[0]
      // 8
    );
    // return [
    //   parseAmount(uint256.uint256ToBN(res?.amountA).toString(), 8),
    //   parseAmount(uint256.uint256ToBN(res?.amountB).toString(), 8),
    // ];
  } catch (error) {
   //console.log("error in getting usd value: ", error);
  }
}

// before interaction
export async function getJediEstimateLiquiditySplit(
  loanMarket: string,
  currentAmount: string,
  tokenA: string,
  tokenB: string
) {


  const provider = getProvider();
  try {
    const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);

    const res = await l3Contract.call(
      "get_jedi_estimate_liquidity_split",
      // [loanId, tokenAAddress, tokenBAddress],
      [
        tokenAddressMap[loanMarket],
        [currentAmount, 0],
        tokenAddressMap[tokenA],
        tokenAddressMap[tokenB],
      ],
      {
        blockIdentifier: "pending",
      }
    );
   
    const split1 = parseAmount(uint256.uint256ToBN(res?.amountA).toString(), 8);
    const split2 = parseAmount(uint256.uint256ToBN(res?.amountB).toString(), 8);
    ////console.log(split1,split2,"split amounts")
    return [split1, split2];
  } catch (error) {
   //console.log("error in getJediEstimateLiquiditySplit: ", error);
  }
}

// before interaction
export async function getJediEstimatedLpAmountOut(
  loanMarket: string,
  currentAmount: string,
  tokenA: string,
  tokenB: string
) {
 
  if (!currentAmount) {
    return 0;
  }

  const provider = getProvider();
  try {
    const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
    const res = await l3Contract.call(
      "get_jedi_estimated_lp_amount_out",
      // [loanId, tokenAAddress, tokenBAddress],
      [
        tokenAddressMap[loanMarket],
        [currentAmount, 0],
        tokenAddressMap[tokenA],
        tokenAddressMap[tokenB],
      ],
      {
        blockIdentifier: "pending",
      }
    );
  
    return parseAmount(uint256.uint256ToBN(res?.lp_amount_out), 18);
  } catch (error) {
   //console.log("error in getJediEstimatedLpAmountOut: ", error);
  }
}

// after interaction, in borrow screen, after getting getUserLoans
// liquidity is the currentAmount, pairAddress is the currentMarketAddress
export async function getJediEstimatedLiqALiqBfromLp(
  liquidity: string,
  loanId: any = 0,
  pairAddress: Token,
  loanMarket: string
) {
 //console.log("split", liquidity, loanId, pairAddress, loanMarket);

  // currentMarketAmount, currentMarketAddress
  const provider = getProvider();
  ////console.log("get_jedi_estimated_liqA_liqB_from_lp", [
  //   [liquidity, 0],
  //   pairAddress,
  // ]);

  try {
    const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
   //console.log("split before calling");
    const res = await l3Contract.call(
      "get_jedi_estimated_liqA_liqB_from_lp",
      // [liquidity, pairAddress],
      [[liquidity, 0], pairAddress],
      {
        blockIdentifier: "pending",
      }
    );
   //console.log("split after calling");
   //console.log("split res", loanId, res);

    ////console.log("res jedi", res);
    ////console.log(
    //   loanId,
    //   "l3 here ",
    //   tokenDecimalsMap[getTokenFromAddress(processAddress(res?.token0))?.name],
    //   tokenDecimalsMap[getTokenFromAddress(processAddress(res?.token1))?.name]
    // );
    if (!res) {
      return {};
    }
    const tokenA = getTokenFromAddress(processAddress(res?.token0))?.name;
    const tokenB = getTokenFromAddress(processAddress(res?.token1))?.name;
    ////console.log(
    //   "split token A",
    //   tokenA,
    //   tokenDecimalsMap[tokenA],
    //   "token B",
    //   tokenB,
    //   tokenDecimalsMap[tokenB],
    //   "loanId",
    //   loanId
    // );

   

    return {
      amountA: parseAmount(
        uint256.uint256ToBN(res?.amountA).toString(),
        tokenDecimalsMap[tokenA as Token]
      ),
      tokenAAddress: res?.token0,
      tokenA: getTokenFromAddress(res?.token0)?.name as NativeToken,

      amountB: parseAmount(
        uint256.uint256ToBN(res?.amountB).toString(),
        tokenDecimalsMap[tokenB as Token]
      ),
      tokenBAddress: res?.token1,
      tokenB: getTokenFromAddress(res?.token1)?.name as NativeToken,
    };
  } catch (error) {
   
  }
}
export async function getMySwapEstimateLiquiditySplit(
  loanMarket: string,
  currentAmount: string,
  tokenA: string,
  tokenB: string
) {


  const provider = getProvider();
  try {
    const l3Contract = new Contract(mySwapAbi, l3DiamondAddress, provider);

    const res = await l3Contract.call(
      "get_myswap_estimate_liquidity_split",
      // [loanId, tokenAAddress, tokenBAddress],
      [
        tokenAddressMap[loanMarket],
        [currentAmount, 0],
        tokenAddressMap[tokenA],
        tokenAddressMap[tokenB],
      ],
      {
        blockIdentifier: "pending",
      }
    );

    const split1 = parseAmount(uint256.uint256ToBN(res?.amountA).toString(), 8);
    const split2 = parseAmount(uint256.uint256ToBN(res?.amountB).toString(), 8);
    ////console.log(split1,split2,"split amounts")
    return [split1, split2];
  } catch (error) {
   //console.log("error in getJediEstimateLiquiditySplit: ", error);
  }
}

// before interaction
export async function getMySwapEstimatedLpAmountOut(
  loanMarket: string,
  currentAmount: string,
  tokenA: string,
  tokenB: string
) {

  if (!currentAmount) {
    return 0;
  }

  const provider = getProvider();
  try {
    const l3Contract = new Contract(mySwapAbi, l3DiamondAddress, provider);
    const res = await l3Contract.call(
      "get_myswap_estimated_lp_amount_out",
      // [loanId, tokenAAddress, tokenBAddress],
      [
        tokenAddressMap[loanMarket],
        [currentAmount, 0],
        tokenAddressMap[tokenA],
        tokenAddressMap[tokenB],
      ],
      {
        blockIdentifier: "pending",
      }
    );
    ////console.log(
    //   "estimated lp amount out for loanId: ",
    //   " is: ",
    //   parseAmount(uint256.uint256ToBN(res?.lp_amount_out))
    // );
    return parseAmount(uint256.uint256ToBN(res?.lp_amount_out), 18);
  } catch (error) {
   //console.log("error in getJediEstimatedLpAmountOut: ", error);
  }
}

// after interaction, in borrow screen, after getting getUserLoans
// liquidity is the currentAmount, pairAddress is the currentMarketAddress
export async function getMySwapEstimatedLiqALiqBfromLp(
  liquidity: string,
  loanId: any = 0,
  pairAddress: Token,
  loanMarket: string
) {
 //console.log("split", liquidity, loanId, pairAddress, loanMarket);

  // currentMarketAmount, currentMarketAddress
  const provider = getProvider();
  ////console.log("get_jedi_estimated_liqA_liqB_from_lp", [
  //   [liquidity, 0],
  //   pairAddress,
  // ]);

  try {
    const l3Contract = new Contract(mySwapAbi, l3DiamondAddress, provider);
    const res = await l3Contract.call(
      "get_myswap_estimated_liqA_liqB_from_lp",
      // [liquidity, pairAddress],
      [[liquidity, 0], pairAddress],
      {
        blockIdentifier: "pending",
      }
    );
   //console.log("split after calling");

    ////console.log("res jedi", res);
    ////console.log(
    //   loanId,
    //   "l3 here ",
    //   tokenDecimalsMap[getTokenFromAddress(processAddress(res?.token0))?.name],
    //   tokenDecimalsMap[getTokenFromAddress(processAddress(res?.token1))?.name]
    // );
    if (!res) {
      return {};
    }
    const tokenA = getTokenFromAddress(processAddress(res?.token0))?.name;
    const tokenB = getTokenFromAddress(processAddress(res?.token1))?.name;
    ////console.log(
    //   "split token A",
    //   tokenA,
    //   tokenDecimalsMap[tokenA],
    //   "token B",
    //   tokenB,
    //   tokenDecimalsMap[tokenB],
    //   "loanId",
    //   loanId
    // );

   

    return {
      amountA: parseAmount(
        uint256.uint256ToBN(res?.amountA).toString(),
        tokenDecimalsMap[tokenA as Token]
      ),
      tokenAAddress: res?.token0,
      tokenA: getTokenFromAddress(res?.token0)?.name as NativeToken,

      amountB: parseAmount(
        uint256.uint256ToBN(res?.amountB).toString(),
        tokenDecimalsMap[tokenB as Token]
      ),
      tokenBAddress: res?.token1,
      tokenB: getTokenFromAddress(res?.token1)?.name as NativeToken,
    };
  } catch (error) {
   console.log(error,"er in myswapsplit")
  }
}

export async function getSupportedPoolsJediSwap() {
  const provider = getProvider();
  try {
    const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
    const res = await l3Contract.call("get_supported_pools_jedi_swap", [], {
      blockIdentifier: "pending",
    });
    ////console.log("supported pools for Jediswap: ", res);
  } catch (error) {
   //console.log("error in getSupportedPoolsJediSwap: ", error);
  }
}

export async function getSupportedPoolsMyswap() {
  const provider = getProvider();
  try {
    const l3Contract = new Contract(mySwapAbi, l3DiamondAddress, provider);
    const res = await l3Contract.call("get_supported_pools_myswap", [], {
      blockIdentifier: "pending",
    });
    ////console.log("supported pools for Myswap is: ", res);
  } catch (error) {
   //console.log("error in getSupportedPoolsMyswap: ", error);
  }
}

// import { Contract, number, uint256 } from "starknet";
// import jediSwapAbi from "../abis/jedi_swap_abi.json";
// import mySwapAbi from "../abis/my_swap_abi.json";
// import {
//   getProvider,
//   getTokenFromAddress,
//   l3DiamondAddress,
// } from "../stark-constants";
// import { tokenAddressMap } from "../utils/addressServices";
// import { etherToWeiBN, parseAmount, weiToEtherNumber } from "../utils/utils";
// import { NativeToken } from "../interfaces/interfaces";

// type LiquiditySplit = {
//   amountA: number;
//   tokenAAddress: string;
//   tokenA: NativeToken;

//   amountB: number;
//   tokenBAddress: string;
//   tokenB: NativeToken;
// };

// // before interaction
// export async function getJediEstimateLiquiditySplit(
//   loan_market: string,
//   current_amount: number,
//   tokenA: string,
//   tokenB: string
// ) {
//  //console.log(
//     "getJediEstimatedLpAmountOut",
//     loan_market,
//     current_amount,
//     tokenA,
//     tokenB
//   );
//   let tokenAAddress = tokenAddressMap[tokenA];
//   let tokenBAddress = tokenAddressMap[tokenB];
//   const provider = getProvider();
//   try {
//     const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
//     const res = await l3Contract.call(
//       "get_jedi_estimate_liquidity_split",
//       // [loan_market, current_amount, tokenAAddress, tokenBAddress],
//       [
//         tokenAddressMap["ETH"],
//         [
//           etherToWeiBN(99, "USDT").toString(),
//           etherToWeiBN(99, "USDT").toString(),
//         ],
//         tokenAddressMap["ETH"],
//         tokenAddressMap["USDT"],
//       ],
//       {
//         blockIdentifier: "pending",
//       }
//     );
//    //console.log(
//       "estimated liquidity split for market : ",
//       loan_market,
//       "and loan amount : ",
//       current_amount,
//       " is: ",
//       res,
//       " for tokenA: ",
//       getTokenFromAddress(tokenA),
//       " and tokenB: ",
//       getTokenFromAddress(tokenB)
//     );
//     return [
//       parseAmount(uint256.uint256ToBN(res?.amountA).toString(), 8),
//       parseAmount(uint256.uint256ToBN(res?.amountB).toString(), 8),
//     ];
//   } catch (error) {
//    //console.log("error in getJediEstimateLiquiditySplit: ", error);
//   }
// }

// // before interaction
// export async function getJediEstimatedLpAmountOut(
//   loan_market: string,
//   current_amount: string,
//   tokenA: string,
//   tokenB: string
// ) {
//  //console.log(
//     "getJediEstimatedLpAmountOut",
//     loan_market,
//     current_amount,
//     tokenA,
//     tokenB
//   );
//   let tokenAAddress = tokenAddressMap[tokenA];
//   let tokenBAddress = tokenAddressMap[tokenB];
//   const provider = getProvider();
//   try {
//     const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
//     const res = await l3Contract.call(
//       "get_jedi_estimated_lp_amount_out",
//       [loan_market, current_amount, tokenAAddress, tokenBAddress],
//       {
//         blockIdentifier: "pending",
//       }
//     );
//    //console.log(
//       "estimated lp amount out for loanId: ",
//       loan_market,
//       "and loan amount : ",
//       current_amount,
//       " is: ",
//       res,
//       " for tokenA: ",
//       parseAmount(uint256.uint256ToBN(res?.lp_amount_out))
//     );
//     return parseAmount(uint256.uint256ToBN(res?.lp_amount_out), 18);
//   } catch (error) {
//    //console.log("error in getJediEstimatedLpAmountOut: ", error);
//   }
// }

// // after interaction, in borrow screen, after getting getUserLoans
// // liquidity is the currentAmount, pairAddress is the currentMarketAddress
// export async function getJediEstimatedLiqALiqBfromLp(
//   liquidity: string,
//   pairAddress: string
// ) {
//   // currentMarketAmount, currentMarketAddress
//   const provider = getProvider();
//   try {
//     const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
//     const res = await l3Contract.call(
//       "get_jedi_estimated_liqA_liqB_from_lp",
//       [liquidity, pairAddress],
//       {
//         blockIdentifier: "pending",
//       }
//     );
//     return {
//       amountA: parseAmount(uint256.uint256ToBN(res?.amountA).toString(), 8),
//       tokenAAddress: res?.token0,
//       tokenA: getTokenFromAddress(res?.token0)?.name as NativeToken,

//       amountB: parseAmount(uint256.uint256ToBN(res?.amountB).toString(), 8),
//       tokenBAddress: res?.token1,
//       tokenB: getTokenFromAddress(res?.token1)?.name as NativeToken,
//     };
//   } catch (error) {
//    //console.log("error in getJediEstimatedLiqALiqBfromLp: ", error);
//   }
// }

// export async function getSupportedPoolsJediSwap() {
//   const provider = getProvider();
//   try {
//     const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
//     const res = await l3Contract.call("get_supported_pools_jedi_swap", [], {
//       blockIdentifier: "pending",
//     });
//    //console.log("supported pools for Jediswap: ", res);
//   } catch (error) {
//    //console.log("error in getSupportedPoolsJediSwap: ", error);
//   }
// }

// export async function getSupportedPoolsMyswap() {
//   const provider = getProvider();
//   try {
//     const l3Contract = new Contract(mySwapAbi, l3DiamondAddress, provider);
//     const res = await l3Contract.call("get_supported_pools_my_swap", [], {
//       blockIdentifier: "pending",
//     });
//    //console.log("supported pools for Myswap is: ", res);
//   } catch (error) {
//    //console.log("error in getSupportedPoolsMyswap: ", error);
//   }
// }

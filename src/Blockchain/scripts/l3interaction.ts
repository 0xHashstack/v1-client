import { Contract, num, number, uint256 } from "starknet";
// import jediSwapAbi from "../abis_upgrade/l3_jedi_swap_abi.json";
// import pricerAbi from "../abis_upgrade/pricer_abi.json";
// import mySwapAbi from "../abis_upgrade/l3_my_swap_abi.json";
import jediSwapAbi from "../abis_mainnet/l3_jedi_swap_abi.json";
import pricerAbi from "../abis_mainnet/pricer_abi.json";
import mySwapAbi from "../abis_mainnet/l3_my_swap_abi.json";
import {
  config,
  contractsEnv,
  diamondAddress,
  getProvider,
  getTokenFromAddress,
  l3DiamondAddress,
  pragmaAddress,
  processAddress,
} from "../stark-constants";
import { tokenAddressMap, tokenDecimalsMap } from "../utils/addressServices";
import { etherToWeiBN, parseAmount, weiToEtherNumber } from "../utils/utils";
import { ILoan, NativeToken, Token } from "../interfaces/interfaces";
import { Address, MyBigNumber, Spend, SpendView, getMainnetConfig, getSepoliaConfig } from "@hashstackdev/itachi-sdk";
import BigNumber from "bignumber.js";

type LiquiditySplit = {
  amountA: number;
  tokenAAddress: string;
  tokenA: NativeToken;

  amountB: number;
  tokenBAddress: string;
  tokenB: NativeToken;
};
Object.defineProperty(BigInt.prototype, 'toJSON', {
  value: function() {
    return this.toString();
  },
  writable: true,
  configurable: true
});
export async function getUSDValue(market: string, amount: number) {
  ////console.log("amount = ", amount * Math.pow(10, tokenDecimalsMap[market]));
  ////console.log("get_asset_usd_value", market, amount);
  // amount = parseFloat(amount);
  const provider = getProvider();
  try {
    const pricerContract = new Contract(pricerAbi, diamondAddress, provider);
    const res:any = await pricerContract.call(
      "get_asset_usd_value",
      [
        tokenAddressMap[market],
        uint256.bnToUint256(amount * Math.pow(10, tokenDecimalsMap[market])),
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
    const tokens=contractsEnv.TOKENS
    const spendcalls = new SpendView(
      config,
      tokens,
      new Address(pragmaAddress)
    );

    const res:any = await spendcalls.get_jedi_estimated_liquidity_split(new Address(tokenAddressMap[loanMarket]),
    new MyBigNumber(currentAmount,tokenDecimalsMap[loanMarket]),
      new Address(tokenAddressMap[tokenA]),
     new Address(tokenAddressMap[tokenB]))
     console.log(Number(res?.amountA),Number(res?.amountB),"split l3")
      // [loanId, tokenAAddress, tokenBAddress],
    const split1 = parseAmount(Number(res?.amountA).toString(), 6);
    const split2 = parseAmount(Number(res?.amountB).toString(), 6);
    return [split1, split2];
  } catch (error) {
   console.log("error in getJediEstimateLiquiditySplit: ", error);
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
  try {
    const tokens=contractsEnv.TOKENS
    const spendcalls = new SpendView(
      config,
      tokens,
      new Address(pragmaAddress)
    );
    const res:any = await spendcalls.get_jedi_estimated_lp_amount_out(new Address(tokenAddressMap[loanMarket]),
    new MyBigNumber(currentAmount,tokenDecimalsMap[loanMarket]),
      new Address(tokenAddressMap[tokenA]),
     new Address(tokenAddressMap[tokenB]))
    return parseAmount(String(Number(res)), 18);
  } catch (error) {
   console.log("error in getJediEstimatedLpAmountOut: ", error);
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
    const tokens=contractsEnv.TOKENS
    const spendcalls = new SpendView(
      config,
      tokens,
      new Address(pragmaAddress)
    );
  //  console.log("split before calling",l3Contract,liquidity,pairAddress);
    const res:any = await spendcalls.get_jedi_estimated_liqA_liqB_from_lp(

      new MyBigNumber(liquidity,tokenDecimalsMap[loanMarket]), new Address(pairAddress)
    )
  //  console.log("split after calling");
  //  console.log("split res", loanId, res);

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
    const tokenA = getTokenFromAddress(processAddress(res?.tokenA?.address))?.name;
    const tokenB = getTokenFromAddress(processAddress(res?.tokenB?.address))?.name;
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
        String((res?.tokenAAmount)),
        tokenDecimalsMap[tokenA as Token]
      ),
      tokenAAddress: res?.tokenA?.address,
      tokenA: getTokenFromAddress(res?.tokenA)?.name as NativeToken,

      amountB: parseAmount(
        String((res?.tokenBAmount)),
        tokenDecimalsMap[tokenB as Token]
      ),
      tokenBAddress: res?.tokenB?.address,
      tokenB: getTokenFromAddress(res?.tokenB)?.name as NativeToken,
    };
  } catch (error) {
   console.log(error,"from lpamount a b")
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
    const tokens=contractsEnv.TOKENS
    const spendcalls = new SpendView(
      config,
      tokens,
      new Address(pragmaAddress)
    );

    const res:any = await spendcalls.get_myswap_estimated_liquidity_split(
      new Address(tokenAddressMap[loanMarket]),
      new MyBigNumber(currentAmount,tokenDecimalsMap[loanMarket]),
        new Address(tokenAddressMap[tokenA]),
       new Address(tokenAddressMap[tokenB])
    )

    const split1 = parseAmount(Number(res?.amountA).toString(), 6);
    const split2 = parseAmount(Number(res?.amountB).toString(), 6);
    return [split1, split2];
  } catch (error) {
   console.log("error in getJediEstimateLiquiditySplit: ", error);
  }
}

export async function getZklendCallData(Loan:any,typeCall:string='normal'){
  try {
    const spendcalls = new Spend(
      config,
      diamondAddress,
      contractsEnv?.TOKENS
    );
    const dataprocessedBorrowandSpend={
      loan_id:'0',
      underlyingMarket: new Address(tokenAddressMap[Loan?.underlyingMarket]),
      underlyingDecimals: tokenDecimalsMap[Loan?.underlyingMarket],
      currentMarket: new Address(tokenAddressMap[Loan?.underlyingMarket]),
      currentAmount: new MyBigNumber(Loan?.currentLoanAmount,tokenDecimalsMap[Loan?.underlyingMarket]),
      state: 1
    }
    const dataprocessedLoan=await spendcalls.getLoanRecord(Loan?.loanId)
    const res=await spendcalls.getZkLendLiquidityCalldata(typeCall==='normal'?dataprocessedLoan:dataprocessedBorrowandSpend)
    return res;
   
  } catch (error) {
    // console.log(error,'err in stats')
  }
}

export async function getJediswapCallData(Loan:any,toMarketSwap:NativeToken,typeCall:string='normal'){
  try {
    const spendcalls = new Spend(
      config,
      diamondAddress,
      contractsEnv?.TOKENS
    );
    
    const dataprocessedBorrowandSpend={
      loan_id:'0',
      underlyingMarket: new Address(tokenAddressMap[Loan?.underlyingMarket]),
      underlyingDecimals: tokenDecimalsMap[Loan?.underlyingMarket],
      currentMarket: new Address(tokenAddressMap[Loan?.underlyingMarket]),
      currentAmount: new MyBigNumber(Loan?.currentLoanAmount,tokenDecimalsMap[Loan?.underlyingMarket]),
      state: 1
    }
    if(typeCall==='normal'){
      const dataprocessedLoan=await spendcalls.getLoanRecord(Loan?.loanId)
      const res=await spendcalls.getJediSwapCalldata(dataprocessedLoan,new Address(tokenAddressMap[toMarketSwap]),0.5)
      return res;
    }else{
      const res=await spendcalls.getJediSwapCalldata(dataprocessedBorrowandSpend,new Address(tokenAddressMap[toMarketSwap]),0.5)
      return res;
    }
   
  } catch (error) {
    console.log(error,'err in getJediswapCallData')
  }
}

export async function getMyswapCallData(Loan:any,toMarketSwap:NativeToken,typeCall:string='normal'){
  try {
    const spendcalls = new Spend(
      config,
      diamondAddress,
      contractsEnv?.TOKENS
    );
    
    const dataprocessedBorrowandSpend={
      loan_id:'0',
      underlyingMarket: new Address(tokenAddressMap[Loan?.underlyingMarket]),
      underlyingDecimals: tokenDecimalsMap[Loan?.underlyingMarket],
      currentMarket: new Address(tokenAddressMap[Loan?.underlyingMarket]),
      currentAmount: new MyBigNumber(Loan?.currentLoanAmount,tokenDecimalsMap[Loan?.underlyingMarket]),
      state: 1
    }
    if(typeCall==='normal'){
      const dataprocessedLoan=await spendcalls.getLoanRecord(Loan?.loanId)
      const res=await spendcalls.getMySwapCalldata(dataprocessedLoan,new Address(tokenAddressMap[toMarketSwap]),100)
      return res;
    }else{
      const res=await spendcalls.getMySwapCalldata(dataprocessedBorrowandSpend,new Address(tokenAddressMap[toMarketSwap]),100)
      return res;
    }
   
  } catch (error) {
    console.log(error,'err in getJediswapCallData')
  }
}

export async function getJediswapLiquidityCallData(Loan:any,toMarketLiqA:NativeToken,toMarketLiqB:NativeToken,typeCall:string='normal'){
  try {
    const spendcalls = new Spend(
      config,
      diamondAddress,
      contractsEnv?.TOKENS
    );
    const dataprocessedBorrowandSpend={
      loan_id:'0',
      underlyingMarket: new Address(tokenAddressMap[Loan?.underlyingMarket]),
      underlyingDecimals: tokenDecimalsMap[Loan?.underlyingMarket],
      currentMarket: new Address(tokenAddressMap[Loan?.underlyingMarket]),
      currentAmount: new MyBigNumber(Loan?.currentLoanAmount,tokenDecimalsMap[Loan?.underlyingMarket]),
      state: 1
    }
    if(typeCall==='normal'){
      const dataprocessedLoan=await spendcalls.getLoanRecord(Loan?.loanId)
      const res=await spendcalls.getJediLiquidityCalldata(dataprocessedLoan,new Address(tokenAddressMap[toMarketLiqA]),new Address(tokenAddressMap[toMarketLiqB]))
      return res;
    }else{
      const res=await spendcalls.getJediLiquidityCalldata(dataprocessedBorrowandSpend,new Address(tokenAddressMap[toMarketLiqA]),new Address(tokenAddressMap[toMarketLiqB]))
      return res;
    }
   
  } catch (error) {
    console.log(error,'err in getJediswapLiquidityCallData')
  }
}

export async function getMyswapLiquidityCallData(Loan:any,toMarketLiqA:NativeToken,toMarketLiqB:NativeToken,typeCall:string='normal'){
  try {
    const spendcalls = new Spend(
      config,
      diamondAddress,
      contractsEnv?.TOKENS
    );
    const dataprocessedBorrowandSpend={
      loan_id:'0',
      underlyingMarket: new Address(tokenAddressMap[Loan?.underlyingMarket]),
      underlyingDecimals: tokenDecimalsMap[Loan?.underlyingMarket],
      currentMarket: new Address(tokenAddressMap[Loan?.underlyingMarket]),
      currentAmount: new MyBigNumber(Loan?.currentLoanAmount,tokenDecimalsMap[Loan?.underlyingMarket]),
      state: 1
    }
    if(typeCall==='normal'){
      const dataprocessedLoan=await spendcalls.getLoanRecord(Loan?.loanId)
      const res=await spendcalls. getMySwapLiquidityCalldata(dataprocessedLoan,new Address(tokenAddressMap[toMarketLiqA]),new Address(tokenAddressMap[toMarketLiqB]))
      return res;
    }else{
      const res=await spendcalls. getMySwapLiquidityCalldata(dataprocessedBorrowandSpend,new Address(tokenAddressMap[toMarketLiqA]),new Address(tokenAddressMap[toMarketLiqB]))
      return res;
    }
   
  } catch (error) {
    // console.log(error,'err in stats')
  }
}

export async function getJediSwapRevertCalldata(Loan_id:string){
  try {
    const spendcalls = new Spend(
      config,
      diamondAddress,
      contractsEnv?.TOKENS
    );
    const dataprocessedLoan=await spendcalls.getLoanRecord(Loan_id)
    const res=await spendcalls.getRevertJediSwapCalldata(dataprocessedLoan,0.5)
    return res;
   
  } catch (error) {
    // console.log(error,'err in stats')
  }
}

export async function getJediSwapLiquidityRevertCalldata(Loan_id:string){
  try {
    const spendcalls = new Spend(
      config,
      diamondAddress,
      contractsEnv?.TOKENS
    );
    const dataprocessedLoan=await spendcalls.getLoanRecord(Loan_id)
    const res=await spendcalls.getRevertJediLiquidityCalldata(dataprocessedLoan,0.5)
    return res;
   
  } catch (error) {
    // console.log(error,'err in stats')
  }
}

export async function getMySwapLiquidityRevertCalldata(Loan_id:string){
  try {
    const spendcalls = new Spend(
      config,
      diamondAddress,
      contractsEnv?.TOKENS
    );
    const dataprocessedLoan=await spendcalls.getLoanRecord(Loan_id)
    const res=await spendcalls.getRevertMySwapLiquidityCalldata(dataprocessedLoan)
    return res;
   
  } catch (error) {
    // console.log(error,'err in stats')
  }
}

export async function getMySwapRevertCalldata(Loan_id:string){
  try {
    const spendcalls = new Spend(
      config,
      diamondAddress,
      contractsEnv?.TOKENS
    );
    const dataprocessedLoan=await spendcalls.getLoanRecord(Loan_id)
    const res=await spendcalls.getRevertMySwapCalldata(dataprocessedLoan)
    return res;
   
  } catch (error) {
    // console.log(error,'err in stats')
  }
}

export async function getzklendRevertCallData(Loan_id:string){
  try {
    const spendcalls = new Spend(
      config,
      diamondAddress,
      contractsEnv?.TOKENS
    );
    const res=await spendcalls.getRevertZkLendLiquidityCalldata(Loan_id)
    return res;
   
  } catch (error) {
    // console.log(error,'err in stats')
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

  try {
    const tokens=contractsEnv.TOKENS
    const spendcalls = new SpendView(
      config,
      tokens,
      new Address(pragmaAddress)
    );
    const res:any = await spendcalls.get_myswap_estimated_lp_amount_out(
      new Address(tokenAddressMap[loanMarket]),
      new MyBigNumber(currentAmount,tokenDecimalsMap[loanMarket]),
        new Address(tokenAddressMap[tokenA]),
       new Address(tokenAddressMap[tokenB]))
      return parseAmount(String(Number(res)), 18)

    ////console.log(
    //   "estimated lp amount out for loanId: ",
    //   " is: ",
    //   parseAmount(uint256.uint256ToBN(res?.lp_amount_out))
    // );
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
    const tokens=contractsEnv.TOKENS
    const spendcalls = new SpendView(
      config,
      tokens,
      new Address(pragmaAddress)
    );
   //console.log("split before calling");
    const res:any = await spendcalls.get_myswap_estimated_liqA_liqB_from_lp(
      new MyBigNumber(liquidity,tokenDecimalsMap[loanMarket]), new Address(pairAddress)
    )
   //console.log("split after calling");
  //  console.log("split res", loanId, res);

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
    const tokenA = getTokenFromAddress(processAddress(res?.tokenA?.address))?.name;
    const tokenB = getTokenFromAddress(processAddress(res?.tokenB?.address))?.name;
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
        String((res?.tokenAAmount)),
        tokenDecimalsMap[tokenA as Token]
      ),
      tokenAAddress: res?.tokenA?.address,
      tokenA: getTokenFromAddress(res?.tokenA)?.name as NativeToken,

      amountB: parseAmount(
        String((res?.tokenBAmount)),
        tokenDecimalsMap[tokenB as Token]
      ),
      tokenBAddress: res?.tokenB?.address,
      tokenB: getTokenFromAddress(res?.tokenB)?.name as NativeToken,
    };
  } catch (error) {
   console.log(error,"error in myswapliquidity")
  }
}

function findZToken(data: any, underlyingToken: any) {
  for (let item of data) {
      if (item.underlying?.address === underlyingToken) {
          return item.zToken?.address;
      }
  }
  return null;  // If no match is found
}

export async function getZklendusdSpendValue(amount:number,coin: string,decimals:number ) {
  try {
  const tokens=contractsEnv.TOKENS
  const bignum=new MyBigNumber(amount,decimals)
    const spendcalls = new SpendView(
      config,
      tokens,
      new Address('0x36031daa264c24520b11d93af622c848b2499b66b41d611bac95e13cfca131a')
    );
    const ztokens=await spendcalls.get_supported_zklend_tokens();
    const ztokenaddress=findZToken(ztokens,coin)
    const res:any = await spendcalls.get_usd_value_zklend(new Address(ztokenaddress),bignum)
  
  return Number(res);

    ////console.log("supported pools for Jediswap: ", res);
  } catch (error) {
   console.log("error in getZklendusdSpendValue ", error);
  }
}

export async function getSupportedPoolsJediSwap() {
  const provider = getProvider();
  try {
    const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
    const res:any = await l3Contract.call("get_supported_pools_jedi_swap", [], {
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
    const res:any = await l3Contract.call("get_supported_pools_myswap", [], {
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

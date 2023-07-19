import { Contract, uint256, number } from "starknet";
import {
  getJediEstimateLiquiditySplit,
  getJediEstimatedLiqALiqBfromLp,
  getJediEstimatedLpAmountOut,
} from "../src/Blockchain/scripts/l3interaction";
import jediSwapAbi from "../src/Blockchain/abi_new/l3_jedi_swap.json";
import {
  getProvider,
  l3DiamondAddress,
} from "../src/Blockchain/stark-constants";
import { tokenAddressMap } from "../src/Blockchain/utils/addressServices";
import { parseAmount } from "../src/Blockchain/utils/utils";
import { TextEncoder, TextDecoder } from "text-encoding-utf-8";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
describe("Get l3 interaction function values", () => {
  it("displays the liquidity split", async () => {
    const expectedLiquiditySplit = [14.501667, 14.5];
    // const expectedLiquiditySplit = 0.052407;
    const loanMarket = "USDC";
    const currentAmount = "29970001";
    const tokenA = "USDC";
    const tokenB = "USDT";
    // const liquiditySplit = await getJediEstimateLiquiditySplit(
    //   loanMarket,
    //   currentAmount,
    //   tokenA,
    //   tokenB
    // );
    // console.log(liquiditySplit,"split test")
    const provider = getProvider();
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
    // console.log(split1,split2,"split amounts")
    const liquiditySplit = [split1, split2];

    expect(liquiditySplit).toBe(expectedLiquiditySplit);
  });
  // it("displays the liquidity split after interaction", async () => {
  //   const expectedLiquiditySplit = {
  //     amountA: 1367.71093,
  //     tokenAAddress:
  //       "027d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
  //     tokenA: "USDC",
  //     amountB: 1367.772494,
  //     tokenBAddress:
  //       "04b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
  //     tokenB: "USDT",
  //     loanId: 169,
  //   };
  //   const currentLoanAmount = 1367772494;

  //   const loanId = 169;

  //   const currentLoanMarketAddress =
  //     "0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e";
  //   const loanMarket = "USDT";

  //   const liquiditySplit = await getJediEstimatedLiqALiqBfromLp(
  //     currentLoanAmount,
  //     loanId,
  //     currentLoanMarketAddress,
  //     loanMarket
  //   );
  //   expect(expectedLiquiditySplit).toBe(liquiditySplit);
  // });
});

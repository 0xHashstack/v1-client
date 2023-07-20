import { Contract, uint256, number } from "starknet";
import {
  getJediEstimateLiquiditySplit,
  getJediEstimatedLiqALiqBfromLp,
  getJediEstimatedLpAmountOut,
} from "../src/Blockchain/scripts/l3interaction";
import jediSwapAbi from "../src/Blockchain/abi_new/l3_jedi_swap_abi.json";
import {
  getProvider,
  getTokenFromAddress,
  l3DiamondAddress,
  processAddress,
} from "../src/Blockchain/stark-constants";
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "../src/Blockchain/utils/addressServices";
import { parseAmount } from "../src/Blockchain/utils/utils";
import { TextEncoder, TextDecoder } from "text-encoding-utf-8";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
describe("Get l3 interaction function values", () => {
  it("displays the liquidity split", async () => {
    const expectedLiquiditySplit = [149.85, 149.84101];
    // const expectedLiquiditySplit = 0.052407;
    const loanMarket = "USDC";
    const currentAmount = "299700001";
    const tokenA = "USDC";
    const tokenB = "USDT";
    const provider = getProvider();
    const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
    const res = await l3Contract.call(
      "get_jedi_estimate_liquidity_split",
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
    const liquiditySplit = [split1, split2];

    expect(liquiditySplit).toStrictEqual(expectedLiquiditySplit);
  });
  it("displays the lp token amount", async () => {
    const expectedLiquiditySplit = 0.360485;
    // const expectedLiquiditySplit = 0.052407;
    const loanMarket = "USDC";
    const currentAmount = "299700001";
    const tokenA = "ETH";
    const tokenB = "USDC";
    const provider = getProvider();
    const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
    const res = await l3Contract.call(
      "get_jedi_estimated_lp_amount_out",
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

    const liquiditySplit = parseAmount(
      uint256.uint256ToBN(res?.lp_amount_out),
      18
    );

    expect(liquiditySplit).toStrictEqual(expectedLiquiditySplit);
  });
  it("displays the lp amount after interaction", async () => {
    const expectedLiquiditySplit = {
      amountA: 1367.71093,
      tokenAAddress:
        "027d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
      tokenA: "USDC",
      amountB: 1367.772494,
      tokenBAddress:
        "04b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
      tokenB: "USDT",
      loanId: 169,
    };

    const liquidity = "1367772494";
    const loanId = 169;
    const pairAddress =
      "0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e";
    const loanMarket = "dUSDT";

    const provider = getProvider();
    const l3Contract = new Contract(jediSwapAbi, l3DiamondAddress, provider);
    console.log("split before calling");
    const res = await l3Contract.call(
      "get_jedi_estimated_liqA_liqB_from_lp",
      // [liquidity, pairAddress],
      [[liquidity, 0], pairAddress],
      {
        blockIdentifier: "pending",
      }
    );
    const tokenA = getTokenFromAddress(processAddress(res?.token0))?.name;
    const tokenB = getTokenFromAddress(processAddress(res?.token1))?.name;
    const liquiditySplit = {
      amountA: parseAmount(
        uint256.uint256ToBN(res?.amountA).toString(),
        tokenDecimalsMap[tokenA ? tokenA : "USDT"]
      ),
      tokenAAddress: res?.token0,
      tokenA: getTokenFromAddress(res?.token0)?.name,

      amountB: parseAmount(
        uint256.uint256ToBN(res?.amountB).toString(),
        tokenDecimalsMap[tokenB ? tokenB : "USDT"]
      ),
      tokenBAddress: res?.token1,
      tokenB: getTokenFromAddress(res?.token1)?.name,
    };
    expect(liquiditySplit).toStrictEqual(expectedLiquiditySplit);
  });
});

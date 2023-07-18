import {
  getJediEstimateLiquiditySplit,
  getJediEstimatedLiqALiqBfromLp,
  getJediEstimatedLpAmountOut,
} from "../src/Blockchain/scripts/l3interaction";

describe("Get l3 interaction function values", () => {
  it("displays the liquidity split", async () => {
    const expectedLiquiditySplit = [14.501667, 14.5];
    // const expectedLiquiditySplit = 0.052407;
    const loanMarket = "USDC";
    const currentAmount = "29970001";
    const tokenA = "USDC";
    const tokenB = "USDT";
    const liquiditySplit = await getJediEstimateLiquiditySplit(
      loanMarket,
      currentAmount,
      tokenA,
      tokenB
    );
    console.log(liquiditySplit,"split test")
    expect(liquiditySplit).toBe(expectedLiquiditySplit);
  });
  it("displays the liquidity split after interaction", async () => {
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
    const currentLoanAmount = 1367772494;

    const loanId = 169;

    const currentLoanMarketAddress =
      "0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e";
    const loanMarket = "USDT";

    const liquiditySplit = await getJediEstimatedLiqALiqBfromLp(
      currentLoanAmount,
      loanId,
      currentLoanMarketAddress,
      loanMarket
    );
    expect(expectedLiquiditySplit).toBe(liquiditySplit);
  });
});

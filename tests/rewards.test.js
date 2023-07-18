import { getrTokensMinted } from "../src/Blockchain/scripts/Rewards";

describe("Get l3 interaction function values", () => {
  it("displays the estimated rTokens minted", async () => {
    const expectedRTokensMinted = 32.75;
    const rToken = "rUSDT";
    const collateralAmount = 32.8;
    const rTokensMinted = await getrTokensMinted(rToken, collateralAmount);
    expect(rTokensMinted).toBe(expectedRTokensMinted);
  });
});

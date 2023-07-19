import { Contract } from "starknet";
import { getrTokensMinted } from "../src/Blockchain/scripts/Rewards";
import { getProvider } from "../src/Blockchain/stark-constants";
import { etherToWeiBN, parseAmount } from "../src/Blockchain/utils/utils";
import supplyABI from "../src/Blockchain/abi_new/supply_abi.json";
import { tokenAddressMap } from "../src/Blockchain/utils/addressServices";

describe("Get l3 interaction function values", () => {
  it("displays the estimated rTokens minted", async () => {
    const expectedRTokensMinted = 32.75;
    const rToken = "rUSDT";
    const collateralAmount = 32.8;
    // const rTokensMinted = await getrTokensMinted(rToken, collateralAmount);

    const provider = getProvider();
    const supplyContract = new Contract(
      supplyABI,
      tokenAddressMap[rToken],
      provider
    );
    // console.log("Called")
    // console.log(supplyContract,"suppply contract")
    const parsedAmount = etherToWeiBN(collateralAmount, rToken).toString();
    // console.log(parsedAmount, "parsed amount");
    const res = await supplyContract.call(
      "preview_deposit",
      [[parsedAmount, 0]],
      {
        blockIdentifier: "pending",
      }
    );
    // console.log(res, "data in rewards");
    const data = parseAmount(
      uint256.uint256ToBN(res?.shares).toString(),
      tokenDecimalsMap[rToken]
    );
    // console.log(
    //     parseAmount(
    //         uint256.uint256ToBN(res?.shares).toString(),
    //         tokenDecimalsMap[rToken]
    //     )
    // );
    const rTokensMinted = data.toFixed(2);

    expect(rTokensMinted).toBe(expectedRTokensMinted);
  });
});

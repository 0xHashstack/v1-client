import {
  diamondAddress,
  getProvider,
  metricsContractAddress,
} from "../src/Blockchain/stark-constants";
import { TextEncoder, TextDecoder } from 'text-encoding-utf-8';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import supplyABI from "../src/Blockchain/abi_new/supply_abi.json";
import { Contract,uint256 } from "starknet";
import { tokenAddressMap,tokenDecimalsMap } from "../src/Blockchain/utils/addressServices";
import { etherToWeiBN, parseAmount } from "../src/Blockchain/utils/utils";
describe("Get l3 interaction function values", () => {
  it("displays the estimated rTokens minted", async () => {
    const expectedRTokensMinted = 144.672119;
    const rToken = "rUSDT";
    const collateralAmount = "144.67";
    const provider =getProvider();
    const supplyContract=new Contract(
      supplyABI,
      tokenAddressMap[rToken],
      provider
    );
    const parsedAmount = etherToWeiBN(collateralAmount, rToken).toString();
    const res = await supplyContract.call(
      "preview_deposit",
      [[parsedAmount, 0]],
      {
        blockIdentifier: "pending",
      }
    );
    const data = parseAmount(
      uint256.uint256ToBN(res?.shares).toString(),
      tokenDecimalsMap[rToken]
    );
    console.log(typeof data)
    expect(data).toBe(expectedRTokensMinted);
  });
});

import {
  diamondAddress,
  getProvider,
  metricsContractAddress,
} from "../src/Blockchain/stark-constants";
import { TextEncoder, TextDecoder } from "text-encoding-utf-8";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import supplyABI from "../src/Blockchain/abi_new/supply_abi.json";
import { Contract, number, uint256 } from "starknet";
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "../src/Blockchain/utils/addressServices";
import { etherToWeiBN, parseAmount } from "../src/Blockchain/utils/utils";
import stakingAbi from "../src/Blockchain/abi_new/staking_abi.json";
describe("Get estimated values", () => {
  it("displays the estimated rTokens minted add collateral", async () => {
    const expectedRTokensMinted = "144.4";
    const rToken = "rUSDT";
    const collateralAmount = "144.67";
     const provider = new RpcProvider({ nodeUrl: rpcUrl});;
    const supplyContract = new Contract(
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
      uint256.uint256ToBN(res[0]).toString(),
      tokenDecimalsMap[rToken]
    );

    expect(data.toFixed(1)).toBe(expectedRTokensMinted);
  });
  it("display the estimated supply amount while withdrawing", async () => {
    const expectedSupplyUnlocked = 2050.9;
    const rToken = "rUSDT";
    const amount = "2052.1";
    const provider = getProvider();
    const supplyContract = new Contract(
      supplyABI,
      tokenAddressMap[rToken],
      provider
    );
    const parsedAmount = etherToWeiBN(amount, rToken).toString();
    const res = await supplyContract.call(
      "preview_redeem",
      [[parsedAmount, 0]],
      {
        blockIdentifier: "pending",
      }
    );
    const data = parseAmount(
      uint256.uint256ToBN(res?.asset_amount_to_withdraw).toString(),
      tokenDecimalsMap[rToken]
    );
    const lowerBound = expectedSupplyUnlocked - 1; // You can adjust the range as needed
    const upperBound = expectedSupplyUnlocked+ 1;
    expect(data).toBeGreaterThanOrEqual(lowerBound);
    expect(data).toBeLessThanOrEqual(upperBound);
  });
  it("display the estimated r tokens", async () => {
    const expectedrTokensUnlocked = 144.6;
    const rToken = "rUSDT";
    const amount = "144.67";
    const provider = getProvider();
    const stakingContract = new Contract(
      stakingAbi,
      "0x386d428081fcae8d28cfdc1ff913fd6cd5da3c93d54060fb20687e8791c12e0",
      provider
    );
    const parsedAmount = etherToWeiBN(amount, rToken).toString();
    const res = await stakingContract.call(
      "preview_redeem",
      [tokenAddressMap[rToken], [parsedAmount, 0]],
      {
        blockIdentifier: "pending",
      }
    );
    const data = parseAmount(
      uint256.uint256ToBN(res?.rToken_amount_to_withdraw).toString(),
      tokenDecimalsMap[rToken]
    );
    const lowerBound = expectedrTokensUnlocked - 1; // You can adjust the range as needed
    const upperBound = expectedrTokensUnlocked + 1;
    expect(data).toBeGreaterThanOrEqual(lowerBound);
    expect(data).toBeLessThanOrEqual(upperBound);
  });
});

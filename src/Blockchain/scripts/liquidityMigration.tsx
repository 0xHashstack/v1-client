import { Contract, number, uint256 } from "starknet";

// import stakingAbi from "../abis_upgrade/staking_abi.json";
// import supplyABI from "../abis_upgrade/supply_abi.json";
// import governorAbi from "../abis_upgrade/governor_abi.json";
import stakingAbi from "../abis_mainnet/staking_abi.json";
import supplyABI from "../abis_mainnet/supply_abi.json";
import liqudityAbi from "../abis_mainnet/liquidity_migration_abi.json"
import governorAbi from "../abis_mainnet/governor_abi.json";
import comptrollerAbi from "../abis_mainnet/comptroller_abi.json";
import nftAbi from "../abis_mainnet/nft_soul_abi.json";
import borrowTokenAbi from "../abis_mainnet/dToken_abi.json";
import {
  diamondAddress,
  getProvider,
  stakingContractAddress,
  nftAddress
} from "../stark-constants";
import { parseAmount } from "../utils/utils";

// import { useContractWrite } from "@starknet-react/core";

// const { address } = useAccount();
export async function get_user_holding_zklend(address:any) {
  ////console.log("getRtokensminted", rToken, amount);

  try {
    const provider = getProvider();
    const migrationContract = new Contract(
      liqudityAbi.abi,
      "0x07663daea12ba87926a2b4161389e352a1d1304da4b67573a7ffcca74743982e",
      provider
    );
    
    ////console.log("Called")
    ////console.log(supplyContract,"suppply contract")
    ////console.log(parsedAmount, "parsed amount");
    // "0xc92a503b2979197bb5d671f70f50ca48f3d144eaa90bc0a831684313f6e683"
    const res:any = await migrationContract.call(
      "get_user_holding_zkLend",
      [address],
      {
        blockIdentifier: "pending",
      }
    );
    // console.log(res)
    // console.log(parseAmount(res[0][0].toString(),18),"called")
    ////console.log(res, "data in rewards");
  } catch (err) {
  //  console.log(err,"err in migration");
  }
}
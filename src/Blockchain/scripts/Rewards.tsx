import { Contract, number, uint256 } from "starknet";
// import stakingAbi from "../abis/staking_abi.json"
// import supplyABI from "../abis/supply_abi.json"
import stakingAbi from "../abi_new/staking_abi.json";
import supplyABI from "../abi_new/supply_abi.json";
import {
    diamondAddress,
    getProvider,
    metricsContractAddress,
} from "../stark-constants";
import { tokenAddressMap, tokenDecimalsMap } from "../utils/addressServices";
import { etherToWeiBN, parseAmount } from "../utils/utils";
// import { useContractWrite } from "@starknet-react/core";
import { useState } from "react";
import { RToken } from "../interfaces/interfaces";
export async function getrTokensMinted(rToken: any, amount: any) {
    try {
        const provider = getProvider();
        const supplyContract = new Contract(
            supplyABI,
            tokenAddressMap[rToken],
            provider
        );
        // console.log("Called")
        // console.log(supplyContract,"suppply contract")
        const parsedAmount = etherToWeiBN(amount, rToken).toString();
        console.log(parsedAmount, "parsed amount");
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
        console.log(
            parseAmount(
                uint256.uint256ToBN(res?.shares).toString(),
                tokenDecimalsMap[rToken]
            )
        );
        return data.toFixed(2);
    } catch (err) {
        console.log(err);
        console.log("err in rewards");
    }
}
export async function getSupplyunlocked(rToken: any, amount: any) {
    try {
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
        console.log(res, "data in est supply");
        const data = parseAmount(
            uint256.uint256ToBN(res?.asset_amount_to_withdraw).toString(),
            tokenDecimalsMap[rToken]
        );
        // console.log(parseAmount(uint256.uint256ToBN(res?.asset_amount_to_withdraw).toString(),8),"parsed")
        return data.toFixed(2);
    } catch (err) {
        console.log(err, "err in getSupplyUnlocked");
    }
}

export async function getEstrTokens(rToken: any, amount: any) {
    try {
        const provider = getProvider();
        const stakingContract = new Contract(
            stakingAbi,
            "0x73e84ffcc178373b80cf2109d0e9beb93da9710d32a93a45eeeada957c133bd",
            provider
        )
        // const parsedAmount=etherToWeiBN(amount,rToken).toString();
        // console.log(parseAmount,"amount in staking")
        console.log(stakingContract, "staking contract")
        const parsedAmount = etherToWeiBN(amount, rToken).toString();
        const res = await stakingContract.call("preview_redeem", [tokenAddressMap[rToken], [parsedAmount, 0]], {
            blockIdentifier: "pending",
        });
        const data = parseAmount(
            uint256.uint256ToBN(res?.rToken_amount_to_withdraw).toString(),
            tokenDecimalsMap[rToken]
        );
        console.log(res, "call in stake");
        return 24;
    } catch (err) {
        console.log(err, "err in est rtokens staking")
    }

}

// const userTokensMinted=()=>{
//     const [rToken1, setRToken1] = useState<RToken>("rUSDT");
//     const [rTokenAmount1, setRTokenAmount1] = useState<number>(20.0);
//     // const { address: owner } = useAccount();
//     const {
//                     data: dataStakeRequest1,
//                     error: errorStakeRequest1,
//                     reset: resetStakeRequest1,
//                     write: writeStakeRequest1,
//                     writeAsync: writeAsyncStakeRequest1,
//                     isError: isErrorStakeRequest1,
//                     isIdle: isIdleStakeRequest1,
//                     isLoading: isLoadingStakeRequest1,
//                     isSuccess: isSuccessStakeRequest1,
//                     status: statusStakeRequest1,
//                   } = useContractWrite({
//                     calls: [
//                       {
//                         contractAddress: "0x73e84ffcc178373b80cf2109d0e9beb93da9710d32a93a45eeeada957c133bd",
//                         entrypoint: "preview_redeem",
//                         calldata: [
//                             tokenAddressMap[rToken1],
//                           etherToWeiBN(rTokenAmount1, rToken1).toString(),
//                           "0",
//                         ],
//                       },
//                     ],
//                   });
//                 // console.log(dataStakeRequest1,"data estrtokens")
//                 return {
//                     rToken1,
//                     setRToken1,
//                     rTokenAmount1,
//                     setRTokenAmount1,
//                     dataStakeRequest1,
//                     errorStakeRequest1,
//                     resetStakeRequest1,
//                     writeStakeRequest1,
//                     writeAsyncStakeRequest1,
//                     isErrorStakeRequest1,
//                     isIdleStakeRequest1,
//                     isLoadingStakeRequest1,
//                     isSuccessStakeRequest1,
//                     statusStakeRequest1,
//                   };
// }
// export default userTokensMinted;

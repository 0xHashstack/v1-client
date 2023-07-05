import { Contract,number,uint256 } from "starknet";
import stakingAbi from "../abis/staking_abi.json"
import supplyABI from "../abis/supply_abi.json"
import { getProvider, metricsContractAddress } from "../stark-constants";
import { tokenAddressMap, tokenDecimalsMap } from "../utils/addressServices";
import { etherToWeiBN, parseAmount } from "../utils/utils";
export async function getrTokensMinted(rToken:any,amount:any){
    try{
        const provider = getProvider();
        const supplyContract=new Contract(
            supplyABI,
            tokenAddressMap[rToken],
            provider
        )
        const parsedAmount=etherToWeiBN(amount,rToken).toString();
        console.log( parsedAmount,"parsed amount")
        const res = await supplyContract.call("preview_deposit",[[parsedAmount,0]],{
            blockIdentifier: "pending",
        });
        console.log(res?.shares,"data in rewards")
        const data=parseAmount(uint256.uint256ToBN(res?.shares).toString(),tokenDecimalsMap[rToken])
        console.log(parseAmount(uint256.uint256ToBN(res?.shares).toString(),tokenDecimalsMap[rToken]))
        return data.toFixed(2);

    }catch(err){
        console.log(err);
        console.log("err in rewards")
    }
}
export async function getSupplyunlocked(rToken:any,amount:any){
        try{
            const provider = getProvider();
            const supplyContract=new Contract(
                supplyABI,
                tokenAddressMap[rToken],
                provider
            ) 
            const parsedAmount=etherToWeiBN(amount,rToken).toString();
            const res = await supplyContract.call("preview_redeem",[[parsedAmount,0]],{
                blockIdentifier: "pending",
            });
            console.log(res,"data in est supply")
            const data=parseAmount(uint256.uint256ToBN(res?.asset_amount_to_withdraw).toString(),tokenDecimalsMap[rToken]);
            // console.log(parseAmount(uint256.uint256ToBN(res?.asset_amount_to_withdraw).toString(),8),"parsed")
            return data.toFixed(2);
    }catch(err){
        console.log(err,"err in getSupplyUnlocked");

    }
}
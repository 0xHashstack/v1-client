import { CallData, constants, Provider, Contract, Account, json, ec } from "starknet";
import fs from "fs";
// @ts-ignore
import {dtoken_loan_address, rtoken_address, opencore_address } from "./constants.ts";
const dtoken_loan_address = "0xx32312";
const rtoken_address = "0xx11312";
const opencore_address = "0xx232312";


async function Spend_Borrow_Integration(integration:any,calldata:any,loan_id:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, rtoken_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _integration: integration,
        _calldata : calldata,
        _loan_id: loan_id,
    })

    try {
        const res = await myTestContract.interact_with_l3(par);
        await provider.waitForTransaction(res.transaction_hash);

        return {result:res, success: true};
        
    } catch (err) {
        console.log(err);
        return false;

    }

}

async function Estimate_fee_Spend_Borrow(integration:any,calldata:any,loan_id:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, rtoken_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    try {
        const { suggestedMaxFee: estimatedFee1 } = await account0.estimateInvokeFee({
            contractAddress: opencore_address,
            entrypoint: "interact_with_l3",
            calldata:[
                integration,
                calldata,
                loan_id,
          ],
          });
          console.log("estimatedFee :", estimatedFee1)
        
    } catch (err) {
        console.log(err);
        return false;

    }

}
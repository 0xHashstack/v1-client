import { CallData, constants, Provider, Contract, Account, json, ec } from "starknet";
import fs from "fs";
// @ts-ignore
import {dtoken_loan_address, rtoken_address, opencore_address } from "./constants.ts";
const dtoken_loan_address = "0xx32312";
const rtoken_address = "0xx11312";
const opencore_address = "0xx232312";

async function Supply_Liquidity_Integration() {

    

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Supply_Liquidity.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, rtoken_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    //Deposit

    const par = CallData.compile({
        _amount: "1000000000000000000000",
        _receiver: "0x00b7dc10a2c5dc61ac1067aec097754d5a3c9732fad3bda9226c53e7cc9fb821",
    })

    try {
        const rToken_shares = await myTestContract.deposit(par);

        await provider.waitForTransaction(rToken_shares.transaction_hash);
        
        return {success: true, tokens: rToken_shares};

    } catch(err)  {
        console.log(err);
        return false;
    }

}

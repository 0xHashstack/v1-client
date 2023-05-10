import { CallData, constants, Provider, Contract, Account, json, ec } from "starknet";
import fs from "fs";
// @ts-ignore
import {dtoken_loan_address, rtoken_address, opencore_address } from "./constants.ts";
const dtoken_loan_address = "0xx32312";
const rtoken_address = "0xx11312";
const opencore_address = "0xx232312";

async function trade(asset:any,amount:any,collateral_market:any,collateral_amount:any,recipient:any,integration:any,loan_id:any,to_market:any) {

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
        Approve(asset, amount, account0, myTestContract.address);
        console.log("Approving transfer...")
        //Approve and loan multicall
        const multiCall = await account0.execute([
          // Calling the first contract
          {
            contractAddress: opencore_address,
            entrypoint: "loan_request",
            // approve 1 wei for bridge
            calldata:[
                asset,
                amount,
                collateral_market,
                collateral_amount,
                recipient,
            ],
          },
          // Calling the second contract
          {
            contractAddress: opencore_address,
            entrypoint: "integration_swap",
            // transfer 1 wei to the contract address
            // calldata.(loanParams),
            calldata:[
                integration,
                loan_id,
                to_market,
            ],
          },
        ])
        console.log("Create loan tx", multiCall.transaction_hash)
        await provider.waitForTransaction(multiCall.transaction_hash)
    
      } catch (err) {
        console.log("err", err)
      }

      async function Approve(market: any, amount: any, from: Account, to: string) {
        const erc20abi = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
        const erc20 = new Contract(erc20abi, market, provider)
        erc20.connect(from)
        let nonce = await from.getNonce()

        const par =  CallData.compile({
            _to: to,
            _amount: amount,
        })
      
        const approve_tx = await erc20.approve(par,{ parseRequest: false, parseResponse: false, });
        await provider.waitForTransaction(approve_tx.transaction_hash)
      }
}
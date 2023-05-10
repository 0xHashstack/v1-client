import { CallData, constants, Provider, Contract, Account, json, ec } from "starknet";
import fs from "fs";
// @ts-ignore
import {dtoken_loan_address, metrics_address, opencore_address } from "./constants.ts";
import { getProvider } from "@project-serum/anchor";
const dtoken_loan_address = "0xx32312";
const rtoken_address = "0xx11312";
const opencore_address = "0xx232312";
const metrics_address = "0x0123"

// function run() {
//     const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
//     const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

//     // initialize existing Argent X account
//     const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
//     const account0 = new Account(provider, account0Address, privateKey1);

//     //{Contract Address}

//     const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
//     const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
//     console.log('Test Contract connected at =', myTestContract.address);

//     // Interactions with the contract with call & invoke
//     myTestContract.connect(account0);
//     return myTestContract;
// }


async function user_supply(user:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _user: user,
    })

    try {
        let result = await myTestContract.user_supply(par);

        console.log("User supply is =", result);
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function user_borrow(user:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _user: user,
    })

    try {
        let result = await myTestContract.user_borrow(par);

        console.log("User borrow is =", result);
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}


async function asset_price(market:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _market: market,
    })

    try {
        let result = [Number,Number];
        result = await myTestContract.asset_price(par);

        console.log("Asset price is =", result);
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function total_supply(market:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _market: market,
    })

    try {
       
        let result = await myTestContract.total_supply(par);

        console.log("Total supply is =", result);
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}


async function borrow_apr(market:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _market: market,
    })

    try {

        let result = await myTestContract.borrow_apr(par);

        console.log("borrow apr is =", result);
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}


async function deposit_apr(market:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _market: market,
    })

    try {

        let result = await myTestContract.deposit_apr(par);

        console.log("Deposit apr is =", result);
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}


async function utilization_rate(market:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _market: market,
    })

    try {

        let result = await myTestContract.utilization_rate(par);

        console.log("Utilization rate is =", result);
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}


async function borrow_market(loan_id:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _loan_id: loan_id,
    })

    try {

        let result = await myTestContract.borrow_market(par);

        console.log("Borrow market address is =", result);
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function borrow_id(user:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _user: user,
    })

    try {

        let result = await myTestContract.borrow_id(par);

        console.log("Borrow market address is =", result);
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}



async function collateral_amount(loan_id:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    


    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _loan_id: loan_id,
    })

    try {

        let result = await myTestContract.collateral_amount(par);

        console.log("collateral amount is =", result);
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}


async function collateral_market(loan_id:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _loan_id: loan_id,
    })

    try {

        let result = await myTestContract.collateral_amount(par);

        console.log("collateral market is =", result);
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}



async function available_borrow_amount(loan_id:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _loan_id: loan_id,
    })

    try {
        const res = await myTestContract.available_borrow_amount(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}


async function available_reserves(market:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _market: market,
    })

    try {
        const res = await myTestContract.available_reserves(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function deposit_fee() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.deposit_fee();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function withdraw_deposit_fee() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.withdraw_deposit_fee();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function borrow_fee() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.borrow_fee();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;        
    }
}

async function repay_fee() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.repay_fee();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function swap_fee() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.swap_fee();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function staking_fee() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.staking_fee();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}

async function unstaking_fee() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.unstaking_fee();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function add_liquidity_fee() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.add_liquidity_fee();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}

async function remove_liquidity_fee() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.remove_liquidity_fee();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function market_swap_fee() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.market_swap_fee();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function revert_swap_loan_fee() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.revert_swap_loan_fee();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function total_reserves() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.total_reserves();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}

async function net_apr_user() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);


    try {
        const res = await myTestContract.net_apr_user();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }

}

async function effective_apr(borrow_market:any, deposit_market: any,deposit_amount:any, borrow_amount:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _borrow_market: borrow_market,
        _deposit_market: deposit_market,
        _deposit_amount: deposit_amount,
        _borrow_amount: borrow_amount,
    })


    try {
        const res = await myTestContract.effective_apr(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}


async function avg_asset_util() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    try {
        const res = await myTestContract.avg_asset_util();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}


async function market_wise_borrowed(market:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _market: market,
    })


    try {
        const res = await myTestContract.market_wise_borrowed(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}

//returns uint128
async function health_factor(loan_id:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _loan_id: loan_id,
    })


    try {
        const res = await myTestContract.health_factor(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}

//returns uint128
async function collateral_balance_user(user:any,market:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _user : user,
        _market: market
    })


    try {
        const res = await myTestContract.collateral_balance_user(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}


//returns uint128
async function est_withdraw(rToken:any,rtoken_amount:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _rToken : rToken,
        _rToken_amount : rtoken_amount,
        
    })

    try {
        const res = await myTestContract.est_withdraw(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}



//returns uint128
async function rtokens_unlocked(loan_id:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _loan_id : loan_id,
        
    })

    try {
        const res = await myTestContract.rtokens_unlocked(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}

async function get_borrow_apr(market:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _market : market,
        
    })

    try {
        const res = await myTestContract.get_borrow_apr(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}


async function get_deposit_apr(market:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _market : market,
        
    })

    try {
        const res = await myTestContract.get_deposit_apr(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}


async function get_staked_apr(market:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _market : market,
        
    })

    try {
        const res = await myTestContract.get_staked_apr(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}

async function total_borrowed(loan_id:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _loan_id : loan_id,
        
    })

    try {
        const res = await myTestContract.total_borrowed(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}
 
//Function yet to be added in the contract
async function net_worth(loan_id:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _loan_id : loan_id,
        
    })

    try {
        const res = await myTestContract.net_worth(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}

//Function yet to be added in the contract
async function your_borrow(loan_id:any) {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    const par =  CallData.compile({
        _loan_id : loan_id,
        
    })

    try {
        const res = await myTestContract.your_borrow(par);
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
        
    }
}

//Function yet to be added in the contract
async function net_apr() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    // const par =  CallData.compile({
    //     _loan_id : loan_id,
        
    // })

    try {
        const res = await myTestContract.net_apr();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Function yet to be added in the contract
async function spend_status() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    // const par =  CallData.compile({
    //     _loan_id : loan_id,
        
    // })

    try {
        const res = await myTestContract.spend_status();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Function yet to be added in the contract
async function risk_premium() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    // const par =  CallData.compile({
    //     _loan_id : loan_id,
        
    // })

    try {
        const res = await myTestContract.risk_premium();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Function yet to be added in the contract
async function liquidity_split() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    // const par =  CallData.compile({
    //     _loan_id : loan_id,
        
    // })

    try {
        const res = await myTestContract.liquidity_split();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Function yet to be added in the contract
async function borrow_balance() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    // const par =  CallData.compile({
    //     _loan_id : loan_id,
        
    // })

    try {
        const res = await myTestContract.borrow_balance();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Function yet to be added in the contract
async function borrow_amount() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    // const par =  CallData.compile({
    //     _loan_id : loan_id,
        
    // })

    try {
        const res = await myTestContract.borrow_amount();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}


//Function yet to be added in the contract
async function Estimated_colatteral_value() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    // const par =  CallData.compile({
    //     _loan_id : loan_id,
        
    // })

    try {
        const res = await myTestContract.Estimated_colatteral_value();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Function yet to be added in the contract
async function earned_apr() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    // const par =  CallData.compile({
    //     _loan_id : loan_id,
        
    // })

    try {
        const res = await myTestContract.earned_apr();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}


//Function yet to be added in the contract
async function exchange_rate() {

    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    const privateKey1 = "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b"

    // initialize existing Argent X account
    const account0Address: string = "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
    const account0 = new Account(provider, account0Address, privateKey1);

    //{Contract Address}

    const compiledTest = json.parse(fs.readFileSync("./compiledContracts/Spend_Borrow_Integration.sierra").toString("ascii"));
    const myTestContract = new Contract(compiledTest.abi, metrics_address, provider);
    console.log('Test Contract connected at =', myTestContract.address);

    // Interactions with the contract with call & invoke
    myTestContract.connect(account0);

    // const par =  CallData.compile({
    //     _loan_id : loan_id,
        
    // })

    try {
        const res = await myTestContract.exchange_rate();
        await provider.waitForTransaction(res.transaction_hash);

        return res;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}






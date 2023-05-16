import {
  Calldata,
  constants,
  Provider,
  Contract,
  Account,
  json,
  ec,
} from "starknet";
import fs from "fs";
// @ts-ignore
import {
  dtoken_loan_address,
  rtoken_address,
  opencore_address,
} from "./constants";
// const dtoken_loan_address = "0xx32312";
// const rtoken_address = "0xx11312";
// const opencore_address = "0xx232312";

async function Add_liquidity_interaction(
  integration_address: any,
  loan_id: any,
  marketA: any,
  marketB: any,
  min_pool_token: any
) {
  const provider = new Provider({
    sequencer: { network: constants.NetworkName.SN_GOERLI },
  });
  const privateKey1 =
    "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b";

  // initialize existing Argent X account
  const account0Address: string =
    "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
  const account0 = new Account(provider, account0Address, privateKey1);

  //{Contract Address}

  const compiledTest = json.parse(
    fs
      .readFileSync("./compiledContracts/Supply_Liquidity.sierra")
      .toString("ascii")
  );
  const myTestContract = new Contract(
    compiledTest.abi,
    rtoken_address,
    provider
  );
  console.log("Test Contract connected at =", myTestContract.address);

  // Interactions with the contract with call & invoke
  myTestContract.connect(account0);

  const par = Calldata.compile({
    _integration_address: integration_address,
    _loan_id: loan_id,
    _marketA: marketA,
    _marketB: marketB,
    _min_pool_token: min_pool_token,
  });

  try {
    const result = await myTestContract.add_liquidity(par);
    await provider.waitForTransaction(result.transaction_hash);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function estimate_gasfee_Add_liquidity(
  integration_address: any,
  loan_id: any,
  marketA: any,
  marketB: any,
  min_pool_token: any
) {
  const provider = new Provider({
    sequencer: { network: constants.NetworkName.SN_GOERLI },
  });
  // const provider = new starknet.Provider();
  const privateKey1 =
    "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b";

  // initialize existing Argent X account
  const account0Address: string =
    "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";
  const account0 = new Account(provider, account0Address, privateKey1);

  //{Contract Address}

  const compiledTest = json.parse(
    fs
      .readFileSync("./compiledContracts/Supply_Liquidity.sierra")
      .toString("ascii")
  );
  const myTestContract = new Contract(
    compiledTest.abi,
    rtoken_address,
    provider
  );
  console.log("Test Contract connected at =", myTestContract.address);

  // Interactions with the contract with call & invoke
  myTestContract.connect(account0);

  const par = Calldata.compile({
    _integration_address: integration_address,
    _loan_id: loan_id,
    _marketA: marketA,
    _marketB: marketB,
    _min_pool_token: min_pool_token,
  });

  try {
    const { suggestedMaxFee: estimatedFee1 } = await account0.estimateInvokeFee(
      {
        contractAddress: opencore_address,
        entrypoint: "add_liquidity",
        calldata: [
          integration_address,
          loan_id,
          marketA,
          marketB,
          min_pool_token,
        ],
      }
    );
    console.log("estimatedFee :", estimatedFee1);
  } catch (error) {
    console.log(error);
    return false;
  }
}

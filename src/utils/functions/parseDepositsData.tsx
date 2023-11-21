// import {
//   Abi,
//   Contract,
//   number,
//   RpcProvider,
//   uint256,
//   Provider,
// } from "starknet";

// import {
//   diamondAddress,
//   getCommitmentIndex,
//   getCommitmentNameFromIndexDeposit,
//   getCommitmentNameFromIndexLoan,
//   getTokenFromAddress,
//   tokenDecimalsMap,
// } from "../../Blockchain/stark-constants";
// import { BNtoNum, GetErrorText, NumToBN } from "../../blockchain/utils";
// function parseDepositsData(depositsData: any[], yieldRecord: any) {
//  //console.log("parseDeposisDatat", depositsData);
//   let deposits: any[] = [];
//   let deposit;
//   for (let i = 0; i < depositsData?.length; i++) {
//     let deposit: any = depositsData?.[i];
//     let yieldData: any = yieldRecord?.[i];
//     let myDep = {
//       amount: uint256.uint256ToBN(deposit?.amount).toString(),
//       market: getTokenFromAddress(number.toHex(deposit?.market))?.name,
//       account: number.toHex(deposit?.owner),
//       commitment: getCommitmentNameFromIndexDeposit(
//         Number(BNtoNum(deposit?.commitment, 0)).toString()
//       ),
//       commitmentIndex: Number(BNtoNum(deposit?.commitment, 0)),
//       marketSymbol: getTokenFromAddress(number.toHex(deposit?.market))?.symbol,
//       marketAddress: number.toHex(deposit?.market),
//       depositId: Number(BNtoNum(deposit?.id, 0)),
//       acquiredYield: uint256
//         .uint256ToBN(yieldData?.total_yield_paid)
//         .add(uint256.uint256ToBN(yieldData?.accrued_yield))
//         ?.toString(),
//       interestPaid: uint256
//         .uint256ToBN(yieldData?.total_yield_paid)
//         ?.toString(),

//       isTimelockApplicable:
//         Number(BNtoNum(deposit?.is_timelock_applicable, 0)) === 1,
//       isTimelockActivated:
//         Number(BNtoNum(deposit?.is_timelock_activated, 0)) === 1,
//       timelockActivationTime: Number(BNtoNum(deposit?.activation_time, 0)),
//       timelockDuration: Number(BNtoNum(deposit?.timelock_validity, 0)),

//       depositCreationTime: Number(deposit.created_at),
//     };
//     // VT: had to stringify and append due to a weird bug that was updating data randomly after append
//     let myDepString = JSON.stringify(myDep);
//     deposits.push(JSON.parse(myDepString));
//   }
//   let nonZeroDeposits = deposits.filter(function (el) {
//    //console.log("amount parse deposit", el.amount);
//     return el.amount !== "0";
//   });
//  //console.log("parsed deposit data", deposits);
//   return nonZeroDeposits;
// }

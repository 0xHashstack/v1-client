import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const {
  contractsEnv,
  metricsContractAddress,
  getTokenFromAddress,
  diamondAddress,
} = require('../src/Blockchain/stark-constants');
const { tokenDecimalsMap,tokenAddressMap }= require('@/Blockchain/utils/addressServices')
const { RpcProvider, Contract, shortString, num, uint256 } = require('starknet');
import governorAbi from '../src/Blockchain/abis_mainnet/governor_abi.json'
import BigNumber from 'bignumber.js';

const parseAmount = (amount, decimals = 18) => {
    const factor = new BigNumber(1000000);
    const amountBN = new BigNumber( amount)
      .times(factor)
      .dividedBy(new BigNumber(10).exponentiatedBy(decimals));
      const roundedAmountBN = amountBN.decimalPlaces(8, BigNumber.ROUND_DOWN);
    return roundedAmountBN.toNumber()/factor.toNumber();
  };

describe('test deposit limits',()=>{
    let minDeposits=[];
    let maxDeposits=[];
    let minLoanAmounts=[];
    let maxLoanAmounts=[];
    it('Checks min deposit',async()=>{
        const provider = new RpcProvider({
            nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
          });
          for(var i=0;i<contractsEnv.rTOKENS.length;i++){
              const governorContract = new Contract(
                governorAbi,
                diamondAddress,
                provider
              );
              const result = await governorContract.call(
                "get_minimum_deposit_amount",
                [tokenAddressMap[contractsEnv.rTOKENS[i].name]],
                { blockIdentifier: "pending" }
              );
              const res = parseAmount(
                uint256.uint256ToBN(result?._get_minimum_deposit_amount).toString(),
                tokenDecimalsMap[contractsEnv.rTOKENS[i].name]
              );
              minDeposits.push(res);
              ////console.log("getPoolsSupported ", result?.secondary_market?.supported.toString(),data);
          }
          expect(minDeposits.length).toBe(6);
    }, 20000)
    it('Checks max deposit',async()=>{
        const provider = new RpcProvider({
            nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
          });
          for(var i=0;i<contractsEnv.rTOKENS.length;i++){
              const governorContract = new Contract(
                governorAbi,
                diamondAddress,
                provider
              );
              const result = await governorContract.call(
                "get_maximum_deposit_amount",
                [tokenAddressMap[contractsEnv.rTOKENS[i].name]],
                { blockIdentifier: "pending" }
              );
              const res= parseAmount(
                uint256.uint256ToBN(result?._get_maximum_deposit_amount).toString(),
                tokenDecimalsMap[tokenAddressMap[contractsEnv.rTOKENS[i].name]]
              );
              maxDeposits.push(res);
              ////console.log("getPoolsSupported ", result?.secondary_market?.supported.toString(),data);
          }
          expect(maxDeposits.length).toBe(6);
    }, 20000)
    it('Checks min Loan',async()=>{
        const provider = new RpcProvider({
            nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
          });
          for(var i=0;i<contractsEnv.dTOKENS.length;i++){
              const governorContract = new Contract(
                governorAbi,
                diamondAddress,
                provider
              );
              const result = await governorContract.call(
                "get_minimum_loan_amount",
                [tokenAddressMap[contractsEnv.dTOKENS[i].name]],
                { blockIdentifier: "pending" }
              );
              const res= parseAmount(
                uint256.uint256ToBN(result?._get_minimum_loan_amount).toString(),
                tokenDecimalsMap[tokenAddressMap[contractsEnv.dTOKENS[i].name]]
              );
              minLoanAmounts.push(res);
              ////console.log("getPoolsSupported ", result?.secondary_market?.supported.toString(),data);
          }
          expect(minLoanAmounts.length).toBe(6);
    }, 20000)
    it('Checks max Loan',async()=>{
        const provider = new RpcProvider({
            nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
          });
          for(var i=0;i<contractsEnv.dTOKENS.length;i++){
              const governorContract = new Contract(
                governorAbi,
                diamondAddress,
                provider
              );
              const result = await governorContract.call(
                "get_maximum_loan_amount",
                [tokenAddressMap[contractsEnv.dTOKENS[i].name]],
                { blockIdentifier: "pending" }
              );
              const res= parseAmount(
                uint256.uint256ToBN(result?._get_maximum_loan_amount).toString(),
                tokenDecimalsMap[tokenAddressMap[contractsEnv.dTOKENS[i].name]]
              );
              maxLoanAmounts.push(res);
              ////console.log("getPoolsSupported ", result?.secondary_market?.supported.toString(),data);
          }
          expect(maxLoanAmounts.length).toBe(6);
    }, 20000)
})
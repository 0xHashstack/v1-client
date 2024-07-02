import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const {
  contractsEnv,
  metricsContractAddress,
  getTokenFromAddress,
  diamondAddress,
  stakingContractAddress
} = require('../src/Blockchain/stark-constants');
const { tokenDecimalsMap,tokenAddressMap }= require('@/Blockchain/utils/addressServices')
const { RpcProvider, Contract, shortString, num, uint256 } = require('starknet');
import stakingAbi from '../src/Blockchain/abis_mainnet/staking_abi.json'
import BigNumber from 'bignumber.js';

const parseAmount = (amount, decimals = 18) => {
    const factor = new BigNumber(1000000);
    const amountBN = new BigNumber( amount)
      .times(factor)
      .dividedBy(new BigNumber(10).exponentiatedBy(decimals));
      const roundedAmountBN = amountBN.decimalPlaces(8, BigNumber.ROUND_DOWN);
    return roundedAmountBN.toNumber()/factor.toNumber();
  };

describe('Get staking shares',()=>{
    let stakingSharesValues=[];
    it('Check staking shares',async()=>{
        const provider = new RpcProvider({
            nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
          });
          for(var i=0;i<contractsEnv.rTOKENS.length;i++){
              const stakingContract = new Contract(
                stakingAbi,
                stakingContractAddress,
                provider
              );
              const result = await stakingContract.call("get_user_staking_shares", [
                '0x05970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4',
                tokenAddressMap[contractsEnv.rTOKENS[i].name],
              ]);
              const res = parseAmount(
                uint256.uint256ToBN(result?.user_staking_share).toString(),
                tokenDecimalsMap[contractsEnv.rTOKENS[i].name]
              );
              ////console.log("getUserStakingShares ", res);
              stakingSharesValues.push(res);
          }
          expect(stakingSharesValues.length).toBe(6);
    })
})
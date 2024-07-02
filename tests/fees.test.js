import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const {
  contractsEnv,
  metricsContractAddress,
  getTokenFromAddress,
  diamondAddress
} = require('../src/Blockchain/stark-constants');
const { RpcProvider, Contract, shortString, num, uint256 } = require('starknet');
import comptrollerAbi from '../src/Blockchain/abis_mainnet/comptroller_abi.json';

describe('Get fees', () => {
  const feesInputParams = {
    'get_deposit_request_fee': 0,
    'get_staking_fee': 0,
    'get_unstaking_fee': 0,
    'get_withdraw_deposit_fee': 0,
    'get_loan_request_fee': 0,
    'get_l3_interaction_fee': 0,
    'get_loan_repay_fee': 0.1
  };

  it('Check fees', async () => {
    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
    });

    const governorContract = new Contract(
      comptrollerAbi,
      diamondAddress,
      provider
    );

    const fees = await Promise.all(Object.keys(feesInputParams).map(async (param) => {
      const result = await governorContract.call(param);
      return Number(result?.fees.toString()) / 100;
    }));

    const expectedFees = Object.values(feesInputParams);

    expect(fees).toEqual(expectedFees);
  }, 20000);
});
